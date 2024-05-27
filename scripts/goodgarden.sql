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
(1, 'Tomaat', 'Groente', 1, "LEFT"),
(2098, "Koriander", "Kruiden", 1, "LEFT"),
(3, "Aardbei", "Fruit", 1, "RIGHT"),
(4, "Champignon", "Schimmel", 1, "RIGHT"),
(5, "Cactus", "Overig", 1, "LEFT");

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
  (1, "2023-06-20", false),
  (2098, "2023-06-21", false),
  (2098, "2023-06-22", true),
  (2098, "2023-06-23", true),
  (3, "2023-06-25", true),
  (3, "2023-06-27", false),
  (3, "2023-06-29", true);

-- USERS

CREATE TABLE `users`
(
  `user_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(150) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`user_id`)
);

INSERT INTO `users` (`username`, `password`, `role`) VALUES
('admin', 'pbkdf2:sha256:600000$uDdHSyHkdL7ESway$c05ebc91d2b414063a296695647f8490e9fd2a9adf5202fb45c03b3d65d3e7cd', 'admin');

-- GENERIC PLANT DATA

CREATE TABLE `generic-plant-data`
(
  `generic_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `common_name` VARCHAR(255),
  `scientific_name` VARCHAR(255),
  `other_name` VARCHAR(255),
  `cycle` VARCHAR(255),
  `watering` VARCHAR(255),
  `sunlight` JSON,
  PRIMARY KEY (`generic_id`)
);

-- SPECIFIC PLANT DATA

CREATE TABLE `specific-plant-data`
(
  `specific_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `plant_id` int(10) UNSIGNED DEFAULT NULL,
  `family` VARCHAR(255),
  `origin` JSON,
  `type` VARCHAR(255),
  `dimension` VARCHAR(255),
  `dimensions` JSON,
  `cycle` VARCHAR(255),
  `attracts` JSON,
  `propagation` JSON,
  `hardiness` JSON,
  `watering` VARCHAR(255),
  `depth_water_requirement` JSON,
  `volume_water_requirement` JSON,
  `watering_general_benchmark` JSON,
  `plant_anatomy` JSON,
  `sunlight` JSON,
  `pruning_month` JSON,
  `pruning_count` JSON,
  `seeds` int(10),
  `maintenance` VARCHAR(255),
  `care-guides` VARCHAR(255),
  `soil` JSON,
  `growth_rate` VARCHAR(255),
  `drought_tolerant` TINYINT(1),
  `salt_tolerant` TINYINT(1),
  `thorny` TINYINT(1),
  `invasive` TINYINT(1),
  `tropical` TINYINT(1),
  `indoor` TINYINT(1),
  `care_level` VARCHAR(255),
  `pest_susceptibility` JSON,
  `pest_susceptibility_api` VARCHAR(255),
  `flowers` TINYINT(1),
  `flowering_season` VARCHAR(255),
  `flower_color` VARCHAR(255),
  `cones` TINYINT(1),
  `fruits` TINYINT(1),
  `edible_fruit` TINYINT(1),
  `edible_fruit_taste_profile` VARCHAR(255),
  `fruit_nutritional_value` VARCHAR(255),
  `fruit_color` JSON,
  `harvest_season` VARCHAR(255),
  `leaf` TINYINT(1),
  `leaf_color` JSON,
  `edible_leaf` TINYINT(1),
  `cuisine` TINYINT(1),
  `medicinal` TINYINT(1),
  `poisonous_to_humans` TINYINT(1),
  `poisonous_to_pets` TINYINT(1),
  `description` TEXT,
  `default_image` JSON,
  PRIMARY KEY (`specific_id`),
  FOREIGN KEY (`plant_id`) REFERENCES `planten`(`planten_id`)
);
