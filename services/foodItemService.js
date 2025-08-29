const FoodItem = require('../models/foodItem');

const update = async (id, updateData) => {
  try {
    const updatedItem = await FoodItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    return updatedItem;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteFood = async (id) => {
  try {
    const deletedItem = await FoodItem.findByIdAndDelete(id);
    return deletedItem;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getById = async (id) => {
  try {
    const foodItem = await FoodItem.findById(id).populate('category');
    return foodItem;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {update ,deleteFood,getById }