const express = require('express');
const router = express.Router();
const auth= require('../middleware/auth');
const Recipe = require('../models/Recipe');
const multer = require('multer');
const path= require('path');
const fs= require('fs');
const upload = require("../middleware/upload");




// CREATE recipe
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { title, ingredients, instructions, category } = req.body;

  
    const updateData = {creator : req.user.id};

    // Add non-image data to updateData if present
    
    if (title) updateData.title = title;
    if (ingredients) updateData.ingredients = ingredients; // Assuming ingredients are passed as a comma-separated string
    if (instructions) updateData.instructions = instructions;
    if (category) updateData.category = category;

    // If an image was uploaded, update imageUrl with the new image path
    if (req.file) {
      updateData.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }
    
    try {
      const newRecipe = new Recipe(updateData);
      await newRecipe.save();
      console.log('Uploaded file:', req.file);
      res.status(201).json(newRecipe);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed to add recipe' });
    }
  });




// POST: Create new recipe
// router.post('/add', auth, async (req, res) => {
//     const { title, ingredients, instructions } = req.body;
  
//     const newRecipe = new Recipe({
//       title,
//       ingredients,
//       instructions,
//       creator: req.user.id, // 🧠 from JWT
//     });
  
//     await newRecipe.save();
//     res.status(201).json(newRecipe);
//   });
  // router.post('/', auth, async (req, res) => {
  //   const { title, ingredients, instructions, category } = req.body;
  //   try {
  //     const newRecipe = new Recipe({
  //       title,
  //       ingredients,
  //       instructions,
  //       category,
  //       creator: req.user.id,
  //     });
  //     await newRecipe.save();
  //     res.status(201).json(newRecipe);
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // });
  
  //search
  // GET /api/recipes/search?title=paneer
  // router.get('/search', async (req, res) => {
  //   try {
  //     const { title } = req.query;
  
  //     if (!title || title.trim() === '') {
  //       return res.status(400).json({ error: 'Please provide a title to search' });
  //     }
  
  //     const regex = new RegExp(title, 'i'); // 'i' for case-insensitive
  
  //     const recipes = await Recipe.find({ title: regex });
  
  //     if (recipes.length === 0) {
  //       return res.status(404).json({ message: 'No recipes found' });
  //     }
  
  //     res.json({ results: recipes });
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // });
  // SEARCH API — search by title
router.get('/search', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ error: 'Provide a title to search' });

    const regex = new RegExp(title, 'i');
    const recipes = await Recipe.find({ title: regex });
    if (recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found' });
    }
    res.json({ results: recipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get all recipes
// router.get('/', async (req, res) => {
//   try {
//     const recipes = await Recipe.find().sort({ createdAt: -1 });
//     res.json(recipes);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
router.get('/', async (req, res) => {
  try{
  const recipes = await Recipe.find().select('title category').sort({ createdAt: -1 });
  res.json(recipes);
  }catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//recipe preview
router.get('/preview/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).select('title category ingredients');
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get recipe BY CATEGORY
router.get('/category/:categoryName', async (req, res) => {
  const { categoryName } = req.params;
  try {
    const recipes = await Recipe.find({ category: categoryName });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.get('/:id', async (req, res) => {
//     try {
//       const recipe = await Recipe.findById(req.params.id);
//       if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
//       res.json(recipe);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
//get full recipe by id
router.get('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// //update
//   router.put('/:id', auth, async (req, res) => {
//     try {
//         const recipe = await Recipe.findById(req.params.id);
//         if (!recipe) {
//           return res.status(404).json({ error: 'Recipe not found' });
//         }
    
//         if (recipe.creator?.toString() !== req.user.id) {
//           return res.status(403).json({ message: 'Access denied. You can only update your own recipes.' });
//         }
    
//         const { title, ingredients, instructions } = req.body;
//         recipe.title = title || recipe.title;
//         recipe.ingredients = ingredients || recipe.ingredients;
//         recipe.instructions = instructions || recipe.instructions;
    
//         const updatedRecipe = await recipe.save();
//         res.json({ message: 'Recipe updated successfully', updatedRecipe });
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//   });


// Route to update recipe details (with or without image)
router.patch("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, description, category } = req.body;

  try {
    const updateData = {};

    // Add non-image data to updateData if present
    if (title) updateData.title = title;
    if (ingredients) updateData.ingredients = ingredients.split(","); // Assuming ingredients are passed as a comma-separated string
    if (description) updateData.description = description;
    if (category) updateData.category = category;

    // If an image was uploaded, update imageUrl with the new image path
    if (req.file) {
      updateData.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    // Update the recipe in the database
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ message: "Recipe updated successfully", recipe: updatedRecipe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



  
  router.delete('/:id', auth, async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
      if (recipe.creator.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      await recipe.deleteOne();
      res.json({ message: 'Recipe deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  module.exports = router;
