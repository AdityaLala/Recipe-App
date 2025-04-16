const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path= require('path');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();
const fs = require("fs");
const multer = require("multer");
// Serve static files from the root directory
app.use(express.static(path.join(__dirname, 'public')));

// If index.html is in the root directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Static directory for uploaded images
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));





app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => res.send('API is running...'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const recipeRoutes = require('./routes/recipes');
app.use('/api/recipes', recipeRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const categoryRoutes = require('./routes/categories');
app.use('/api/categories', categoryRoutes);