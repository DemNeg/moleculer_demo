"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const Customer = require("../models/customer.model");

/**
 * create service
 */
module.exports = {

	name: "customers",

	mixins: [DbService],
	adapter: new MongooseAdapter(process.env.MONGO_URI || "mongodb://mongo:27017/ecommerce"),
	model: Customer,

	/**
	 * Service settings
	 */
	settings: {
		fields:["_id","id","name","credit_limit"]
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
		/**
		* Test action
		*/
		test: {
			async handler(ctx) {
				return "Hello Moleculer";
			}
		}
	},

	/**
	 * Events
	 */
	events: {
		async "some.thing"(ctx) {
			this.logger.info("Something happened", ctx.params);
		},

		"order.created"(payload){
			// payload.customer_id
			// payload.total
			this.logger.info("Something happened in order.created event handler", payload);

			//Check the customer credit limit
			this.checkCustomerCreditLimit(payload.customer_id, payload.total);
		}
	},

	/**
	 * Methods
	 */
	methods: {
		async seedDB(){
			this.logger.info(" Seed Customer DB...");
			await Promise.resolve();
			this.adapter.insert({
				id: 1,
				name: "Joe",
				credit_limit: 90000
			});
			const customers = this.adapter.insert({
				id: 2,
				name: "Jeen",
				credit_limit: 10000
			});
			this.logger.info(`Generated ${customers.length} customers !`);
		},

		checkCustomerCreditLimit(customer_id, total) {
			Customer.findOne({id : customer_id}, (err, foundCustomer) =>{
				if (err) {
					this.logger.error("Error connecting to customer DB");
				}

				// In case the customer is found
				const credit_limit = foundCustomer.credit_limit;
				if(total <= credit_limit) {
					this.broker.emit("creditReserved", "Under customer credit limit, can process the orders");
				}else{
					this.broker.emit("creditLimitExceeded", "Exceed customer credit limit, cannot process the orders");
				}
			});
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
