document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");

  form.addEventListener("submit", function (e) {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      e.preventDefault();
      alert("❌ Please enter an email address");
      emailInput.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      e.preventDefault();
      alert("❌ Please enter a valid email address");
      emailInput.focus();
      return;
    }

    // Email is valid, proceed
    alert("✅ Email validated! Proceeding...");
  });
});
