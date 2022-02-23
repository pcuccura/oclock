<?php
class AllScores {
    private $data;
    private $pdo;
    public $scoresNumber;

    public function __construct(array $data, object $pdo)
    {
        $this->data = $data;
        $this->pdo = $pdo;
        $this-> scoresNumber = $this->data['scoresNumber'];
    }

    public function selectData (): void  {

        if ($this->scoresNumber) {
            $sql_displaytScore = "
               SELECT pseudo, wintime, clicknumber, DATE_FORMAT(date, ' %d-%m-%Y %H:%i:%s') AS date_fr
               FROM scores
               ORDER BY wintime, clicknumber
               LIMIT $this->scoresNumber ";
               //var_dump($sql_displaytScore);

           // Execution de la requete
           $sth_displayScore = $this->pdo -> query($sql_displaytScore);
           // tableau des resultats
           $result = $sth_displayScore->fetchAll(PDO::FETCH_ASSOC);
           //Affiche un message et termine le script courant
            exit(json_encode($result));
        }
    }
    /////////////////////////////
}



