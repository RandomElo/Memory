// ---------------------------------------
// CREATION DES VARIABLES A PORTEE GLOBALE
let divResultat = document.querySelector("#divResultat");
let tableauMemory = []; //Permet de contenir l'état du Memory
let objetReponse = {}; //Permet de savoir l'équivalence case : image
let nombrePaires = 0; //Permet de savoir il y a combien de faire dans le jeu
let nombrePairesTrouves = 0; //Permet de savoir combien de paire ont été trouver
// ---------------------------------------

//Fonction qui permet de générer alétoriement l'élément
let tableauValeur = []; //Permet de sauvegarder les éléments déja choisit en dehors de la variable
function generateurPlacement(tableauID) {
    let valeur = 0;
    do {
        valeur = tableauID[Math.floor(Math.random() * tableauID.length)];
    } while (tableauValeur.includes(valeur));
    tableauValeur.push(valeur);
    return valeur;
}

//Fonction qui permet de générer de façon aléatoire les couples de cartes
function generateurCarte(nombreCase, tableauID) {
    for (let i = 0; i < nombreCase / 2; i++) {
        objetReponse[generateurPlacement(tableauID)] = `/images/Photo-${i}.jpg`;
        objetReponse[generateurPlacement(tableauID)] = `/images/Photo-${i}.jpg`;
        nombrePaires++;
    }
}

//Fonction qui permet de générer le memory et le tableau qui va avec
function generateurMemory(largeur, hauteur) {
    tableauValeur = []; //Suppression des données qu'il comprend
    let conteneurMemory = ""; //Contient le memory
    let tableauIdCarte = []; //Tableau qui permet d'avoir chaque id des différentes cartes
    for (let h = 0; h < hauteur; h++) {
        let conteneurLigne = "";
        let tableauIntermediaireMemory = [];
        for (let l = 0; l < largeur; l++) {
            conteneurLigne += /*html*/ `<img src="/images/Photo-x.jpg" class="me-3 carte" id="${h}_${l}" />`;
            tableauIdCarte.push(`${h}_${l}`);
            tableauIntermediaireMemory.push(0);
        }
        tableauMemory.push(tableauIntermediaireMemory);
        conteneurMemory += /*html*/ `<div class="d-flex justify-content-center mt-3">${conteneurLigne}</div>`;
    }
    divResultat.innerHTML = /*html*/ `<a class="btn btn-primary" onclick="affichageAccueil()">Accueil</a>` + conteneurMemory;
    generateurCarte(hauteur * largeur, tableauIdCarte);
    gestionCartes();
}

//fonction qui permet de savoir quels sont les élément retourné
function verificationMemory() {
    let indexElement = "";
    for (let i = 0; i < tableauMemory.length; i++) {
        for (let j = 0; j < tableauMemory[i].length; j++) {
            if (tableauMemory[i][j] == 1) {
                indexElement += `${i}_${j}|`;
            }
        }
    }
    if (indexElement.endsWith("|")) {
        //Si jamais l'élément ce fini par "|" alors je supprime le dernier élément
        indexElement = indexElement.slice(0, -1);
    }
    return indexElement;
}

//Fonctuion qui permet de gérer le clique de la carte
function gestionCartes() {
    document.querySelectorAll(".carte").forEach((carte) =>
        carte.addEventListener("click", () => {
            carte.setAttribute("src", `${objetReponse[carte.id]}`); //M%odification de l'image

            let carteRetourne = verificationMemory(); //Permet de savoir si une carte est déja retourné

            let splitCarteRetourne = carteRetourne.split("|"); //Split de la valeur retourner
            if (splitCarteRetourne[0] != "" && splitCarteRetourne.length != 1) {
                //Si jamais deux élément sont déja retourné alors je les cache

                //Modification des images
                document.getElementById(`${splitCarteRetourne[0]}`).setAttribute("src", "/images/Photo-x.jpg");
                document.getElementById(`${splitCarteRetourne[1]}`).setAttribute("src", "/images/Photo-x.jpg");

                //Mondification du tableau Memory
                let splitPremierCarte = splitCarteRetourne[0].split("_");
                let splitSecondeCarte = splitCarteRetourne[1].split("_");
                tableauMemory[splitPremierCarte[0]][splitPremierCarte[1]] = 0;
                tableauMemory[splitSecondeCarte[0]][splitSecondeCarte[1]] = 0;
            }

            if (carteRetourne != "") {
                //Une carte est déja retourné
                if (carte.id != carteRetourne) {
                    //Permet de vérifier que la case cliquer ne soit aps la meme que la précédente
                    if (objetReponse[carte.id] == objetReponse[carteRetourne]) {
                        //Les deux élément ont la même image

                        // Récupération des informations pour modifier le tableau
                        let carteIdSplit = carte.id.split("_");
                        let valeurCarteRetourne = carteRetourne.split("_");
                        tableauMemory[carteIdSplit[0]][carteIdSplit[1]] = 2;
                        tableauMemory[valeurCarteRetourne[0]][valeurCarteRetourne[1]] = 2;

                        nombrePairesTrouves++; //Mise a jour de la variable

                        if (nombrePaires === nombrePairesTrouves) {
                            divResultat.innerHTML = /*html*/ `<a class="btn btn-primary" onclick="affichageAccueil()">Accueil</a><h2>Bravo vous avez fini le memory 👏</h2>`;
                        }
                    } else {
                        // Modification du tableau
                        let carteIdSplit = carte.id.split("_");
                        tableauMemory[carteIdSplit[0]][carteIdSplit[1]] = 1;
                    }
                }
            } else {
                //aucune carte est retourné
                tableauMemory[carte.id.split("_")[0]][carte.id.split("_")[1]] = 1;
            }
        })
    );
}

//Fonction qui permet d'afficher l'accueil
function affichageAccueil() {
    divResultat.innerHTML = /*html*/ `
        <a class="btn btn-primary" onclick="generateurMemory(3,2)">Facile (3 x 2)</a>
        <a class="btn btn-primary" onclick="generateurMemory(4,3)">Moyen (3 x 4)</a>
        <a class="btn btn-primary" onclick="generateurMemory(6,3)">Moyen (3 x 6)</a>
        
        `;
}

affichageAccueil();
