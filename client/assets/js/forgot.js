const API_BASE = "https://ecommerce-depi.runasp.net";

const forgotForm = document.getElementById("forgotForm");
const forgotMessage = document.getElementById("forgotMessage");

forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    forgotMessage.textContent = "";

    const email = document.getElementById("forgotEmail").value.trim();

    try {
        const res = await fetch(`${API_BASE}/forgotPassword`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        if (!res.ok) {
            throw new Error("Email not found");
        }

        forgotMessage.textContent = "Check your email for reset code!";
        forgotMessage.style.color = "green";
        window.location.href = `./reset.html?email=${encodeURIComponent(email)}`;
    } catch {
        forgotMessage.textContent = "Email not found";
        forgotMessage.style.color = "red";
    }
});
