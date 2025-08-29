
const Category = require('../models/category');

const getMenuTypes = async (req, res) => {
  try {
    const menuTypes = [
      "Pizzas", "Garlic Bread", "Calzone", "Kebabs", 
      "Salads", "Cold drinks", "Happy Meal", 
      "Desserts", "Hot drinks", "Sauces", "Orbit"
    ];
    
    res.json({
      success: true,
      data: menuTypes
    });
  } catch (error) {
    console.error('Error fetching menu types:', error);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const searchMenuType = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: ' please input the item'
      });
    }

    const regex = new RegExp(query, 'i');
    
    const categories = await Category.find({
      $or: [
        { type: regex },
        { name: regex }
      ],
      isActive: true
    }).select('name type description image items');
    
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Do not have results'
      });
    }

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'server error'
    });
  }
};

const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    const categories = await Category.find({
      type: type,
      isActive: true
    }).select('name description image items');
    
    res.json({
      success: true,
      type: type,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories by type:', error);
    res.status(500).json({
      success: false,
      message: 'server error'
    });
  }
};

const getItemsByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    const categories = await Category.find({
      type: type,
      isActive: true
    });
    
    const allItems = [];
    categories.forEach(category => {
      category.items.forEach(item => {
        allItems.push({
          name: item.name,
          price: item.price,
          description: item.description,
          category: category.name
        });
      });
    });
    
    res.json({
      success: true,
      type: type,
      count: allItems.length,
      data: allItems
    });
  } catch (error) {
    console.error('Error fetching items by type:', error);
    res.status(500).json({
      success: false,
      message: 'server error'
    });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, type, description, image, items } = req.body;
    
    const newCategory = new Category({
      name,
      type,
      description,
      image,
      items: items || []
    });
    
    const savedCategory = await newCategory.save();
    
    res.status(201).json({
      success: true,
      message: 'Sucssess added',
      data: savedCategory
    });
  } catch (error) {
    console.error('Error adding category:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'data error',
        errors: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'server error'
    });
  }
};

module.exports = {
  getMenuTypes,
  searchMenuType,
  getCategoriesByType,
  getItemsByType,
  addCategory
};