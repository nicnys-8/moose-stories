"use strict";

const mongoose = require("mongoose"),
	UserSchema = new mongoose.Schema({
		username: {
			type: String,
			trim: true,
			unique: true
		},
		password: {
			type: String
		},
		email: String,
		admin: {
			type: Boolean,
			default: false
		}
	});

module.exports = mongoose.model("User", UserSchema);
