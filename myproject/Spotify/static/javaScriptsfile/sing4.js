
    document.getElementById("termsForm").addEventListener("submit", function(e) {
      const agreeCheckbox = document.getElementById("agree");
      const errorMsg = document.getElementById("errorMsg");

      if (!agreeCheckbox.checked) {
        e.preventDefault(); // Stop form submission
        errorMsg.style.display = "block";
      } else {
        errorMsg.style.display = "none";
        window.location.href = "next-page.html"; // Redirect on success
      }
    });
