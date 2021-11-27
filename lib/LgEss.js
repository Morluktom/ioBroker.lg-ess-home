"use strict";

const request   = require('request');
const timeout   = 1500;
let _auth_key = null;
let _userrole = null;
var timerCommon = null;
var timerHome = null;
var timerSlow = null;
var timerLogIn = null;
var unload = false;

const STATE_URL = {
	Common: "/v1/user/essinfo/common",
	Home: "/v1/user/essinfo/home",
	SystemInfo: "/v1/user/setting/systeminfo",
	SettingBatt: "/v1/user/setting/batt",
	SettingNetwork: "/v1/user/setting/network",
	InstallerSettingBatt: "/v1/installer/setting/batt",
	InstallerSettingPv: "/v1/installer/setting/pv",
	InstallerSettingPcs: "/v1/installer/setting/pcs",
}

const MAPPING ={
	is_direct_consuming_: {type: "boolean"},
	is_battery_charging_: {type: "boolean"},
	is_battery_discharging_: {type: "boolean"},
	is_grid_selling_: {type: "boolean"},
	is_grid_buying_: {type: "boolean"},
	is_charging_from_grid_: {type: "boolean"},
	is_discharging_to_grid_: {type: "boolean"},
	batt_status: {
		states: {
			0: "Standby", 
			1: "charging",
			2: "discharging"}
	},
	feed_in_limitation: {unit: "%"},
	month_pv_generation_sum: {unit: "kWh", scaling: 0.001},
	month_co2_reduction_accum: {unit: "kg",	scaling: 0.001},
	today_pv_generation_sum: {unit: "kWh", scaling: 0.001},
	today_month_pv_generation_sum: {unit: "kWh", scaling: 0.001},
	today_self_consumption: {unit: "%"},
	current_day_self_consumption: {unit: "%"},
	pv_capacity: {unit: "kWp", scaling: 0.001},
	mode: {
		states: {
			0: "Stop", 
			1: "Normal Mode", 
			2: "PV only Mode"}
	},
	ac_output_power: {unit: "kW", scaling: 1},
	bat_status: { 
		states: {
			0: "Standby", 
			1: "charging",
			2: "discharging",
			off: "off"}
	},
	current_pv_generation_sum: {unit: "kWh", scaling: 0.001},
	bat_use:{type: "boolean"},
	capacity: {unit: "kWh", scaling: 0.1},
	ac_input_power: {unit: "kW", scaling: 0.001},
	startdate: {type: "string"},
	stopdate: {type: "string"},
	
	backup_status: {map: "BackupMode"},
	winter_status: {map: "WinterMode"},
	alg_setting: {map: "ChargingMode"},
/*	use: {map: "BatteryUse"}, */
	status: {map: "Operation"},

	BackupMode: {type: "number", write: true, urlCmd: "/v1/user/setting/batt", cmdKey: "backupmode",
		states: {
			0: "off", 
			1: "on"},
		valueMap:{
			off: 0,
			on: 1}	
		},
	WinterMode: {type: "number", write: true, urlCmd: "/v1/user/setting/batt", cmdKey: "wintermode",
		states: {
			0: "off", 
			1: "on"},
		valueMap:{
			off: 0,
			on: 1}
		},
	ChargingMode: {type: "number", write: true, urlCmd: "/v1/user/setting/batt", cmdKey: "alg_setting",		
		states: {
			0: "battery_care", 
			1: "fast_charge", 
			2: "weather_forecast"},
		valueMap:{
			battery_care: 0,
			fast_charge: 1,
			weather_forecast: 2}
	},
	Operation: {type: "number", write: true, urlCmd: "/v1/user/operation/status", cmdKey: "operation",		
		states: {
			0: "stop", 
			1: "start"},
		valueMap:{
			stop: 0,
			start: 1}
	},
}/*	BatteryUse: {type: "number", write: true, urlCmd: "/v1/installer/setting/batt/use", cmdKey: "use",
		states: {
			0: "off", 
			1: "on"},
		valueMap:{
			off: 0,
			on: 1}	
	},	
}*/

const GRAPH_TIMESPANS = ["day", "week", "month", "year"]
const GRAPH_DEVICES = ["batt", "load", "pv"]

const GRAPH_PARAMS = {
	day: "year_month_day",
	week: "year_month_day",
	month: "year_month",
	year: "year"
}

const GRAPH_TFORMATS = {
	year_month_day: "yyyymmdd",
	year: "yyyy",
	year_month: "yyyymm"
}

