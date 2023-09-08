const apiUrl = "http://localhost:5678/api";
const worksUrl = `${apiUrl}/works`;
const categoriesUrl = `${apiUrl}/categories`;
const galleryContainer = document.querySelector(".gallery.articles");
const imgPostFlex = document.querySelector(".img-post-flex");
const previewImage = document.getElementById("previewImage");

let works; // Variable pour stocker les travaux

// Fonction pour créer un élément de travail dans la galerie
function createWorkElement(work) {
  const workElement = document.createElement("div");
  workElement.classList.add("work");

  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;
  workElement.appendChild(imageElement);

  const titleElement = document.createElement("h2");
  titleElement.innerText = work.title;
  workElement.appendChild(titleElement);


  return workElement;
}

// Fonction pour afficher les travaux dans la galerie
function displayWorks(works) {
  galleryContainer.innerHTML = "";

  works.forEach((work) => {
    const workElement = createWorkElement(work);
    galleryContainer.appendChild(workElement);
  });
}

// Fonction pour récupérer les travaux filtrés à partir de l'API
function fetchWorks(url) {
  fetch(url)
    .then((response) => response.json())
    .then((worksData) => {
      works = worksData; // Stock les travaux dans la variable globale
      displayWorks(works);
    })
    .catch((error) => {
      console.error("Une erreur s'est produite lors de la récupération des travaux:", error);
    });
}

// Fonction pour récupérer tous les travaux depuis l'API
function fetchAllWorks() {
  fetch(worksUrl)
    .then((response) => response.json())
    .then((worksData) => {
      works = worksData; // Stock les travaux dans la variable globale
      displayWorks(works);
    })
    .catch((error) => {
      console.error("Une erreur s'est produite lors de la récupération des travaux:", error);
    });
}

function fetchCategories(url) {
  fetch(url)
    .then((response) => response.json())
    .then((categories) => {
      const filtersContainer = document.querySelector(".filtres");
      filtersContainer.innerHTML = " "; // Efface les filtres existants

      // Ajoutez le bouton "tous"
      const allWorksButton = document.createElement("button");
      allWorksButton.classList.add("filtre");
      allWorksButton.innerHTML = `Tous`
      allWorksButton.addEventListener("click", () => {
        // Ne supprimez pas les autres boutons
        const filtersContainer = document.querySelector(".filtres");
        const otherButtons = filtersContainer.querySelectorAll(".filtre");
        otherButtons.forEach((button) => {
          button.disabled = false;
        });
      
        // Efface les filtres
        filtersContainer.innerHTML = "";
      
        // Affiche tous les travaux
        fetchAllWorks();
      });
      filtersContainer.appendChild(allWorksButton);

      categories.forEach((category) => {
        const filterButton = document.createElement("button");
        filterButton.classList.add("filtre");
        filterButton.setAttribute("data-category-id", category.id);
        filterButton.innerHTML = `<p>${category.name}</p>`;
        filtersContainer.appendChild(filterButton);

        filterButton.addEventListener("click", () => {
          const categoryId = category.id;
          const filteredWorks = works.filter((work) => work.category.id === categoryId);
          displayWorks(filteredWorks);
        });
      });

      // Appel de la fonction pour récupérer tous les travaux une fois que les catégories sont chargées
      fetchAllWorks();
    })
    .catch((error) => {
      console.error("Une erreur s'est produite lors de la récupération des catégories:", error);
    });
}

// Appel de la fonction pour récupérer les catégories disponibles
fetchCategories(categoriesUrl);

// Fenêtre Login
const loginLink = document.getElementById("login");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".close-btn");

loginLink.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Intégration module Log In
const loginForm = document.querySelector(".login-input");
const errorMessage = document.querySelector(".error-message");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêche la soumission par défaut du formulaire

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const loginData = {
    email: email,
    password: password,
  };

  fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      // Gérer la réponse du serveur après la connexion réussie
      console.log(data);

      // Vérifier si la réponse contient l'identifiant de l'utilisateur et le token
      if (data.userId && data.token) {
        // Stocker les informations de connexion dans le stockage local
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("token", data.token);

        // Rediriger vers la page d'accueil (index.html)
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      // Afficher le carré rouge avec le message d'erreur
      errorMessage.innerHTML = "Erreur de connexion. Veuillez réessayer.";
      errorMessage.classList.add("error");
      console.error("Une erreur s'est produite lors de la connexion:", error);
    });
});

// Vérifier si l'utilisateur est déjà connecté
const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

if (token) {
  // Afficher le lien "Poster"
  const postLink = document.getElementById("post");
  const editMode = document.getElementById("modif-mode");
  postLink.style.display = "block";
  editMode.style.display = "flex";
}

// Modale Post
const openModalBtn = document.getElementById("post");
const modalContainer = document.querySelector(".post-modal");
const closeModalBtn = document.querySelector(".modal-close-btn");

openModalBtn.addEventListener("click", () => {
  modalContainer.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
  modalContainer.style.display = "none";
});


