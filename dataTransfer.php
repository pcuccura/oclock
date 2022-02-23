<?php
require_once('_dbConnect.php');
require_once('class/AllScores.php');
require_once('class/insertScore.php');

$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
if ($contentType === "application/json") {
    //Receive the RAW post data.
    // trim supprime les espaces
    // file_get_contents : lit la chaine de caract�re dans un fichier
    // php:// � Acc�s aux divers flux I/O
    // php://input est un flux en lecture seule qui permet de lire des donn�es brutes depuis le corps de la requ�te.
    // php://input n'est pas disponible avec enctype="multipart/form-data".
    $jsonData = trim(file_get_contents("php://input"));
    // on transforme la chaine de caracteres  json en format array lisible par PHP
    $data = json_decode($jsonData, true);

    // si le joueur a gagn� la cl� winTime existe
    if(array_key_exists('winTime', $data)) {
        // insertion des scores
        $insertScore = new insertScore($data, $pdo);
        $insertScore ->insertData();
    }

    // Affichage des scores au chargement
    // et affichage mise � jour apr�s insertion
    $displayScores = new AllScores($data, $pdo);
    $displayScores ->selectData();
}






