const categories = document.querySelectorAll(".category-box");
const recipeGrid = document.getElementById("recipe-grid");
const recipeBoxes = document.getElementById("recipe-boxes");
const categoryTitle = document.getElementById("category-title");
const addRecipeForm = document.getElementById('add-recipe-form');
const addRecipeButton = document.getElementById('add-recipe-btn');
const addRecipeModal = document.getElementById('add-recipe-modal');
const closeAddRecipeModal = document.getElementById('close-add-recipe');


// Base API URL
// const API_BASE = "http://localhost:5000";
const API_BASE = "https://recipe-app-guir.onrender.com";


  
// Fetch recipes by category
categories.forEach((box) => {
  box.addEventListener("click", async () => {
    const type = box.dataset.category; // reliable way to get category
    
    categoryTitle.textContent =
      type === "Veg" ? "Veg Recipes" : type === "Non-Veg" ? "Non-Veg Recipes" : "Dessert";
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/recipes/category/${type}`, {
        method: "GET",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "", // Include token if available
        },
      });
      const data = await response.json();

      renderRecipeCards(data);
      recipeGrid.style.display = "block";
      recipeGrid.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  });
});



function renderRecipeCards(data) {
  const recipeBoxes = document.getElementById("recipe-boxes");
  recipeBoxes.innerHTML = '';
  data.forEach((recipe) => {
    const imageUrl = recipe.imageUrl ? `${API_BASE}${recipe.imageUrl}` : 'default-image.jpg';
    const card = document.createElement('div');
    card.classList.add('recipe-card');
    card.innerHTML = `
      <img src="${recipe.imageUrl}" alt="${recipe.title}" />
      <h3>${recipe.title}</h3>
    `;
    card.addEventListener('click', () => {
      window.location.href = `recipe.html?id=${recipe._id}`;
    });
    recipeBoxes.appendChild(card);
  });
}

// Example for search functionality with token validation
const searchButton = document.getElementById("search-button");

if (searchButton) {
  searchButton.addEventListener("click", async () => {
    const query = document.getElementById("search-input").value.trim();
    if (!query) return alert("Enter a recipe name to search!");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/recipes/search?title=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "", // Send token
        },
      });

      const data = await res.json();

      categoryTitle.textContent = `Search Results for "${query}"`;
      renderRecipeCards(data.results);
      recipeGrid.style.display = "block";
      recipeGrid.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Search error:", err);
      alert("Recipe not found!");
    }
  });
}

// Open Add Recipe Modal


if (addRecipeButton) {
  addRecipeButton.addEventListener("click", () => {
    addRecipeModal.style.display = "block";
  });
}

// Close modal
if (closeAddRecipeModal) {
  closeAddRecipeModal.addEventListener("click", () => {
    addRecipeModal.style.display = "none";
  });
}

// Close on outside click
window.addEventListener("click", (e) => {
  if (e.target === addRecipeModal) {
    addRecipeModal.style.display = "none";
  }
});




// Toggle visibility of the Add Recipe button based on login status
function toggleAddRecipeButton(isLoggedIn) {
  if (isLoggedIn) {
    addRecipeButton.style.display = 'inline-block'; // Show button
  } else {
    addRecipeButton.style.display = 'none'; // Hide button
  }
}

addRecipeButton.addEventListener('click', () => {
  addRecipeModal.style.display = 'block';
});

closeAddRecipeModal.addEventListener('click', () => {
  addRecipeModal.style.display = 'none';
});

addRecipeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Submitting recipe...'); // ✅
  
  const fileInput = document.getElementById('recipe-image-file');
  if (!fileInput || !fileInput.files.length) {
    alert("Please upload an image");
    return;
  }
  
  const formData = new FormData();
  formData.append('title', document.getElementById('recipe-title').value);
  formData.append('category', document.getElementById('recipe-category').value);
  formData.append('ingredients', document.getElementById('recipe-ingredients').value);
  formData.append('instructions', document.getElementById('recipe-instructions').value);
  formData.append('image', fileInput.files[0]);
  
  try {
    const response = await fetch(`${API_BASE}/api/recipes`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit recipe');
    }
    
    alert('Recipe added successfully!');
    console.log('Recipe added:', result);
    addRecipeModal.style.display = 'none';
  } catch (error) {
    console.error('Error submitting recipe:', error);
    alert(error.message);
  }
});




function attachProfileAvatarListener() {
  const profileAvatar = document.getElementById('profile-avatar');
  const profileMenu = document.getElementById('profile-menu');

  if (profileAvatar && profileMenu) {
    profileAvatar.addEventListener('click', (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!profileMenu.contains(e.target) && !profileAvatar.contains(e.target)) {
        profileMenu.classList.remove('active');
      }
    });
  }
}



window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  
  const loginBtn = document.getElementById('login-button');
  const registerBtn = document.getElementById('register-link');
  const logoutBtn = document.getElementById('logout-button');
  const profileDropdown = document.getElementById('profile-avatar');
  
  if (token) {
    // User is logged in
    loginBtn?.classList.add('hidden');
    registerBtn?.classList.add('hidden');
    logoutBtn?.classList.remove('hidden');
    profileDropdown?.classList.remove('hidden');
    attachProfileAvatarListener();
    setTimeout(() => {
      attachProfileAvatarListener();
    }, 0);
    toggleAddRecipeButton(true);
  } else {
    // User is logged out
    loginBtn?.classList.remove('hidden');
    registerBtn?.classList.remove('hidden');
    logoutBtn?.classList.add('hidden');
    profileDropdown?.classList.add('hidden');
    toggleAddRecipeButton(false);
  }
});


const profileAvatar = document.getElementById('profile-avatar');
const profileMenu = document.getElementById('profile-menu');

if (profileAvatar && profileMenu) {
  profileAvatar.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents the click from bubbling up to document
    profileMenu.classList.toggle('active'); // Toggle the menu visibility
  });
  
  // Optional: Close the dropdown if user clicks anywhere outside the menu
  document.addEventListener('click', (e) => {
    if (!profileMenu.contains(e.target) && !profileAvatar.contains(e.target)) {
      profileMenu.classList.remove('active'); // Close menu if clicked outside
    }
  });
}

// recipeBoxes.addEventListener("click", (e) => {
//   if (e.target.closest(".recipe-card")) {
//     const card = e.target.closest(".recipe-card");
//     const title = card.querySelector("h3").textContent;

//     fetch(`${API_BASE}/api/recipes/title/${encodeURIComponent(title)}`, {
//       headers: {
//         "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token
//       },
//     })
//       .then((res) => res.json())
//       .then((recipe) => {
//         document.getElementById("recipe-main").innerHTML = `
//           <h2>${recipe.title}</h2>
//           <img src="${recipe.imageUrl}" alt="${recipe.title}" style="max-width:100%;border-radius:10px;" />
//           <p>${recipe.description}</p>
//         `;

//         fetch(`${API_BASE}/api/recipes/category/${recipe.category}`)
//           .then((res) => res.json())
//           .then((allRecipes) => {
//             const recommended = allRecipes
//               .filter((r) => r.title !== recipe.title)
//               .slice(0, 4);

//             const recommendedList = document.getElementById("recommended-list");
//             recommendedList.innerHTML = "";

//             recommended.forEach((r) => {
//               const card = document.createElement("div");
//               card.classList.add("recipe-card");
//               card.innerHTML = `
//                 <img src="${r.imageUrl}" alt="${r.title}" />
//                 <span>${r.title}</span>
//               `;
//               recommendedList.appendChild(card);
//             });

//             document.getElementById("recipe-details").style.display = "block";
//             document.getElementById("recipe-details").scrollIntoView({ behavior: "smooth" });
//           });
//       });
//   }



//   // AUTO SHOW USER IF ALREADY LOGGED IN
//   const userName = localStorage.getItem("userName");
//   if (userName) {
//     const userDisplay = document.getElementById("user-name-display");
//     if (userDisplay) {
//       userDisplay.textContent = `👋 Welcome, ${userName}`;
//     }

//     const loginBtn = document.getElementById("login-button");
//     if (loginBtn) {
//       loginBtn.disabled = true;
//       loginBtn.innerText = "Logged In";
//     }
//   }
// });
