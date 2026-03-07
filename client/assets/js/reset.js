const API_BASE = "https://ecommerce-depi.runasp.net";

const resetForm = document.getElementById("resetForm");
const resetMessage = document.getElementById("resetMessage");

resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    resetMessage.textContent = "";

    const email = document.getElementById("resetEmail").value.trim();
    const code = document.getElementById("resetCode").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    try {
        const res = await fetch(`${API_BASE}/resetPassword`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                resetCode: code,
                newPassword
            })
        });

        if (!res.ok) {
            throw new Error("Reset failed");
        }

        resetMessage.textContent = "Password reset successfully!";
        resetMessage.style.color = "green";
        window.location.href = "./login.html";
    } catch {
        resetMessage.textContent = "Failed to reset password";
        resetMessage.style.color = "red";
    }
});
