"use strict";

const request   = require('request');
const timeout   = 1500;
let _auth_key = null;
let _userrole = null;
let _ipAdress = null;
var timerFast = null;
var timerSlow = null;
var timerLogIn = null;

const stateUrl = {
	Common: "/v1/user/essinfo/common",
	Home: "/v1/user/essinfo/home",
	SystemInfo: "/v1/user/setting/systeminfo",
	SettingBatt: "/v1/user/setting/batt",
	SettingNetwork: "/v1/user/setting/network"
}

const mapping = {
//PV
	brand: {
		group: "pv", 
		name: "Brand", 
		type: "string", 
		roll: "text"},
	pv_capacity: {
		group: "pv", 
		name: "System Capacity", 
		unit: "kWp", 
		factor: 0.001, 
		roll: "value"},
	pv1_voltage: {
		group: "pv", 
		name: "DC Voltage String 1", 
		unit: "V",  
		roll: "value.voltage"},
	pv2_voltage: {
		group: "pv", 
		name: "DC Voltage String 2", 
		unit: "V", 
		roll: "value.voltage"},
	pv3_voltage: {
		group: "pv", 
		name: "DC Voltage String 3", 
		unit: "V",  
		roll: "value.voltage"},
	pv1_power: {
		group: "pv", 
		name: "DC Power String 1", 
		unit: "W", 
		roll: "value.power"},
	pv2_power: {
		group: "pv", 
		name: "DC Power String 2", 
		unit: "W", 
		roll: "value.power"},
	pv3_power: {
		group: "pv", 
		name: "DC Power String 3", 
		unit: "W", 
		roll: "value.power"},
	pv1_current: {
		group: "pv", 
		name: "DC Current String 1", 
		unit: "A",  
		roll: "value.current"},
	pv2_current: {
		group: "pv", 
		name: "DC Current String 2", 
		unit: "A",  
		roll: "value.current"},
	pv3_current: {
		group: "pv", 
		name: "DC Current String 3", 
		unit: "A", 
		roll: "value.current"},
	today_pv_generation_sum: {
		group: "pv", 
		name: "Today generation", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value"},
	today_month_pv_generation_sum: {
		group: "pv", 
		name: "This month generation", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value"},

//BATT
	batt_status: {
		group: "battery", 
		name: "Battery Status", 
		roll: "value", 
		states: {
			0: "Standby", 
			1: "charging",
			2: "discharging"}
	},
	soc: {
		group: "battery", 
		name: "State of charge", 
		unit: "%", 
		roll: "value"},
	dc_power: {
		group: "battery", 
		name: "DC Power", 
		unit: "W", 
		roll: "value.power"},
	safety_soc: {
		group: "battery", 
		name: "Safety SOC", 
		unit: "%", 
		roll: "value"},
	winter_setting: {
		group: "battery", 
		name: "Winter Mode", 
		type: "string", 
		roll: "level", 
		write: true,
		urlCmd: "/v1/user/setting/batt",
		cmdKey: "wintermode",
		states: {
			"off": "off", 
			"on": "on"}
	},
	winter_status: {
		map: "winter_setting"},
	backup_setting: {
		group: "battery", 
		name: "Backup Mode", 
		type: "string", 
		roll: "text", 
		write: true,
		urlCmd: "/v1/user/setting/batt",
		cmdKey: "backupmode",
		states: {
			"off": "off", 
			"on": "on"}
	},
	backup_status: {
		map: "backup_setting"},
	backup_soc: {
		group: "battery", 
		name: "Backup SOC", 
		unit: "%", 
		roll: "value"},
	today_batt_charge_energy: {
		group: "battery", 
		name: "Charging Energy today", 
		unit: "kWh", factor: 0.001, 
		roll: "value"},
	month_batt_charge_energy: {
		group: "battery", 
		name: "Charging Energy this month", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value"},
	month_batt_discharge_energy: {
		group: "battery", 
		name: "Discharging Energy this month", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value"},
	today_batt_discharge_enery: {
		group: "battery", 
		name: "Discharging Energy today", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value"},

//GRID
	active_power: {
		group: "grid", 
		name: "Active Power", 
		unit: "W", 
		roll: "value.power"},
	a_phase: {
		group: "grid", 
		name: "Voltage", 
		unit: "V", 
		roll: "value.voltage"},
	freq: {
		group: "grid", 
		name: "Frequency", 
		unit: "Hz", 
		roll: "value"},
	today_grid_feed_in_energy: {
		group: "grid", 
		name: "Energy into Grid today", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value"},
	month_grid_feed_in_energy: {
		group: "grid", 
		name: "Energy into Grid today", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value"},
	month_grid_power_purchase_energy: {
		group: "grid", 
		name: "Energy from grid this month", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value"},
	today_grid_power_purchase_energy: {
		group: "grid", 
		name: "Energy from grid today", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value"},
	
//LOAD	
	load_power: {
		group: "load", 
		name: "Load Power", 
		unit: "W", 
		roll: "value.power"},
	month_load_consumption_sum: {
		group: "load", 
		name: "Total consumption this month", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value.power.consumption"},
	month_pv_direct_consumption_energy: {
		group: "pv", name: "Direct consumption this month", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value.power.consumption"},
	today_load_consumption_sum: {
		group: "load", 
		name: "Total consumption today", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value.power.consumption"},
	today_pv_direct_consumption_enegy: {
		group: "pv", 
		name: "Direct consumption today", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value.power.consumption"},

//PCS
	today_self_consumption: {
		group: "pcs", 
		name: "Today self-consumption rate", 
		unit: "%", 
		roll: "value"},
	month_co2_reduction_accum: {
		group: "pcs", 
		name: "This month CO2 reduction", 
		unit: "kg", 
		factor: 0.001, 
		roll: "value"},
	pcs_stauts: {
		group: "pcs", 
		name: "PCS Status", 
		roll: "value"},
	feed_in_limitation: {
		group: "pcs", 
		name: "Feed in limitation", 
		unit: "%", 
		roll: "value"},
	operation_mode: {
		group: "pcs", 
		name: "Opteration Mode", 
		roll: "value"},
	month_pv_generation_sum: {
		group: "pv", 
		name: "This month generation", 
		unit: "kWh", 
		factor: 0.001, 
		roll: "value"},

//PMS
	model: {
		group: "pms", 
		name: "Model", 
		type: "string", 
		roll: "text"},
    serialno: {
		group: "pms", 
		name: "Registration No", 
		type: "string", 	
		roll: "text"},
	ac_input_power: {
		group: "pms", 
		name: "DC Input Power", 
		unit: "kW", 
		factor: 0.001, 
		roll: "value"},
	ac_output_power: {
		group: "pms", 
		name: "AC Output Power", 
		unit: "kW", 
		roll: "value"},
	pms_install_date: {
		group: "pms", 
		name: "Installation Date", 
		type: "string", 
		roll: "date"},

//BATT
	batt_capacity: {
		group: "battery", 
		name: "Capacity", 
		unit: "kWh", 
		factor: 0.1, 
		roll: "value"},
	batt_install_date: {
		group: "battery", 
		name: "Replacement Date", 
		type: "string", 
		roll: "text"},

//Version
	pms_version: {
		group: "version", 
		name: "PMS SW Version", 
		type: "string", 
		roll: "text"},
	pms_build_date: {
		group: "version", 
		name: "PMS Build Date", 
		type: "string", 
		roll: "text"},
	pcs_version: {
		group: "version", 
		name: "PCS SW Version", 
		type: "string", 
		roll: "text"},
	bms_version: {
		group: "version", 
		name: "BMS SW Version", 
		type: "string", 
		roll: "text"},
	bms_unit1_version: {
		group: "version", 
		name: "BMS Unit 1 SW Version", 
		type: "string", 
		roll: "text"},
	bms_unit2_version: {
		group: "version", 
		name: "BMS Unit 2 SW Version", 
		type: "string", 
		roll: "text"},

//statistics
	pcs_pv_total_power: {
		group: "pv", 
		name: "DC Power Total", 
		unit: "W", 
		roll: "value.power"},
	batconv_power: {map: "dc_power"},
	bat_use: {
		group: "battery", 
		name: "Batterie use", 
		type: "boolean", 
		roll: "indicator"},
	bat_status: {
		map: "batt_status"},
	bat_user_soc: {
		map: "soc"},
	load_today: {
		map: "today_load_consumption_sum"},
	grid_power: {
		map: "active_power"},
	current_day_self_consumption: {
		map: "today_self_consumption"},
	current_pv_generation_sum: {
		map: "today_pv_generation_sum"},
	current_grid_feed_in_energy: {
		map: "today_grid_feed_in_energy"},

// direction
	is_direct_consuming_: {
		group: "load", 
		name: "Is direct consuming", 
		type: "boolean", 
		roll: "indicator"},
	is_battery_charging_: {
		group: "battery", 
		name: "Is battery charging", 
		type: "boolean", 
		roll: "indicator"},
	is_battery_discharging_: {
		group: "battery", 
		name: "Is battery discharging", 
		type: "boolean", 
		roll: "indicator"},
	is_grid_selling_: {
		group: "grid", 
		name: "Is grid selling", 
		type: "boolean", 
		roll: "indicator"},
	is_grid_buying_: {
		group: "grid", 
		name: "Is grid buying", 
		type: "boolean", 
		roll: "indicator"},
	is_charging_from_grid_: {
		group: "battery", 
		name: "Is charging form grid", 
		type: "boolean", 
		roll: "indicator"},
	is_discharging_to_grid_: {
		group: "battery", 
		name: "Is discharging to grid", 
		type: "boolean", 
		roll: "indicator"},

//operation
	operation_status: {
		group: "operation", 
		name: "Operation Status", 
		type: "string", 
		roll: "level", 
		write: true,
		urlCmd: "/v1/user/operation/status",
		cmdKey: "operation",
		states: {
			"start": "Start", 
			"stop": "Stop"}
	},
	mode: {
		group: "operation", 
		name: "Operation Mode", 
		roll: "value", 
		states: {
			0: "Stop", 
			1: "Normal Mode", 
			2: "PV only Mode"}
	},
	pcs_standbymode: {
		group: "pcs", 
		name: "PCS Standby mode", 
		type: "boolean", 
		roll: "value"
	},


//heatpump
	heatpump_protocol: {
		group: "heatpump", 
		name: "Protocol", 
		type: "string", 
		roll: "text"},
	heatpump_activate: {
		group: "heatpump", 
		name: "Heatpump activate", 
		type: "boolean", 
		roll: "indecator"},
	current_temp: {
		group: "heatpump", 
		name: "Current temperature", 
		unit: "°C", 
		roll: "value.temperature"},
	heatpump_working: {
		group: "heatpump", 
		name: "Heatpump working", 
		type: "boolean", 
		roll: "indecator"},

//evcharger
	ev_activate: {
		group: "evcharger", 
		name: "EV Charger activate", 
		type: "boolean", 
		roll: "indecator"},
	ev_power: {
		group: "evcharger", 
		name: "EV Charger Power", 
		unit: "W", roll: "value.power"},
	gridwaitingtime: {
		group: "grid", 
		name: "Grid waiting time", 
		unit: "s", 
		roll: "value"},
	pcs_status: {
		group: "pcs", 
		name: "PCS status", 
		type: "string", 
		roll: "text"},
	pcs_op_status: {
		group: "pcs", 
		name: "PCS Operation status", 
		type: "string", 
		roll: "text"},

// /v1/user/setting/batt
	alg_setting: {
		group: "battery", 
		name: "Charging Mode", 
		type: "string", 
		roll: "level", 
		write: true,
		urlCmd: "/v1/user/setting/batt",
		cmdKey: "alg_setting",
		states: {
			"battery_care": "Battery Care", 
			"fast_charge": "Fast Charging", 
			"weather_forecast": "Weather Forecast"}
	},
	startdate: {
		group: "battery", 
		name: "Wintermode Start Date", 
		type: "string", 
		roll: "text"},
	stopdate: {
		group: "battery", 
		name: "Wintermode End Date", 
		type: "string", 
		roll: "text"},
	internet_connection: {
		group: "network", 
		name: "Internet Connection", 
		type: "string", 
		roll: "text"},
	enervu_activated: {
		group: "network", 
		name: "Enervu activated", 
		type: "boolean", 
		roll: "indecator"},
	enervu_upload: {
		group: "network", 
		name: "Enervu upload", 
		type: "boolean", 
		roll: "indecator"},

	type: {
		group: "network", 
		name: "Connection Type", 
		type: "string", 
		roll: "text"},
 	setting: {
		 group: "network", 
		 name: "IP Setting", 
		 type: "string", 
		 roll: "text"},
 	ip: {
		 group: "network", 
		 name: "IP Adress", 
		 type: "string", 
		 roll: "info.ip"},
 	mask: {
		 group: "network", 
		 name: "Subnet Mask", 
		 type: "string", 
		 roll: "text"},
 	gateway: {
		 group: "network", 
		 name: "Gateway", 
		 type: "string", 
		 roll: "text"},
 	dns: {
		 group: "network", 
		 name: "DNS", 
		 type: "string", 
		 roll: "text"},
 	connected: {
		 group: "network", 
		 name: "Internet", 
		 type: "string", 
		 roll: "text"},

};

const channels = {
	pv: {name: "PV"},
	battery: {name: "Battery"},
	network: {name: "Network"},
	grid: {name: "Grid"},
	load: {name: "Load"},
	pcs: {name: "PCS"},
	evcharger: {name: "EV Charger"},
	heatpump: {name: "Heatpump"},
	operation: {name: "Operation"},
	pms: {name: "PMS"},
	version: {name: "Version"},
}

function LgEss(adapter, ip, password, refreshTime, commonFast){


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
		adapter.log.debug(`Try to Login`);
		request(options, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				adapter.log.debug(`Response from ESS: ${JSON.stringify(body)}`);
				try {
					if (body.status == "password mismatched")					{
						adapter.log.warn(`Response from ESS: ${JSON.stringify(body)}`);
						return false;
					}
					else if (body.status == "success"){
                        adapter.setState("info.connection", true, true);
                        _auth_key = body.auth_key;
                        _userrole = body.role;
						_ipAdress = ip;
						this.createStates();
						this.FastTimer();
						this.SlowTimer();
					}
					
				} catch (e) {
					
				}
			} else {
				adapter.log.warn(`Login failed: ${error ? JSON.stringify(error) : response && response.statusCode}. Try again in one Minute`);
				this.StopTimer();
				timerLogIn = setTimeout(() => this.Login(), 60000); /* Login in einer Minute erneut versuchen */			
			}
		});
	}

	this.FastTimer = function() {
		this.GetHome();
		if (commonFast == true) this.GetCommon();
		timerFast = setTimeout(() => this.FastTimer(), refreshTime * 1000);
	}

	this.SlowTimer = function () {
		this.GetSystemInfo();
		if (commonFast == false)this.GetCommon();
		this.GetSettingBatt();
		this.GetSettingNetwork();

		let dt = new Date();
		let min = dt.getMinutes() % 15;
		timerSlow = setTimeout(() => this.SlowTimer(), (15-min)  * 60 * 1000 - (dt.getSeconds() *1000) + 10000); /* alle 15 Minuten */		
	}

	this.StopTimer = function () {
		if (timerFast) clearTimeout(timerFast);
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
			url: `https://${_ipAdress}${url}`,
			method: 'POST',
			timeout: timeout,
			strictSSL: false,
			rejectUnauthorized: false,
			json: {
                auth_key: _auth_key
            }
		};

		request(options, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				adapter.log.debug(`Response from ESS: ${JSON.stringify(body)}`);
				try {					
					this.parseData(body);	
				} catch (e) {
                    adapter.log.debug(`Error: ${e}`);	
				}
			} else if (error){
				adapter.log.warn(`Response from ESS: ${error ? JSON.stringify(error) : response && response.statusCode}`);
				this.Login();
			} else {
				this.Login();
			}
		});
    }
	this.parseData = function(data){	
		for (const [variable, value] of Object.entries(data)) {
			if (typeof(value) == "object"){
				for (const [variable1, value1] of Object.entries(data[variable])) {
					this.setValue(variable.toLowerCase(), variable1.toLowerCase(),value1);
				};
			} else {
				this.setValue(null, variable.toLowerCase(),value);
			}
		};	
	}
	this.createStates = async function(){

		for (var key in mapping) {
				
			if (mapping[key].map) continue;
			
			/* Create Channel */
			await adapter.setObjectNotExistsAsync(mapping[key].group, {
				type: 'channel',
				common: {
					name: (channels[mapping[key].group]) ? channels[mapping[key].group].name : "",
				},
				native: {}
			});
			
			let write = (mapping[key].write) ? mapping[key].write : false; 
			await adapter.setObjectNotExistsAsync(mapping[key].group + "."+ key, {
				type: "state",
				common: {
					name: mapping[key].name,
					type: (mapping[key].type) ? mapping[key].type : "number",
					role: mapping[key].roll,
					unit: mapping[key].unit,
					read: true,
					write: write,
					states: mapping[key].states,
				},
				native: {},
			});

			/*Subscribe state changes*/
			if (write == true) 
				adapter.subscribeStates(mapping[key].group + "."+ key);
		}
	}
	this.setValue = async function(key ,variable, value){
		if (!value){
			adapter.log.silly(`Emty Value => Ignored: ${key + " " + variable }`);
			return;
		}

		let mVar;
		if ((key)&&((variable === "capacity") || (variable === "install_date") || (variable === "status")))
			mVar = key + "_" + variable;
		else
			mVar = variable;
		
		if (mapping[mVar]){					
			if (mapping[mVar].map){
				mVar = mapping[mVar].map;
				variable = mVar;
			} 
			
			let va = value;
			if (mapping[mVar].type == "boolean"){
				va = (value == 1) ? true : false;
			} else {
				if (mapping[mVar].factor) va *= mapping[mVar].factor;
			}

			// Set Value
			await adapter.getStateAsync(mapping[mVar].group + "."+ mVar, async function (err, state) {
				if (err || (!state) || ((state) && (state.val != va)))
					await adapter.setStateAsync(mapping[mVar].group + "."+ mVar, va,true);
			}); 

		} else {
			adapter.log.debug(`Not in mapping found: ${mVar}`);
		}
	}
	this.SetCommand = function(key, val){
		let dummy = key.split('.');
		let variable;
		variable = dummy[dummy.length-1];
		adapter.log.debug(`Variable: ${dummy[dummy.length-1]} neuer Wert: ${val}`);


		if (!mapping[variable] || !mapping[variable].write || !mapping[variable].urlCmd)
		return;

		if (!mapping[variable].states.hasOwnProperty(val)){
			adapter.log.debug(`[LG ESS] Value ${val} is not valid.`);
			return;
		}

		let options = {
			url: `https://${_ipAdress}${mapping[variable].urlCmd}`,
			method: 'PUT',
			timeout: timeout,
			strictSSL: false,
			rejectUnauthorized: false,
			json: {
				auth_key: _auth_key,
            }
		};
		options.json[mapping[variable].cmdKey] = val;
		adapter.log.debug(`[LG ESS] request: ${JSON.stringify(options)}`);

		request(options, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				adapter.log.debug(`[LG ESS] Response: ${JSON.stringify(body)}  ${JSON.stringify(response)}`);
			} else if (error){
				adapter.log.warn(`[LG ESS] Response: ${error ? JSON.stringify(error) : response && response.statusCode}`);
			} else {
				adapter.log.warn(`[LG ESS] Response: ${response && response.statusCode}`);
		}
		});
	}
}

module.exports = LgEss;