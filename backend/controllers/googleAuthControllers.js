const { oauth2client } = require("../util/googleConfig");
const axios = require("axios");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const controller = {};

controller.googleRegister = async (req, res) => {
	const { code } = req.query;
	try {
		const googleRes = await oauth2client.getToken(code);
		oauth2client.setCredentials(googleRes.tokens);

		const userRes = await axios.get(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
		);
		const { email, name } = userRes.data;

		const existing = await User.findOne({ email });
		if (existing) return res.status(400).json({ error: "Email already exists" });

		res.status(200).json({
			message: "success",
			user: {
				email,
				name,
			},
		});
	} catch (error) {
		res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

controller.googleLogin = async (req, res) => {
	const { code } = req.query;
	try {
		const googleRes = await oauth2client.getToken(code);
		oauth2client.setCredentials(googleRes.tokens);

		const userRes = await axios.get(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
		);
		const { email } = userRes.data;
		console.log(userRes);

		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ error: "User not found" });

		const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
		res.json({ data: { ...user.toObject(), password: undefined }, token });
	} catch (error) {
		res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

module.exports = controller;
