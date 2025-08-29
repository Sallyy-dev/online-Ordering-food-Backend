const FoodItem = require('../models/foodItem');
const foodItemService = require('../services/foodItemService'); 

const getAllFoodItems = async (req, res) => {
  try {
    const items = await FoodItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createFoodItem = async (req, res) => {
  const item = new FoodItem({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    category: req.body.category,
    sizes: req.body.sizes || []
  });
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateFoodItem = async (req, res)=>{
      try {
      const updated = await foodItemService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: "Food not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

const deleteFoodItem = async(req,res)=>{
      try {
      const deleted = await foodItemService.deleteFood(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Food not found" });
      res.json({ message: "Food item deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

const getFoodItemById = async (req, res) => {
  try {
    const foodItem = await foodItemService.getById(req.params.id);
    if (!foodItem) return res.status(404).json({ message: "Food not found" });
    res.json(foodItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {getAllFoodItems,createFoodItem, updateFoodItem ,deleteFoodItem,getFoodItemById  }
