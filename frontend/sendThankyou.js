document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-generate");
  if (!btn) return;

  const card = btn.closest(".card");
  const clientId = card?.dataset?.clientId;

  if (!clientId) {
    alert("Client ID not found");
    return;
  }

  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Sending...";

  try {
    const response = await fetch("http://localhost:8000/api/send-thankyou", {

      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_clients: Number(clientId)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to send email");
    }

    btn.textContent = "Sent ✅";
  } catch (error) {
    console.error(error);
    alert(error.message);
    btn.textContent = originalText;
  } finally {
    btn.disabled = false;
  }
});
