// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMenuTypes,
  searchMenuType,
  getCategoriesByType,
  getItemsByType,
  addCategory
} = require('../controllers/menuController');

router.get('/menu-types', getMenuTypes);
router.get('/search', searchMenuType);

router.get('/categories/:type', getCategoriesByType);
router.get('/items/:type', getItemsByType);


router.post('/categories', addCategory);

module.exports = router;