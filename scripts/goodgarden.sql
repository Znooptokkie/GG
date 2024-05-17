DROP DATABASE IF EXISTS goodgarden;
CREATE DATABASE goodgarden;

USE goodgarden;

-- PLANTEN

CREATE TABLE `planten` (
  `planten_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `plant_naam` varchar(50)  NOT NULL,
  `plantensoort` varchar(50) NOT NULL,
  `plant_geteelt` tinyint(1) NOT NULL,
  `kas_locatie` ENUM('LEFT', 'RIGHT') NOT NULL,
  PRIMARY KEY (`planten_id`)
);

INSERT INTO `planten` (`planten_id`, `plant_naam`, `plantensoort`, `plant_geteelt`, `kas_locatie`) VALUES
(1, 'Tomatenplant', 'Groente', 1, "LEFT"),
(2, "Koriander", "Kruiden", 1, "LEFT"),
(3, "Aardbei", "Fruit", 1, "RIGHT");

-- OOGSTEN - PIEDIAGRAM

CREATE TABLE `oogsten`
(
  `oogst_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `plant_id` int(10) UNSIGNED DEFAULT NULL,
  `datum` date,
  `succesvol` boolean DEFAULT true,
  PRIMARY KEY (`oogst_id`),
  FOREIGN KEY (`plant_id`) REFERENCES `planten`(`planten_id`)
);

INSERT INTO `oogsten` (`plant_id`, `datum`, `succesvol`) 
VALUES
  (1, "2023-06-20", true),
  (1, "2023-06-20", true),
  (2, "2023-06-21", false),
  (2, "2023-06-22", true),
  (3, "2023-06-23", true),
  (3, "2023-06-25", true),
  (3, "2023-06-27", false),
  (3, "2023-06-29", true);
