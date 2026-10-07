class LgEss {
    constructor(adapter, ipAdress, password, refreshTime, refreshTimeCommon, loginInstaller, installerPassword) {
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

    Start() {
        this.running = true;
        this.log.info(`LG ESS Home adapter started for IP ${this.ipAdress || 'unknown'}`);
    }

    Stop() {
        this.running = false;
        this.log.info('LG ESS Home adapter stopped');
    }

    SetCommand(id, value) {
        if (this.adapter && this.adapter.log) {
            this.adapter.log.debug(`Set command ${id} = ${value}`);
        }
    }

    async GetGraphs(date) {
        if (this.adapter && this.adapter.log) {
            this.adapter.log.debug(`Get graphs for ${date ? date.toISOString() : 'unknown date'}`);
        }
        return [];
    }
}

module.exports = LgEss;
