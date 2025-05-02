// const API_BASE = "http://localhost:5000";
const logoutBtn = document.getElementById("logout-button");
const loginBtn = document.getElementById("login-button");
const loginModal = document.getElementById("login-modal");
const closeLogin = document.getElementById("close-login");
const loginForm = document.getElementById("login-form");
const addRecipeBtn = document.getElementById("add-recipe-btn");
const closeAddRecipe = document.getElementById("close-add-recipe");
const registerBtn= document.getElementById("register-link");
const API_BASE= "https://recipe-app-guir.onrender.com";

// In login.js
function updateUIAfterLogin() {
  const loginBtn = document.getElementById('login-button');
  const registerBtn = document.getElementById('register-link');
  const logoutBtn = document.getElementById('logout-button');
  const profileDropdown = document.getElementById('profile-avatar');

  loginBtn?.classList.add('hidden');
  registerBtn?.classList.add('hidden');
  logoutBtn?.classList.remove('hidden');
  profileDropdown?.classList.remove('hidden');

  toggleAddRecipeButton(true);

  // Log to confirm UI updates
  console.log('UI updated after login');

  // Also attach the dropdown functionality here
  attachProfileAvatarListener();
  window.location.reload();
}


// Show login modal
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginModal.style.display = "block";
});
// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  alert("Logged out successfully!");
  window.location.href = "index.html";
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
    const res = await fetch(`${API_BASE}/api/users/login`, {
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
      registerBtn.style.display="none"
      
      const userDisplay = document.getElementById("user-name-display");
      if (userDisplay) userDisplay.textContent = `👋 Hello, ${data.user.name}`;
      const addRecipeBtn = document.getElementById("add-recipe-btn");
      if (addRecipeBtn) addRecipeBtn.style.display = "inline-block";
      updateUIAfterLogin()
     

    }
    else {
      alert(data.error || "Login failed. Please try again.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong with login!");
  }
});

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


