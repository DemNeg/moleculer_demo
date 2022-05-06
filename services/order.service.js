"use strict";

const DbService = require("moleculer-db");
const mongooseAdapter = require("moleculer-db-adapter-mongoose");
const Order = require("../models/order.model");

/**
 * orders service
 */
module.exports = {

	name: "orders",

	mixins: [DbService],
	adapter: new mongooseAdapter("mongodb://localhost:27017/ecommerce"),
	model: Order, 

	/**
	 * Service settings
	 */
	settings: {
		fields: ["_id","id","customer_id","state","total"]
	},

	/**
	 * Service metadata
	 */
	metadata: {},

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		
		async place_order(ctx){
			const customer_id = ctx.params.customer_id;
			const total = ctx.params.total;
			const node_id = this.broker.nodeID

			this.broker.emit("order.created", {customer_id, total})
			// Alternative way : ctx.emit("order.created", {customer_id, total})
			return{ node_id };
		}
	},

	/**
	 * Events
	 */
	events: {
		async "some.thing"(ctx) {
			this.logger.info("Something happened", ctx.params);
		},

		"creditReserved"(payload){
			this.logger.info("Credit Reserved", payload);
		},
		"creditLimitExceeded"(payload){
			this.logger.info("Credit Limit Exceeded", payload);
		}
	},

	/**
	 * Methods
	 */
	methods: {
		async seedDB(){
			this.logger.info("Seed Orders DB ...");

			await Promise.resolve();
			this.adapter.insert({
				id: 1,
				customer_id: 1,
				state: "pending",
				total: 90000
			});
			const orders = this.adapter.insert({
				id: 2,
				customer_id: 2,
				state: "pending",
				total: 26000
			});
			this.logger.info(`Generated ${orders.length} orders !`);
		}

	},

	async afterConnected(){
		const count = await this.adapter.count();
		if (count == 0) {
			this.seedDB();
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
