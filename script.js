document.getElementById("enrollForm")
.addEventListener("submit", async function(e) {

  e.preventDefault();

  const formData = Object.fromEntries(new FormData(this));

  const response = await fetch("/api/enroll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  const data = await response.json();

  window.location.href = data.paymentUrl;
});
