/**
 * LgEss adapter class.
 */
class LgEss {
  /**
   * Create a new LgEss instance.
   *
   * @param {object} adapter Adapter instance.
   * @param {string} ipAdress IP address.
   * @param {string} password Password.
   * @param {number} refreshTime Refresh time.
   * @param {number} refreshTimeCommon Common refresh time.
   * @param {boolean} loginInstaller Whether the installer login should be used.
   * @param {string} installerPassword Installer password.
   */
  constructor(
    adapter,
    ipAdress,
    password,
    refreshTime,
    refreshTimeCommon,
    loginInstaller,
    installerPassword,
  ) {
    this.adapter = adapter;
    this.ipAdress = ipAdress;
    this.password = password;
    this.refreshTime = refreshTime;
    this.refreshTimeCommon = refreshTimeCommon;
    this.loginInstaller = !!loginInstaller;
    this.installerPassword = installerPassword;
    this.running = false;
    this.log = adapter && adapter.log ? adapter.log : console;
  }

  /**
   * Starts the adapter.
   */
  Start() {
    this.running = true;
    this.log.info(`LG ESS Home adapter started for IP ${this.ipAdress || "unknown"}`);
  }

  /**
   * Stops the adapter.
   */
  Stop() {
    this.running = false;
    this.log.info("LG ESS Home adapter stopped");
  }

  /**
   * Sends a command to the adapter.
   *
   * @param {string} id Command ID.
   * @param {unknown} value Command value.
   */
  SetCommand(id, value) {
    if (this.adapter && this.adapter.log) {
      this.adapter.log.debug(`Set command ${id} = ${value}`);
    }
  }

  /**
   * Returns graph data.
   *
   * @param {Date | null | undefined} date Target date.
   * @returns {Promise<Array>} Graph data.
   */
  async GetGraphs(date) {
    if (this.adapter && this.adapter.log) {
      this.adapter.log.debug(`Get graphs for ${date ? date.toISOString() : "unknown date"}`);
    }
    return [];
  }
}

module.exports = LgEss;
