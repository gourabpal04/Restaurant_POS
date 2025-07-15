const express = require("express");
const router = express.Router();
const { createCategory, getAllCategories, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { verifyToken } = require("../middlewares/tokenVerification");

router.post("/", verifyToken, createCategory);
router.get("/", getAllCategories);
router.put("/:id", verifyToken, updateCategory);
router.delete("/:id", verifyToken, deleteCategory);

module.exports = router;
