// -------------------------------------------------------//
// Zone de déclaration des valeurs à portée globale
// VARIABLES POUR LA GENERATION DU MEMORY
let divResultat = document.querySelector("#resultat");
let tableauValeur = []; //permet de contenir chaque valeur déja donnée
let objetReponse = {}; //Permet de savoir quel élément correpond à quoi
let nombrePaires = 0; //permet de sauvegarder le nombre de paires disponible

// VARIABLES POUR L'AFFICHAGE DU MEMORY
let nombrePaireRetourne = 0; //Permet de savoir combien de paire ont été retourné
let carteRetourne = ""; //Permet de savoir l'id de l'élément retourner
let donneesTimer = ""; //Permet de récupérer les données du timer si jamais on clique sur uen autre carte avant la fin du timer
// -------------------------------------------------------//

//Peremt de générer des valeurs aléatoires, qui ne sont pas déja utilisé
function generateurPlacement(nombreCase) {
    let valeur = 0;
    do {
        valeur = Math.floor(Math.random() * nombreCase); //Génération de l'id
    } while (tableauValeur.includes(valeur));
    tableauValeur.push(valeur);
    return valeur;
}
//De choisir quelle sont les deux cartes qui vont avoir la meme image
function generateurCarte(nombreCase) {
    for (let i = 0; i < nombreCase / 2; i++) {
        objetReponse[generateurPlacement(nombreCase)] = `images/Photo-${i}.jpg`;
        objetReponse[generateurPlacement(nombreCase)] = `images/Photo-${i}.jpg`;
        nombrePaires++;
    }
    console.log(objetReponse)
}
//Fonction qui gére l'affichage de case cliquer
function affichageCarte(carte) {
    carte.setAttribute("src", objetReponse[carte.id.split("-")[1]]); //Permet d'afficher la carte
    if (carteRetourne != "") {
        //Peremt de récupérer l'image correpondante a chaque élément
        let carteRetourneImage = objetReponse[carteRetourne.split("-")[1]];
        let carteImage = objetReponse[carte.id.split("-")[1]];

        if (carteRetourneImage == carteImage) {
            //Les deux images sont les mêmes
            carteRetourne = "";
            nombrePaireRetourne++;
            if (nombrePaires == nombrePaireRetourne) {
                divResultat.innerHTML = /*html*/ `<a class="btn btn-primary mb-4" id="boutonAccueil">Accueil</a><h1>Bravo la partie est fini !</h1>`;
                document.querySelector("#boutonAccueil").addEventListener("click", () => affichageAccueil()); //Permet de surveiller le clique sur le bouton d'accueil
            }
        } else {
            let carteRetournePause = carteRetourne;
            donneesTimer = `${carteRetourne}_${carte.id}`;
            setTimeout(() => {
                document.querySelector(`#${carteRetournePause}`).setAttribute("src", "images/Photo-x.jpg");
                carte.setAttribute("src", "images/Photo-x.jpg");
                donneesTimer = "";
            }, 1500);
            carteRetourne = "";
        }
    } else if (donneesTimer != "") {
        //Permet de masquer les images si le timer n'est pas encore finis
        document.querySelector(`#${donneesTimer.split("_")[0]}`).setAttribute("src", "images/Photo-x.jpg");
        document.querySelector(`#${donneesTimer.split("_")[1]}`).setAttribute("src", "images/Photo-x.jpg");
        donneesTimer = "";
        carteRetourne = carte.id;
    } else {
        carteRetourne = carte.id;
    }
}
//Fonction qui permet de générer l'html du memory
function generateurMemory(largeur, hauteur) {
    let elementId = 0;
    //Boucle qui peremt de générer les différentes lignes
    let totalLigne = ""; //Permet de sauvegarder le contenu de chaque ligne
    for (let h = 0; h < hauteur; h++) {
        //Hauteur
        ///Boucle qui permet de générer chaque image de la ligne
        let ligne = "";
        for (let l = 0; l < largeur; l++) {
            //Largeur
            ligne += /*html*/ `<img src="images/Photo-x.jpg" alt="Image Memory" class="col carte" id="image-${elementId}" />`;
            elementId++;
        }
        totalLigne += /*html*/ `<div class="container row mb-3 text-center">${ligne}</div>`;
    }
    divResultat.innerHTML = /*html*/ `<a class="btn btn-primary mb-4" id="boutonAccueil">Accueil</a><div class="w-75 m-auto d-flex flex-column align-items-center" id="memory">${totalLigne}</div>`;
    generateurCarte(largeur * hauteur);
    document.querySelector("#boutonAccueil").addEventListener("click", () => affichageAccueil()); //Permet de surveiller le clique sur le bouton d'accueil
    document.querySelectorAll(".carte").forEach((carte) => carte.addEventListener("click", () => affichageCarte(carte)));
}
//Permet de génrer l'affchage de l'accueil
function affichageAccueil() {
    tableauValeur = [];
    objetReponse = {};
    divResultat.innerHTML = /*html*/ `
        <a class="btn btn-primary me-2 btnMode" data-difficulte="facile" onclick="generateurMemory(3, 2)">Niveau 1</a>
        <a class="btn btn-primary me-2 btnMode" data-difficulte="moyen" onclick="generateurMemory(8, 2)">Niveau 2</a>
        <a class="btn btn-primary me-2 btnMode" data-difficulte="difficile" onclick="generateurMemory(7, 4)">Niveau 3</a>
        <a class="btn btn-primary btnMode" data-difficulte="dieu" onclick="generateurMemory(7, 4)">Dieu</a>
    `;
}
affichageAccueil();
