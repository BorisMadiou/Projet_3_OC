const reponse = await fetch('http://localhost:5678/api/works');
const works = await reponse.json();

// fonction affichage des photos
function generateWorks(works) {
    for (let i = 0; i < works.length; i++) {
        const element = works[i];
        // Récupération de l'élément du DOM qui accueillera les projets
        const divWorks = document.querySelector(".gallery");
        // Création d’une balise dédiée à un projet
        const worksElement = document.createElement("figure");
        // Création de la balise image 
        const imageElement = document.createElement("img");
        if (element.imageUrl) {
            imageElement.src = element.imageUrl;
        } else {
        imageElement.src = element.image;
        }
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
console.log(works);
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
        return work.categoryId === 1
    })
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(worksFiltered);
})

buttonFiltersApartments.addEventListener("click", function (){
    const worksFiltered = works.filter(function (work){
        return work.categoryId === 2
    })
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(worksFiltered);
})

buttonFiltersHotels.addEventListener("click", function (){
    const worksFiltered = works.filter(function (work){
        return work.categoryId === 3
    })
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(worksFiltered);
})




// affichage mode administrateur
const token = window.sessionStorage.getItem("token");


if (window.sessionStorage.getItem("token")) {
    const admin = document.getElementsByClassName("admin");
    for(let a of admin){
        a.style.display = "flex" ;
    }
    document.querySelector(".filters").style.display = "none";
    document.querySelector(".logout").style.display = "none";
    document.querySelector("body").style.paddingTop ="0"
}

//Déconnexion
const logout = document.getElementById("logout");
logout.addEventListener("click", function(){
        sessionStorage.clear();
        window.location.reload();
})

//...............MODALES.......................

// affichage page modale
const modifyGallery = document.getElementById("modify-gallery");
const modal = document.getElementById("modal");
const modalWrapper = document.querySelector(".modal-wrapper");
modifyGallery.addEventListener("click", function (){
    modal.style.visibility = "visible";
    modalWrapper.style.display = "flex";
    generateWorksToModify(works);
})

// fermeture page modale
function closeModal(){
    modal.style.visibility = "hidden";
    document.querySelector(".add-foto-wrapper").style.display = "none";
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(works);
}
function stopPropagation(e){
    e.stopPropagation();
}
const crossClose = document.getElementById("close");
crossClose.addEventListener("click", closeModal);
document.getElementById("modal").addEventListener("click", closeModal);
document.querySelector(".modal-wrapper").addEventListener("click", stopPropagation);
document.querySelector(".add-foto-wrapper").addEventListener("click", stopPropagation);

// fonction affichage des photos modifiables
function generateWorksToModify(works) {
    document.querySelector(".foto-wrapper").innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        const element = works[i];
        // Récupération de l'élément du DOM qui accueillera les projets
        const divWorks = document.querySelector(".foto-wrapper");
        // Création d’une balise dédiée à un projet
        const worksElement = document.createElement("figure");
        // Création de la balise image 
        const imageElement = document.createElement("img");
        if (element.imageUrl) {
            imageElement.src = element.imageUrl;
        } else {
        imageElement.src = element.image;
        }
        // Création de la balise titre 
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = "éditer";
        // Rattachement des balises
        divWorks.appendChild(worksElement);
        worksElement.appendChild(imageElement);
        worksElement.appendChild(titleElement);
        // ajout des icones sur les photos
        const trashIcon = document.createElement("img");
        trashIcon.classList.add("trash");
        trashIcon.src = "assets/icons/Trash.png";
        const moveIcon = document.createElement("img");
        moveIcon.classList.add("move");
        moveIcon.src = "assets/icons/Move.png";
        worksElement.appendChild(moveIcon);
        worksElement.appendChild(trashIcon);
    }
    trash();
}

//// fonctions supprimer projets

// Listener supprimer un projet

