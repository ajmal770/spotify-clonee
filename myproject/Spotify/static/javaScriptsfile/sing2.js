// const password = document.getElementById("password");
//   const eye = document.getElementById("eye");

//   function showPassword() {
//     password.type = "text";
//   }

//   function hidePassword() {
//     password.type = "password";
//   }

  // Desktop
//   eye.addEventListener("mousedown", showPassword);
//   document.addEventListener("mouseup", hidePassword);

  // Mobile
//   eye.addEventListener("touchstart", showPassword);
//   document.addEventListener("touchend", hidePassword);

// the button side validatioon 

document.addEventListener("DOMContentLoaded", function () {
  const password = document.getElementById("password");
  const eye = document.getElementById("eye");
  const btm = document.getElementById("btm");

  const ruleLetter = document.getElementById("rule-letter");
  const ruleNumber = document.getElementById("rule-number");
  const ruleLength = document.getElementById("rule-length");

  password.addEventListener("input", function () {
    const value = password.value;

    // conditions
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumberOrSpecial = /[0-9#?!&]/.test(value);
    const hasLength = value.length >= 10;

    // 1 letter
    ruleLetter.checked = hasLetter;
    ruleLetter.nextElementSibling.style.color =
      hasLetter ? "#1ed760" : "#ffffff";

    // 1 number or special character
    ruleNumber.checked = hasNumberOrSpecial;
    ruleNumber.nextElementSibling.style.color =
      hasNumberOrSpecial ? "#1ed760" : "#ffffff";

    // 10 characters
    ruleLength.checked = hasLength;
    ruleLength.nextElementSibling.style.color =
      hasLength ? "#1ed760" : "#ffffff";

    // Enable / disable Next button
    btm.disabled = !(hasLetter && hasNumberOrSpecial && hasLength);
  });

  // Show / Hide password
  eye.addEventListener("click", function () {
    if (password.type === "password") {
      password.type = "text";
      eye.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      password.type = "password";
      eye.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
});

$(document).ready(function(){
    $("#btm").click(function(){
        $("#line").animate({
            width: "20%"   /* HALF of the line */
        }, 1500);
    });
});