const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	phone: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String }, // nullable for google logins
	dob: { type: String, required: true },
	age: { type: Number, required: true },
});

// add test results array here for dynamic chart

const User = mongoose.model("User", UserSchema);

module.exports = User;
