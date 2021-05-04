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

const stateUrl = {
	Common: "/v1/user/essinfo/common",
	Home: "/v1/user/essinfo/home",
	SystemInfo: "/v1/user/setting/systeminfo",
	SettingBatt: "/v1/user/setting/batt",
	SettingNetwork: "/v1/user/setting/network"
}

const mapping ={
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
			2: "discharging"}
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
	status: {map: "Operation"},

	BackupMode: {type: "number", write: true, urlCmd: "/v1/user/setting/batt", cmdKey: "backupmode",
		states: {
			0: "off", 
			1: "on"},
		valueMap:{
			"off": 0,
			"on": 1}	
		},
	WinterMode: {type: "number", write: true, urlCmd: "/v1/user/setting/batt", cmdKey: "wintermode",
		states: {
			0: "off", 
			1: "on"},
		valueMap:{
			"off": 0,
			"on": 1}
		},
	ChargingMode: {type: "number", write: true, urlCmd: "/v1/user/setting/batt", cmdKey: "alg_setting",		
		states: {
			0: "battery_care", 
			1: "fast_charge", 
			2: "weather_forecast"},
		valueMap:{
			"battery_care": 0,
			"fast_charge": 1,
			"weather_forecast": 2}
	},
	Operation: {type: "number", write: true, urlCmd: "/v1/user/operation/status", cmdKey: "operation",		
		states: {
			0: "stop", 
			1: "start"},
		valueMap:{
			"stop": 0,
			"start": 1}
	}	
}

