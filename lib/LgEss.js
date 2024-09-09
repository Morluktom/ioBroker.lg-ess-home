'use strict';

const Axios = require('axios').default;
const https = require('https');

const STATE_URL = {
    Common: '/v1/user/essinfo/common',
    Home: '/v1/user/essinfo/home',
    SystemInfo: '/v1/user/setting/systeminfo',
    SettingBatt: '/v1/user/setting/batt',
    SettingNetwork: '/v1/user/setting/network',
    InstallerSettingBatt: '/v1/installer/setting/batt',
    InstallerSettingPv: '/v1/installer/setting/pv',
    InstallerSettingPcs: '/v1/installer/setting/pcs',
};

const MAPPING ={
    is_direct_consuming_: {type: 'boolean'},
    is_battery_charging_: {type: 'boolean'},
    is_battery_discharging_: {type: 'boolean'},
    is_grid_selling_: {type: 'boolean'},
    is_grid_buying_: {type: 'boolean'},
    is_charging_from_grid_: {type: 'boolean'},
    is_discharging_to_grid_: {type: 'boolean'},
    batt_status: {
        states: {
            0: 'Standby',
            1: 'charging',
            2: 'discharging'}
    },
    feed_in_limitation: {unit: '%'},
    month_pv_generation_sum: {unit: 'kWh', scaling: 0.001},
    month_co2_reduction_accum: {unit: 'kg',	scaling: 0.001},
    today_pv_generation_sum: {unit: 'kWh', scaling: 0.001},
    today_month_pv_generation_sum: {unit: 'kWh', scaling: 0.001},
    today_self_consumption: {unit: '%'},
    current_day_self_consumption: {unit: '%'},
    pv_capacity: {unit: 'kWp', scaling: 0.001},
    mode: {
        states: {
            0: 'Stop',
            1: 'Normal Mode',
            2: 'PV only Mode'}
    },
    ac_output_power: {unit: 'kW', scaling: 1},
    bat_status: {
        type: 'number',
        states: {
            0: 'Standby',
            1: 'charging',
            2: 'discharging',
            10: 'off'}
    },
    current_pv_generation_sum: {unit: 'kWh', scaling: 0.001},
    bat_use:{type: 'boolean'},
    capacity: {unit: 'kWh', scaling: 0.1},
    ac_input_power: {unit: 'kW', scaling: 0.001},
    startdate: {type: 'string'},
    stopdate: {type: 'string'},

    backup_status: {map: 'BackupMode'},
    winter_status: {map: 'WinterMode'},
    alg_setting: {map: 'ChargingMode'},
    /*	use: {map: 'BatteryUse'}, */
    status: {map: 'Operation'},

    BackupMode: {type: 'number', write: true, urlCmd: '/v1/user/setting/batt', cmdKey: 'backupmode',
        states: {
            0: 'off',
            1: 'on'},
        valueMap:{
            off: 0,
            on: 1}
    },
    WinterMode: {type: 'number', write: true, urlCmd: '/v1/user/setting/batt', cmdKey: 'wintermode',
        states: {
            0: 'off',
            1: 'on'},
        valueMap:{
            off: 0,
            on: 1}
    },
    ChargingMode: {type: 'number', write: true, urlCmd: '/v1/user/setting/batt', cmdKey: 'alg_setting',
        states: {
            0: 'battery_care',
            1: 'fast_charge',
            2: 'weather_forecast'},
        valueMap:{
            battery_care: 0,
            fast_charge: 1,
            weather_forecast: 2}
    },
    Operation: {type: 'number', write: true, urlCmd: '/v1/user/operation/status', cmdKey: 'operation',
        states: {
            0: 'stop',
            1: 'start'},
        valueMap:{
            stop: 0,
            start: 1}
    },
};/*	BatteryUse: {type: 'number', write: true, urlCmd: '/v1/installer/setting/batt/use', cmdKey: 'use',
		states: {
			0: 'off',
			1: 'on'},
		valueMap:{
			off: 0,
			on: 1}
	},
}*/

