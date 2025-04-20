const API_BASE = "http://localhost:5000";
const recipeBoxes = document.getElementById("recipe-boxes");
const categoryTitle = document.getElementById("category-title");
const userDisplay = document.getElementById("user-name-display");
const logoutBtn = document.getElementById("logout-button");

const updateModal = document.getElementById("update-recipe-modal");
const updateForm = document.getElementById("update-recipe-form");
const closeUpdateModal = document.getElementById("close-update-recipe");



logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    alert("Logged out successfully!");
    window.location.href = "index.html";
  });

// Display logged-in username
const userName = localStorage.getItem("userName");
if (userName && userDisplay) {
  userDisplay.textContent = `👋 Welcome, ${userName}`;
}

// Load user's recipes
async function fetchMyRecipes() {
  try {
    const res = await fetch(`${API_BASE}/api/recipes/my-recipes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const recipes = await res.json();
    renderMyRecipes(recipes);
  } catch (err) {
    console.error("Failed to fetch recipes:", err);
  }
}

// Render recipe cards with update/delete buttons
function renderMyRecipes(recipes) {
  recipeBoxes.innerHTML = "";
  categoryTitle.textContent = "My Recipes";

  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    card.innerHTML = `
      <img src="${recipe.imageUrl}" alt="${recipe.title}" />
      <h3>${recipe.title}</h3>
      <p class="instruction">${recipe.instructions.slice(0, 100)}...</p>
      <div class="card-buttons">
        <button class="update-btn" data-id="${recipe._id}">Update</button>
        <button class="delete-btn" data-id="${recipe._id}">Delete</button>
      </div>
    `;

    recipeBoxes.appendChild(card);
  });
}

// Open update modal and fill data
recipeBoxes.addEventListener("click", (e) => {
  if (e.target.classList.contains("update-btn")) {
    const recipeId = e.target.dataset.id;
    openUpdateModal(recipeId);
  }

  if (e.target.classList.contains("delete-btn")) {
    const recipeId = e.target.dataset.id;
    if (confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipe(recipeId);
    }
  }
});

// Fetch single recipe and prefill update form
async function openUpdateModal(recipeId) {
  try {
    const res = await fetch(`${API_BASE}/api/recipes/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const recipe = await res.json();

    document.getElementById("update-recipe-id").value = recipe._id;
    document.getElementById("update-recipe-title").value = recipe.title;
    document.getElementById("update-recipe-category").value = recipe.category;
    document.getElementById("update-recipe-ingredients").value = recipe.ingredients;
    document.getElementById("update-recipe-instructions").value = recipe.instructions;

    updateModal.style.display = "block";
  } catch (err) {
    console.error("Failed to load recipe for update:", err);
  }
}

// Submit updated recipe
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const recipeId = document.getElementById("update-recipe-id").value;

  const formData = new FormData();
formData.append("title", document.getElementById("update-recipe-title").value);
formData.append("category", document.getElementById("update-recipe-category").value);
formData.append("ingredients", document.getElementById("update-recipe-ingredients").value);
formData.append("description", document.getElementById("update-recipe-instructions").value);

const imageFile = document.getElementById("update-recipe-image-file").files[0];
if (imageFile) {
  formData.append("image", imageFile);
}

const token = localStorage.getItem("token");

fetch(`${API_BASE}/api/recipes/${recipeId}`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Update response:", data);
    alert("Recipe updated successfully!");
    location.reload();
  })
  .catch((err) => {
    console.error("Update error:", err);
    alert("Something went wrong while updating the recipe!");
  });

});

// Delete recipe
async function deleteRecipe(recipeId) {
  try {
    const res = await fetch(`${API_BASE}/api/recipes/${recipeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Delete failed");

    alert("Recipe deleted successfully!");
    fetchMyRecipes();
  } catch (err) {
    console.error("Failed to delete recipe:", err);
    alert("Delete failed.");
  }
}

// Close modal
closeUpdateModal.addEventListener("click", () => {
  updateModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === updateModal) {
    updateModal.style.display = "none";
  }
});

// Load recipes on page load
const backButton = document.getElementById('back-to-home');

backButton.addEventListener('click', () => {
  window.location.href = 'index.html';
});

fetchMyRecipes();
