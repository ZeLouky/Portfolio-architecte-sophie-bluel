const apiUrl = "http://localhost:5678/api";
const worksUrl = `${apiUrl}/works`;
const categoriesUrl = `${apiUrl}/categories`;
const galleryContainer = document.querySelector(".gallery.articles");

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