// Fonction pour créer la modale "post" avec les travaux récupérés depuis l'API
function createPostModal(works) {
  imgPostFlex.innerHTML = ""; // Efface les travaux existants

  works.forEach((work) => {
    if (work.imageUrl && work.imageUrl.trim() !== "" && work.imageUrl !== null) {
      const imgPostDetails = document.createElement("div");
      imgPostDetails.classList.add("img-post-details");

      const imageElement = document.createElement("img");
      imageElement.src = work.imageUrl;
      imageElement.classList.add("img-post");
      imgPostDetails.appendChild(imageElement);

      imgPostFlex.appendChild(imgPostDetails);

      const textPostImg = document.createElement("p");
      textPostImg.textContent = "éditer";
      imgPostDetails.appendChild(textPostImg);

      const rectangle = document.createElement("div");
      rectangle.classList.add("rectangle")
      imgPostDetails.appendChild(rectangle);

      rectangle.innerHTML = "<i class=\"fa-solid fa-arrows-up-down-left-right\"></i>";

      const rectangle1 = document.createElement("div");
      rectangle1.classList.add("rectangle1")
      imgPostDetails.appendChild(rectangle1);
      rectangle1.setAttribute("data-id", work.id); // Stocker l'ID du travail dans l'attribut "data-id"
      rectangle1.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i>";

      rectangle1.addEventListener("click", () => {
        const workId = work.id;
        deleteWork(workId); // Appeler la fonction pour supprimer le travail côté serveur

      });
    }
  });

  modalContainer.style.display = "flex"; // Afficher la modale après avoir récupéré les travaux
}

// Fonction pour récupérer les travaux depuis l'API et afficher la modale "post"
function fetchAndDisplayPostModal() {
  fetch(worksUrl)
    .then((response) => response.json())
    .then((worksData) => {
      const imgPostWorks = worksData.filter((work) => work.imageUrl && work.imageUrl.trim() !== "" && work.imageUrl !== null);
      createPostModal(imgPostWorks);
    })
    .catch((error) => {
      console.error("Une erreur s'est produite lors de la récupération des travaux:", error);
    });
}

// Appel de la fonction pour récupérer les travaux et afficher la modale "post"
openModalBtn.addEventListener("click", () => {
  fetchAndDisplayPostModal();
});

closeModalBtn.addEventListener("click", () => {
  const modalContainer = document.querySelector(".post-modal");
  modalContainer.style.display = "none";
});


function deleteWork(workId) {
  fetch(`${worksUrl}/${workId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Suppression du travail échouée.");
      }
    })
    .then(() => {
      // Si la suppression côté serveur réussit, met à jour l'interface utilisateur côté client
      const galleryContainer = document.querySelector(".gallery.articles");
      const workElementToRemove = document.querySelector(`.work[data-id="${workId}"]`);
      if (workElementToRemove) {
        galleryContainer.removeChild(workElementToRemove);
      }

      const workModalElementToRemove = document.querySelector(`.img-post-details[data-id="${workId}"]`);
      if (workModalElementToRemove) {
        imgPostFlex.removeChild(workModalElementToRemove);
      }
      fetchAndDisplayPostModal();
      fetchAllWorks();
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression du travail :", error);
    });
}


const openAddWorkModalBtn = document.querySelector(".add-work");
const addWorkModalContainer = document.querySelector(".add-work-modal");
const closeAddWorkModalBtn = document.querySelector(".modal-close-btn2");
const addWorkForm = document.getElementById("addWorkForm");


openAddWorkModalBtn.addEventListener("click", () => {
  addWorkModalContainer.style.display = "flex";
});

closeAddWorkModalBtn.addEventListener("click", () => {
  addWorkModalContainer.style.display = "none";
});

// Soumettre le formulaire
addWorkForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêche la soumission par défaut du formulaire

  const workTitle = document.getElementById("workTitle").value;
  const workCatId = document.getElementById("workCat").value;
  const workImageInput = document.getElementById("workImageInput");
  const workImageFile = workImageInput.files[0];

  const formData = new FormData();
  formData.append("image", workImageFile);
  formData.append("title", workTitle);
  formData.append("category", workCatId);

  fetch(worksUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ajout d'un nouveau travail échoué.");
      }
      return response.json();
    })
    .then((newWork) => {
      // Si l'ajout côté serveur réussit, mettez à jour l'interface utilisateur côté client
      works.push(newWork);
      displayWorks(works);
      addWorkModalContainer.style.display = "none"; // Fermer la modale après l'ajout
      // Réinitialiser le formulaire après l'ajout
      addWorkForm.reset();
      previewImage.src = "";
      previewImage.style.display = "none";
      imgPostFlex.innerHTML = "";

      fetchAndDisplayPostModal();
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout d'un nouveau travail :", error);
    });
});

function preview(event) {
  const file = event.target.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    previewImage.src = imageUrl;
    previewImage.style.display = "block"; // Afficher l'image de prévisualisation
  } else {
    previewImage.src = "";
    previewImage.style.display = "none"; // Masquer l'image de prévisualisation si aucun fichier n'est sélectionné
  }
}
workImageInput.addEventListener("change", preview);

const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  window.location.href = "index.html";
});