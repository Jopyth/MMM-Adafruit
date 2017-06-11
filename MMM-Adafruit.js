/* global Module */

/* Magic Mirror
 * Module: Adafruit
 *
 * By Joseph Bethge https://github.com/Jopyth
 * MIT Licensed.
 */

Module.register("MMM-Adafruit",{

	// Default module config.
	defaults: {
		feed: "",
		updateInterval: 60 * 1000,
		label: "data"
	},

	start: function() {
		Log.info('Starting module: ' + this.name);

		var self = this;
		self.updateData();
		this.loaded = false;
		
		setInterval(function() {
			self.updateData();
		}, this.config.updateInterval);
	},

	updateData: function() {
		this.sendSocketNotification('REQUEST', this.config);
	},

	getScripts: function() {
		return ["modules/MMM-Adafruit/node_modules/chart.js/dist/Chart.js"];
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("canvas");
		wrapper.id = "adafruit-canvas";

		return wrapper;
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === 'RESPONSE')
		{
			this.loaded = true;

			var response = JSON.parse(payload);

			var labels = [];
			var data = [];

			for (var i = 0; i < response.length; i++)
			{
				if (i % 5 == 0)
				{				
					var reverseIndex = response.length - 1 - i;
					labels.push(response[reverseIndex].created_at.split("T")[1].replace("Z",""));
					data.push(response[reverseIndex].value);
				}
			}

			var ctx = document.getElementById("adafruit-canvas").getContext("2d");

			this.chart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: labels,
					datasets: [{
						label: this.config.label,
						data: data,
						backgroundColor: "rgba(255,255,255,0.5)"
					}]
				},
				options: {
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
						}]
					}
				}
			});
		}
	}
});
