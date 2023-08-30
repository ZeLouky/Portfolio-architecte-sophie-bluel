const apiUrl = "http://localhost:5678/api";
const worksUrl = `${apiUrl}/works`;
const categoriesUrl = `${apiUrl}/categories`;
const galleryContainer = document.querySelector(".gallery.articles");

let works; // Variable pour stocker les travaux

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

function displayWorks(works) {
  galleryContainer.innerHTML = "";

  works.forEach((work) => {
    const workElement = createWorkElement(work);
    galleryContainer.appendChild(workElement);
  });
}

function fetchworks(url) {
  fetch(url) 
    .then((response)=>response.json)
    .then((worksData) => {
      works = worksData;
      displayWorks(works);
    })
    .catch((error) => {
      console.error("Une erreur s'est produite lors de la récupération des travaux:", error);
    });
  }

function fetchAllWorks() {
  fetch(worksUrl)
    .then((response) => response.json())
    .then((worksData) => {
      works = worksData;
      displayWorks(works);
    })
    .catch((error) => {
      console.error("Une erreur s'est produite lors de la récupération des travaux:", error);
    });
}

function fetchCategories(url) {
  fetch(url)
  .then((response)=>response.json())
  .then((categories) =>{
    const filtersContainer = document.querySelector (".filtres");
    filtersContainer.innerHTML =".";

    categories.forEach ((category) =>{
      const filterButton = document.createElement("button");
      filterButton.classList.add("Filtre");
      filterButton.setAttribute("data-category-id-name", category.id);
      filterButton.innerHTML = `<p>${category.name}</p>`;
      filtersContainer.appendChild(filterButton);

      filterButton.addEventListener("click", () => {
        const categoryId =category.id;
        const filteredWorks = works.filter ((work) => work.category.id === categoryId)
        displayWorks(filteredWorks);
      })
    })
    
    fetchAllWorks();
  })
  .catch((error) => {
    console.error("Une erreur s'est produite lors de la récupération des catégories:", error);
});
}

fetchCategories(categoriesUrl);