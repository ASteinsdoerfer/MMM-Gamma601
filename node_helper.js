const NodeHelper = require("node_helper");
const axios = require("axios");

module.exports = NodeHelper.create({

    socketNotificationReceived(notification, config) {

        if(notification !== "GET_GAMMA_DATA")
            return;

        this.readMiner(config);
    },

    async readMiner(config){

        try{

            const response = await axios.get(
                `http://${config.ip}/api/system/info`
            );

            const d = response.data;


this.sendSocketNotification("GAMMA_DATA", {

    online: true,
    hashrate: d.hashRate,
    hashrate1m: d.hashRate_1m,
    hashrate10m: d.hashRate_10m,
    hashrate1h: d.hashRate_1h,

    expectedHashrate: d.expectedHashrate,

    temp: d.temp,
    vrTemp: d.vrTemp,

    power: d.power,

    shares: d.sharesAccepted,
    rejected: d.sharesRejected,
    errorPercentage: d.errorPercentage,

    uptime: d.uptimeSeconds,

    pool: d.stratumURL,
    difficulty: d.poolDifficulty,

    fanspeed: d.fanrpm,

    version: d.axeOSVersion,

    wifi: d.wifiRSSI,

    bestDiff: d.bestDiff

});
        }catch(e){

            this.sendSocketNotification("GAMMA_DATA",{
                online:false
            });

        }

    }

});