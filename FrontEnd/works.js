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
        return work.category.name === "1"
    })
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(worksFiltered);
})

buttonFiltersApartments.addEventListener("click", function (){
    const worksFiltered = works.filter(function (work){
        return work.category.name === "2"
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
    if (inputFoto.files){
        fotoPreview.style.display = "none";
    }
    title.value ="";
    category.value = "nothing";
    inputAnalyse();
})
   

    //chargement de photo

const inputFoto = document.getElementById("file");
let fotoPreview = document.createElement("img");
let src ;
inputFoto.addEventListener("change",function(e){
    if (e.target.files.length > 0){
        src = URL.createObjectURL(e.target.files[0]);
        fotoPreview.src = src;
        fotoPreview.style.display = "block";
        document.querySelector(".add-foto").appendChild(fotoPreview);
        document.querySelectorAll(".mask-foto").forEach(element => element.style.display = "none");
    }
    inputAnalyseFoto();
    inputAnalyse();
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
        // console.log('fotoPreview',fotoPreview);
        // console.log('fotoPreview.src',fotoPreview.src);
        // console.log('inputFoto', inputFoto);
        // fotoPreview.src = "";
        // src = '';
        // console.log('src', src);       
        // fotoPreview.remove();
        // console.log('inputPhoto', inputFoto.files);   
    // const filesArray = [inputFoto.files];
    // filesArray.splice(0,1);
    }
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
    } else {
        validateButton.classList.remove("active");
    }
}



console.log("work0", works[0]);


//Création nouveau projet



  validateButton.addEventListener("click", function() {
    let newWork = {
        "id": 1,
        "title": title.value,
        "imageUrl": src,
        "categoryId": category.value,
        "userId": 1
      }
    works.push(newWork);
    closeModal();
    console.log(works[9]);
    console.log(title.value);
    console.log(src);
    console.log(category.value);
} ) 

//Publier les changements

const publishButton = document.getElementById("publish-button");
publishButton.addEventListener("click", async function(e){
    e.preventDefault();
    console.log(works[9]);


      await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json;charset=utf-8'
          },
        body: JSON.stringify(works[9])
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la création de la ressource');
          }
          console.log('Ressource créée avec succès');
        })
        .catch(error => {
          console.error(error);
        });
        
})

//fonction supprimer tous les projets
async function deleteAll(){
    const reponse2 = await fetch('http://localhost:5678/api/works');
    const works2 = await reponse2.json();
    for (let i = 1; i <= works2.length; i++) {

    await fetch('http://localhost:5678/api/works/`${i}`', {
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
       console.log("works2", works2);
    }
}
