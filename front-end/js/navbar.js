document.addEventListener("DOMContentLoaded", () => {
    fetch("/front-end/componentes/navbar.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("navbar-container").innerHTML = html;
        })
        .catch(err => console.error("Error cargando navbar:", err));
});
