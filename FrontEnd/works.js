////Récupération et affichage des projets

// Récupération de l'élément du DOM qui accueillera les projets

const gallery = document.querySelector(".gallery");

//fonction de récupération des travaux

let reponse;
let works;
async function getWorks() {
    reponse = await fetch('http://localhost:5678/api/works');
    works = await reponse.json();
}

// fonction affichage des photos

function displayWorks(works) {
    for (let i = 0; i < works.length; i++) {
        const element = works[i];
        // Création d’une balise dédiée à un projet
        const figure = document.createElement("figure");
        // Création de la balise image 
        const image = document.createElement("img");
        image.src = element.imageUrl || element.image;
        // Création de la balise titre 
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = element.title;
        // Rattachement des balises
        gallery.appendChild(figure);
        figure.appendChild(image);
        figure.appendChild(titleElement);
    }
}
//// Initialisation

async function init() {
    await getWorks();
    displayWorks(works);
    admin();
    console.log(works);
};

init();

////Filtrage des projets

const buttonFiltersAll = document.querySelector(".all")
const buttonFiltersObjects = document.querySelector(".objects")
const buttonFiltersApartments = document.querySelector(".apartments")
const buttonFiltersHotels = document.querySelector(".hotels")

// Ajout de listeners sur les boutons de filtrages

buttonFiltersAll.addEventListener("click", function (){
    gallery.innerHTML = "";
    displayWorks(works);
})

buttonFiltersObjects.addEventListener("click", function (){
    const worksFiltered = works.filter(work => work.categoryId === 1);
    gallery.innerHTML = "";
    displayWorks(worksFiltered);
})

buttonFiltersApartments.addEventListener("click", function (){
    const worksFiltered = works.filter(work => work.categoryId === 2);
    gallery.innerHTML = "";
    displayWorks(worksFiltered);
})

buttonFiltersHotels.addEventListener("click", function (){
    const worksFiltered = works.filter(work => work.categoryId === 3);
    gallery.innerHTML = "";
    displayWorks(worksFiltered);
})


//// affichage mode administrateur

const token = window.sessionStorage.getItem("token");

// Fonction administrateur connecté

function admin() {
    if (token) {
        const admin = document.getElementsByClassName("admin");
        for(let a of admin){
            a.style.display = "flex" ;
        }
        document.querySelector(".filters").style.display = "none";
        document.querySelector(".logout").style.display = "none";
        document.querySelector("body").style.paddingTop ="0"
    }
}

//Déconnexion

const logout = document.getElementById("logout");
logout.addEventListener("click", function(){
        sessionStorage.clear();
        window.location.reload();
})

//// Page modale

// affichage page modale

const modifyGallery = document.getElementById("modify-gallery");
const modal = document.getElementById("modal");
const modalWrapper = document.querySelector(".modal-wrapper");
const addFotoWrapper = document.querySelector(".add-foto-wrapper");

// Ajout de listeners sur le bouton modifier

modifyGallery.addEventListener("click", function (){
    modal.style.visibility = "visible";
    modalWrapper.style.display = "flex";
    document.body.style.overflow = "hidden";
    generateWorksToModify(works);
})

// fermeture page modale

async function closeModal(){
    modal.style.visibility = "hidden";
    addFotoWrapper.style.display = "none";
    document.body.style.overflow = "";
    gallery.innerHTML = "";
    await getWorks();
    displayWorks(works);
}
function stopPropagation(e){
    e.stopPropagation();
}
const crossClose = document.getElementById("close");
crossClose.addEventListener("click", closeModal);
modal.addEventListener("click", closeModal);
modalWrapper.addEventListener("click", stopPropagation);
addFotoWrapper.addEventListener("click", stopPropagation);

// fonction affichage des photos modifiables

// Récupération de l'élément du DOM qui accueillera les projets
const fotoWrapper = document.querySelector(".foto-wrapper");

function generateWorksToModify(works) {
    fotoWrapper.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        const element = works[i];
        // Création d’une balise dédiée à un projet
        const figure = document.createElement("figure");
        // Création de la balise image 
        const image = document.createElement("img");
        image.src = element.imageUrl || element.image;
        // Création de la balise titre 
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = "éditer";
        // Rattachement des balises
        fotoWrapper.appendChild(figure);
        figure.appendChild(image);
        figure.appendChild(titleElement);
        // ajout des icones sur les photos
        const trashIcon = document.createElement("img");
        trashIcon.classList.add("trash");
        trashIcon.src = "assets/icons/Trash.png";
        const moveIcon = document.createElement("img");
        moveIcon.classList.add("move");
        moveIcon.src = "assets/icons/Move.png";
        figure.appendChild(moveIcon);
        figure.appendChild(trashIcon);
    }
    trash();
}

//// Supprimer projets

// Fonction supprimer un projet

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
    fotoWrapper.innerHTML = "";
    generateWorksToModify(works);
            
        })
    }
    console.log(works);
};

// Fonction supprimer la gallery

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
fotoWrapper.innerHTML = "";
generateWorksToModify(works);
});

//Modale ajouter projet

const addFotoGalery = document.querySelector(".add-foto-galery");
addFotoGalery.addEventListener("click", function() {
    modalWrapper.style.display = "none";
    addFotoWrapper.style.display = "flex";
    document.querySelectorAll(".mask-foto").forEach(element => element.style.display = "inline");
    if (inputFoto.files){
        inputFoto.value = null;
        fotoPreview.style.display = "none";
    }
    title.value ="";
    category.value = "nothing";
    inputAnalyse();
})

//Ajout de listener sur l'icone flèche retour

 const arrowBack = document.getElementById("arrow-back");
 arrowBack.addEventListener("click", async function(){
     modalWrapper.style.display = "flex";
     addFotoWrapper.style.display = "none";
     await getWorks();
     generateWorksToModify(works);
 })

//Ajout de listener sur l'icone croix

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
    inputAnalyseTitle();
    inputAnalyseCategory();
    inputAnalyseFoto();
    if (titleOk && categoryOk && fotoOk) {
        validateButton.classList.add("active");
        validateButton.disabled = false;
    } else {
        validateButton.classList.remove("active");
        validateButton.disabled = true;
    }
}
////Création nouveau projet

//Fonction chargement de photo

const inputFoto = document.getElementById("file");
let file;
const maxFileSize = 4 * 1024 * 1024; // 4Mo en octets

// Créer l'élément img si nécessaire

let fotoPreview = document.querySelector(".add-foto img");
if (!fotoPreview) {
fotoPreview = document.createElement("img");
fotoPreview.style.display = "none";
document.querySelector(".add-foto").appendChild(fotoPreview);
}

// Ajout d'un listener pour gérer le changement de fichier

inputFoto.addEventListener("change",function(e){
    console.log(inputFoto.value);
    if (e.target.files.length > 0){
        const fileSize = e.target.files[0].size;
        if (fileSize > maxFileSize) {
            alert("La taille de la photo ne doit pas dépasser 4Mo.");
            inputFoto.value = null;
            fotoPreview.style.display = "none";
            return;
        }
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
});

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
    fotoPreview.remove();
    inputFoto.value = null;
    addFotoWrapper.style.display = "flex";
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
});

//Publier les changements

const publishButton = document.getElementById("publish-button");
publishButton.addEventListener("click", async function(e){
    e.preventDefault();
    gallery.innerHTML = "";
    displayWorks(works);  
})