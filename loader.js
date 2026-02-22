document.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("loaderScreen");

  // Montre le loader immédiatement
  loader.style.opacity = "1";
  loader.style.display = "flex";

  // Force d'afficher le loader pendant 2 secondes
  setTimeout(() => {
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500); // temps de fade-out
  }, 2000); // durée obligatoire d'affichage
});
