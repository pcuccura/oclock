CREATE DATABASE oclock
 DEFAULT CHARACTER SET utf8
 DEFAULT COLLATE utf8_general_ci;



CREATE TABLE `oclock`.`scores` (
    id` INT NOT NULL AUTO_INCREMENT ,
    `pseudo` VARCHAR(100) NOT NULL , `
    wintime` INT NOT NULL , `
    clicknumber` INT NOT NULL , `
    date` DATETIME NOT NULL ,
    PRIMARY KEY (`id`)
    )
    ENGINE = MyISAM