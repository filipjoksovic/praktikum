CREATE DATABASE  IF NOT EXISTS `avto_delavnica` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `avto_delavnica`;
-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: avto_delavnica
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `street` varchar(50) NOT NULL,
  `street_number` varchar(10) NOT NULL,
  `zipcode` int NOT NULL,
  `city` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'Goriska cesta','20',3320,'Velenje','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(2,'Saleska cesta','15',3320,'Velenje','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(3,'Silihova ulica','3',3310,'Zalec','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(4,'Robova ulica','15',3000,'Celje','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(5,'Grunova ulica','4',3000,'Celje','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(6,'Mariborska cesta','119',3000,'Celje','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(7,'Medvedova ulica','45',2000,'Maribor','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(8,'Ekartova ulica','44',2000,'Maribor','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(9,'Ptujska cesta','132',2000,'Maribor','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(10,'Bravnicarjeva ulica','5',1000,'Ljubljana','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(11,'ulica 15. maja','26',6000,'Koper','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(12,'Rozmanova ulica','17',6000,'Koper','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(13,'Levceva ulica','5',1000,'Ljubljana','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(14,'Vevska cesta','17a',1260,'Ljubljana-polje','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(15,'Novi dom','59',1420,'Trbovlje','Slovenija','2022-06-01 07:08:03','2022-06-01 07:08:03'),(16,'Gosposvetska cesta','89',32210,'Kragujevac','Serbia','2022-06-07 20:55:36','2022-06-07 20:55:36'),(17,'Gosposvetska cesta','92',2000,'Maribor','Slovenija','2022-06-08 19:38:08','2022-06-08 19:38:08'),(18,'Gosposvetska cesta','undefined',2000,'Maribor','Slovenija','2022-06-08 23:43:05','2022-06-08 23:43:05');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_statuses`
--

DROP TABLE IF EXISTS `booking_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_statuses`
--

LOCK TABLES `booking_statuses` WRITE;
/*!40000 ALTER TABLE `booking_statuses` DISABLE KEYS */;
INSERT INTO `booking_statuses` VALUES (1,'Pending','2022-06-08 23:14:22','2022-06-08 23:14:22'),(2,'Accepted','2022-06-08 23:14:22','2022-06-08 23:14:22'),(3,'Cancelled','2022-06-08 23:14:22','2022-06-08 23:14:22'),(4,'Finished','2022-06-08 23:14:22','2022-06-08 23:14:22');
/*!40000 ALTER TABLE `booking_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car_services`
--

DROP TABLE IF EXISTS `car_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `isLicenced` tinyint NOT NULL,
  `maxCapacity` int NOT NULL,
  `isAllowed` tinyint DEFAULT '0',
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `car_services_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_services`
--

LOCK TABLES `car_services` WRITE;
/*!40000 ALTER TABLE `car_services` DISABLE KEYS */;
INSERT INTO `car_services` VALUES (1,'PSC Praprotnik, d.o.o.',1,10,1,'038983220','prodaja@pscpraprotnik.si',2,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(2,'Avtohisa Selmar',1,20,1,'034244000','info@selmar.si',6,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(3,'AVTO TRIGLAV Maribor',1,60,0,'','info@avto-triglav.si',9,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(4,'Mercedes-Benz',1,30,0,'024600123','info@mercedes-benz.si',9,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(5,'Porsche Ljubljana',1,100,0,'015825300','porsche.ljubljana@porsche.si',10,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(6,'Avtoplus d.o.o. Koper-Mercedes',1,20,0,'056137000','info@avtoplus.si',11,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(7,'Test',1,2,1,'0691444112','filipjoksovic1@gmail.com',16,'2022-06-07 20:55:36','2022-06-07 20:55:36');
/*!40000 ALTER TABLE `car_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cars` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model` varchar(100) NOT NULL,
  `manufactured_year` year NOT NULL,
  `manufacturer_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `manufacturer_id` (`manufacturer_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cars`
--

LOCK TABLES `cars` WRITE;
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;
INSERT INTO `cars` VALUES (2,'Tipo',2012,5,9,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(3,'GTV',1999,3,4,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(4,'Punto',2004,5,5,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(5,'M4',2021,6,8,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(6,'Superb',2015,4,6,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(7,'Octavia',2016,4,3,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(9,'A7',2023,1,2,'2022-06-09 02:03:35','2022-06-09 02:03:35');
/*!40000 ALTER TABLE `cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite_dealerships`
--

DROP TABLE IF EXISTS `favorite_dealerships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_dealerships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `car_service_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `car_service_id` (`car_service_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `favorite_dealerships_ibfk_1` FOREIGN KEY (`car_service_id`) REFERENCES `car_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `favorite_dealerships_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite_dealerships`
--

LOCK TABLES `favorite_dealerships` WRITE;
/*!40000 ALTER TABLE `favorite_dealerships` DISABLE KEYS */;
INSERT INTO `favorite_dealerships` VALUES (1,1,19,'2022-06-08 21:36:42','2022-06-08 21:36:42'),(2,2,19,'2022-06-08 21:36:44','2022-06-08 21:36:44'),(5,2,2,'2022-06-09 03:33:32','2022-06-09 03:33:32'),(6,7,2,'2022-06-09 03:33:35','2022-06-09 03:33:35');
/*!40000 ALTER TABLE `favorite_dealerships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manufacturers`
--

DROP TABLE IF EXISTS `manufacturers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manufacturers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturers`
--

LOCK TABLES `manufacturers` WRITE;
/*!40000 ALTER TABLE `manufacturers` DISABLE KEYS */;
INSERT INTO `manufacturers` VALUES (1,'Audi','2022-06-01 07:08:03','2022-06-01 07:08:03'),(2,'Mercedes','2022-06-01 07:08:03','2022-06-01 07:08:03'),(3,'Alfa Romeo','2022-06-01 07:08:03','2022-06-01 07:08:03'),(4,'Skoda','2022-06-01 07:08:03','2022-06-01 07:08:03'),(5,'Fiat','2022-06-01 07:08:03','2022-06-01 07:08:03'),(6,'BMW','2022-06-01 07:08:03','2022-06-01 07:08:03');
/*!40000 ALTER TABLE `manufacturers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mechanic_bookings`
--

DROP TABLE IF EXISTS `mechanic_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mechanic_bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `mechanic_id` int DEFAULT NULL,
  `booking_date` date NOT NULL,
  `booking_longitude` double NOT NULL,
  `booking_latitude` double NOT NULL,
  `booking_status_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `mechanic_id` (`mechanic_id`),
  KEY `booking_status_id` (`booking_status_id`),
  CONSTRAINT `mechanic_bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `mechanic_bookings_ibfk_2` FOREIGN KEY (`mechanic_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `mechanic_bookings_ibfk_3` FOREIGN KEY (`booking_status_id`) REFERENCES `booking_statuses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_bookings`
--

LOCK TABLES `mechanic_bookings` WRITE;
/*!40000 ALTER TABLE `mechanic_bookings` DISABLE KEYS */;
INSERT INTO `mechanic_bookings` VALUES (5,2,21,'2022-06-09',15.6130871,46.5615665,4,'2022-06-09 01:17:21','2022-06-09 01:18:23'),(6,2,21,'2022-06-09',15.6130871,46.5615665,4,'2022-06-09 01:18:28','2022-06-09 01:18:33'),(7,2,21,'2022-06-09',15.6130871,46.5615665,4,'2022-06-09 01:20:14','2022-06-09 01:20:31'),(8,2,21,'2022-06-09',15.6130871,46.5615665,2,'2022-06-09 02:32:42','2022-06-09 02:32:48'),(9,2,21,'2022-06-09',15.6130871,46.5615665,2,'2022-06-09 02:33:12','2022-06-09 02:33:14');
/*!40000 ALTER TABLE `mechanic_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offered_services`
--

DROP TABLE IF EXISTS `offered_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offered_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_id` int NOT NULL,
  `car_service_id` int NOT NULL,
  `description` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`),
  KEY `car_service_id` (`car_service_id`),
  CONSTRAINT `offered_services_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `offered_services_ibfk_2` FOREIGN KEY (`car_service_id`) REFERENCES `car_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offered_services`
--

LOCK TABLES `offered_services` WRITE;
/*!40000 ALTER TABLE `offered_services` DISABLE KEYS */;
INSERT INTO `offered_services` VALUES (1,1,1,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(2,1,2,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(3,1,3,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(4,1,4,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(6,2,1,'Opis 8','2022-06-01 07:08:03','2022-06-01 07:08:03'),(7,2,2,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(8,2,3,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(9,2,4,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(10,2,5,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(11,2,6,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(12,3,1,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(13,3,2,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(14,3,3,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(15,3,4,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(16,3,5,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(17,3,6,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(18,4,3,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(19,4,2,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(20,4,5,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(21,5,1,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(22,5,5,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(23,6,5,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(24,7,1,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(25,7,3,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(26,7,4,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(27,7,5,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(28,8,1,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(29,8,2,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(30,8,3,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(31,8,4,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(32,8,5,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(33,8,6,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(34,9,1,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(35,9,2,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(36,9,3,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(37,9,4,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(38,9,5,'......','2022-06-01 07:08:03','2022-06-01 07:08:03'),(39,9,6,'......','2022-06-01 07:08:03','2022-06-01 07:08:03');
/*!40000 ALTER TABLE `offered_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `text` varchar(500) NOT NULL,
  `isAdvice` tinyint DEFAULT '0',
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'Odpoved racunalnika','Pozdravljeni, imam probleme z racunalnikom pri avtomobilu FIat Tipo 2012 letnik. Dogaja se da se pri vklopu avta razunalnik ustavi in izpise napako pri potnem racunalniku.',0,9,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(2,'Problemi z menjalnikom','Fiat punto 2004, avto ime 210 000 prevozenih kilometrov, pogosto servisiran. Pri avtu se doagaja da ko spreminjam iz 3 v 4 hitrost avto se zacne cudno obnasat in se zacne zvisevat temperaturo. Ali ta napaka zahteva spremebo menjalnika?',0,5,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(3,'Stresno okno se ne odpira','Spostovani, pri skodi superb 2015 letnik mi se ustavi stresno okno ko se odpira. Okno se odpre 10 cm in po tem se ustavi in pusca zvoke kot da neku udara po oknu. Kaj je mozna okvara v tem primeru?',0,6,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(4,'Servis pri GTV 1999','Potrebujem velikega servisa za alfa romeo GTV 1999 letnik. V tem je problem ker avto ne morem pripeljat vec kot 20 km (v Celju pa ne obstaja pooblascen alfa romeo servis, kje je najbliza lokacija in koliko bi stalo?)',0,4,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(5,'Sprememba zavor na BMW-ju','Imam probleme pri desni zavori na BMW M4 2021. Zavora se prevec segreva in ne bremza kot druga. problem nastaja pri zamenjavi ker ne najdem originalne zaovre za m-sport opremo. Ali v Sloveniji obstaja servis kateri zamenja originalne dele?',0,8,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(13,'Postavljeno vprasanje','Novo vprasanje',0,19,'2022-06-08 19:36:12','2022-06-08 19:36:12'),(14,'Dodan nasvet','Tekst novega nasveta',1,19,'2022-06-08 19:48:39','2022-06-08 19:48:39');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prices`
--

DROP TABLE IF EXISTS `prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` int NOT NULL,
  `offered_service_id` int NOT NULL,
  `valid_from` date NOT NULL,
  `valid_to` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `offered_service_id` (`offered_service_id`),
  CONSTRAINT `prices_ibfk_1` FOREIGN KEY (`offered_service_id`) REFERENCES `offered_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prices`
--

LOCK TABLES `prices` WRITE;
/*!40000 ALTER TABLE `prices` DISABLE KEYS */;
INSERT INTO `prices` VALUES (1,40,1,'2022-01-01','2022-06-01','2022-06-01 07:08:03','2022-06-01 07:08:03'),(2,45,2,'2022-02-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(3,45,3,'2022-03-25','2022-07-20','2022-06-01 07:08:03','2022-06-01 07:08:03'),(4,37,4,'2022-01-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(6,120,6,'2022-01-01','2022-12-31','2022-06-01 07:08:03','2022-06-01 07:08:03'),(7,90,7,'2022-02-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(8,95,8,'2022-03-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(9,98,9,'2022-01-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(10,110,10,'2022-03-20','2022-07-20','2022-06-01 07:08:03','2022-06-01 07:08:03'),(11,105,11,'2022-01-01','2022-12-31','2022-06-01 07:08:03','2022-06-01 07:08:03'),(12,70,12,'2022-02-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(13,75,13,'2022-03-20',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(14,75,14,'2022-01-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(15,75,15,'2022-01-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(16,80,16,'2022-05-10','2022-10-04','2022-06-01 07:08:03','2022-06-01 07:08:03'),(17,65,17,'2022-01-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(18,50,18,'2022-01-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(19,52,19,'2022-03-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(20,60,20,'2022-04-10','2022-12-10','2022-06-01 07:08:03','2022-06-01 07:08:03'),(21,300,21,'2022-01-01','2022-06-01','2022-06-01 07:08:03','2022-06-01 07:08:03'),(22,320,22,'2022-01-01','2022-12-31','2022-06-01 07:08:03','2022-06-01 07:08:03'),(23,60,23,'2022-01-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(24,45,24,'2022-04-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(25,30,25,'2022-01-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(26,35,26,'2022-03-01','2022-09-01','2022-06-01 07:08:03','2022-06-01 07:08:03'),(27,45,27,'2022-05-03',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(28,80,28,'2022-03-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(29,85,29,'2022-01-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(30,75,30,'2022-02-10','2022-07-10','2022-06-01 07:08:03','2022-06-01 07:08:03'),(31,70,31,'2022-03-20',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(32,85,32,'2022-01-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(33,90,33,'2022-03-05','2022-09-05','2022-06-01 07:08:03','2022-06-01 07:08:03'),(34,200,34,'2022-01-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(35,210,35,'2022-01-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(36,250,36,'2022-02-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(37,180,37,'2022-01-01',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(38,190,38,'2022-03-05',NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(39,200,39,'2021-10-01','2022-10-01','2022-06-01 07:08:03','2022-06-01 07:08:03');
/*!40000 ALTER TABLE `prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(500) NOT NULL,
  `rating` int NOT NULL,
  `offered_service_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `offered_service_id` (`offered_service_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`offered_service_id`) REFERENCES `offered_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (1,'Odlicno narejeno, avto je bil pregledan in računalniške napake odpravljene v krajšem času kot je navedeno.',5,1,3,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(2,'Pripravite se, da greste v prodajalca avtomobilov. Psihično se pripravite na prihajajoče naporne prodajalce. In potem ... ne pridejo. Namesto tega dobite prijazne ljudi, ki vam ne poskušajo ničesar potiskati. so v pomoč. Poslušajo. So ustrežljivi. To je bila moja izkušnja.',5,3,9,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(3,'Z opravljenim delom sem zadovoljen, čeprav je trajalo veliko dlje, kot sem pričakoval.',3,6,5,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(4,'Hitro, pošteno in ugodno. Svoj avto sem vzel za zadnje opornike in bili so veliko cenejši kot takrat, ko sem dal narediti sprednje nekaj mesecev prej v [veliki nacionalni verigi]. Mislil sem, da imam težave z gorivom, in ko so si ogledali in ugotovili, da ni nič narobe (to je bila moja napaka), so vztrajali, da mi ni treba plačati stroškov ocene.',4,8,1,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(5,'Zelo priporočam to avto trgovino! Bil je zelo profesionalen, zelo koristen in imel je odlične cene. se bo zagotovo vrnil',5,11,6,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(6,'Imel sem čudovito izkušnjo z nakupom rabljenega vozila. Postopek je bil brez stresa in prijeten. (DN) je bil zelo temeljit in dobro obveščen. Lahko mi je našel vozilo, ki je ustrezalo mojim potrebam.',5,14,6,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(7,'To mehanično delavnico uporabljam že več kot 8 let. Je zelo dobro obveščen, vreden zaupanja, pošten in jasen. Izkušnje ima v mnogih znamkah. Zelo priporočam brez zadržkov.',5,16,8,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(8,'Moj avto je potreboval novo črpalko za gorivo. Vzel sem avto in ga popravila še isti dan. Težav ni bilo in avto je dobro delal.',4,18,10,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(9,'Poiskal sem v Googlu avto servis v bližini in izbral mesto zaradi dobrih ocen. Vesela sem, da sem jih izbrala, hitra prijazna postrežba. Takoj vnaprej o ceni opravljenega dela na mojem avtomobilu in podrobno zakaj. To trgovino bom priporočil vsej svoji družini v okolici.',4,21,1,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(10,'Zelo dobro poslovno in super prijazno osebje z različnimi storitvami. Našel sem jih prek aplikacije AAA in vsekakor bi jih priporočil vsakomur, saj so eden izmed 10 najboljših avtoservisov v mestu!',4,23,1,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(11,'Nisem zadovoljen s storitvijo, ki mi je bila zagotovljena.',1,24,5,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(12,'Najslabše mesto za popravilo avtomobila. Izogibajte se za vsako ceno.',2,25,6,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(13,'Moje popravilo je zamujalo 5 dni.',2,28,4,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(14,'Spremenjena ocena',5,30,2,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(15,'Imel sem zelo pozitivno izkušnjo. Vodja je zelo prijazen in profesionalen. Prvotna spletna ponudba je bila maksimalna, kot je bilo pričakovano, vendar je bila naslednja ponudba iz glavne pisarne med tem obiskom nižja od pričakovane, me je spodbudila k nasprotni ponudbi, za katero sem upal, da jo dobim, in je bila sprejeta. Papirologija je bila izpolnjena v razumnem času in odšel sem s čekom v približno eni uri po prihodu. Priporočam to podjetje in lokacijo.',5,32,7,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(16,'Kupec je vozilo v celoti pregledal. Slike so bile naložene in v 30 minutah sem prejel ponudbo, ki sem jo sprejel. Nemotena in poštena transakcija.',5,34,7,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(17,'Moje popravilo je zamujalo 3 dni.',2,36,7,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(18,'Tako sem srečen, da sem jih našel. Odzivna, komunikacija je bila nad in tako prijetna. Pravi profesionalci! Zelo priporočam.',5,37,9,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(19,'Odlicno narejeno, avto je bil pregledan in računalniške napake odpravljene v krajšem času kot je navedeno.',5,21,3,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(20,'zelo hitro in dobro narejeno, vsa priporočila.',5,1,12,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(21,'Zaradi gneče je bilo težko načrtovati velik servis, a so mojstri opravili odlično delo.',4,33,13,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(22,'Zelo hiter nakup originalnih delov, vendar sem čakal 7 dni, da sem dobil avto nazas s servisa, kar je bilo rečeno 4 dni.',3,6,6,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(23,'Z opravljenim delom sem zadovoljen, čeprav je trajalo veliko dlje, kot sem pričakoval.',3,38,5,'2022-06-01 07:08:03','2022-06-01 07:08:03');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservation_date` datetime NOT NULL,
  `user_id` int DEFAULT NULL,
  `offered_service_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `offered_service_id` (`offered_service_id`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`offered_service_id`) REFERENCES `offered_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,'2022-05-30 13:00:00',2,2,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(2,'2022-06-05 09:00:00',9,4,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(3,'2022-06-05 09:00:00',9,11,'2022-06-01 07:08:03','2022-06-01 07:08:03');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responses`
--

DROP TABLE IF EXISTS `responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `responses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(500) NOT NULL,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `responses_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `responses_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responses`
--

LOCK TABLES `responses` WRITE;
/*!40000 ALTER TABLE `responses` DISABLE KEYS */;
INSERT INTO `responses` VALUES (1,'Spostovana Sabrina, pri modelu Tipo 2012 se dogajajo problemi z racunalnikom. take napake se ponavadi popravljajo z podrobnim pregledom racunalnika v nasem servisu.',1,10,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(2,'Pozdravljeni, pri starejših avtomobilih se dogajajo okvare na menjalniku, priporocamo podrobni pregled menjalnika. V celju ne obstaja pooblascen servis prioprocamo da pirpeljete avto, ce avta ne morete pripeljati obstaja nasa vlecna sluzba za informacije nas poklicite.',2,10,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(3,'Ce ja imam zavarovanje v vasem servisu ali je vlecna sluzba zracunata v zavarovanje?',2,5,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(4,'Ne zal vlecna sluzba ni zracunata v zavarovanje.',2,10,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(5,'Spostovani, mozno je da se pri stresnem oknu preneha delovanje motorja, ce na avtu imate podaljsano garancijo, lahko avto pripeljeta v nas ali druge pooblascene skoda servise.',3,11,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(6,'Koliko casa traja popravilo v vasem servisu?',3,6,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(7,'Popravilo traja od 2 do 5 dni.',3,11,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(8,'Spostovani, originalne zavore se lahko narocajo v vseh pooblascenih servisih BMW, servisi tudi opravljajo in zamenjavo. V primeru da imate garancijo, zamenjava in del je brzplacno.',5,7,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(9,'Odgovoreno pitanje',4,19,'2022-06-08 19:56:53','2022-06-08 19:56:53'),(10,'Nov odgovor',13,19,'2022-06-08 19:58:12','2022-06-08 19:58:12');
/*!40000 ALTER TABLE `responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Zamenjava olja','2022-06-01 07:08:03','2022-06-01 07:08:03'),(2,'Popravila zavor','2022-06-01 07:08:03','2022-06-01 07:08:03'),(3,'Popravila podvozja','2022-06-01 07:08:03','2022-06-01 07:08:03'),(4,'Popravila avtomobilskih klopov','2022-06-01 07:08:03','2022-06-01 07:08:03'),(5,'Napredni pregledi','2022-06-01 07:08:03','2022-06-01 07:08:03'),(6,'Zamenjava pnevmatik','2022-06-01 07:08:03','2022-06-01 07:08:03'),(7,'Hitri servis','2022-06-01 07:08:03','2022-06-01 07:08:03'),(8,'Mali servis','2022-06-01 07:08:03','2022-06-01 07:08:03'),(9,'Veliki servis','2022-06-01 07:08:03','2022-06-01 07:08:03');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,'user','2022-06-01 07:08:03','2022-06-01 07:08:03'),(2,'expert','2022-06-01 07:08:03','2022-06-01 07:08:03'),(3,'moderator','2022-06-01 07:08:03','2022-06-01 07:08:03'),(4,'admin','2022-06-01 07:08:03','2022-06-01 07:08:03'),(5,'mechanic','2022-06-08 22:29:23','2022-06-08 22:29:23');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `facebook_id` varchar(100) DEFAULT NULL,
  `twitter_id` varchar(100) DEFAULT NULL,
  `google_id` varchar(100) DEFAULT NULL,
  `role_id` int NOT NULL DEFAULT '1',
  `address_id` int DEFAULT NULL,
  `car_service_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `address_id` (`address_id`),
  KEY `car_service_id` (`car_service_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_3` FOREIGN KEY (`car_service_id`) REFERENCES `car_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Miha','Pinter','051234567','miha.pinter@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.70uvcxL0zOU5kHL86BzIcDBuKEtj906',NULL,NULL,NULL,2,17,2,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(2,'Klara','Bajc','070978465','klara.bajc@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.dq3GGsACMUUiWgqz8glW89GniW94NTW',NULL,NULL,NULL,1,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(3,'Lojz','Ciglar','041490808','lojz.ciglar@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.yRdV9qkp0vWmy8TFND1oMkEzhupI7uS',NULL,NULL,NULL,1,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(4,'Peter','Cerin','069254653','peter.cerin@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.Idyr4f8z0DlG59GCG0hcI58jTUsE292',NULL,NULL,NULL,3,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(5,'Gregor','Didek','070265748','gregor.didek@hotmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.js/k1.4DkziVioAmJIqwSTHpxTGKkDq',NULL,NULL,NULL,1,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(6,'Helena','Ferlih','069102945','helena.ferlih@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.29mVZ503cYX3qw73jnQmR0s6rrT3VAq',NULL,NULL,NULL,1,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(7,'Simon','Goler','051903784','simon.goler@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.fWFjrrueWgHjSxI3FEgp8/0KRPCw8pq',NULL,NULL,NULL,2,17,2,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(8,'David','Habe','041344429','david.habe@hotmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.GPwKTlEYgcBbQgC70NgbVekJuGIhsv6',NULL,NULL,NULL,4,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(9,'Sabrina','Jerin','070164632','sabrina.jerin@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.fiQ0t76QLei2e.a4uoVh.C.OzCe93QG',NULL,NULL,NULL,1,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(10,'Klemen','Majcen','069485007','klemen.majcen@yahoo.com','$2b$10$fuLME/29jLIOy34PLY1gM.OWn.lDtD90KNaXUbiHqx/9UZkh.7XV2',NULL,NULL,NULL,2,17,3,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(11,'Joze','Repnik','051384091','joze.repnik@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.u9VPqoFRsHxuD7jXX3xJDoF1fS/k71m',NULL,NULL,NULL,2,17,1,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(12,'Alen','Belic','051','alenbelic@yahoo.com','$2b$10$fuLME/29jLIOy34PLY1gM.jgb2YJQcx6Z5JOZpmqh9JSz0hnahWAa',NULL,NULL,NULL,1,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(13,'Leon','Arih','069','leonarih@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.bwgWrb2AknIpSAJOnFWAxL7dqYs/0Ay',NULL,NULL,NULL,1,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(14,'Erik','Ciglar','069','erikciglar@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.jgVggWABEpPLWWBksgt4Ll9HyyAIncq',NULL,NULL,NULL,1,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(15,'Ana','Krajnc','041','ana.krajnc@hotmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.ypu6CwsieXZwqkcrE0uJipmJPlmIWI2',NULL,NULL,NULL,1,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(16,'Damir','Fister','070','damirfister@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.UFVZ.XPdj5e8HivwKwrWXwwrraRIYwK',NULL,NULL,NULL,1,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(17,'Denis','Gorenc','041','denisgorenc@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.XSyfmHn4qYrALuYwEHdzkeHV0HgzViK',NULL,NULL,NULL,1,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(18,'Blaz','Grad','070','blaz.grad@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.o57uqEgW.5PMyW2ThocB6C0dck9Z5lG',NULL,NULL,NULL,1,17,NULL,'2022-06-01 07:08:03','2022-06-01 07:08:03'),(19,'Filip','Joksovic','0691444112','filipjoksovic1@gmail.com','$2b$10$fuLME/29jLIOy34PLY1gM.u.0B2nkD8wIvgWwUrSnbbx0JIWh2hQ.','2698369783640758',NULL,NULL,3,17,NULL,'2022-06-01 07:10:10','2022-06-01 07:10:10'),(20,'Test','Moderator',NULL,'test@expert.com','$2b$10$pERSshPIA1wh3b7WZFg5duiyvbWVM2/j1jDUdeVN73z2HwRocURyC',NULL,NULL,NULL,2,17,1,'2022-06-07 20:55:36','2022-06-07 20:55:36'),(21,'Mehanik','Mehanik','+38651789648','mehanik@mehanik.com','$2b$10$.hN6L1Rj5M.iafhquZpz/esTrJo94eLuje1Pv8T8koBgtDNHOLcM.',NULL,NULL,NULL,5,18,NULL,'2022-06-08 23:42:15','2022-06-08 23:42:15');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-09  4:41:32
