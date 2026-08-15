const NodeHelper = require("node_helper");
const axios = require("axios");



function formatDifficulty(value) {

    if (value === null || value === undefined || isNaN(value)) {
        return "N/A";
    }

    const units = ["", "K", "M", "G", "T", "P", "E"];

    let unitIndex = 0;

    while (
        value >= 1000 &&
        unitIndex < units.length - 1
    ) {
        value /= 1000;
        unitIndex++;
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`;
}


async function getNetworkDifficulty() {
    try {
        const response = await axios.get(
            "https://blockchain.info/q/getdifficulty"
        );

        return response.data;

    } catch (error) {
        console.error(
            "Fehler beim Abrufen der Netzwerk-Difficulty:",
            error.message
        );

        return null;
    }
}

async function getInterval() {
    try {
        const response = await axios.get(
            "https://blockchain.info/q/interval"
        );
		response.data = response.data / 60;	
		
        return response.data;

    } catch (error) {
        console.error(
            "Fehler beim Abrufen der Zeit zwischen 2 Blöcken",
            error.message
        );

        return null;
    }
}

async function getBTCoverall() {
    try {
        const response = await axios.get(
            "https://blockchain.info/q/totalbc"
        );
		
		response.data = response.data/ 100000000;
				
        return response.data;

    } catch (error) {
        console.error(
            "Fehler beim Abrufen der absoluten BTC",
            error.message
        );

        return null;
    }
}


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


            // Netzwerk-Difficulty abrufen
            const networkDifficulty = await getNetworkDifficulty();

            // Best Difficulty formatieren
            const bestDiffFormatted = formatDifficulty(d.bestDiff);

            // Netzwerk-Difficulty formatieren
            const networkDifficultyFormatted =
                networkDifficulty !== null
                    ? formatDifficulty(networkDifficulty)
                    : "N/A";


					
			let bestDiffRatio = null;
			let bestDiffRatioFormatted = "N/A";

			const bestDiff = Number(d.bestDiff);
			const netDiff = Number(networkDifficulty);

			if (Number.isFinite(bestDiff) && Number.isFinite(netDiff) && bestDiff > 0 && netDiff > 0) 
				{			
				bestDiffRatio =  netDiff / bestDiff;
				bestDiffRatioFormatted = formatDifficulty(bestDiffRatio);
				}


			//Wie groß ist die Blockintervallzeit
            const NextBlockInterval= await getInterval();
			
			//wieviele BTC sind im Umlauf
			const BTCoverall = await getBTCoverall();
			
			

this.sendSocketNotification("GAMMA_DATA", {

    online: true,
    hashrate: d.hashRate,
    hashrate1m: d.hashRate_1m,
    hashrate10m: d.hashRate_10m,
    hashrate1h: d.hashRate_1h,

	Jackpot: d.blockFound,

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

    bestDiff: d.bestDiff,
	
 
    bestDiffFormatted: bestDiffFormatted,
    networkDifficulty: networkDifficulty,
    networkDifficultyFormatted: networkDifficultyFormatted,
    bestDiffRatio: bestDiffRatio,
	bestDiffRatioFormatted: bestDiffRatioFormatted,
	NextBlockInterval: NextBlockInterval,
	BTCoverall : BTCoverall
	
	

});
        }catch(e){

            this.sendSocketNotification("GAMMA_DATA",{
                online:false
            });

        }

    }

});