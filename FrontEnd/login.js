    const formLogin = document.querySelector(".form-connexion")

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
        console.log(connection);
        if (reponse.ok) {
            window.sessionStorage.setItem("token", connection.token);
            console.log(window.sessionStorage.getItem("token"));
            document.location.href="index.html";
        } else if (reponse.status == "404"){
            document.querySelector(".email-error").innerHTML = "email incorrect"
            
        } else if (reponse.status == "401"){
            document.querySelector(".password-error").innerHTML = "mot de passe incorrect"
            document.querySelector(".email-error").parentNode.removeChild(document.querySelector(".email-error"));
        }
    });
    




