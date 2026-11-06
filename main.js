"use strict";

/*
 * Created with @iobroker/create-adapter v1.30.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter.
const utils = require("@iobroker/adapter-core");

// Load your modules here, e.g.:
const LgEss = require("./lib/LgEss");

let lgEss;

function decrypt(key, value) {
  let result = "";
  for (let i = 0; i < value.length; ++i) {
    result += String.fromCharCode(
      key[i % key.length].charCodeAt(0) ^ value.charCodeAt(i),
    );
  }
  return result;
}

class LgEssHome extends utils.Adapter {
  /**
   * @param {Partial<utils.AdapterOptions>} options Adapter options.
   */
  constructor(options) {
    super({
      ...options,
      name: "lg-ess-home",
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    // this.on("objectChange", this.onObjectChange.bind(this));
    this.on("message", this.onMessage.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }

  /**
   * Is called when databases are connected and the adapter received configuration.
   */
  async onReady() {
    // Initialize your adapter here.
    // The adapter configuration (everything under the native attribute in the
    // instance object) is accessible via this.config.

    const ipAddressPattern =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipAddressPattern.test(this.config.ipadress)) {
      this.log.info(`Ip Adress: ${this.config.ipadress} is invalid`);
      return;
    }

    this.getForeignObject("system.config", (_err, obj) => {
      if (!this.supportsFeature || !this.supportsFeature("ADAPTER_AUTO_DECRYPT_NATIVE")) {
        if (obj && obj.native && obj.native.secret) {
          //noinspection JSUnresolvedVariable
          this.config.userpassword = decrypt(
            obj.native.secret,
            this.config.userpassword,
          );
          this.config.installerPassword = decrypt(
            obj.native.secret,
            this.config.installerPassword,
          );
        } else {
          //noinspection JSUnresolvedVariable
          this.config.userpassword = decrypt(
            "Zgfr56gFe87jJOM",
            this.config.userpassword,
          );
          this.config.installerPassword = decrypt(
            "Zgfr56gFe87jJOM",
            this.config.installerPassword,
          );
        }
      }
      this.main();
    });
  }

  /** Main routine. */
  main() {
    lgEss = new LgEss(
      this,
      this.config.ipadress,
      this.config.userpassword,
      this.config.refreshTime,
      this.config.refreshTimeCommon,
      this.config.loginInstaller,
      this.config.installerPassword,
    );
    lgEss.Start();
    this.subscribeStates("commands.*");
  }

  /**
   * Is called when the adapter shuts down. The callback must always be called.
   * @param {() => void} callback Shutdown callback.
   */
  onUnload(callback) {
    try {
      // Clear any timeouts or intervals that may still be active.
      // clearTimeout(timeout1);
      // clearTimeout(timeout2);
      // clearInterval(timer);
      lgEss.Stop();
      callback();
    } catch {
      callback();
    }
  }

  // If you need to react to object changes, uncomment this block and the
  // corresponding listener in the constructor. You also need to subscribe to
  // objects with this.subscribeObjects, similar to this.subscribeStates.
  // /**
  //  * Is called if a subscribed object changes.
  //  * @param {string} id
  //  * @param {ioBroker.Object | null | undefined} obj
  //  */
  // onObjectChange(id, obj) {
  //   if (obj) {
  //     this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
  //   } else {
  //     this.log.info(`object ${id} deleted`);
  //   }
  // }

  /**
   * Is called if a subscribed state changes.
   * @param {string} id State ID.
   * @param {ioBroker.State | null | undefined} state State value.
   */
  onStateChange(id, state) {
    if (state) {
      // The state was changed.
      if (state.ack === false) {
        lgEss.SetCommand(id, state.val);
      }
      // this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      // The state was deleted.
      this.log.info(`state ${id} deleted`);
    }
  }

  // If you need to accept messages in your adapter, uncomment this block and
  // the corresponding listener in the constructor.
  /**
   * Handles a message sent to this instance over the message box.
   * Requires "common.message" to be true in io-package.json.
   * @param {ioBroker.Message} obj Message received by the adapter.
   */
  async onMessage(obj) {
    if (typeof obj === "object" && obj.message) {
      if (obj.command === "getChart") {
        // e.g. send email or pushover or whatever
        this.log.debug(`[LG_ESS] Message getChart Date: ${obj.message}`);
        await lgEss.GetGraphs(new Date(obj.message));

        // Send a response in the callback if required.
        if (obj.callback) {
          this.sendTo(obj.from, obj.command, "Message received", obj.callback);
        }
      }
    }
  }
}

// @ts-expect-error -- parent is a valid property on the CommonJS module.
if (module.parent) {
  // Export the constructor in compact mode.
  /**
   * @param {Partial<utils.AdapterOptions>} options Adapter options.
   */
  module.exports = (options) => new LgEssHome(options);
} else {
  // Otherwise start the instance directly.
  new LgEssHome();
}
