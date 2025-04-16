const loginBtn = document.getElementById("login-button");
const loginModal = document.getElementById("login-modal");
const closeLogin = document.getElementById("close-login");
const loginForm = document.getElementById("login-form");
const addRecipeBtn = document.getElementById("add-recipe-btn");
const closeAddRecipe = document.getElementById("close-add-recipe");

// Show login modal
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginModal.style.display = "block";
});

// Close login modal
closeLogin.addEventListener("click", () => {
  loginModal.style.display = "none";
});

// Close modal when clicked outside
window.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.style.display = "none";
  }
});

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  try {
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Login response:", data);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      loginModal.style.display = "none";
    
      // loginBtn.disabled = true;
       loginBtn.style.display = "none"
      logoutBtn.style.display = "inline-block"; // 👈 show logout button
    
      const userDisplay = document.getElementById("user-name-display");
      if (userDisplay) userDisplay.textContent = `👋 Hello, ${data.user.name}`;
      const addRecipeBtn = document.getElementById("add-recipe-btn");
      if (addRecipeBtn) addRecipeBtn.style.display = "inline-block";

    }
    else {
      alert(data.error || "Login failed. Please try again.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong with login!");
  }
});

const logoutBtn = document.getElementById("logout-button");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");

    // Update UI
    loginBtn.disabled = false;
    loginBtn.innerText = "Login";
    logoutBtn.style.display = "none";
    const userDisplay = document.getElementById("user-name-display");
    if (userDisplay) userDisplay.textContent = "";

    alert("You have been logged out!");
    const addRecipeBtn = document.getElementById("add-recipe-btn");
    if (addRecipeBtn) addRecipeBtn.style.display = "none";

    window.location.href = "/client/index.html"; // Optional: redirect to homepage
  });
}



