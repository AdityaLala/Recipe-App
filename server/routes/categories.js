const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(['Veg', 'Non-Veg', 'Dessert']);
});

module.exports = router;