function LgEss(adapter, ip, password, refreshTime, refreshTimeCommon, loginAsInstaller, installerpassword){

     this.Login = function () {
		let options;
        if (!loginAsInstaller){
			options = {
				url: `https://${ip}/v1/user/setting/login`,
				method: 'PUT',
				timeout: timeout,
				strictSSL: false,
				rejectUnauthorized: false,
				json: {
					password: password
				}
			};
		} else {
			options = {
				url: `https://${ip}/v1/installer/setting/login`,
				method: 'PUT',
				timeout: timeout,
				strictSSL: false,
				rejectUnauthorized: false,
				json: {
					password: installerpassword
				}
			};
		}
		adapter.log.silly(`[LG ESS] Try to Login: ${JSON.stringify(options)}`);
		unload = false;
		request(options, async (error, response, body) => {
			try {
				if (!error && response && response.statusCode === 200) {
					let data = (typeof(body) == "object") ? body : JSON.parse(body);					
					adapter.log.debug(`[LG ESS] Response: ${JSON.stringify(data)}`);
					if (data.status == "password mismatched") {
						await adapter.setStateAsync("info.connection", false, true);
						await adapter.setStateAsync("info.connectedUser", "", true);
						adapter.log.info(`[LG ESS] Login faild: ${JSON.stringify(data)}`);
						return false;
					}
					else if (data.status == "success"){
						adapter.log.info("[LG ESS] Login success.");
						await adapter.setStateAsync("info.connection", true, true);
						await adapter.setStateAsync("info.connectedUser", data.role, true);
						_auth_key = data.auth_key;
						_userrole = data.role;
						adapter.deltestate
						this.TimerHome();
						this.TimerCommon();
						this.SlowTimer();
					}
				} else {
					adapter.log.info(`[LG ESS] Login faild: ${error ? JSON.stringify(error) : response && response.statusCode}. Try again in one Minute`);
					await adapter.setStateAsync("info.connection", false, true);
					await adapter.setStateAsync("info.connectedUser", "", true);
					this.StopTimer(false);
					if (unload === false)
						timerLogIn = setTimeout(() => this.Login(), 60000); /* Login in einer Minute erneut versuchen */			
				}
			}
			catch(err){
				adapter.log.error(`[LG ESS] Login: ${err}`)
			}
		});
	}

	this.TimerHome = function() {
		this.GetRequest(STATE_URL.Home);
		if (unload === false)
			timerHome = setTimeout(() => this.TimerHome(), refreshTime * 1000);
	}
	this.TimerCommon = function() {
		this.GetRequest(STATE_URL.Common);
		if (unload === false)
			timerCommon = setTimeout(() => this.TimerCommon(), refreshTimeCommon * 1000);
	}
	this.SlowTimer = function () {
		this.GetRequest(STATE_URL.SystemInfo);
		this.GetRequest(STATE_URL.SettingBatt);
		this.GetRequest(STATE_URL.SettingNetwork);
		this.GetGraphs();
		if (_userrole == "installer"){
			this.GetRequest(STATE_URL.InstallerSettingBatt);
			this.GetRequest(STATE_URL.InstallerSettingPv);
			this.GetRequest(STATE_URL.InstallerSettingPcs);
		}

		let dt = new Date();
		let min = dt.getMinutes() % 15;
		if (unload === false)
			timerSlow = setTimeout(() => this.SlowTimer(), (15-min)  * 60 * 1000 - (dt.getSeconds() *1000) + 10000); /* alle 15 Minuten */		
	}

	this.StopTimer = function (cmdUnload) {
		unload = cmdUnload;
		if (timerHome) clearTimeout(timerHome);
		if (timerCommon) clearTimeout(timerCommon);
		if (timerSlow) clearTimeout(timerSlow);
		if (timerLogIn) clearTimeout(timerLogIn);
	}

	/******************************************************************************************************************************
	 * Get actual graphs 
	 ******************************************************************************************************************************/
	this.GetGraphs = function () {
		for (let i = 0; i < GRAPH_DEVICES.length; i++) {
			for (let u = 0; u < GRAPH_TIMESPANS.length; u++) {
				let date = this.formatTime(new Date(),GRAPH_TFORMATS[GRAPH_PARAMS[GRAPH_TIMESPANS[u]]]);
				let extra_json_data={};
				extra_json_data[GRAPH_PARAMS[GRAPH_TIMESPANS[u]]] = date;
				this.GetRequest(`/v1/user/graph/${GRAPH_DEVICES[i]}/${GRAPH_TIMESPANS[u]}`,extra_json_data);
			}
		}
	}

	/******************************************************************************************************************************
	 * Get request
	 * @param {string} url Request url
	 * @param {string} extra_json_data extra json data
	 ******************************************************************************************************************************/
    this.GetRequest = function (url, extra_json_data) {
        let options = {
			url: `https://${ip}${url}`,
			method: 'POST',
			timeout: timeout,
			strictSSL: false,
			rejectUnauthorized: false,
			json: {
                auth_key: _auth_key,
            }
		};

		if (extra_json_data)
			Object.assign(options.json, extra_json_data);
		
		adapter.log.debug(`[LG ESS] request: ${JSON.stringify(options)}`);
		request(options, async (error, response, body) => {
			try {
				if (!error && response && response.statusCode === 200) {
					let data = (typeof(body) == "object") ? body : JSON.parse(body);		
					adapter.log.debug(`[LG ESS] Response: ${JSON.stringify(data)}`);			
					if (response.request.uri.path) this.ParseData(data, response.request.uri.path);	
				} else if (error){
					adapter.log.warn(`[LG ESS] Error: ${error ? JSON.stringify(error) : response && response.statusCode}`);
					this.StopTimer(false);
					await adapter.setStateAsync("info.connection", false, true);
					if (unload === false)
						timerLogIn = setTimeout(() => this.Login(), 60000); /* Retry login in a minute */
				} else {
					this.StopTimer(false);
					await adapter.setStateAsync("info.connection", false, true);
					if (unload === false)
						timerLogIn = setTimeout(() => this.Login(), 60000); /* Retry login in a minute */				
				}
			}
			catch(err){
				adapter.log.error(`[LG ESS] - GetRequest: ${err}`)
			}
		});
	}

	/******************************************************************************************************************************
	 * Parse request data
	 * @param {any} data Data to parse
	 * @param {string} path Data path
	 ******************************************************************************************************************************/	
	this.ParseData = async function(data , path){	
		try {
			let keys = path.split('/');
			let strName = null;
			let keyGraph = 0;

			for (let i = 1; i < keys.length; i++) {
				if (keys[i] == "v1") continue;

				if (keyGraph > 0) keyGraph++;
				if (keys[i] == "graph") keyGraph = 1;

				if (strName == null) strName = keys[i];
				else strName = strName + "." + keys[i];

				/* Write graph json */
				if (keyGraph == 3){
					// Create Object
					await adapter.setObjectNotExistsAsync(strName, {
						type: "state",
						common: {
							name: keys[i],
							type: "json",
							role: "json",
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
						
						let varName = `${variable}_${(i+1).toString()}`;
						
						/* Create Channel */
						await adapter.setObjectNotExistsAsync(`${strName}.${varName}`, {
							type: 'channel',
							common: {
								name: varName,
							},
							native: {}
						});	

						for (const [variable1, value1] of Object.entries(value[i])) {
							this.WriteData(`${strName}.${varName}`, variable1, value1, false);
						}
					}
				}
				else if (typeof(value) == "object"){
					for (const [variable1, value1] of Object.entries(data[variable])) {
						
						/* Create Channel */
						await adapter.setObjectNotExistsAsync(`${strName}.${variable}`, {
							type: 'channel',
							common: {
								name: variable,
							},
							native: {}
						});	
						this.WriteData(`${strName}.${variable}`, variable1, value1, false);
					};
				} else {
					this.WriteData(strName, variable, value, false);
				}
			};
		}
		catch(err){
			adapter.log.error(`[LG ESS] - ParseData:  ${err}`)
		}	
	}

	/******************************************************************************************************************************
	 * Write data to a datapoint, if datapoint not exists create this datapoint
	 * @param {string} path Data path
	 * @param {string} variable Variablenname
	 * @param {any} value Value
	 ******************************************************************************************************************************/
	this.WriteData = async function(path, variable, value, onlyUpdateDifferent){
		let id = `${path}.${variable}`;

		try {
			const obj = await adapter.getObjectAsync(id)
			if (!obj){
				await this.CreateDataPoint(path, variable, value);
			} else {
				/* If a scaling factor is defined then calculate the value */
				if (obj.native.ScalingFactor) {
					let factor = 1 / obj.native.ScalingFactor;
					value *= obj.native.ScalingFactor;
					value = Math.round(value * factor)/factor;
				} else if (this.GetVarType(value)== "number" && obj.common.type =="number")
					value = Math.round(value * 100)/100;
				
				this.WriteValue(path, variable, obj.common.type, value, onlyUpdateDifferent);
			}
		}
		catch (err){
			adapter.log.debug(`[LG ESS] - WriteData: ${err}`);	
		}
	}

	/******************************************************************************************************************************
	 * Create a datapoint 
	 * @param {string} path Data path
	 * @param {string} variable Variablenname
	 * @param {any} value Value
	 ******************************************************************************************************************************/	
	this.CreateDataPoint = async function(path, variable, value){
		try {
			let id = `${path}.${variable}`;

			/*Ignore empty values*/
			if (value == "") return;

			var r = this.CreateTypeRollUnitScaling(path,variable,value);
			let write = false;

			if (MAPPING[variable] && MAPPING[variable].write) write = MAPPING[variable].write;
			// Create Object
			await adapter.setObjectNotExistsAsync(id, {
				type: "state",
				common: {
					name: variable,
					type: r.type,
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
			if (this.GetVarType(value) == "number" && r.type =="number")
				value = Math.round(value * 100)/100;

			this.WriteValue(path, variable, r.type,  value);
		}
		catch(err){
			adapter.log.error(`[LG ESS] CreateDataPoint: ${err}`)
		}
	}

	this.CreateTypeRollUnitScaling = function(path, variable, value){

		let type;
		let role;
		let unit;
		let scaling;
		let states;

		if ((variable == "status") && (path == "user.essinfo.common.BATT")) variable = "batt_status";
		if ((variable == "capacity") && (path == "user.essinfo.common.PV")) variable = "pv_capacity";
		if ((variable == "capacity") && (path.startsWith("installer.setting.pv.pvinfo"))) variable = "pv_capacity";

		if (MAPPING[variable] && MAPPING[variable].type)
			type = MAPPING[variable].type;
		else
			type = this.GetVarType(value);
				
		if (type =="number"){
			role = "value";

			if (variable.indexOf("soc") != -1) {
				unit = "%";
			} else if (variable.indexOf("soh") != -1) {
				unit = "%";
			} else if (variable.indexOf("operation_range") != -1) {
				unit = "%";
			} else if (variable.indexOf("load_consumption_sum") != -1) {
				unit = "kWh";
				scaling = 0.001;
			} else if (variable.indexOf("energy") != -1) {
				unit = "kWh";
				scaling = 0.001;
			} else if (variable.indexOf("enery") != -1) {
				unit = "kWh";
				scaling = 0.001;				
			} else if (variable.indexOf("enegy") != -1) {
				unit = "kWh";
				scaling = 0.001;				
			} else if (variable.indexOf("voltage") != -1) {
				unit = "V";
				role = "value.voltage";
			} else if (variable.indexOf("a_phase") != -1) {
				unit = "V";
				role = "value.voltage";				
			} else if (variable.indexOf("cell_volt") != -1) {
				unit = "V";
				role = "value.voltage";	
			} else if (variable.indexOf("out_vol") != -1) {
				unit = "V";
				role = "value.voltage";	
			} else if (variable.indexOf("freq") != -1) {
				unit = "Hz";
			} else if (variable.indexOf("temp") != -1) {
				unit = "°C";
				role = "value.temperature";				
			} else if (variable.indexOf("_current") != -1) {
				unit = "A";
				role = "value.current";
			} else if (variable.indexOf("out_cur") != -1) {
				unit = "A";
				role = "value.current";
			} else if (variable.indexOf("power") != -1) {
				unit = "kW";
				scaling = 0.001;
				role = "value.power";
			} else if (variable.indexOf("Time") != -1) {
				unit = "s";
			}
		} else if (type == "boolean"){
			role = "indicator";
		} else if (type == "string"){
			role = "text";
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
	this.WriteValue = async function(path, variable, type, value, onlyUpdateDifferent){
		try {
			let id = path + "."+ variable;

			if (MAPPING[variable] && MAPPING[variable].valueMap){
				if ((value in MAPPING[variable].valueMap))
					value = MAPPING[variable].valueMap[value];
				else return;
			}

			if (type == "boolean"){
				if ((value == "0") || (value == "off") || (value == "false")) value = false;
				else if ((value == "1") || (value == "on") || (value == "true")) value = true;		
			}
			let state = await adapter.getStateAsync(id);
			if ((onlyUpdateDifferent == false) || !state || ((state) && (state.val != value)))
				await adapter.setStateAsync(id, value, true);

			/* If a MAPPING entry is defined, copy it to the specified variable */
			if ((MAPPING[variable]) && (MAPPING[variable].map))
				this.WriteData("commands",MAPPING[variable].map,value,true);
			
		}
		catch(err){
			adapter.log.error(`[LG ESS] WriteValue: ${err}`)
		}
	}

	/******************************************************************************************************************************
	 * Set a command
	 * @param {string} key Key of command
	 * @param {any} val Value
	 ******************************************************************************************************************************/	
	this.SetCommand = function(key, val){
		let dummy = key.split('.');
		let variable = dummy[dummy.length-1];
		adapter.log.debug(`[LG ESS] SetCommand - Variable: ${variable} new Value: ${val}`);

		if (!MAPPING[variable] || !MAPPING[variable].write || !MAPPING[variable].urlCmd || !MAPPING[variable].states || !MAPPING[variable].states[val])
		return;

		let extra_json_data={};
		if (variable == "ChargingMode")
			extra_json_data[MAPPING[variable].cmdKey] = val;
		else
			extra_json_data[MAPPING[variable].cmdKey] = MAPPING[variable].states[val];
		
		if ((variable == "BatteryUse") && (val == 0))
			this.PutRequest("/v1/installer/setting/pcs/ac", {"acuse" :"off" });

		this.PutRequest(MAPPING[variable].urlCmd,extra_json_data, key, val);
	}

	/******************************************************************************************************************************
	 * Put request
	 * @param {string} url Request url
	 * @param {string} extra_json_data extra json data
	 ******************************************************************************************************************************/
	this.PutRequest = function (url, extra_json_data, key, value) {
        let options = {
			url: `https://${ip}${url}`,
			method: 'PUT',
			timeout: timeout,
			strictSSL: false,
			rejectUnauthorized: false,
			headers: {
				'X-HTTP-Method-Override': 'PUT',
				"Content-Type": "application/json"
			},
			json: {
                auth_key: _auth_key,
            }
		};

		if (extra_json_data)
			Object.assign(options.json, extra_json_data);
		
		adapter.log.debug(`[LG ESS] request: ${JSON.stringify(options)}`);
		request(options, async (error, response, body) => {
			try {
				let data = (typeof(body) == "object") ? body : JSON.parse(body);
				if (!error && response && response.statusCode === 200) {
					if (key)
						await adapter.setStateAsync(key, value, true);
					adapter.log.debug(`[LG ESS] Response: ${JSON.stringify(data)}  ${JSON.stringify(response)}`);
				} else if (error){
					adapter.log.warn(`[LG ESS] Response: ${error ? JSON.stringify(error) : response && response.statusCode}`);
				} else {
					adapter.log.warn(`[LG ESS] Response: ${response && response.statusCode}`);
				}
			}
			catch(err){
				adapter.log.error(`[LG ESS] PostRequest: ${err}`)
			}
		});
	}

	/******************************************************************************************************************************
	 * Checks whether it is a valid IP address
	 * @param {string} ipaddress
	 ******************************************************************************************************************************/
	this.ValidateIPaddress = function (ipaddress) 
	{
		if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
			return true
		else
			return false
	}

	/******************************************************************************************************************************
	 * Determines the type of a variable
	 * @param {string} value
	 ******************************************************************************************************************************/
	this.GetVarType = function (value) {
		if(this.isNumeric(value) == true)
			return "number";
		else if ((value.toLowerCase() == "true") || (value.toLowerCase() == "false"))
			return "boolean";
		else 
			return "string";
	}

	/******************************************************************************************************************************
	 * Determines if a variable is numeric
	 * @param {any} value
	 ******************************************************************************************************************************/
	this.isNumeric = function (value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	}


	this.formatTime = function(time, format){
		time = typeof time == 'number' ? new Date(time) : time;
		format = format || 'yyyy-mm-dd hh:MM:ss';
		var add0 = function(t){ return t < 10 ? '0' + t : t; };
		var year = time.getFullYear();
		var month = time.getMonth() + 1; // 0 indexed
		var date = time.getDate();
		var hours = time.getHours();
		var minutes = time.getMinutes();
		var seconds = time.getSeconds();
		var replaceMent = {
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
		}
		for(var key in replaceMent){
			format = format.replace(key, replaceMent[key]);
		}
		return format;
	}
	  
}

module.exports = LgEss;