function trash() {
    const trash = document.querySelectorAll(".trash");  
    const trashArray = Array.from(trash);
    for(let t of trashArray){
    t.addEventListener("click", async function (){
        await fetch(`http://localhost:5678/api/works/${works[trashArray.indexOf(t)].id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la ressource');
        }
        console.log('Ressource supprimée avec succès');
    })
        .catch(error => {
        console.error(error);
    });
    works.splice(trashArray.indexOf(t), 1);
    document.querySelector(".foto-wrapper").innerHTML = "";
    generateWorksToModify(works);
            
        })
    }
    console.log(works);
};

    
// supprimer la gallery
//fonction supprimer la gallery
async function deleteAll(){

    for (let i = 0; i < works.length; i++) {

        await fetch(`http://localhost:5678/api/works/${works[i].id}`, {
         method: 'DELETE',
         headers: {
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json;charset=utf-8'
           }
       })
       .then(response => {
         if (!response.ok) {
           throw new Error('Erreur lors de la suppression de la ressource');
         }
         console.log('Ressource supprimée avec succès');
       })
         .catch(error => {
         console.error(error);
       });
    } 
}
// Listener supprimer tous les projets
const deleteGallery = document.querySelector(".delete-gallery");
deleteGallery.addEventListener("click", function () {
deleteAll();
works.length = 0;
document.querySelector(".foto-wrapper").innerHTML = "";
generateWorksToModify(works);
});
//Modale ajouter projet

const addFotoGalery = document.querySelector(".add-foto-galery");
addFotoGalery.addEventListener("click", function() {
    document.querySelector(".modal-wrapper").style.display = "none";
    document.querySelector(".add-foto-wrapper").style.display = "flex";
    document.querySelectorAll(".mask-foto").forEach(element => element.style.display = "inline");
    if (inputFoto.files){
        fotoPreview.style.display = "none";
    }
    title.value ="";
    category.value = "nothing";
    inputAnalyse();
})
   

    

  
    //icone flèche retour
 const arrowBack = document.getElementById("arrow-back");
 arrowBack.addEventListener("click", function(){
     document.querySelector(".modal-wrapper").style.display = "flex";
     document.querySelector(".add-foto-wrapper").style.display = "none";
     generateWorksToModify(works);
 })
    //icone croix 
 const closeAddFoto = document.getElementById("close-add-foto");
 closeAddFoto.addEventListener("click", function(){
    closeModal();
})
 
    //Ajout d'un projet
const title = document.getElementById("title");
const category = document.getElementById("category");
const validateButton = document.getElementById("validate");
    // fonction analyse des input
let titleOk = false;
let categoryOk = false;
let fotoOk = false;

function inputAnalyseTitle() {
    if (title.value.trim() !== "") {
        titleOk = true ;
    } else {
        titleOk = false ;
    } 
}
title.addEventListener("input", function() {
    inputAnalyseTitle();
    inputAnalyse();
} )

function inputAnalyseCategory() {
    if (category.value === "1" || category.value === "2" || category.value === "3" ) {
        categoryOk = true ;
    } else {
        categoryOk = false ;
    }
}
category.addEventListener("input", function() {
    inputAnalyseCategory();
    inputAnalyse();
} )
function inputAnalyseFoto() {
    if (inputFoto.files.length > 0) {
        fotoOk = true ;
    } else {
        fotoOk = false ;
    }
}
function inputAnalyse() {
    if (titleOk && categoryOk && fotoOk) {
        validateButton.classList.add("active");
        validateButton.disabled = false;
    } else {
        validateButton.classList.remove("active");
        validateButton.disabled = true;
    }
}



console.log("works", works);


////Création nouveau projet

//Fonction chargement de photo

const inputFoto = document.getElementById("file");
let fotoPreview = document.createElement("img");
let file;

inputFoto.addEventListener("change",function(e){
    if (e.target.files.length > 0){
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function() {
            fotoPreview.src = reader.result;
            fotoPreview.style.display = "block";
            document.querySelector(".add-foto").appendChild(fotoPreview);
            document.querySelectorAll(".mask-foto").forEach(element => element.style.display = "none");
            file = e.target.files[0];
            console.log("e.target.files[0]",e.target.files[0]);
        };
    }
    inputAnalyseFoto();
    inputAnalyse();
})
// Fonction d'envoie d'un nouveau projet
async function addNewProject() {
    await fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
        },
    body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la ressource');
      }
      console.log('Ressource créée avec succès');
    })
    .catch(error => {
      console.error(error);
    })
    newWork = {
        title : title.value,
        category : category.value,
        image : fotoPreview.src
    };
    works.push(newWork);
    fotoPreview.remove();
    document.querySelector(".add-foto-wrapper").style.display = "flex";
    document.querySelectorAll(".mask-foto").forEach(element => element.style.display = "inline");
    title.value ="";
    category.value = "nothing";
    validateButton.classList.remove("active");
    validateButton.disabled = true;
    
};

// Fonction de création de formulaire

let form;
let formData;
let newWork;
validateButton.addEventListener("click", function(e) {
    e.preventDefault();
    form = document.getElementById('add-form');
    formData = new FormData(form);
    formData.append("image", file);
    formData.append("title", title.value);
    formData.append("category", category.value);
    for (const [key, value] of formData.entries()) {
        console.log("formData",`${key}: ${value}`);
      };
    addNewProject()
}) 

//Publier les changements

const publishButton = document.getElementById("publish-button");
publishButton.addEventListener("click", async function(e){
    e.preventDefault();
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(works);
    
})


