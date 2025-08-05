const router = require("express").Router();
const controller = require("../controllers/googleAuthControllers")

router.get("/test", (req, res) => {
	res.send("working");
});

router.get("/google/signup", controller.googleRegister);
router.get('/google/login', controller.googleLogin);


module.exports = router;