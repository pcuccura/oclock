<?php
class insertScore {
    private $data;
    private $pdo;
    private $clickNumber;

    public function __construct(array $data, object $pdo)
    {
        $this->data = $data;
        $this->pdo = $pdo;
        $this->pseudo = $this->data['pseudo'];
        $this->winTime = $this->data['winTime'];
        $this->clickNumber = $this->data['clickNumber'];
    }
    /////////////////////////////
    public function insertData(): void  {
            // requete preparees
            $sql_insertScore = "
            INSERT INTO scores(pseudo, wintime, clicknumber, date)
            VALUES(:pseudo, :wintime, :clicknumber, NOW())";
            $sth_insertScore = $this->pdo->prepare($sql_insertScore);
            $sth_insertScore->bindParam(':pseudo', $this->pseudo, PDO::PARAM_STR);
            $sth_insertScore->bindParam(':wintime',  $this->winTime, PDO::PARAM_INT);
            $sth_insertScore->bindParam(':clicknumber',  $this->clickNumber, PDO::PARAM_INT);
            // execution de la requete
            $done = $sth_insertScore->execute();
            // pour debug reqquete preparee
            //var_dump($sth_insertScore->debugDumpParams());
    }
    /////////////////////////////
}



