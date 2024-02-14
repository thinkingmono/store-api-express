const express = require('express');
//Router creation with express.
const router = express.Router();
//Import route controllers
const { getAllProducts, getAllProductsStatic } = require('../controllers/products')

//Routes to handle '/' and '/static' passing controllers
router.route('/').get(getAllProducts)
router.route('/static').get(getAllProductsStatic);

module.exports = router;