const reponse = await fetch('http://localhost:5678/api/works');
const works = await reponse.json();

function generateWorks(works) {
    for (let i = 0; i < works.length; i++) {
        const element = works[i];
        // Récupération de l'élément du DOM qui accueillera les projets
        const divWorks = document.querySelector(".gallery");
        // Création d’une balise dédiée à un projet
        const worksElement = document.createElement("figure");
        // Création de la balise image 
        const imageElement = document.createElement("img");
        imageElement.src = element.imageUrl;
        // Création de la balise titre 
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = element.title;
        // Rattachement des balises
        divWorks.appendChild(worksElement);
        worksElement.appendChild(imageElement);
        worksElement.appendChild(titleElement);
    }
}

generateWorks(works);

// Récupération de l'élément du DOM qui accueillera le bouton tous
const buttonFiltersAll = document.querySelector(".all")
buttonFiltersAll.addEventListener("click", function (){
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(works);
})

const buttonFiltersObjects = document.querySelector(".objects")
buttonFiltersObjects.addEventListener("click", function (){
    const worksFiltered = works.filter(function (work){
        return work.category.name === "Objets"
    })
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(worksFiltered);
})

const buttonFiltersApartments = document.querySelector(".apartments")
buttonFiltersApartments.addEventListener("click", function (){
    const worksFiltered = works.filter(function (work){
        return work.category.name === "Appartements"
    })
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(worksFiltered);
})

const buttonFiltersHotels = document.querySelector(".hotels")
buttonFiltersHotels.addEventListener("click", function (){
    const worksFiltered = works.filter(function (work){
        return work.category.name === "Hotels & restaurants"
    })
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(worksFiltered);
})

