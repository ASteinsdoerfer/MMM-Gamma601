Module.register("MMM-Gamma601", {

    defaults: {
        ip: "192.168.178.114",
        port: 80,
        updateInterval: 300000
    },

    start() {
        this.dataMiner = {};
        this.getData();

        setInterval(() => {
            this.getData();
        }, this.config.updateInterval);
    },

    getData() {
        this.sendSocketNotification("GET_GAMMA_DATA", this.config);
    },

    socketNotificationReceived(notification, payload) {

        if(notification === "GAMMA_DATA") {
            this.dataMiner = payload;
            this.updateDom(500);
        }
    },

    getDom() {

        const wrapper = document.createElement("div");

     if (!this.dataMiner.online) {
    wrapper.innerHTML = "Verbinde mit Miner...";
    return wrapper;
    }  

	const seconds = this.dataMiner.uptime;

	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const sekunden = Math.floor((seconds % 60));

	const uptimeText =
	`${days} ${days === 1 ? "Tag" : "Tage"} ` +
	`${hours} ${hours === 1 ? "Stunde" : "Stunden"}`;


        wrapper.innerHTML = `
            
			Status ${this.dataMiner.online ? "<i class='fa-solid fa-wifi'></i>" :"<i class='fa-solid fa-bell'></i>"}<br>
			<i class="fa-brands fa-btc"></i> Hashrate ${(this.dataMiner.hashrate /1000).toFixed(2)} Th/s<br>
			<i class="fa-solid fa-trophy"></i> already mined: ${this.dataMiner.Jackpot}<br>
            <i class="fa-solid fa-temperature-high"></i> Temperatur ${this.dataMiner.temp.toFixed(1)} °C<br>
            <i class="fa-solid fa-bolt"></i> Power ${this.dataMiner.power.toFixed(1)} W<br>
            <i class="fa-solid fa-share-nodes"></i> Shares: ${this.dataMiner.shares} <i class="fa-solid fa-xmark"></i> Rejected ${this.dataMiner.rejected} <i class="fa-solid fa-caret-right"></i> ${((this.dataMiner.rejected/this.dataMiner.shares)*100).toFixed(2)} %<br> 
            <i class="fa-solid fa-water-ladder"></i> Pool: ${this.dataMiner.pool}<br>
            <i class="fa-solid fa-power-off"></i> Uptime: ${uptimeText} ${sekunden} Sekunden<br>		
        `;


        return wrapper;
    }
});