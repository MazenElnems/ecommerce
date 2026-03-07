const form = document.getElementById("signupForm");
const errorMsg = document.getElementById("signupError");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  errorMsg.textContent = "";

  // Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // Email Validation
  if (!emailRegex.test(email)) {
    errorMsg.textContent = "Please enter a valid email address";
    errorMsg.style.color = "red";
    return;
  }

  // Password Validation
  if (!passwordRegex.test(password)) {
    errorMsg.textContent = "Password must be at least 8 characters and contain letters and numbers";
    errorMsg.style.color = "red";
    return;
  }

  try {
    const res = await fetch("https://localhost:7200/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      alert("Account created successfully");
      window.location.href = "login.html";
      return;
    }

    const data = await res.json();

    if (data.errors) {
      errorMsg.textContent = Object.values(data.errors).flat().join(", ");
    } else {
      errorMsg.textContent = data.title || "Registration failed";
    }

  } catch (error) {
    console.error(error);
    errorMsg.textContent = "Server connection error";
  }
});