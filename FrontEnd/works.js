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

// Récupération de l'élément du DOM qui accueillera les boutons
const buttonFiltersAll = document.querySelector(".all")
const buttonFiltersObjects = document.querySelector(".objects")
const buttonFiltersApartments = document.querySelector(".apartments")
const buttonFiltersHotels = document.querySelector(".hotels")

// Ajout listeners sur les boutons
buttonFiltersAll.addEventListener("click", function (){
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(works);
})

buttonFiltersObjects.addEventListener("click", function (){
    const worksFiltered = works.filter(function (work){
        return work.category.name === "Objets"
    })
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(worksFiltered);
})

buttonFiltersApartments.addEventListener("click", function (){
    const worksFiltered = works.filter(function (work){
        return work.category.name === "Appartements"
    })
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(worksFiltered);
})

buttonFiltersHotels.addEventListener("click", function (){
    const worksFiltered = works.filter(function (work){
        return work.category.name === "Hotels & restaurants"
    })
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(worksFiltered);
})

// affichage mode administrateur
const token = window.sessionStorage.getItem("token")
console.log(token);

if (window.sessionStorage.getItem("token")) {
    const admin = document.getElementsByClassName("admin");
    console.log(admin);
    for(let a of admin){
        a.style.display = "flex" ;
    }
    document.querySelector(".filters").style.display = "none";  
}