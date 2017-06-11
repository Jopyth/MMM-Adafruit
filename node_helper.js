/* Magic Mirror
 * Module: Adafruit
 *
 * By Joseph Bethge https://github.com/Jopyth
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const spawn = require("child_process").spawn;

module.exports = NodeHelper.create({
	start: function () {
		console.log(this.name + " helper started ...");
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;

		if (notification === "REQUEST") {
			var content = "";
			var errorContent = "";

			var child = spawn("adafruit-io", ["client", "data", "all", payload.feed, "-j"]);

			child.stdout.on("data", function(chunk) {
				content = content + chunk;
			});

			child.stderr.on("data", function(chunk) {
				errorContent = errorContent + chunk;
			});

			child.on("close", (code) => {
				// console.log(`child process exited with code ${code}`);
				// console.log(content);
				self.sendSocketNotification("RESPONSE", content);
			});
		}
	}
});
