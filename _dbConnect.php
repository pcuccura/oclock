<?php

    $db = 'oclock';
    $user = 'root';
    $pass = '';
    try {
        $pdo = new PDO('mysql:host=localhost;dbname=' . $db, $user, $pass);
    } catch (PDOException $e) {
        return "Erreur !: " . $e->getMessage() . "<br/>";
        die();
    }


