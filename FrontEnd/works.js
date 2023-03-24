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
        imageElement.src = element.imageUrl;
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

// fonction icone corbeille
function trash() {
    const trash = document.querySelectorAll(".trash");  
    const trashArray = Array.from(trash);
    for(let t of trashArray){
        t.addEventListener("click", function (){
            console.log(trashArray.indexOf(t));
            works.splice(trashArray.indexOf(t), 1);
            document.querySelector(".foto-wrapper").innerHTML = "";
            generateWorksToModify(works);
        })
    }
}
    // trash.forEach(function (trash){
    //  trash.addEventListener("click", function (){
            //         trash.parentElement.remove();
        //})
    //}) 
    //}

    // for (let i = 0; i < trash.length; i++){
    //     trash[i].addEventListener("click", function (){
    //         works.splice(i, 1);
    //         console.log(works);
    //         //document.querySelector(".foto-wrapper").innerHTML = "";
    //         //generateWorksToModify(works);
             
    //     }
    
// supprimer la gallery
const deleteGallery = document.querySelector(".delete-gallery");
deleteGallery.addEventListener("click", function(){
       works.splice(0, works.length);
       document.querySelector(".foto-wrapper").innerHTML = "";
       generateWorksToModify(works);  
    })

//Modale ajouter projet

const addFotoGalery = document.querySelector(".add-foto-galery");
addFotoGalery.addEventListener("click", function(){
    document.querySelector(".modal-wrapper").style.display = "none";
    document.querySelector(".add-foto-wrapper").style.display = "flex";
    document.querySelectorAll(".mask-foto").forEach(element => element.style.display = "inline");

})
   

    //chargement de photo


const inputFoto = document.getElementById("file");
const fotoPreview = document.createElement("img");
inputFoto.addEventListener("change",function(e){
    if (e.target.files.length > 0){
        const src = URL.createObjectURL(e.target.files[0]);
        fotoPreview.src = src;
        document.querySelector(".add-foto").appendChild(fotoPreview);
        document.querySelectorAll(".mask-foto").forEach(element => element.style.display = "none");
        console.log(inputFoto);
        console.log(inputFoto.value);
    }
})
  
    //icone flèche retour
 const arrowBack = document.getElementById("arrow-back");
 arrowBack.addEventListener("click", function(){
     document.querySelector(".modal-wrapper").style.display = "flex";
     document.querySelector(".add-foto-wrapper").style.display = "none";
 })
    //icone croix 
 const closeAddFoto = document.getElementById("close-add-foto");
 closeAddFoto.addEventListener("click", function(){
    closeModal();
    if (inputFoto.files){
    console.log(inputFoto.files);    
    // const filesArray = [inputFoto.files];
    // filesArray.splice(0,1);
    }
})
 
    //Ajout d'un projet
const title = document.getElementById("title");
const category = document.getElementById("category");
const validateButton = document.getElementById("validate");


validateButton.classList.add("active");

const newProject = {
    "id": works.length,
    "title": title.value,
    "imageUrl": inputFoto.value,
    "categoryId": category.value,
    "userId": 0
  }

//Publier les changements

const publishButton = document.getElementById("publish-button");
publishButton.addEventListener("click", function(e){
e.preventDefault();

})