const GRAPH_TIMESPANS = ['day', 'week', 'month', 'year'];
const GRAPH_DEVICES = ['batt', 'load', 'pv'];

const GRAPH_PARAMS = {
    day: 'year_month_day',
    week: 'year_month_day',
    month: 'year_month',
    year: 'year'
};

const GRAPH_TFORMATS = {
    year_month_day: 'yyyymmdd',
    year: 'yyyy',
    year_month: 'yyyymm'
};

function LgEss(adapter, ip, password, refreshTimeHome, refreshTimeCommon, instLogInPossible, installerpassword){

    const _CancelToken = Axios.CancelToken;
    let CancelRequests;
    let _auth_key = null;
    const _timeout   = 30000;
    let _timerCommon = null;
    let _timerHome = null;
    let _timerSlow = null;
    let _timerLogIn = null;
    let _reconnect = false;

    /******************************************************************************************************************************
	 * Start Communication with inverter
	 ******************************************************************************************************************************/
    this.Start = function (){
        ConnectLgEss();
    };

    function ConnectLgEss(){
        StopTimers();

        if (typeof CancelRequests != typeof undefined)
            CancelRequests.cancel();

        CancelRequests = _CancelToken.source();

        Login()
            .then (data => {
                if (_reconnect == true){
                    adapter.log.debug(`[LG ESS] Reconnect success (${data.role})`);
                } else {
                    adapter.log.info(`[LG ESS] Login success (${data.role})`);
                }
                _reconnect = false;
                _timerHome = setTimeout(() => TimerHome(), 100);
                _timerCommon = setTimeout(() => TimerCommon(), 5000);
                _timerSlow = setTimeout(() => TimerSlow(), 10000);
            })
            .catch (error => {
                adapter.setStateAsync('info.connection', false, true);
                adapter.setStateAsync('info.connectedUser', '', true);
                _reconnect = false;
                if (error == 'Cancel')
                    adapter.log.debug(`[LG ESS] (ConnectLgEss) ${error}.`);
                else if (error.message == 'Wrong user password')
                    adapter.log.error(`[LG ESS] (ConnectLgEss) ${error}.`);
                else {
                    if (error.message == 'Wrong installer password'){
                        adapter.log.info(`[LG ESS] (ConnectLgEss) ${error}. Login as user`);
                        instLogInPossible = false;
                        _timerLogIn = setTimeout(() => ConnectLgEss(), 1000);
                    }
                    else {
                        adapter.log.info(`[LG ESS] (ConnectLgEss) ${error}. Try again in 60 seconds`);
                        _timerLogIn = setTimeout(() => ConnectLgEss(), 60000);
                    }
                }
            });
    }

    /******************************************************************************************************************************
	 * Stop Communication with inverter
	 ******************************************************************************************************************************/
    this.Stop = function () {
        CancelRequests.cancel();
        StopTimers();
    };

    /******************************************************************************************************************************
	 * Login
	 * @param {boolean} installerLogIn Login as installer
	 ******************************************************************************************************************************/
    function Login(installerLogIn) {
        return new Promise((resolve, reject) => {
            let _password;
            let url;

            if (!instLogInPossible || !installerLogIn){
                url = `https://${ip}/v1/user/setting/login`;
                _password = password;
            } else {
                url = `https://${ip}/v1/installer/setting/login`;
                _password = installerpassword;
            }

            const Agent = new https.Agent({
                rejectUnauthorized: false
            });

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
                httpsAgent: Agent,
                timeout: _timeout,
                cancelToken: CancelRequests.token
            };

            adapter.log.silly(`[LG ESS] Try to Login: ${url}`);
            Axios.put(url, {password: _password}, config)
                .then(response => {
                    adapter.log.silly(`[LG ESS] Login Response: ${JSON.stringify(response.data)}`);
                    if (response.data.status == 'success'){
                        adapter.setStateAsync('info.connection', true, true);
                        adapter.setStateAsync('info.connectedUser', response.data.role, true);
                        _auth_key = response.data.auth_key;
                        return resolve(response.data);
                    } else {
                        if (response.data.status == 'password mismatched'){
                            if (response.config.url.indexOf('/user/') !== -1)
                                reject(new Error('Wrong user password'));
                            else
                                reject(new Error('Wrong installer password'));
                        } else
                            reject(new Error(response.data.status));
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /******************************************************************************************************************************
	 * Timer for home data
	 ******************************************************************************************************************************/
    async function TimerHome() {
        try{
            await ReadFromInverter(STATE_URL.Home);
            _timerHome = setTimeout(() => TimerHome(), refreshTimeHome * 1000);
        } catch (error) {
            adapter.log.error(`[LG ESS] (TimerHome) ${error}.`);
        }
    }

    /******************************************************************************************************************************
	 * Timer for common data
	 ******************************************************************************************************************************/
    async function TimerCommon() {
        try {
            await ReadFromInverter(STATE_URL.Common);
            _timerCommon = setTimeout(() => TimerCommon(), refreshTimeCommon * 1000);
        } catch (error) {
            adapter.log.error(`[LG ESS] (TimerCommon) ${error}.`);
        }
    }

    /******************************************************************************************************************************
	 * Timer slow communication (every 15 min, at :00, :15, :30, :45)
	 ******************************************************************************************************************************/
    async function TimerSlow() {
        try {
            const dt = new Date();

            const systemInfo = ReadFromInverter(STATE_URL.SystemInfo);
            const settingBatt = ReadFromInverter(STATE_URL.SettingBatt);
            const settingNetwork = ReadFromInverter(STATE_URL.SettingNetwork);
            const graphs = readGraphs();
            const installerData = ReadInstallerData();

            await systemInfo;
            await settingBatt;
            await settingNetwork;
            await graphs;
            await installerData;

            const min = dt.getMinutes() % 15;
            _timerSlow = setTimeout(() => TimerSlow(), (15-min)  * 60 * 1000 - (dt.getSeconds() *1000) + 10000); /* alle 15 Minuten */
        } catch (error) {
            adapter.log.error(`[LG ESS] TimerSlow ${error}.`);
        }
    }

    /******************************************************************************************************************************
	 * Stop all timers
	 *******************************************************************************************************************************/
    function StopTimers() {
        if (_timerHome) clearTimeout(_timerHome);
        if (_timerCommon) clearTimeout(_timerCommon);
        if (_timerSlow) clearTimeout(_timerSlow);
        if (_timerLogIn) clearTimeout(_timerLogIn);
    }

    /******************************************************************************************************************************
	 * Read all possible data from installer
	 *******************************************************************************************************************************/
    async function ReadInstallerData(){
        /* Return if installer login is not possible*/
        if (instLogInPossible == false) return;
        try{
            await Login(true);
            const settingBatt = ReadFromInverter(STATE_URL.InstallerSettingBatt);
            const settingPv = ReadFromInverter(STATE_URL.InstallerSettingPv);
            const settingPcs = ReadFromInverter(STATE_URL.InstallerSettingPcs);

            await settingBatt;
            await settingPv;
            await settingPcs;
            await Login();
        } catch (error) {
            if (error == 'Cancel')
                adapter.log.debug(`[LG ESS] (ReadInstallerData) ${error}.`);
            else
                adapter.log.error(`[LG ESS] (ReadInstallerData) ${error}.`);
        }
    }

    /******************************************************************************************************************************
	 * Get actual graphs
	 ******************************************************************************************************************************/
	 this.GetGraphs = async function(date){
        await readGraphs(date);
    };

    async function readGraphs(date){
        try {
            const _date = date || new Date();
            const calls = [];

            for (let i = 0; i < GRAPH_DEVICES.length; i++) {
                calls[i] = [];
                for (let u = 0; u < GRAPH_TIMESPANS.length; u++) {
                    const date = formatTime(_date,GRAPH_TFORMATS[GRAPH_PARAMS[GRAPH_TIMESPANS[u]]]);
                    const extra_json_data={};
                    extra_json_data[GRAPH_PARAMS[GRAPH_TIMESPANS[u]]] = date;
                    calls[i][u] = ReadFromInverter(`/v1/user/graph/${GRAPH_DEVICES[i]}/${GRAPH_TIMESPANS[u]}`,extra_json_data);
                }
            }
            for (let i = 0; i < GRAPH_DEVICES.length; i++) {
                for (let u = 0; u < GRAPH_TIMESPANS.length; u++) {
                    await calls[i][u];
                }
            }
        } catch (error) {
            adapter.log.error(`[LG ESS] (GetGraphs) ${error}.`);
        }
    }

    /******************************************************************************************************************************
	 * Read data from inverter
	 * @param {string} url Request url
	 * @param {string} extra_json_data extra json data
	******************************************************************************************************************************/
    async function ReadFromInverter(url, extra_json_data) {
        try {
            const response =  await GetRequest(url, extra_json_data);
            // Remove the URL Protocol (https:// & http://) using regex.
            const uri = response.config.url.replace(/(^\w+:|^)\/\//, '');
            adapter.log.silly(`[LG ESS] GetRequest - Url: ${response.config.url} Data: ${JSON.stringify(response.data)}`);
            ParseData(response.data, uri);
            return response.data;
        } catch (error) {
            adapter.setStateAsync('info.connection', false, true);
            adapter.setStateAsync('info.connectedUser', '', true);
            if (error == 'Cancel') {
                adapter.log.debug(`[LG ESS] (ReadFromInverter) ${error}. Url: ${url}`);
            } else {
                adapter.log.debug(`[LG ESS] (ReadFromInverter) ${error}. => Reconnect`);
                StopTimers();
                CancelRequests.cancel();
                _reconnect = true;
                _timerLogIn = setTimeout(() => ConnectLgEss(), 5000);
            }
        }
    }

    /******************************************************************************************************************************
	 * Get request
	 * @param {string} url Request url
	 * @param {string} extra_json_data extra json data
	 ******************************************************************************************************************************/
    function GetRequest(url, extra_json_data) {
        return new Promise((resolve, reject) => {
            const data = {
                auth_key: _auth_key,
            };

            if (extra_json_data)
                Object.assign(data, extra_json_data);

            const Agent = new https.Agent({
                rejectUnauthorized: false
            });

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Host: ip
                },
                httpsAgent: Agent,
                timeout: _timeout,
                cancelToken: CancelRequests.token
            };

            const url1 = `https://${ip}${url}`;
            adapter.log.silly(`[LG ESS] GetRequest from Url: ${url1}`);
            Axios.post(url1, data, config)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /******************************************************************************************************************************
	 * Parse request data
	 * @param {any} data Data to parse
	 * @param {string} path Data path
	 ******************************************************************************************************************************/
    async function ParseData(data , path){
        try {
            const keys = path.split('/');
            let strName = null;
            let keyGraph = 0;

            for (let i = 1; i < keys.length; i++) {
                if (keys[i] == 'v1') continue;

                if (keyGraph > 0) keyGraph++;
                if (keys[i] == 'graph') keyGraph = 1;

                if (strName == null) strName = keys[i];
                else strName = strName + '.' + keys[i];

                /* Write graph json */
                if (keyGraph == 3){
                    // Create Object
                    await adapter.setObjectNotExistsAsync(strName, {
                        type: 'state',
                        common: {
                            name: keys[i],
                            type: 'json',
                            role: 'json',
                            read: true,
                        },
                    });
                    await adapter.setStateAsync(strName, JSON.stringify(data), true);
                    return;
                }

                /* Create Channel */
                await adapter.setObjectNotExistsAsync(strName, {
                    type: 'channel',
                    common: {
                        name: keys[i],
                    },
                    native: {}
                });

            }

            for (const [variable, value] of Object.entries(data)) {
                if (Array.isArray(value)){
                    for ( let i=0; i<value.length; i++ ) {

                        const varName = `${variable}_${(i+1).toString()}`;

                        /* Create Channel */
                        await adapter.setObjectNotExistsAsync(`${strName}.${varName}`, {
                            type: 'channel',
                            common: {
                                name: varName,
                            },
                            native: {}
                        });

                        for (const [variable1, value1] of Object.entries(value[i])) {
                            WriteData(`${strName}.${varName}`, variable1, value1, false);
                        }
                    }
                }
                else if (typeof(value) == 'object'){
                    for (const [variable1, value1] of Object.entries(data[variable])) {

                        /* Create Channel */
                        await adapter.setObjectNotExistsAsync(`${strName}.${variable}`, {
                            type: 'channel',
                            common: {
                                name: variable,
                            },
                            native: {}
                        });
                        WriteData(`${strName}.${variable}`, variable1, value1, false);
                    };
                } else {
                    WriteData(strName, variable, value, false);
                }
            };
        } catch(err){
            adapter.log.error(`[LG ESS] (ParseData):  ${err}`);
        }
    }

    /******************************************************************************************************************************
	 * Write data to a datapoint, if datapoint not exists create this datapoint
	 * @param {string} path Data path
	 * @param {string} variable Variablenname
	 * @param {any} value Value
	 ******************************************************************************************************************************/
	 async function WriteData(path, variable, value, onlyUpdateDifferent){
        const id = `${path}.${variable}`;
        try {
            const obj = await adapter.getObjectAsync(id);
            if (!obj){
                await CreateDataPoint(path, variable, value);
            } else {
                /* If a scaling factor is defined then calculate the value */
                if (obj.native.ScalingFactor) {
                    const factor = 1 / obj.native.ScalingFactor;
                    value *= obj.native.ScalingFactor;
                    value = Math.round(value * factor)/factor;
                } else if (GetVarType(value)== 'number' && obj.common.type =='number')
                    value = Math.round(value * 100)/100;

                WriteValue(path, variable, obj.common.type, value, onlyUpdateDifferent);
            }
        } catch (err){
            adapter.log.debug(`[LG ESS] - WriteData: ${err}`);
        }
    }

    /******************************************************************************************************************************
	 * Create a datapoint
	 * @param {string} path Data path
	 * @param {string} variable Variablenname
	 * @param {any} value Value
	 ******************************************************************************************************************************/
	 async function CreateDataPoint(path, variable, value){
        try {
            const id = `${path}.${variable}`;

            /*Ignore empty values*/
            if (value == '') return;

            const r = GetTypeRollUnitScaling(path,variable,value);

            let write = false;
            if (MAPPING[variable] && MAPPING[variable].write) write = MAPPING[variable].write;

            let type = r.type;
            if (MAPPING[variable] && MAPPING[variable].type) type = MAPPING[variable].type;

            // Create Object
            await adapter.setObjectNotExistsAsync(id, {
                type: 'state',
                common: {
                    name: variable,
                    type: type,
                    role: r.role,
                    unit: r.unit,
                    read: true,
                    write: write,
                    states: r.states,
                },
                native: {
                    ScalingFactor: r.scaling,
                },
            });

            /*Subscribe state changes*/
            if (write == true)
                adapter.subscribeStates(id);

            if (r.scaling) value *= r.scaling;
            if (GetVarType(value) == 'number' && r.type =='number')
                value = Math.round(value * 100)/100;

            WriteValue(path, variable, r.type,  value);
        } catch(err){
            adapter.log.error(`[LG ESS] CreateDataPoint: ${err}`);
        }
    }

    /******************************************************************************************************************************
	 * Get type, roll, unit and scaling a datapoint
	 * @param {string} path Data path
	 * @param {string} variable Variablenname
	 * @param {any} value Value
	 ******************************************************************************************************************************/
    function GetTypeRollUnitScaling(path, variable, value){

        let type;
        let role;
        let unit;
        let scaling;
        let states;

        if ((variable == 'status') && (path == 'user.essinfo.common.BATT')) variable = 'batt_status';
        if ((variable == 'capacity') && (path == 'user.essinfo.common.PV')) variable = 'pv_capacity';
        if ((variable == 'capacity') && (path.startsWith('installer.setting.pv.pvinfo'))) variable = 'pv_capacity';

        if (MAPPING[variable] && MAPPING[variable].type)
            type = MAPPING[variable].type;
        else
            type = GetVarType(value);

        if (type =='number'){
            role = 'value';

            if (variable.indexOf('soc') != -1) {
                unit = '%';
            } else if (variable.indexOf('soh') != -1) {
                unit = '%';
            } else if (variable.indexOf('operation_range') != -1) {
                unit = '%';
            } else if (variable.indexOf('load_consumption_sum') != -1) {
                unit = 'kWh';
                scaling = 0.001;
            } else if (variable.indexOf('energy') != -1) {
                unit = 'kWh';
                scaling = 0.001;
            } else if (variable.indexOf('enery') != -1) {
                unit = 'kWh';
                scaling = 0.001;
            } else if (variable.indexOf('enegy') != -1) {
                unit = 'kWh';
                scaling = 0.001;
            } else if (variable.indexOf('voltage') != -1) {
                unit = 'V';
                role = 'value.voltage';
            } else if (variable.indexOf('a_phase') != -1) {
                unit = 'V';
                role = 'value.voltage';
            } else if (variable.indexOf('cell_volt') != -1) {
                unit = 'V';
                role = 'value.voltage';
            } else if (variable.indexOf('out_vol') != -1) {
                unit = 'V';
                role = 'value.voltage';
            } else if (variable.indexOf('freq') != -1) {
                unit = 'Hz';
            } else if (variable.indexOf('temp') != -1) {
                unit = '°C';
                role = 'value.temperature';
            } else if (variable.indexOf('_current') != -1) {
                unit = 'A';
                role = 'value.current';
            } else if (variable.indexOf('out_cur') != -1) {
                unit = 'A';
                role = 'value.current';
            } else if (variable.indexOf('power') != -1) {
                unit = 'kW';
                scaling = 0.001;
                role = 'value.power';
            } else if (variable.indexOf('Time') != -1) {
                unit = 's';
            }
        } else if (type == 'boolean'){
            role = 'indicator';
        } else if (type == 'string'){
            role = 'text';
        }
        if (MAPPING[variable] && MAPPING[variable].unit)
            unit = MAPPING[variable].unit;
        if (MAPPING[variable] && MAPPING[variable].scaling)
            scaling = MAPPING[variable].scaling;
        if (MAPPING[variable] && MAPPING[variable].states)
            states = MAPPING[variable].states;

        return {type,role,unit,scaling,states};
    }

    /******************************************************************************************************************************
	 * Write a value to a datapoint
	 * @param {string} path Data path
	 * @param {string} variable Variablenname
	 * @param {string} type Type of Variable
	 * @param {any} value Value
	 ******************************************************************************************************************************/
    async function WriteValue(path, variable, type, value, onlyUpdateDifferent){
        try {
            const id = path + '.'+ variable;

            if (MAPPING[variable] && MAPPING[variable].valueMap){
                if ((value in MAPPING[variable].valueMap))
                    value = MAPPING[variable].valueMap[value];
                else return;
            }

            if (type == 'boolean'){
                if ((value == '0') || (value == 'off') || (value == 'false')) value = false;
                else if ((value == '1') || (value == 'on') || (value == 'true')) value = true;
            }
            if (variable == 'bat_status'){
                if (value == 'off') value =10;
            }
            const state = await adapter.getStateAsync(id);
            if ((onlyUpdateDifferent == false) || !state || ((state) && (state.val != value)))
                await adapter.setStateAsync(id, value, true);

            /* If a MAPPING entry is defined, copy it to the specified variable */
            if ((MAPPING[variable]) && (MAPPING[variable].map))
                WriteData('commands',MAPPING[variable].map,value,true);

        } catch(err){
            adapter.log.error(`[LG ESS] WriteValue: ${err}`);
        }
    }

    /******************************************************************************************************************************
	 * Set a command
	 * @param {string} key Key of command
	 * @param {any} val Value
	 ******************************************************************************************************************************/
    this.SetCommand = function(key, val){
        const dummy = key.split('.');
        const variable = dummy[dummy.length-1];
        adapter.log.debug(`[LG ESS] SetCommand - Variable: ${variable} new Value: ${val}`);

        if (!MAPPING[variable] || !MAPPING[variable].write || !MAPPING[variable].urlCmd || !MAPPING[variable].states || !MAPPING[variable].states[val])
            return;

        const extra_json_data={};
        if (variable == 'ChargingMode')
            extra_json_data[MAPPING[variable].cmdKey] = val;
        else
            extra_json_data[MAPPING[variable].cmdKey] = MAPPING[variable].states[val];

        if ((variable == 'BatteryUse') && (val == 0))
            PutRequest('/v1/installer/setting/pcs/ac', {'acuse' :'off' });

        PutRequest(MAPPING[variable].urlCmd,extra_json_data, key, val);
    };

    /******************************************************************************************************************************
	 * Put request
	 * @param {string} url Request url
	 * @param {string} extra_json_data extra json data
	 ******************************************************************************************************************************/
    function PutRequest(url, extra_json_data, key, value) {

        const data = {
            auth_key: _auth_key,
        };

        if (extra_json_data)
            Object.assign(data, extra_json_data);

        const Agent = new https.Agent({
            rejectUnauthorized: false
        });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            httpsAgent: Agent,
            timeout: _timeout,
            cancelToken: CancelRequests.token
        };

        const url1 = `https://${ip}${url}`;

        adapter.log.silly(`[LG ESS] PutRequest: ${url1} Value: ${JSON.stringify(extra_json_data)}`);
        Axios.put(url1, data, config)
            .then(response => {
                adapter.log.silly(`[LG ESS] PutRequest Response: ${JSON.stringify(response.data)}`);
                if (key)
                    adapter.setStateAsync(key, value, true);
            })
            .catch(error => {
                adapter.log.error(`[LG ESS] PutRequest ${error}`);
            });
    }

    /******************************************************************************************************************************
	 * Determines the type of a variable
	 * @param {string} value
	 ******************************************************************************************************************************/
    function GetVarType (value) {
        if(isNumeric(value) == true)
            return 'number';
        else if ((value.toLowerCase() == 'true') || (value.toLowerCase() == 'false'))
            return 'boolean';
        else
            return 'string';
    }

    /******************************************************************************************************************************
	 * Determines if a variable is numeric
	 * @param {any} value
	 ******************************************************************************************************************************/
    function isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    /******************************************************************************************************************************
	 * Format time
	 * @param {any} time
	 * @param {any} format
	 ******************************************************************************************************************************/
    function formatTime(time, format){
        time = typeof time == 'number' ? new Date(time) : time;
        format = format || 'yyyy-mm-dd hh:MM:ss';
        const add0 = function(t){ return t < 10 ? '0' + t : t; };
        const year = time.getFullYear();
        const month = time.getMonth() + 1; // 0 indexed
        const date = time.getDate();
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const replaceMent = {
            'yyyy': year,
            'mm': add0(month),
            'm': month,
            'dd': add0(date),
            'd': date,
            'hh': add0(hours),
            'h': hours,
            'MM': add0(minutes),
            'M': minutes,
            'ss': add0(seconds),
            's': seconds
        };
        for(const key in replaceMent){
            format = format.replace(key, replaceMent[key]);
        }
        return format;
    }

}

module.exports = LgEss;