function LgEss(adapter, ip, password, refreshTime, refreshTimeCommon){


     this.Login = function () {
    
        let options = {
			url: `https://${ip}/v1/user/setting/login`,
			method: 'PUT',
			timeout: timeout,
			strictSSL: false,
			rejectUnauthorized: false,
			json: {
                password: password
            }
		};
		adapter.log.silly(`[LG ESS] Try to Login: ${JSON.stringify(options)}`);
		unload = false;
		request(options, async (error, response, body) => {
			try {
				if (!error && response && response.statusCode === 200) {
					let data = (typeof(body) == "object") ? body : JSON.parse(body);					
					adapter.log.debug(`[LG ESS] Response: ${JSON.stringify(data)}`);
					if (data.status == "password mismatched") {
						await adapter.setStateAsync("info.connection", false, true);
						adapter.log.info(`[LG ESS] Login faild: ${JSON.stringify(data)}`);
						return false;
					}
					else if (data.status == "success"){
						adapter.log.info("[LG ESS] Login success.");
						await adapter.setStateAsync("info.connection", true, true);
						_auth_key = data.auth_key;
						_userrole = data.role;
						this.TimerHome();
						this.TimerCommon();
						this.SlowTimer();
					}
				} else {
					adapter.log.info(`[LG ESS] Login faild: ${error ? JSON.stringify(error) : response && response.statusCode}. Try again in one Minute`);
					await adapter.setStateAsync("info.connection", false, true);
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
		this.GetHome();
		if (unload === false)
			timerHome = setTimeout(() => this.TimerHome(), refreshTime * 1000);
	}
	this.TimerCommon = function() {
		this.GetCommon();
		if (unload === false)
			timerCommon = setTimeout(() => this.TimerCommon(), refreshTimeCommon * 1000);
	}
	this.SlowTimer = function () {
		this.GetSystemInfo();
		this.GetSettingBatt();
		this.GetSettingNetwork();

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

	this.GetCommon = function () {
		this.GetRequest(stateUrl.Common);
	}

	this.GetHome = function () {
		this.GetRequest(stateUrl.Home);
	}

	this.GetSystemInfo = function () {
		this.GetRequest(stateUrl.SystemInfo);
	}

	this.GetSettingBatt = function () {
		this.GetRequest(stateUrl.SettingBatt);
	}

	this.GetSettingNetwork = function () {
		this.GetRequest(stateUrl.SettingNetwork);
	}

    this.GetRequest = function (url) {
    
        let options = {
			url: `https://${ip}${url}`,
			method: 'POST',
			timeout: timeout,
			strictSSL: false,
			rejectUnauthorized: false,
			json: {
                auth_key: _auth_key
            }
		};

		request(options, async (error, response, body) => {
			try {
				if (!error && response && response.statusCode === 200) {
					let data = (typeof(body) == "object") ? body : JSON.parse(body);		
					adapter.log.debug(`[LG ESS] Response: ${JSON.stringify(data)}`);			
					if (response.request.uri.path) this.parseData(data, response.request.uri.path);	
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
	
	this.parseData = async function(data , path){	
		try {
			let keys = path.split('/');
			let strName = null;

			for (let i = 1; i < keys.length; i++) {
				if (keys[i] == "v1") continue;

				if (strName == null) strName = keys[i];
				else strName = strName + "." + keys[i];

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
				if (typeof(value) == "object"){
					for (const [variable1, value1] of Object.entries(data[variable])) {
						
						/* Create Channel */
						await adapter.setObjectNotExistsAsync(strName + "." + variable, {
							type: 'channel',
							common: {
								name: variable,
							},
							native: {}
						});	
						this.writeData(strName + "." + variable, variable1, value1, false);
					};
				} else {
					this.writeData(strName, variable, value, false);
				}
			};
		}
		catch(err){
			adapter.log.error(`[LG ESS] - parseData:  ${err}`)
		}	
	}

	this.writeData = async function(path, variable, value, onlyUpdateDifferent){
		let id = path + "."+ variable;

		try {
			const obj = await adapter.getObjectAsync(id)
			if (!obj){
				await this.createDataPoint(path, variable, value);
			} else {
				/*The following lines are only required for compatibility with versions <V 0.0.5. Will be deleted in later versions.*/
				if (obj.common.ScalingFactor) {
					obj.native.ScalingFactor = obj.common.ScalingFactor;
					delete obj.common.ScalingFactor;
					adapter.setObject(id, obj);
				}

				/* If a scaling factor is defined then calculate the value */
				if (obj.native.ScalingFactor) {
					let factor = 1 / obj.native.ScalingFactor;
					value *= obj.native.ScalingFactor;
					value = Math.round(value * factor)/factor;
				} else if (obj.common.type == "number")
					value = Math.round(value * 100)/100;
				
				this.writeValue(path, variable, obj.common.type, value, onlyUpdateDifferent);
			}
		}
		catch (err){
			adapter.log.debug(`[LG ESS] - create State: ${err}`);	
		}
	}

	this.createDataPoint = async function(path, variable, value){
		try {
			let id = path + "."+ variable;

			/*Ignore empty values*/
			if (value == "") return;

			var r = this.CreateTypeRollUnitScaling(path,variable,value);
			let write = false;

			if (mapping[variable] && mapping[variable].write) write = mapping[variable].write;
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
			this.writeValue(path, variable, r.type,  value);
		}
		catch(err){
			adapter.log.error(`[LG ESS] createDataPoint: ${err}`)
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

		if (mapping[variable] && mapping[variable].type)
			type = mapping[variable].type;
		else
			type = this.GetVarType(value);
				
		if (type =="number"){
			role = "value";

			if (variable.indexOf("soc") != -1) {
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
			} else if (variable.indexOf("freq") != -1) {
				unit = "Hz";
			} else if (variable.indexOf("temp") != -1) {
				unit = "°C";
				role = "value.temperature";				
			} else if (variable.indexOf("_current") != -1) {
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
		if (mapping[variable] && mapping[variable].unit)
			unit = mapping[variable].unit;
		if (mapping[variable] && mapping[variable].scaling)
			scaling = mapping[variable].scaling;
		if (mapping[variable] && mapping[variable].states)
			states = mapping[variable].states;	

		return {type,role,unit,scaling,states};
	}

	this.writeValue = async function(path, variable, type, value, onlyUpdateDifferent){
		try {
			let id = path + "."+ variable;

			if (mapping[variable] && mapping[variable].valueMap)
				if (mapping[variable].valueMap[value]) 
					value = mapping[variable].valueMap[value];
				else return;

			if (type == "boolean"){
				if (value == "0") value = 0;
				else if (value == "1") value = 1;
				else if (value == "off") value = 0;
				else if (value == "on") value = 1;
				else if (value == "false") value = 0;
				else if (value == "true") value = 1;			
			}
			let state = await adapter.getStateAsync(id);
			if ((onlyUpdateDifferent == false) || !state || ((state) && (state.val != value)))
				await adapter.setStateAsync(id, value, true);

			/* If a mapping entry is defined, copy it to the specified variable */
			if ((mapping[variable]) && (mapping[variable].map)){
				this.writeData("commands",mapping[variable].map,value,true);
			}
		}
		catch(err){
			adapter.log.error(`[LG ESS] writeValue: ${err}`)
		}
	}

	this.SetCommand = function(key, val){
		let dummy = key.split('.');
		let variable;
		variable = dummy[dummy.length-1];
		adapter.log.debug(`[LG ESS] SetCommand - Variable: ${dummy[dummy.length-1]} new Value: ${val}`);


		if (!mapping[variable] || !mapping[variable].write || !mapping[variable].urlCmd || !mapping[variable].states || !mapping[variable].states[val])
		return;

		let options = {
			url: `https://${ip}${mapping[variable].urlCmd}`,
			method: 'PUT',
			timeout: timeout,
			strictSSL: false,
			rejectUnauthorized: false,
			json: {
				auth_key: _auth_key,
            }
		};
		if (variable == "ChargingMode")
			options.json[mapping[variable].cmdKey] = val
		else
			options.json[mapping[variable].cmdKey] = mapping[variable].states[val];
		adapter.log.debug(`[LG ESS] request: ${JSON.stringify(options)}`);

		request(options, async (error, response, body) => {
			try {
				let data = (typeof(body) == "object") ? body : JSON.parse(body);
				if (!error && response && response.statusCode === 200) {
					await adapter.setStateAsync(key, val, true);
					adapter.log.debug(`[LG ESS] Response: ${JSON.stringify(data)}  ${JSON.stringify(response)}`);
				} else if (error){
					adapter.log.warn(`[LG ESS] Response: ${error ? JSON.stringify(error) : response && response.statusCode}`);
				} else {
					adapter.log.warn(`[LG ESS] Response: ${response && response.statusCode}`);
				}
			}
			catch(err){
				adapter.log.error(`[LG ESS] SetCommand: ${err}`)
			}
		});
	}

	/**
	 * Checks whether it is a valid IP address
	 * @param {string} ipaddress
	 */
	this.ValidateIPaddress = function (ipaddress) 
	{
		if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
			return true
		else
			return false
	}

	/**
	 * Determines the type of a variable
	 * @param {string} value
	 */
	this.GetVarType = function (value) {
		if(this.isNumeric(value) == true)
			return "number";
		else if ((value.toLowerCase() == "true") || (value.toLowerCase() == "false"))
			return "boolean";
		else 
			return "string";
	}
	
	this.isNumeric = function (value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	}
	  
}

module.exports = LgEss;