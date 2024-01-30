const router = require("express").Router();

const { getMocks, addMock } = require("../controllers/mock");

router.get("/", getMocks);

router.post("/", addMock);

module.exports = router;

