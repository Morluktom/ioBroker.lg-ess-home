"use strict";

/*
 * Created with @iobroker/create-adapter v1.30.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils 	= require("@iobroker/adapter-core");


// Load your modules here, e.g.:
const LgEss     = require('./lib/LgEss');

var lgEss;

function decrypt(key, value) {
	var result = '';
	for (var i = 0; i < value.length; ++i) {
		result += String.fromCharCode(key[i % key.length].charCodeAt(0) ^ value.charCodeAt(i));
	}
	return result;
}

class LgEssHome extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: "lg-ess-home",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		/*this.log.info("Config Password: " + this.config.userpassword);
		this.log.info("Config refresh time Home: " + this.config.refreshTime);
		this.log.info("Config refresh time Common: " + this.config.refreshTimeCommon);
		*/

		if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.config.ipadress) == false){
			this.log.info("Ip Adress: " + this.config.ipadress + " is invalid");
		}

		this.getForeignObject("system.config", (err, obj) => {
			try {
				if (obj && obj.native && obj.native.secret) {
					//noinspection JSUnresolvedVariable
					this.config.userpassword = decrypt(obj.native.secret, this.config.userpassword);
				} else {
					//noinspection JSUnresolvedVariable
					this.config.userpassword = decrypt("Zgfr56gFe87jJOM", this.config.userpassword);
				}
					
			} catch (err) {
				this.log.warn("Error: " + err);
			}
			this.main();
		});
	}

	/**
	 * Main Routine
	 */
	main(){
		lgEss = new LgEss(this, this.config.ipadress, this.config.userpassword, this.config.refreshTime, this.config.refreshTimeCommon);
		lgEss.Login();

		this.subscribeStates('commands.*');

	}



	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			//clearInterval(timer);
			lgEss.StopTimer();


			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  * @param {string} id
	//  * @param {ioBroker.Object | null | undefined} obj
	//  */
	// onObjectChange(id, obj) {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			if (state.ack == false)
				lgEss.SetCommand(id, state.val)
				
			//this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	
	}

	}
	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.message" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }


// @ts-ignore parent is a valid property on module
if (module.parent) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new LgEssHome(options);
} else {
	// otherwise start the instance directly
	new LgEssHome();
}






