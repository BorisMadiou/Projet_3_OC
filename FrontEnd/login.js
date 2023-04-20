////Fonction connexion

//Récupération du formulaire

const formLogin = document.querySelector(".form-connexion")

//Ajout du listener

formLogin.addEventListener("submit", async function(event) {
    event.preventDefault();
    const login = {
        email : document.querySelector("[name=email]").value,
        password : document.querySelector("[name=password]").value,
    };

    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login)
    });
    const connection = await reponse.json();
    if (reponse.ok) {
        window.sessionStorage.setItem("token", connection.token);
        document.location.href="index.html";
    } else if (reponse.status == "404"){
        document.querySelector(".email-error").innerHTML = "email incorrect";
        document.querySelector(".password-error").innerHTML = "";
        
    } else if (reponse.status == "401"){
        document.querySelector(".password-error").innerHTML = "mot de passe incorrect";
        document.querySelector(".email-error").innerHTML = "";
    }
});