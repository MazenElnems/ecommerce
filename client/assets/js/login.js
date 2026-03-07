const API_BASE = "https://ecommerce-depi.runasp.net";

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mainNav = document.getElementById("mainNav");

if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener("click", function () {
        mainNav.classList.toggle("show");
    });
}

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const res = await fetch(`${API_BASE}/login?useCookies=false`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                twoFactorCode: "",
                twoFactorRecoveryCode: ""
            })
        });

        if (!res.ok) {
            throw new Error("Invalid login");
        }

        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken || "");
        localStorage.setItem("refreshToken", data.refreshToken || "");
        window.location.href = "./index.html";
    } catch {
        loginError.textContent = "Invalid email or password";
        loginError.style.color = "red";
        document.getElementById("password").value = "";
    }
});
