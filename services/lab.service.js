"use strict";
// lab.service.js
const Laboratory = require("@moleculer/lab");
/**
 * create service
 */
module.exports = {

	mixins: [Laboratory.AgentService],
    settings: {

    },
	metrics: {
        enabled: true,
        reporter: "Laboratory"
    }, 
	tracing: {
        enabled: true,
        exporter: "Laboratory"
    }, 
	logger: [{
		type: "Console",
		options: { /*...*/ }
	}, "Laboratory"], 
};
