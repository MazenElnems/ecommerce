const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const twoFactorCode = "";
    const twoFactorRecoveryCode = "";

    const bodyData = {
        email:email,
        password:password,
        twoFactorCode:twoFactorCode,
        twoFactorRecoveryCode:twoFactorRecoveryCode
    };

    try {
        const res = await fetch("https://localhost:7200/login?useCookies=false", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData)
        });

        if (!res.ok) throw new Error("Invalid login");

        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        window.location.href = "home.html";
    } catch (err) {
        loginError.textContent = "Invalid email or password";
        loginError.style.color = "red";
        document.getElementById("password").value = "";
    }
});