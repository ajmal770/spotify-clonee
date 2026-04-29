document.getElementById("signupForm").addEventListener("submit", function (e) {
      e.preventDefault();

      let valid = true;

      // Name
      const name = document.getElementById("name");
      const nameError = document.getElementById("nameError");
      if (name.value.trim().length < 3) {
        nameError.textContent = "Name must be at least 3 characters.";
        valid = false;
      } else {
        nameError.textContent = "";
      }

      // DOB
      const year = document.getElementById("year").value;
      const month = document.getElementById("month").value;
      const day = document.getElementById("day").value;
      const dobError = document.getElementById("dobError");

      if (!/^\d{4}$/.test(year) || day < 1 || day > 31 || month === "") {
        dobError.textContent = "Enter a valid date of birth.";
        valid = false;
      } else {
        dobError.textContent = "";
      }

      // Gender
      const gender = document.querySelector('input[name="gender"]:checked');
      const genderError = document.getElementById("genderError");
      if (!gender) {
        genderError.textContent = "Please select your gender.";
        valid = false;
      } else {
        genderError.textContent = "";
      }

      if (valid) {
        alert("Step 2 completed successfully ✅");
        // submit or redirect here
      }
    });