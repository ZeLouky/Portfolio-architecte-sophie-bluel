// Formulaire de connexion

document.querySelector(".form").addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = {
    email: email,
    password: password,
  };

  // Appel à l'api pour uploader données du formulaire

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })

    // Traitement réponse Api et creation et stockage du token dans local storage
    // Ou générations de messages d'erreurs
    .then((data) => {
      const token = data.token;
      const invalidEmailDiv = document.querySelector(".invalidEmail");
      const invalidPasswordDiv = document.querySelector(".invalidPassword");
      const existingEmailErrorMessage =
        invalidEmailDiv.querySelector(".error-message");
      const existingPasswordErrorMessage =
        invalidPasswordDiv.querySelector(".error-message");
      localStorage.setItem("token", token);

      if (data.message) {
        if (existingEmailErrorMessage) {
          existingEmailErrorMessage.innerText = "Email non valide";
        } else {
          const invalidEmail = document.createElement("p");
          invalidEmail.classList.add("error-message");
          invalidEmail.innerText = "Email non valide";
          invalidEmailDiv.appendChild(invalidEmail);
        }
      } else {
        if (existingEmailErrorMessage) {
          existingEmailErrorMessage.innerText = "";
        }

        if (data.error) {
          if (existingPasswordErrorMessage) {
            existingPasswordErrorMessage.innerText = "Mot de passe non valide";
          } else {
            const invalidPassword = document.createElement("p");
            invalidPassword.classList.add("error-message");
            invalidPassword.innerText = "Mot de passe non valide";
            invalidPasswordDiv.appendChild(invalidPassword);
          }
        } else {
          window.location.href = "index.html";
        }
      }
    });
});
