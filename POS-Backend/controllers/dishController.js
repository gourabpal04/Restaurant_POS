const Dish = require("../models/dishModel");

// Create new dish
exports.createDish = async (req, res) => {
    try {
        const dish = await Dish.create(req.body);
        res.status(201).json({
            success: true,
            data: dish
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all dishes
exports.getAllDishes = async (req, res) => {
    try {
        const dishes = await Dish.find().populate("category", "name");
        res.status(200).json({
            success: true,
            data: dishes
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get dishes by category
exports.getDishesByCategory = async (req, res) => {
    try {
        const dishes = await Dish.find({ category: req.params.categoryId }).populate("category", "name");
        res.status(200).json({
            success: true,
            data: dishes
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update dish
exports.updateDish = async (req, res) => {
    try {
        const dish = await Dish.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("category", "name");
        if (!dish) {
            return res.status(404).json({
                success: false,
                message: "Dish not found"
            });
        }
        res.status(200).json({
            success: true,
            data: dish
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete dish
exports.deleteDish = async (req, res) => {
    try {
        const dish = await Dish.findByIdAndDelete(req.params.id);
        if (!dish) {
            return res.status(404).json({
                success: false,
                message: "Dish not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Dish deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
