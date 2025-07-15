const express = require("express");
const router = express.Router();
const { createDish, getAllDishes, getDishesByCategory, updateDish, deleteDish } = require("../controllers/dishController");
const { verifyToken } = require("../middlewares/tokenVerification");

router.post("/", verifyToken, createDish);
router.get("/", getAllDishes);
router.get("/category/:categoryId", getDishesByCategory);
router.put("/:id", verifyToken, updateDish);
router.delete("/:id", verifyToken, deleteDish);

module.exports = router;
