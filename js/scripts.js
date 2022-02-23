// chargement du DOM
document.addEventListener("DOMContentLoaded", ready);
function ready() {
    'use strict';
    const game = document.getElementById('game');
    const displayChrono = document.getElementById("chrono");
    const tableResultScores = document.getElementById('scores');
    let clickNumber = 0;

    ////////////////////
    // variables du jeu
    ////////////////////
    // Nombre de cartes
    // mode debug : on va pas faire tout le jeu à chaque fois pour debugger!
    //const cartNumber = 3;
    // mode prod
    const cartNumber = 14;

    const squareNumber = cartNumber * 2;
    ////////////////////////////
    // durée pendant lesquelles les 2 cartes restent retournées si elles sont differentes (en ms)
    const timeDisplayLooseCards = 700;
    // Duree du jeu en secondes
    const playMaxTime = 120;
    // nombre de resultats affiché dans les scores
    const scoresNumber = 15;
    // mise en session: sera utilisé lors de l'envoi ajax des données au fichier dataTransfer.php
    sessionStorage.setItem('scoresNumber', scoresNumber);
    // affichage dans le DOM
    tableResultScores.querySelector('caption span').innerHTML = scoresNumber;



    // reload de la page
    //sessionStorage.clear();


    ///////////////////////////////////////////////////////
    // Entrée et mise en session du pseudo s'il n'existe pas
    ///////////////////////////////////////////////////////
    // la session du joueur n'existe pas
    // si 1er jeu
    // ou le joueur refait une partie
    // ou  le joueur a rejoué la meme partie
    function createPseudo() {
        const pseudoSession = sessionStorage.getItem('pseudo');
        if(pseudoSession == null) {
            let pseudo = prompt("Entrer votre pseudo");
            if (pseudo == null || pseudo == "") {
                alert("Vous jouez avec le pseudo: anonyme");
                sessionStorage.setItem('pseudo', "anonyme");
            } else {
                sessionStorage.setItem('pseudo', pseudo);
            }
        }
    }
    ////////////////////
    createPseudo()
    ///////////////////




    ///////////////////////////////////
    // creation de la grille de carte
    // ou réutilisation du précédent jeu pour replay
    ///////////////////////////////////
     createSquare(squareNumber);
    ///////////////////////////////////
    function createSquare(squareNumber) {
        // tableau qui va contenir les numeros de cartes
        const arraySquareNumber = [];
        for(let i=0; i<2; i++) {
            for(let i=1;i<=cartNumber; i++) {
                arraySquareNumber.push(i);
            }
        }
        // jeu aléatoire
       // si la partie est rejouée on garde la meme disposition
        //console.log(sessionStorage.getItem('arrayGame'))
       if(sessionStorage.getItem('arrayGame') != null) {
           // ici var arraySquareShuffle est utilisée (à defaut de const) pour hisser la déclaration de la variable au debut du bloc function
           // sinon nous ne pourrions pas l'utiliser en dehors du bloc if
           // const serait accessible que dans son bloc: ici if
           var arraySquareShuffle = JSON.parse(sessionStorage.getItem('arrayGame'));
       // sinon nouvelle partie
       } else {
           var arraySquareShuffle = arraySquareNumber.sort(() => Math.random() - 0.5);
       }

       //mise en session du jeu pour replay
       sessionStorage.setItem('arrayGame', JSON.stringify(arraySquareShuffle));
        // creation des div
       for(let element of arraySquareShuffle) {
           // on insere les numeros de cartes dans l'attribut data-cardnum
            game.insertAdjacentHTML('beforeEnd', '<div data-cardnum="' + element + '"></div>' );
        }

    }



    ////////////////////////////////////////////////////////////////////////
    // Ajout des evenements click sur les cartes
    // Sauf si elles sont gagnantes
    ////////////////////////////////////////////////////////////////////////
    const squares = game.querySelectorAll('#game div[data-cardnum]');
    //console.log(squares)
    ///////////////////
    addSquareEvent();
    ///////////////////
    function addSquareEvent () {
        for(let square of squares) {
                    // On recupere la valeur de l'attribut data-cardnum qd on clique sur une carte
                    //let getCartNumber = squares[square].dataset.cardnum;
                    let getCartNumber = square.dataset.cardnum;
                    //console.log(getCartNumber)
                    // Pas de click  sur les cartes retournées identiques
                    let obj = sessionStorage;
                        for (let key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                var validCardNumber = obj[key];
                            }
                            if (getCartNumber == validCardNumber) {
                                var dejaValid = true;
                                 break;
                            }
                        }
                        if (dejaValid) {
                            //console.log('carte validé:' + validCardNumber);
                            square.removeAttribute("style");
                            dejaValid = false;
                        } else {
                            //console.log('carte non validé:' + square);
                            square.addEventListener('click', displayCart);
                            square.style.cursor = 'pointer';
                        }
        }
    }


    ////////////////////////////////////////////////////
    // supprime tous les evenements click sur les cartes (plus de clics possibles)
    // et les styles cursor
    ///////////////////////////////////////////////////
    function removeSquareEvent() {
        for(let square of squares) {
            square.removeEventListener('click', displayCart);
            square.removeAttribute("style");
        }
    }


    ////////////////////////////////////
    // Apparition des cartes au clic
    ////////////////////////////////////
    function displayCart(e) {
        //console.log(e)
        // empeche un 2e clic sur la meme carte
        this.removeEventListener('click', displayCart);
        this.removeAttribute("style");
        let getCartNumber = this.getAttribute('data-cardnum');
        this.insertAdjacentHTML('beforeEnd', '<img src="img/cartes/' + getCartNumber + '.jpg">');
        // controle des cartes
        gameControl(getCartNumber);
    }
    //////////////////////////////////////////////////////////////////////////


    /////////////////////////////
    // controle du jeu
    /////////////////////////////
    // nombre de clics
    // comparaison des 2 cartes cliqués
    const arrayCartCompare = [];
    function gameControl(getCartNumber) {
        //console.log(arrayCartCompare)
        //console.log(getCartNumber)
        clickNumber++;
        //console.log('clicknumbre' + clickNumber )
        arrayCartCompare.push(getCartNumber);

        // Début du chrono/jeu
        if(clickNumber == 1) {
            beginStopPlay()
        }

        // controle des clics/ 2 max
        if(arrayCartCompare.length == 2) {
                // suppression des evenements sur les square: plus de clic pdt la comparaison
                removeSquareEvent();

                // Comparaison des 2 cartes
                // si identiques
                if (arrayCartCompare[0] == arrayCartCompare[1]) {
                    //console.log("Gagné");
                    win(arrayCartCompare, clickNumber);

                } else {
                    //console.log("perdu");
                    // Fonction appelé au bout de 1000ms pour permettre de voir la 2e carte retournée avant qu'elles disparaissent
                    setTimeout(loose, timeDisplayLooseCards, arrayCartCompare )
                }
        }
    }


    /////////////////////////////////////////////
    // Réinitialise le tableau qui contient les num des 2 cartes cliquées
    // Reset des évenements clic sur les cartes non retournées
    function reset(arrayCartCompare) {
        arrayCartCompare.length = 0;
        // reset des clic sur les carrés
        addSquareEvent ();
    }
    ////////////////////////////////////////////


    ///////////////////////////////////////////////////////
    // fonction "perdu" lorsque 2 cartes sont differentes
    ///////////////////////////////////////////////////////
    // Les cartes sont retournées: en fait on supprime les 2 images
    function loose(arrayCartCompare) {
        for(let cardNumber of arrayCartCompare) {
            const cardDiv = game.querySelector('[data-cardnum="' + cardNumber + '"] img');
            cardDiv.remove();
        }
        reset(arrayCartCompare);
    }
    //////////////////////////////////////////////////////

    /////////////////////////////////////////////////
    // fonction gagne: lorsque 2 cartes sont identiques
    ////////////////////////////////////////////////////
    // Mise en session des numeros de carte gagnante
    // variable qui permet de différencier les variables de session
    let numberOfWin = 0;
    function win(arrayCartCompare, clickNumber) {
        numberOfWin++;
        // mise en session des cartes validées
        // utiliser dans la fonction addSquareEvent pour ne plus attacher un event sur les cartes gagnantes (plus de clic)
        const cardNumberWin = arrayCartCompare[0];
        sessionStorage.setItem(numberOfWin, cardNumberWin);
        reset(arrayCartCompare);
        ///////////////////////////////////
        // Si tout est gagné : fin du jeu
        ///////////////////////////////////
        //arret du chrono
        if(numberOfWin == cartNumber) {
            // recup du nombre de clics
            console.log(clickNumber);
            sessionStorage.setItem('clickNumber', clickNumber);
            // Permet d'arreter le chrono dans la fonction compteur
            sessionStorage.setItem('endWin', 'bravo');
            // insertion dans la base de donnée
        }
    }
    //////////////////////////////////////////////


    ////////////////////////
    // Chrono
    ///////////////////////
    // declenche le chrono
    // Arrete le jeu si le temps est dépassé
    // Arrete le jeu quand le joueur a gagné
    displayChrono.innerHTML = "<p>MEMORY GAME<br>But du jeu: vous devez trouver 2 cartes identiques<br>Dès que vous cliquerez sur une carte, vous aurez " + playMaxTime + "s pour finir ce jeu</p>";
    let seconde = 0;
    function beginStopPlay(stopWinPlay) {
        // lancement du chrono en seconde (1000ms) 1 seule fois
        if(sessionStorage.getItem('chrono') == null) {
            console.log('begin chrono')
            var chrono = setInterval(compteur, 1000);
            sessionStorage.setItem('chrono', true)
        }

        function compteur() {
            seconde++;
            // Affichage du temps
            displayChrono.innerHTML = '<p>Time: ' +  seconde + 's';
            // Affichage de la bar time
            barTimeProgress(seconde);

            // fin du jeu: perdu
            if(seconde >= playMaxTime) {
                // on arrete le chrono
                clearInterval(chrono);
                // Affichage fin de jeu
                displayChrono.innerHTML = 'C\'est fini! Vous avez perdu ;(';
                displayChrono.innerHTML += ' <a href="#" id="replay">Rejouer la partie</a> <a href="#" id="newgame">Nouvelle partie</a>';
                const btReplay = document.getElementById('replay');
                btReplay.addEventListener('click', rePlay);
                const btNewGame = document.getElementById('newgame');
                btNewGame.addEventListener('click', newGame);

                // Empeche de continuer de cliquer quand le jeu est terminé
                removeSquareEvent();
            }
            // fin du jeu réussi: on arrete le compteur
            // mise en session du temps mis pour gagner
            if(sessionStorage.getItem('endWin') == 'bravo') {
                // on arrete le chrono
                clearInterval(chrono);
                // on recupere le nombre de clics effectués pour gagner
                const getClickNumber = sessionStorage.getItem('clickNumber');
                // Affichage fin de jeu
                displayChrono.innerHTML = '<p>Bravooooo! vous avez gagné en ' + seconde + 's et ' + getClickNumber + ' clics </p>';
                displayChrono.innerHTML += ' <a href="#" id="replay">Rejouer la partie</a> <a href="#" id="newgame">Nouvelle partie</a>';
                const btReplay = document.getElementById('replay');
                btReplay.addEventListener('click', rePlay);
                const btNewGame = document.getElementById('newgame');
                btNewGame.addEventListener('click', newGame);

                // Mise en session du temps de jeu
                sessionStorage.setItem('winTime', seconde);
                // Envoi des variable en Ajax pour insertion ds la BDD
                dataTranfer();
            }
        }
    }

    ////////////////
    // Progress bar
    ////////////////
    const widthGame = game.offsetWidth;
    game.insertAdjacentHTML('afterEnd' , '<progress id="progressBar" value=0" max="100"> </progress>' );
    const progressBar = document.getElementById("progressBar");
    progressBar.style.width = widthGame + 'px';
    let unity = 100 / playMaxTime;
    function barTimeProgress(seconde) {
        let progress = seconde * unity;
        progressBar.setAttribute('value', progress)
    }


    ///////////////////////////
    //Replay
    //////////////////////////
    // fonction qui permet de rejouer avec le meme pseudo
    // et avec la meme disposition des cartes
    function rePlay(e) {
    // clic désactivé
        e.preventDefault();
        // on supprime toute les session sauf le pseudo et la session du jeu
        let objSessionStorage = sessionStorage;
        for(let key in objSessionStorage) {
            if(objSessionStorage.hasOwnProperty(key)) {
                if(key != 'pseudo' && key!= 'arrayGame') {
                    sessionStorage.removeItem(key, objSessionStorage[key] );
                }
            }
        }
        // on retourne le jeu
        resetGame();
    }

    ///////////////////////////
    //New game
    //////////////////////////
    function newGame(e) {
        // clic désactivé
        e.preventDefault();
        // on supprime toutes les sessions et on reload la page
        sessionStorage.clear();
        // on retourne le jeu
        resetGame();
    }


    //////////////////////////
    // reset du jeu
    //////////////////////////
    // A faire sans reload...
    function resetGame() {
        window.location.href = 'index.html';
    }





    //////////
    // Ajax
    //////////
    // envoi des données au fichier PHP pour insert ds db
    // et affichage des scores
    dataTranfer();
    function dataTranfer() {
        //console.log('pret pour insertion BDD')
        //console.log(sessionStorage)
        const jsonValues = JSON.stringify(sessionStorage);
        //console.log(jsonValues);
        // fetch API: voir promesses
        fetch("dataTransfer.php", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "same-origin", // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",  // sent request
                "Accept":       "application/json"   // expected data sent back
            },
            body: JSON.stringify(sessionStorage)
        })
            // retour des données reçues du fichier dataTransfer.php au format json
            .then(response => response.json())
           // recup des données
            .then(response => displayScores(response))
            .catch(error => console.log("Erreur : " + error));
        //////////////////////////////
    }
    ////////////////////////////////////////////





    ///////////////////////////////////////
    // Affichage des scores
    //////////////////////////////////////
    function displayScores(response) {
        console.log(response)
        let ranking = 0;
        // reset de l'affichage des scores precedents
        if(document.querySelector('#scores tbody')) {
            document.querySelector('#scores tbody').remove();
        }
        // affichage des scores
        let displayHtml = '<tbody>';
        for(let key in response) {
            //console.log(response[key])
            ranking++;
            displayHtml += '<tr>';
            displayHtml += '<td>' + ranking + '</td>';
            displayHtml += '<td>' + response[key].pseudo + '</td>';
            displayHtml += '<td>' + response[key].wintime + '</td>';
            displayHtml += '<td>' + response[key].clicknumber + '</td>';
            displayHtml += '<td>' + response[key].date_fr + '</td>';
            displayHtml += '</tr>';
        }
        displayHtml += '</tbody>';
        displayHtml += '</table>';
        tableResultScores.insertAdjacentHTML('afterBegin', displayHtml);
    }



    ////////////////////////////////////////////////////////







} // ready
