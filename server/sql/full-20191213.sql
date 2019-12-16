-- MySQL dump 10.13  Distrib 5.7.28, for Linux (x86_64)
--
-- Host: localhost    Database: anteaterExpress
-- ------------------------------------------------------
-- Server version	5.7.28-0ubuntu0.18.04.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `busDaysActive`
--

DROP TABLE IF EXISTS `busDaysActive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `busDaysActive` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bus_id` int(10) unsigned NOT NULL,
  `daysActive` varchar(9) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `busDaysActive`
--

LOCK TABLES `busDaysActive` WRITE;
/*!40000 ALTER TABLE `busDaysActive` DISABLE KEYS */;
INSERT INTO `busDaysActive` VALUES (83,157,'Monday'),(84,157,'Wednesday'),(85,157,'Thursday');
/*!40000 ALTER TABLE `busDaysActive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `busGaps`
--

DROP TABLE IF EXISTS `busGaps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `busGaps` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bus_id` int(10) unsigned NOT NULL,
  `gapStartTime` varchar(4) NOT NULL,
  `gapDuration` varchar(2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `busGaps`
--

LOCK TABLES `busGaps` WRITE;
/*!40000 ALTER TABLE `busGaps` DISABLE KEYS */;
INSERT INTO `busGaps` VALUES (1,157,'1100','10'),(2,157,'1300','10'),(3,157,'1500','10');
/*!40000 ALTER TABLE `busGaps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_info`
--

DROP TABLE IF EXISTS `bus_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bus_info` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `bus_number` smallint(6) NOT NULL,
  `route_id` int(9) NOT NULL,
  `vehicle_id` int(9) NOT NULL,
  `start_time` varchar(4) COLLATE utf8_unicode_ci NOT NULL,
  `rounds` tinyint(3) unsigned NOT NULL,
  `end_time` varchar(4) COLLATE utf8_unicode_ci NOT NULL,
  `opening_duration` smallint(4) NOT NULL,
  `closing_duration` smallint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_info`
--

LOCK TABLES `bus_info` WRITE;
/*!40000 ALTER TABLE `bus_info` DISABLE KEYS */;
INSERT INTO `bus_info` VALUES (157,4242,607,1,'0900',20,'1750',20,20);
/*!40000 ALTER TABLE `bus_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cellProvider`
--

DROP TABLE IF EXISTS `cellProvider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cellProvider` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cell_provider` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `cell_domain` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cellProvider`
--

LOCK TABLES `cellProvider` WRITE;
/*!40000 ALTER TABLE `cellProvider` DISABLE KEYS */;
INSERT INTO `cellProvider` VALUES (1,'ATT','txt.att.net'),(2,'Boost Mobile ','myboostmobile.com'),(3,'Cricket Wireless','mms.cricketwireless.net'),(4,'Project Fi','msg.fi.google.com'),(5,'Sprint','messaging.sprintpcs.com'),(6,'T-Mobile','tmomail.net'),(7,'U.S. Cellular','email.uscc.net'),(8,'Verizon','vtext.com'),(9,'Virgin Mobile','vmobl.com'),(10,'Republic Wireless','text.republicwireless.com');
/*!40000 ALTER TABLE `cellProvider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operator_availability`
--

DROP TABLE IF EXISTS `operator_availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operator_availability` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `session_id` int(11) NOT NULL,
  `day_of_week` enum('Sun','Mon','Tue','Wed','Thu','Fri','Sat') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `start_time` smallint(4) NOT NULL,
  `end_time` smallint(4) NOT NULL,
  `cont_block` smallint(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operator_availability`
--

LOCK TABLES `operator_availability` WRITE;
/*!40000 ALTER TABLE `operator_availability` DISABLE KEYS */;
/*!40000 ALTER TABLE `operator_availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operator_day_detail`
--

DROP TABLE IF EXISTS `operator_day_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operator_day_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `total_hours` smallint(11) NOT NULL,
  `date` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operator_day_detail`
--

LOCK TABLES `operator_day_detail` WRITE;
/*!40000 ALTER TABLE `operator_day_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `operator_day_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operator_route_preference`
--

DROP TABLE IF EXISTS `operator_route_preference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operator_route_preference` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `user_id` int(9) NOT NULL,
  `route_id` int(9) NOT NULL,
  `session_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operator_route_preference`
--

LOCK TABLES `operator_route_preference` WRITE;
/*!40000 ALTER TABLE `operator_route_preference` DISABLE KEYS */;
/*!40000 ALTER TABLE `operator_route_preference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operator_session_avail`
--

DROP TABLE IF EXISTS `operator_session_avail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operator_session_avail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `min_avail_hours` tinyint(4) DEFAULT NULL,
  `avail_end_date` bigint(11) DEFAULT NULL,
  `availEndDateString` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operator_session_avail`
--

LOCK TABLES `operator_session_avail` WRITE;
/*!40000 ALTER TABLE `operator_session_avail` DISABLE KEYS */;
/*!40000 ALTER TABLE `operator_session_avail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operator_week_detail`
--

DROP TABLE IF EXISTS `operator_week_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operator_week_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operator_week_detail`
--

LOCK TABLES `operator_week_detail` WRITE;
/*!40000 ALTER TABLE `operator_week_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `operator_week_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operators`
--

DROP TABLE IF EXISTS `operators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operators` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `date` bigint(20) NOT NULL,
  `operator` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4124 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operators`
--

LOCK TABLES `operators` WRITE;
/*!40000 ALTER TABLE `operators` DISABLE KEYS */;
/*!40000 ALTER TABLE `operators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `mid` varchar(35) NOT NULL,
  `display_name` varchar(63) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'super_admin','Super Admin',NULL,'2019-12-02 20:14:59','2019-12-02 20:14:59'),(2,'admin','Admin',NULL,'2019-12-02 20:14:59','2019-12-02 20:14:59'),(3,'operations','Operations',NULL,'2019-12-02 20:16:37','2019-12-02 20:16:37'),(4,'operators','Operators',NULL,'2019-12-02 20:16:37','2019-12-02 20:16:37'),(5,'trainers','Trainers',NULL,'2019-12-02 20:16:37','2019-12-02 20:16:37'),(6,'trainees','Trainees',NULL,'2019-12-02 20:16:37','2019-12-02 20:16:37');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `round`
--

DROP TABLE IF EXISTS `round`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `round` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `user_id` int(9) NOT NULL,
  `session_id` int(9) NOT NULL,
  `bus_info_id` int(6) NOT NULL,
  `date` date NOT NULL,
  `start_time` smallint(4) NOT NULL,
  `end_time` smallint(4) NOT NULL,
  `status` enum('scheduled','posted','traded','swapped','unscheduled') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'unscheduled',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11597 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `round`
--

LOCK TABLES `round` WRITE;
/*!40000 ALTER TABLE `round` DISABLE KEYS */;
INSERT INTO `round` VALUES (10457,1,19,157,'2020-01-02',840,925,'unscheduled'),(10458,1,19,157,'2020-01-02',925,950,'unscheduled'),(10459,1,19,157,'2020-01-02',950,1015,'unscheduled'),(10460,1,19,157,'2020-01-02',1015,1040,'unscheduled'),(10461,1,19,157,'2020-01-02',1040,1115,'unscheduled'),(10462,1,19,157,'2020-01-02',1115,1140,'unscheduled'),(10463,1,19,157,'2020-01-02',1140,1205,'unscheduled'),(10464,1,19,157,'2020-01-02',1205,1230,'unscheduled'),(10465,1,19,157,'2020-01-02',1230,1255,'unscheduled'),(10466,1,19,157,'2020-01-02',1255,1330,'unscheduled'),(10467,1,19,157,'2020-01-02',1330,1355,'unscheduled'),(10468,1,19,157,'2020-01-02',1355,1420,'unscheduled'),(10469,1,19,157,'2020-01-02',1420,1445,'unscheduled'),(10470,1,19,157,'2020-01-02',1445,1520,'unscheduled'),(10471,1,19,157,'2020-01-02',1520,1545,'unscheduled'),(10472,1,19,157,'2020-01-02',1545,1610,'unscheduled'),(10473,1,19,157,'2020-01-02',1610,1635,'unscheduled'),(10474,1,19,157,'2020-01-02',1635,1700,'unscheduled'),(10475,1,19,157,'2020-01-02',1700,1725,'unscheduled'),(10476,1,19,157,'2020-01-02',1725,1810,'unscheduled'),(10477,1,19,157,'2020-01-04',840,925,'unscheduled'),(10478,1,19,157,'2020-01-04',925,950,'unscheduled'),(10479,1,19,157,'2020-01-04',950,1015,'unscheduled'),(10480,1,19,157,'2020-01-04',1015,1040,'unscheduled'),(10481,1,19,157,'2020-01-04',1040,1115,'unscheduled'),(10482,1,19,157,'2020-01-04',1115,1140,'unscheduled'),(10483,1,19,157,'2020-01-04',1140,1205,'unscheduled'),(10484,1,19,157,'2020-01-04',1205,1230,'unscheduled'),(10485,1,19,157,'2020-01-04',1230,1255,'unscheduled'),(10486,1,19,157,'2020-01-04',1255,1330,'unscheduled'),(10487,1,19,157,'2020-01-04',1330,1355,'unscheduled'),(10488,1,19,157,'2020-01-04',1355,1420,'unscheduled'),(10489,1,19,157,'2020-01-04',1420,1445,'unscheduled'),(10490,1,19,157,'2020-01-04',1445,1520,'unscheduled'),(10491,1,19,157,'2020-01-04',1520,1545,'unscheduled'),(10492,1,19,157,'2020-01-04',1545,1610,'unscheduled'),(10493,1,19,157,'2020-01-04',1610,1635,'unscheduled'),(10494,1,19,157,'2020-01-04',1635,1700,'unscheduled'),(10495,1,19,157,'2020-01-04',1700,1725,'unscheduled'),(10496,1,19,157,'2020-01-04',1725,1810,'unscheduled'),(10497,1,19,157,'2020-01-05',840,925,'unscheduled'),(10498,1,19,157,'2020-01-05',925,950,'unscheduled'),(10499,1,19,157,'2020-01-05',950,1015,'unscheduled'),(10500,1,19,157,'2020-01-05',1015,1040,'unscheduled'),(10501,1,19,157,'2020-01-05',1040,1115,'unscheduled'),(10502,1,19,157,'2020-01-05',1115,1140,'unscheduled'),(10503,1,19,157,'2020-01-05',1140,1205,'unscheduled'),(10504,1,19,157,'2020-01-05',1205,1230,'unscheduled'),(10505,1,19,157,'2020-01-05',1230,1255,'unscheduled'),(10506,1,19,157,'2020-01-05',1255,1330,'unscheduled'),(10507,1,19,157,'2020-01-05',1330,1355,'unscheduled'),(10508,1,19,157,'2020-01-05',1355,1420,'unscheduled'),(10509,1,19,157,'2020-01-05',1420,1445,'unscheduled'),(10510,1,19,157,'2020-01-05',1445,1520,'unscheduled'),(10511,1,19,157,'2020-01-05',1520,1545,'unscheduled'),(10512,1,19,157,'2020-01-05',1545,1610,'unscheduled'),(10513,1,19,157,'2020-01-05',1610,1635,'unscheduled'),(10514,1,19,157,'2020-01-05',1635,1700,'unscheduled'),(10515,1,19,157,'2020-01-05',1700,1725,'unscheduled'),(10516,1,19,157,'2020-01-05',1725,1810,'unscheduled'),(10517,1,19,157,'2020-01-09',840,925,'unscheduled'),(10518,1,19,157,'2020-01-09',925,950,'unscheduled'),(10519,1,19,157,'2020-01-09',950,1015,'unscheduled'),(10520,1,19,157,'2020-01-09',1015,1040,'unscheduled'),(10521,1,19,157,'2020-01-09',1040,1115,'unscheduled'),(10522,1,19,157,'2020-01-09',1115,1140,'unscheduled'),(10523,1,19,157,'2020-01-09',1140,1205,'unscheduled'),(10524,1,19,157,'2020-01-09',1205,1230,'unscheduled'),(10525,1,19,157,'2020-01-09',1230,1255,'unscheduled'),(10526,1,19,157,'2020-01-09',1255,1330,'unscheduled'),(10527,1,19,157,'2020-01-09',1330,1355,'unscheduled'),(10528,1,19,157,'2020-01-09',1355,1420,'unscheduled'),(10529,1,19,157,'2020-01-09',1420,1445,'unscheduled'),(10530,1,19,157,'2020-01-09',1445,1520,'unscheduled'),(10531,1,19,157,'2020-01-09',1520,1545,'unscheduled'),(10532,1,19,157,'2020-01-09',1545,1610,'unscheduled'),(10533,1,19,157,'2020-01-09',1610,1635,'unscheduled'),(10534,1,19,157,'2020-01-09',1635,1700,'unscheduled'),(10535,1,19,157,'2020-01-09',1700,1725,'unscheduled'),(10536,1,19,157,'2020-01-09',1725,1810,'unscheduled'),(10537,1,19,157,'2020-01-11',840,925,'unscheduled'),(10538,1,19,157,'2020-01-11',925,950,'unscheduled'),(10539,1,19,157,'2020-01-11',950,1015,'unscheduled'),(10540,1,19,157,'2020-01-11',1015,1040,'unscheduled'),(10541,1,19,157,'2020-01-11',1040,1115,'unscheduled'),(10542,1,19,157,'2020-01-11',1115,1140,'unscheduled'),(10543,1,19,157,'2020-01-11',1140,1205,'unscheduled'),(10544,1,19,157,'2020-01-11',1205,1230,'unscheduled'),(10545,1,19,157,'2020-01-11',1230,1255,'unscheduled'),(10546,1,19,157,'2020-01-11',1255,1330,'unscheduled'),(10547,1,19,157,'2020-01-11',1330,1355,'unscheduled'),(10548,1,19,157,'2020-01-11',1355,1420,'unscheduled'),(10549,1,19,157,'2020-01-11',1420,1445,'unscheduled'),(10550,1,19,157,'2020-01-11',1445,1520,'unscheduled'),(10551,1,19,157,'2020-01-11',1520,1545,'unscheduled'),(10552,1,19,157,'2020-01-11',1545,1610,'unscheduled'),(10553,1,19,157,'2020-01-11',1610,1635,'unscheduled'),(10554,1,19,157,'2020-01-11',1635,1700,'unscheduled'),(10555,1,19,157,'2020-01-11',1700,1725,'unscheduled'),(10556,1,19,157,'2020-01-11',1725,1810,'unscheduled'),(10557,1,19,157,'2020-01-12',840,925,'unscheduled'),(10558,1,19,157,'2020-01-12',925,950,'unscheduled'),(10559,1,19,157,'2020-01-12',950,1015,'unscheduled'),(10560,1,19,157,'2020-01-12',1015,1040,'unscheduled'),(10561,1,19,157,'2020-01-12',1040,1115,'unscheduled'),(10562,1,19,157,'2020-01-12',1115,1140,'unscheduled'),(10563,1,19,157,'2020-01-12',1140,1205,'unscheduled'),(10564,1,19,157,'2020-01-12',1205,1230,'unscheduled'),(10565,1,19,157,'2020-01-12',1230,1255,'unscheduled'),(10566,1,19,157,'2020-01-12',1255,1330,'unscheduled'),(10567,1,19,157,'2020-01-12',1330,1355,'unscheduled'),(10568,1,19,157,'2020-01-12',1355,1420,'unscheduled'),(10569,1,19,157,'2020-01-12',1420,1445,'unscheduled'),(10570,1,19,157,'2020-01-12',1445,1520,'unscheduled'),(10571,1,19,157,'2020-01-12',1520,1545,'unscheduled'),(10572,1,19,157,'2020-01-12',1545,1610,'unscheduled'),(10573,1,19,157,'2020-01-12',1610,1635,'unscheduled'),(10574,1,19,157,'2020-01-12',1635,1700,'unscheduled'),(10575,1,19,157,'2020-01-12',1700,1725,'unscheduled'),(10576,1,19,157,'2020-01-12',1725,1810,'unscheduled'),(10577,1,19,157,'2020-01-16',840,925,'unscheduled'),(10578,1,19,157,'2020-01-16',925,950,'unscheduled'),(10579,1,19,157,'2020-01-16',950,1015,'unscheduled'),(10580,1,19,157,'2020-01-16',1015,1040,'unscheduled'),(10581,1,19,157,'2020-01-16',1040,1115,'unscheduled'),(10582,1,19,157,'2020-01-16',1115,1140,'unscheduled'),(10583,1,19,157,'2020-01-16',1140,1205,'unscheduled'),(10584,1,19,157,'2020-01-16',1205,1230,'unscheduled'),(10585,1,19,157,'2020-01-16',1230,1255,'unscheduled'),(10586,1,19,157,'2020-01-16',1255,1330,'unscheduled'),(10587,1,19,157,'2020-01-16',1330,1355,'unscheduled'),(10588,1,19,157,'2020-01-16',1355,1420,'unscheduled'),(10589,1,19,157,'2020-01-16',1420,1445,'unscheduled'),(10590,1,19,157,'2020-01-16',1445,1520,'unscheduled'),(10591,1,19,157,'2020-01-16',1520,1545,'unscheduled'),(10592,1,19,157,'2020-01-16',1545,1610,'unscheduled'),(10593,1,19,157,'2020-01-16',1610,1635,'unscheduled'),(10594,1,19,157,'2020-01-16',1635,1700,'unscheduled'),(10595,1,19,157,'2020-01-16',1700,1725,'unscheduled'),(10596,1,19,157,'2020-01-16',1725,1810,'unscheduled'),(10597,1,19,157,'2020-01-18',840,925,'unscheduled'),(10598,1,19,157,'2020-01-18',925,950,'unscheduled'),(10599,1,19,157,'2020-01-18',950,1015,'unscheduled'),(10600,1,19,157,'2020-01-18',1015,1040,'unscheduled'),(10601,1,19,157,'2020-01-18',1040,1115,'unscheduled'),(10602,1,19,157,'2020-01-18',1115,1140,'unscheduled'),(10603,1,19,157,'2020-01-18',1140,1205,'unscheduled'),(10604,1,19,157,'2020-01-18',1205,1230,'unscheduled'),(10605,1,19,157,'2020-01-18',1230,1255,'unscheduled'),(10606,1,19,157,'2020-01-18',1255,1330,'unscheduled'),(10607,1,19,157,'2020-01-18',1330,1355,'unscheduled'),(10608,1,19,157,'2020-01-18',1355,1420,'unscheduled'),(10609,1,19,157,'2020-01-18',1420,1445,'unscheduled'),(10610,1,19,157,'2020-01-18',1445,1520,'unscheduled'),(10611,1,19,157,'2020-01-18',1520,1545,'unscheduled'),(10612,1,19,157,'2020-01-18',1545,1610,'unscheduled'),(10613,1,19,157,'2020-01-18',1610,1635,'unscheduled'),(10614,1,19,157,'2020-01-18',1635,1700,'unscheduled'),(10615,1,19,157,'2020-01-18',1700,1725,'unscheduled'),(10616,1,19,157,'2020-01-18',1725,1810,'unscheduled'),(10617,1,19,157,'2020-01-19',840,925,'unscheduled'),(10618,1,19,157,'2020-01-19',925,950,'unscheduled'),(10619,1,19,157,'2020-01-19',950,1015,'unscheduled'),(10620,1,19,157,'2020-01-19',1015,1040,'unscheduled'),(10621,1,19,157,'2020-01-19',1040,1115,'unscheduled'),(10622,1,19,157,'2020-01-19',1115,1140,'unscheduled'),(10623,1,19,157,'2020-01-19',1140,1205,'unscheduled'),(10624,1,19,157,'2020-01-19',1205,1230,'unscheduled'),(10625,1,19,157,'2020-01-19',1230,1255,'unscheduled'),(10626,1,19,157,'2020-01-19',1255,1330,'unscheduled'),(10627,1,19,157,'2020-01-19',1330,1355,'unscheduled'),(10628,1,19,157,'2020-01-19',1355,1420,'unscheduled'),(10629,1,19,157,'2020-01-19',1420,1445,'unscheduled'),(10630,1,19,157,'2020-01-19',1445,1520,'unscheduled'),(10631,1,19,157,'2020-01-19',1520,1545,'unscheduled'),(10632,1,19,157,'2020-01-19',1545,1610,'unscheduled'),(10633,1,19,157,'2020-01-19',1610,1635,'unscheduled'),(10634,1,19,157,'2020-01-19',1635,1700,'unscheduled'),(10635,1,19,157,'2020-01-19',1700,1725,'unscheduled'),(10636,1,19,157,'2020-01-19',1725,1810,'unscheduled'),(10637,1,19,157,'2020-01-23',840,925,'unscheduled'),(10638,1,19,157,'2020-01-23',925,950,'unscheduled'),(10639,1,19,157,'2020-01-23',950,1015,'unscheduled'),(10640,1,19,157,'2020-01-23',1015,1040,'unscheduled'),(10641,1,19,157,'2020-01-23',1040,1115,'unscheduled'),(10642,1,19,157,'2020-01-23',1115,1140,'unscheduled'),(10643,1,19,157,'2020-01-23',1140,1205,'unscheduled'),(10644,1,19,157,'2020-01-23',1205,1230,'unscheduled'),(10645,1,19,157,'2020-01-23',1230,1255,'unscheduled'),(10646,1,19,157,'2020-01-23',1255,1330,'unscheduled'),(10647,1,19,157,'2020-01-23',1330,1355,'unscheduled'),(10648,1,19,157,'2020-01-23',1355,1420,'unscheduled'),(10649,1,19,157,'2020-01-23',1420,1445,'unscheduled'),(10650,1,19,157,'2020-01-23',1445,1520,'unscheduled'),(10651,1,19,157,'2020-01-23',1520,1545,'unscheduled'),(10652,1,19,157,'2020-01-23',1545,1610,'unscheduled'),(10653,1,19,157,'2020-01-23',1610,1635,'unscheduled'),(10654,1,19,157,'2020-01-23',1635,1700,'unscheduled'),(10655,1,19,157,'2020-01-23',1700,1725,'unscheduled'),(10656,1,19,157,'2020-01-23',1725,1810,'unscheduled'),(10657,1,19,157,'2020-01-25',840,925,'unscheduled'),(10658,1,19,157,'2020-01-25',925,950,'unscheduled'),(10659,1,19,157,'2020-01-25',950,1015,'unscheduled'),(10660,1,19,157,'2020-01-25',1015,1040,'unscheduled'),(10661,1,19,157,'2020-01-25',1040,1115,'unscheduled'),(10662,1,19,157,'2020-01-25',1115,1140,'unscheduled'),(10663,1,19,157,'2020-01-25',1140,1205,'unscheduled'),(10664,1,19,157,'2020-01-25',1205,1230,'unscheduled'),(10665,1,19,157,'2020-01-25',1230,1255,'unscheduled'),(10666,1,19,157,'2020-01-25',1255,1330,'unscheduled'),(10667,1,19,157,'2020-01-25',1330,1355,'unscheduled'),(10668,1,19,157,'2020-01-25',1355,1420,'unscheduled'),(10669,1,19,157,'2020-01-25',1420,1445,'unscheduled'),(10670,1,19,157,'2020-01-25',1445,1520,'unscheduled'),(10671,1,19,157,'2020-01-25',1520,1545,'unscheduled'),(10672,1,19,157,'2020-01-25',1545,1610,'unscheduled'),(10673,1,19,157,'2020-01-25',1610,1635,'unscheduled'),(10674,1,19,157,'2020-01-25',1635,1700,'unscheduled'),(10675,1,19,157,'2020-01-25',1700,1725,'unscheduled'),(10676,1,19,157,'2020-01-25',1725,1810,'unscheduled'),(10677,1,19,157,'2020-01-26',840,925,'unscheduled'),(10678,1,19,157,'2020-01-26',925,950,'unscheduled'),(10679,1,19,157,'2020-01-26',950,1015,'unscheduled'),(10680,1,19,157,'2020-01-26',1015,1040,'unscheduled'),(10681,1,19,157,'2020-01-26',1040,1115,'unscheduled'),(10682,1,19,157,'2020-01-26',1115,1140,'unscheduled'),(10683,1,19,157,'2020-01-26',1140,1205,'unscheduled'),(10684,1,19,157,'2020-01-26',1205,1230,'unscheduled'),(10685,1,19,157,'2020-01-26',1230,1255,'unscheduled'),(10686,1,19,157,'2020-01-26',1255,1330,'unscheduled'),(10687,1,19,157,'2020-01-26',1330,1355,'unscheduled'),(10688,1,19,157,'2020-01-26',1355,1420,'unscheduled'),(10689,1,19,157,'2020-01-26',1420,1445,'unscheduled'),(10690,1,19,157,'2020-01-26',1445,1520,'unscheduled'),(10691,1,19,157,'2020-01-26',1520,1545,'unscheduled'),(10692,1,19,157,'2020-01-26',1545,1610,'unscheduled'),(10693,1,19,157,'2020-01-26',1610,1635,'unscheduled'),(10694,1,19,157,'2020-01-26',1635,1700,'unscheduled'),(10695,1,19,157,'2020-01-26',1700,1725,'unscheduled'),(10696,1,19,157,'2020-01-26',1725,1810,'unscheduled'),(10697,1,19,157,'2020-01-30',840,925,'unscheduled'),(10698,1,19,157,'2020-01-30',925,950,'unscheduled'),(10699,1,19,157,'2020-01-30',950,1015,'unscheduled'),(10700,1,19,157,'2020-01-30',1015,1040,'unscheduled'),(10701,1,19,157,'2020-01-30',1040,1115,'unscheduled'),(10702,1,19,157,'2020-01-30',1115,1140,'unscheduled'),(10703,1,19,157,'2020-01-30',1140,1205,'unscheduled'),(10704,1,19,157,'2020-01-30',1205,1230,'unscheduled'),(10705,1,19,157,'2020-01-30',1230,1255,'unscheduled'),(10706,1,19,157,'2020-01-30',1255,1330,'unscheduled'),(10707,1,19,157,'2020-01-30',1330,1355,'unscheduled'),(10708,1,19,157,'2020-01-30',1355,1420,'unscheduled'),(10709,1,19,157,'2020-01-30',1420,1445,'unscheduled'),(10710,1,19,157,'2020-01-30',1445,1520,'unscheduled'),(10711,1,19,157,'2020-01-30',1520,1545,'unscheduled'),(10712,1,19,157,'2020-01-30',1545,1610,'unscheduled'),(10713,1,19,157,'2020-01-30',1610,1635,'unscheduled'),(10714,1,19,157,'2020-01-30',1635,1700,'unscheduled'),(10715,1,19,157,'2020-01-30',1700,1725,'unscheduled'),(10716,1,19,157,'2020-01-30',1725,1810,'unscheduled'),(10717,1,19,157,'2020-02-01',840,925,'unscheduled'),(10718,1,19,157,'2020-02-01',925,950,'unscheduled'),(10719,1,19,157,'2020-02-01',950,1015,'unscheduled'),(10720,1,19,157,'2020-02-01',1015,1040,'unscheduled'),(10721,1,19,157,'2020-02-01',1040,1115,'unscheduled'),(10722,1,19,157,'2020-02-01',1115,1140,'unscheduled'),(10723,1,19,157,'2020-02-01',1140,1205,'unscheduled'),(10724,1,19,157,'2020-02-01',1205,1230,'unscheduled'),(10725,1,19,157,'2020-02-01',1230,1255,'unscheduled'),(10726,1,19,157,'2020-02-01',1255,1330,'unscheduled'),(10727,1,19,157,'2020-02-01',1330,1355,'unscheduled'),(10728,1,19,157,'2020-02-01',1355,1420,'unscheduled'),(10729,1,19,157,'2020-02-01',1420,1445,'unscheduled'),(10730,1,19,157,'2020-02-01',1445,1520,'unscheduled'),(10731,1,19,157,'2020-02-01',1520,1545,'unscheduled'),(10732,1,19,157,'2020-02-01',1545,1610,'unscheduled'),(10733,1,19,157,'2020-02-01',1610,1635,'unscheduled'),(10734,1,19,157,'2020-02-01',1635,1700,'unscheduled'),(10735,1,19,157,'2020-02-01',1700,1725,'unscheduled'),(10736,1,19,157,'2020-02-01',1725,1810,'unscheduled'),(10737,1,19,157,'2020-02-02',840,925,'unscheduled'),(10738,1,19,157,'2020-02-02',925,950,'unscheduled'),(10739,1,19,157,'2020-02-02',950,1015,'unscheduled'),(10740,1,19,157,'2020-02-02',1015,1040,'unscheduled'),(10741,1,19,157,'2020-02-02',1040,1115,'unscheduled'),(10742,1,19,157,'2020-02-02',1115,1140,'unscheduled'),(10743,1,19,157,'2020-02-02',1140,1205,'unscheduled'),(10744,1,19,157,'2020-02-02',1205,1230,'unscheduled'),(10745,1,19,157,'2020-02-02',1230,1255,'unscheduled'),(10746,1,19,157,'2020-02-02',1255,1330,'unscheduled'),(10747,1,19,157,'2020-02-02',1330,1355,'unscheduled'),(10748,1,19,157,'2020-02-02',1355,1420,'unscheduled'),(10749,1,19,157,'2020-02-02',1420,1445,'unscheduled'),(10750,1,19,157,'2020-02-02',1445,1520,'unscheduled'),(10751,1,19,157,'2020-02-02',1520,1545,'unscheduled'),(10752,1,19,157,'2020-02-02',1545,1610,'unscheduled'),(10753,1,19,157,'2020-02-02',1610,1635,'unscheduled'),(10754,1,19,157,'2020-02-02',1635,1700,'unscheduled'),(10755,1,19,157,'2020-02-02',1700,1725,'unscheduled'),(10756,1,19,157,'2020-02-02',1725,1810,'unscheduled'),(10757,1,19,157,'2020-02-06',840,925,'unscheduled'),(10758,1,19,157,'2020-02-06',925,950,'unscheduled'),(10759,1,19,157,'2020-02-06',950,1015,'unscheduled'),(10760,1,19,157,'2020-02-06',1015,1040,'unscheduled'),(10761,1,19,157,'2020-02-06',1040,1115,'unscheduled'),(10762,1,19,157,'2020-02-06',1115,1140,'unscheduled'),(10763,1,19,157,'2020-02-06',1140,1205,'unscheduled'),(10764,1,19,157,'2020-02-06',1205,1230,'unscheduled'),(10765,1,19,157,'2020-02-06',1230,1255,'unscheduled'),(10766,1,19,157,'2020-02-06',1255,1330,'unscheduled'),(10767,1,19,157,'2020-02-06',1330,1355,'unscheduled'),(10768,1,19,157,'2020-02-06',1355,1420,'unscheduled'),(10769,1,19,157,'2020-02-06',1420,1445,'unscheduled'),(10770,1,19,157,'2020-02-06',1445,1520,'unscheduled'),(10771,1,19,157,'2020-02-06',1520,1545,'unscheduled'),(10772,1,19,157,'2020-02-06',1545,1610,'unscheduled'),(10773,1,19,157,'2020-02-06',1610,1635,'unscheduled'),(10774,1,19,157,'2020-02-06',1635,1700,'unscheduled'),(10775,1,19,157,'2020-02-06',1700,1725,'unscheduled'),(10776,1,19,157,'2020-02-06',1725,1810,'unscheduled'),(10777,1,19,157,'2020-02-08',840,925,'unscheduled'),(10778,1,19,157,'2020-02-08',925,950,'unscheduled'),(10779,1,19,157,'2020-02-08',950,1015,'unscheduled'),(10780,1,19,157,'2020-02-08',1015,1040,'unscheduled'),(10781,1,19,157,'2020-02-08',1040,1115,'unscheduled'),(10782,1,19,157,'2020-02-08',1115,1140,'unscheduled'),(10783,1,19,157,'2020-02-08',1140,1205,'unscheduled'),(10784,1,19,157,'2020-02-08',1205,1230,'unscheduled'),(10785,1,19,157,'2020-02-08',1230,1255,'unscheduled'),(10786,1,19,157,'2020-02-08',1255,1330,'unscheduled'),(10787,1,19,157,'2020-02-08',1330,1355,'unscheduled'),(10788,1,19,157,'2020-02-08',1355,1420,'unscheduled'),(10789,1,19,157,'2020-02-08',1420,1445,'unscheduled'),(10790,1,19,157,'2020-02-08',1445,1520,'unscheduled'),(10791,1,19,157,'2020-02-08',1520,1545,'unscheduled'),(10792,1,19,157,'2020-02-08',1545,1610,'unscheduled'),(10793,1,19,157,'2020-02-08',1610,1635,'unscheduled'),(10794,1,19,157,'2020-02-08',1635,1700,'unscheduled'),(10795,1,19,157,'2020-02-08',1700,1725,'unscheduled'),(10796,1,19,157,'2020-02-08',1725,1810,'unscheduled'),(10797,1,19,157,'2020-02-09',840,925,'unscheduled'),(10798,1,19,157,'2020-02-09',925,950,'unscheduled'),(10799,1,19,157,'2020-02-09',950,1015,'unscheduled'),(10800,1,19,157,'2020-02-09',1015,1040,'unscheduled'),(10801,1,19,157,'2020-02-09',1040,1115,'unscheduled'),(10802,1,19,157,'2020-02-09',1115,1140,'unscheduled'),(10803,1,19,157,'2020-02-09',1140,1205,'unscheduled'),(10804,1,19,157,'2020-02-09',1205,1230,'unscheduled'),(10805,1,19,157,'2020-02-09',1230,1255,'unscheduled'),(10806,1,19,157,'2020-02-09',1255,1330,'unscheduled'),(10807,1,19,157,'2020-02-09',1330,1355,'unscheduled'),(10808,1,19,157,'2020-02-09',1355,1420,'unscheduled'),(10809,1,19,157,'2020-02-09',1420,1445,'unscheduled'),(10810,1,19,157,'2020-02-09',1445,1520,'unscheduled'),(10811,1,19,157,'2020-02-09',1520,1545,'unscheduled'),(10812,1,19,157,'2020-02-09',1545,1610,'unscheduled'),(10813,1,19,157,'2020-02-09',1610,1635,'unscheduled'),(10814,1,19,157,'2020-02-09',1635,1700,'unscheduled'),(10815,1,19,157,'2020-02-09',1700,1725,'unscheduled'),(10816,1,19,157,'2020-02-09',1725,1810,'unscheduled'),(10817,1,19,157,'2020-02-13',840,925,'unscheduled'),(10818,1,19,157,'2020-02-13',925,950,'unscheduled'),(10819,1,19,157,'2020-02-13',950,1015,'unscheduled'),(10820,1,19,157,'2020-02-13',1015,1040,'unscheduled'),(10821,1,19,157,'2020-02-13',1040,1115,'unscheduled'),(10822,1,19,157,'2020-02-13',1115,1140,'unscheduled'),(10823,1,19,157,'2020-02-13',1140,1205,'unscheduled'),(10824,1,19,157,'2020-02-13',1205,1230,'unscheduled'),(10825,1,19,157,'2020-02-13',1230,1255,'unscheduled'),(10826,1,19,157,'2020-02-13',1255,1330,'unscheduled'),(10827,1,19,157,'2020-02-13',1330,1355,'unscheduled'),(10828,1,19,157,'2020-02-13',1355,1420,'unscheduled'),(10829,1,19,157,'2020-02-13',1420,1445,'unscheduled'),(10830,1,19,157,'2020-02-13',1445,1520,'unscheduled'),(10831,1,19,157,'2020-02-13',1520,1545,'unscheduled'),(10832,1,19,157,'2020-02-13',1545,1610,'unscheduled'),(10833,1,19,157,'2020-02-13',1610,1635,'unscheduled'),(10834,1,19,157,'2020-02-13',1635,1700,'unscheduled'),(10835,1,19,157,'2020-02-13',1700,1725,'unscheduled'),(10836,1,19,157,'2020-02-13',1725,1810,'unscheduled'),(10837,1,19,157,'2020-02-15',840,925,'unscheduled'),(10838,1,19,157,'2020-02-15',925,950,'unscheduled'),(10839,1,19,157,'2020-02-15',950,1015,'unscheduled'),(10840,1,19,157,'2020-02-15',1015,1040,'unscheduled'),(10841,1,19,157,'2020-02-15',1040,1115,'unscheduled'),(10842,1,19,157,'2020-02-15',1115,1140,'unscheduled'),(10843,1,19,157,'2020-02-15',1140,1205,'unscheduled'),(10844,1,19,157,'2020-02-15',1205,1230,'unscheduled'),(10845,1,19,157,'2020-02-15',1230,1255,'unscheduled'),(10846,1,19,157,'2020-02-15',1255,1330,'unscheduled'),(10847,1,19,157,'2020-02-15',1330,1355,'unscheduled'),(10848,1,19,157,'2020-02-15',1355,1420,'unscheduled'),(10849,1,19,157,'2020-02-15',1420,1445,'unscheduled'),(10850,1,19,157,'2020-02-15',1445,1520,'unscheduled'),(10851,1,19,157,'2020-02-15',1520,1545,'unscheduled'),(10852,1,19,157,'2020-02-15',1545,1610,'unscheduled'),(10853,1,19,157,'2020-02-15',1610,1635,'unscheduled'),(10854,1,19,157,'2020-02-15',1635,1700,'unscheduled'),(10855,1,19,157,'2020-02-15',1700,1725,'unscheduled'),(10856,1,19,157,'2020-02-15',1725,1810,'unscheduled'),(10857,1,19,157,'2020-02-16',840,925,'unscheduled'),(10858,1,19,157,'2020-02-16',925,950,'unscheduled'),(10859,1,19,157,'2020-02-16',950,1015,'unscheduled'),(10860,1,19,157,'2020-02-16',1015,1040,'unscheduled'),(10861,1,19,157,'2020-02-16',1040,1115,'unscheduled'),(10862,1,19,157,'2020-02-16',1115,1140,'unscheduled'),(10863,1,19,157,'2020-02-16',1140,1205,'unscheduled'),(10864,1,19,157,'2020-02-16',1205,1230,'unscheduled'),(10865,1,19,157,'2020-02-16',1230,1255,'unscheduled'),(10866,1,19,157,'2020-02-16',1255,1330,'unscheduled'),(10867,1,19,157,'2020-02-16',1330,1355,'unscheduled'),(10868,1,19,157,'2020-02-16',1355,1420,'unscheduled'),(10869,1,19,157,'2020-02-16',1420,1445,'unscheduled'),(10870,1,19,157,'2020-02-16',1445,1520,'unscheduled'),(10871,1,19,157,'2020-02-16',1520,1545,'unscheduled'),(10872,1,19,157,'2020-02-16',1545,1610,'unscheduled'),(10873,1,19,157,'2020-02-16',1610,1635,'unscheduled'),(10874,1,19,157,'2020-02-16',1635,1700,'unscheduled'),(10875,1,19,157,'2020-02-16',1700,1725,'unscheduled'),(10876,1,19,157,'2020-02-16',1725,1810,'unscheduled'),(10877,1,19,157,'2020-02-20',840,925,'unscheduled'),(10878,1,19,157,'2020-02-20',925,950,'unscheduled'),(10879,1,19,157,'2020-02-20',950,1015,'unscheduled'),(10880,1,19,157,'2020-02-20',1015,1040,'unscheduled'),(10881,1,19,157,'2020-02-20',1040,1115,'unscheduled'),(10882,1,19,157,'2020-02-20',1115,1140,'unscheduled'),(10883,1,19,157,'2020-02-20',1140,1205,'unscheduled'),(10884,1,19,157,'2020-02-20',1205,1230,'unscheduled'),(10885,1,19,157,'2020-02-20',1230,1255,'unscheduled'),(10886,1,19,157,'2020-02-20',1255,1330,'unscheduled'),(10887,1,19,157,'2020-02-20',1330,1355,'unscheduled'),(10888,1,19,157,'2020-02-20',1355,1420,'unscheduled'),(10889,1,19,157,'2020-02-20',1420,1445,'unscheduled'),(10890,1,19,157,'2020-02-20',1445,1520,'unscheduled'),(10891,1,19,157,'2020-02-20',1520,1545,'unscheduled'),(10892,1,19,157,'2020-02-20',1545,1610,'unscheduled'),(10893,1,19,157,'2020-02-20',1610,1635,'unscheduled'),(10894,1,19,157,'2020-02-20',1635,1700,'unscheduled'),(10895,1,19,157,'2020-02-20',1700,1725,'unscheduled'),(10896,1,19,157,'2020-02-20',1725,1810,'unscheduled'),(10897,1,19,157,'2020-02-22',840,925,'unscheduled'),(10898,1,19,157,'2020-02-22',925,950,'unscheduled'),(10899,1,19,157,'2020-02-22',950,1015,'unscheduled'),(10900,1,19,157,'2020-02-22',1015,1040,'unscheduled'),(10901,1,19,157,'2020-02-22',1040,1115,'unscheduled'),(10902,1,19,157,'2020-02-22',1115,1140,'unscheduled'),(10903,1,19,157,'2020-02-22',1140,1205,'unscheduled'),(10904,1,19,157,'2020-02-22',1205,1230,'unscheduled'),(10905,1,19,157,'2020-02-22',1230,1255,'unscheduled'),(10906,1,19,157,'2020-02-22',1255,1330,'unscheduled'),(10907,1,19,157,'2020-02-22',1330,1355,'unscheduled'),(10908,1,19,157,'2020-02-22',1355,1420,'unscheduled'),(10909,1,19,157,'2020-02-22',1420,1445,'unscheduled'),(10910,1,19,157,'2020-02-22',1445,1520,'unscheduled'),(10911,1,19,157,'2020-02-22',1520,1545,'unscheduled'),(10912,1,19,157,'2020-02-22',1545,1610,'unscheduled'),(10913,1,19,157,'2020-02-22',1610,1635,'unscheduled'),(10914,1,19,157,'2020-02-22',1635,1700,'unscheduled'),(10915,1,19,157,'2020-02-22',1700,1725,'unscheduled'),(10916,1,19,157,'2020-02-22',1725,1810,'unscheduled'),(10917,1,19,157,'2020-02-23',840,925,'unscheduled'),(10918,1,19,157,'2020-02-23',925,950,'unscheduled'),(10919,1,19,157,'2020-02-23',950,1015,'unscheduled'),(10920,1,19,157,'2020-02-23',1015,1040,'unscheduled'),(10921,1,19,157,'2020-02-23',1040,1115,'unscheduled'),(10922,1,19,157,'2020-02-23',1115,1140,'unscheduled'),(10923,1,19,157,'2020-02-23',1140,1205,'unscheduled'),(10924,1,19,157,'2020-02-23',1205,1230,'unscheduled'),(10925,1,19,157,'2020-02-23',1230,1255,'unscheduled'),(10926,1,19,157,'2020-02-23',1255,1330,'unscheduled'),(10927,1,19,157,'2020-02-23',1330,1355,'unscheduled'),(10928,1,19,157,'2020-02-23',1355,1420,'unscheduled'),(10929,1,19,157,'2020-02-23',1420,1445,'unscheduled'),(10930,1,19,157,'2020-02-23',1445,1520,'unscheduled'),(10931,1,19,157,'2020-02-23',1520,1545,'unscheduled'),(10932,1,19,157,'2020-02-23',1545,1610,'unscheduled'),(10933,1,19,157,'2020-02-23',1610,1635,'unscheduled'),(10934,1,19,157,'2020-02-23',1635,1700,'unscheduled'),(10935,1,19,157,'2020-02-23',1700,1725,'unscheduled'),(10936,1,19,157,'2020-02-23',1725,1810,'unscheduled'),(10937,1,19,157,'2020-02-27',840,925,'unscheduled'),(10938,1,19,157,'2020-02-27',925,950,'unscheduled'),(10939,1,19,157,'2020-02-27',950,1015,'unscheduled'),(10940,1,19,157,'2020-02-27',1015,1040,'unscheduled'),(10941,1,19,157,'2020-02-27',1040,1115,'unscheduled'),(10942,1,19,157,'2020-02-27',1115,1140,'unscheduled'),(10943,1,19,157,'2020-02-27',1140,1205,'unscheduled'),(10944,1,19,157,'2020-02-27',1205,1230,'unscheduled'),(10945,1,19,157,'2020-02-27',1230,1255,'unscheduled'),(10946,1,19,157,'2020-02-27',1255,1330,'unscheduled'),(10947,1,19,157,'2020-02-27',1330,1355,'unscheduled'),(10948,1,19,157,'2020-02-27',1355,1420,'unscheduled'),(10949,1,19,157,'2020-02-27',1420,1445,'unscheduled'),(10950,1,19,157,'2020-02-27',1445,1520,'unscheduled'),(10951,1,19,157,'2020-02-27',1520,1545,'unscheduled'),(10952,1,19,157,'2020-02-27',1545,1610,'unscheduled'),(10953,1,19,157,'2020-02-27',1610,1635,'unscheduled'),(10954,1,19,157,'2020-02-27',1635,1700,'unscheduled'),(10955,1,19,157,'2020-02-27',1700,1725,'unscheduled'),(10956,1,19,157,'2020-02-27',1725,1810,'unscheduled'),(10957,1,19,157,'2020-02-29',840,925,'unscheduled'),(10958,1,19,157,'2020-02-29',925,950,'unscheduled'),(10959,1,19,157,'2020-02-29',950,1015,'unscheduled'),(10960,1,19,157,'2020-02-29',1015,1040,'unscheduled'),(10961,1,19,157,'2020-02-29',1040,1115,'unscheduled'),(10962,1,19,157,'2020-02-29',1115,1140,'unscheduled'),(10963,1,19,157,'2020-02-29',1140,1205,'unscheduled'),(10964,1,19,157,'2020-02-29',1205,1230,'unscheduled'),(10965,1,19,157,'2020-02-29',1230,1255,'unscheduled'),(10966,1,19,157,'2020-02-29',1255,1330,'unscheduled'),(10967,1,19,157,'2020-02-29',1330,1355,'unscheduled'),(10968,1,19,157,'2020-02-29',1355,1420,'unscheduled'),(10969,1,19,157,'2020-02-29',1420,1445,'unscheduled'),(10970,1,19,157,'2020-02-29',1445,1520,'unscheduled'),(10971,1,19,157,'2020-02-29',1520,1545,'unscheduled'),(10972,1,19,157,'2020-02-29',1545,1610,'unscheduled'),(10973,1,19,157,'2020-02-29',1610,1635,'unscheduled'),(10974,1,19,157,'2020-02-29',1635,1700,'unscheduled'),(10975,1,19,157,'2020-02-29',1700,1725,'unscheduled'),(10976,1,19,157,'2020-02-29',1725,1810,'unscheduled'),(10977,1,19,157,'2020-03-01',840,925,'unscheduled'),(10978,1,19,157,'2020-03-01',925,950,'unscheduled'),(10979,1,19,157,'2020-03-01',950,1015,'unscheduled'),(10980,1,19,157,'2020-03-01',1015,1040,'unscheduled'),(10981,1,19,157,'2020-03-01',1040,1115,'unscheduled'),(10982,1,19,157,'2020-03-01',1115,1140,'unscheduled'),(10983,1,19,157,'2020-03-01',1140,1205,'unscheduled'),(10984,1,19,157,'2020-03-01',1205,1230,'unscheduled'),(10985,1,19,157,'2020-03-01',1230,1255,'unscheduled'),(10986,1,19,157,'2020-03-01',1255,1330,'unscheduled'),(10987,1,19,157,'2020-03-01',1330,1355,'unscheduled'),(10988,1,19,157,'2020-03-01',1355,1420,'unscheduled'),(10989,1,19,157,'2020-03-01',1420,1445,'unscheduled'),(10990,1,19,157,'2020-03-01',1445,1520,'unscheduled'),(10991,1,19,157,'2020-03-01',1520,1545,'unscheduled'),(10992,1,19,157,'2020-03-01',1545,1610,'unscheduled'),(10993,1,19,157,'2020-03-01',1610,1635,'unscheduled'),(10994,1,19,157,'2020-03-01',1635,1700,'unscheduled'),(10995,1,19,157,'2020-03-01',1700,1725,'unscheduled'),(10996,1,19,157,'2020-03-01',1725,1810,'unscheduled'),(10997,1,19,157,'2020-03-05',840,925,'unscheduled'),(10998,1,19,157,'2020-03-05',925,950,'unscheduled'),(10999,1,19,157,'2020-03-05',950,1015,'unscheduled'),(11000,1,19,157,'2020-03-05',1015,1040,'unscheduled'),(11001,1,19,157,'2020-03-05',1040,1115,'unscheduled'),(11002,1,19,157,'2020-03-05',1115,1140,'unscheduled'),(11003,1,19,157,'2020-03-05',1140,1205,'unscheduled'),(11004,1,19,157,'2020-03-05',1205,1230,'unscheduled'),(11005,1,19,157,'2020-03-05',1230,1255,'unscheduled'),(11006,1,19,157,'2020-03-05',1255,1330,'unscheduled'),(11007,1,19,157,'2020-03-05',1330,1355,'unscheduled'),(11008,1,19,157,'2020-03-05',1355,1420,'unscheduled'),(11009,1,19,157,'2020-03-05',1420,1445,'unscheduled'),(11010,1,19,157,'2020-03-05',1445,1520,'unscheduled'),(11011,1,19,157,'2020-03-05',1520,1545,'unscheduled'),(11012,1,19,157,'2020-03-05',1545,1610,'unscheduled'),(11013,1,19,157,'2020-03-05',1610,1635,'unscheduled'),(11014,1,19,157,'2020-03-05',1635,1700,'unscheduled'),(11015,1,19,157,'2020-03-05',1700,1725,'unscheduled'),(11016,1,19,157,'2020-03-05',1725,1810,'unscheduled'),(11017,1,19,157,'2020-03-07',840,925,'unscheduled'),(11018,1,19,157,'2020-03-07',925,950,'unscheduled'),(11019,1,19,157,'2020-03-07',950,1015,'unscheduled'),(11020,1,19,157,'2020-03-07',1015,1040,'unscheduled'),(11021,1,19,157,'2020-03-07',1040,1115,'unscheduled'),(11022,1,19,157,'2020-03-07',1115,1140,'unscheduled'),(11023,1,19,157,'2020-03-07',1140,1205,'unscheduled'),(11024,1,19,157,'2020-03-07',1205,1230,'unscheduled'),(11025,1,19,157,'2020-03-07',1230,1255,'unscheduled'),(11026,1,19,157,'2020-03-07',1255,1330,'unscheduled'),(11027,1,19,157,'2020-03-07',1330,1355,'unscheduled'),(11028,1,19,157,'2020-03-07',1355,1420,'unscheduled'),(11029,1,19,157,'2020-03-07',1420,1445,'unscheduled'),(11030,1,19,157,'2020-03-07',1445,1520,'unscheduled'),(11031,1,19,157,'2020-03-07',1520,1545,'unscheduled'),(11032,1,19,157,'2020-03-07',1545,1610,'unscheduled'),(11033,1,19,157,'2020-03-07',1610,1635,'unscheduled'),(11034,1,19,157,'2020-03-07',1635,1700,'unscheduled'),(11035,1,19,157,'2020-03-07',1700,1725,'unscheduled'),(11036,1,19,157,'2020-03-07',1725,1810,'unscheduled'),(11037,1,19,157,'2020-03-08',840,925,'unscheduled'),(11038,1,19,157,'2020-03-08',925,950,'unscheduled'),(11039,1,19,157,'2020-03-08',950,1015,'unscheduled'),(11040,1,19,157,'2020-03-08',1015,1040,'unscheduled'),(11041,1,19,157,'2020-03-08',1040,1115,'unscheduled'),(11042,1,19,157,'2020-03-08',1115,1140,'unscheduled'),(11043,1,19,157,'2020-03-08',1140,1205,'unscheduled'),(11044,1,19,157,'2020-03-08',1205,1230,'unscheduled'),(11045,1,19,157,'2020-03-08',1230,1255,'unscheduled'),(11046,1,19,157,'2020-03-08',1255,1330,'unscheduled'),(11047,1,19,157,'2020-03-08',1330,1355,'unscheduled'),(11048,1,19,157,'2020-03-08',1355,1420,'unscheduled'),(11049,1,19,157,'2020-03-08',1420,1445,'unscheduled'),(11050,1,19,157,'2020-03-08',1445,1520,'unscheduled'),(11051,1,19,157,'2020-03-08',1520,1545,'unscheduled'),(11052,1,19,157,'2020-03-08',1545,1610,'unscheduled'),(11053,1,19,157,'2020-03-08',1610,1635,'unscheduled'),(11054,1,19,157,'2020-03-08',1635,1700,'unscheduled'),(11055,1,19,157,'2020-03-08',1700,1725,'unscheduled'),(11056,1,19,157,'2020-03-08',1725,1810,'unscheduled'),(11057,1,19,157,'2020-03-12',840,925,'unscheduled'),(11058,1,19,157,'2020-03-12',925,950,'unscheduled'),(11059,1,19,157,'2020-03-12',950,1015,'unscheduled'),(11060,1,19,157,'2020-03-12',1015,1040,'unscheduled'),(11061,1,19,157,'2020-03-12',1040,1115,'unscheduled'),(11062,1,19,157,'2020-03-12',1115,1140,'unscheduled'),(11063,1,19,157,'2020-03-12',1140,1205,'unscheduled'),(11064,1,19,157,'2020-03-12',1205,1230,'unscheduled'),(11065,1,19,157,'2020-03-12',1230,1255,'unscheduled'),(11066,1,19,157,'2020-03-12',1255,1330,'unscheduled'),(11067,1,19,157,'2020-03-12',1330,1355,'unscheduled'),(11068,1,19,157,'2020-03-12',1355,1420,'unscheduled'),(11069,1,19,157,'2020-03-12',1420,1445,'unscheduled'),(11070,1,19,157,'2020-03-12',1445,1520,'unscheduled'),(11071,1,19,157,'2020-03-12',1520,1545,'unscheduled'),(11072,1,19,157,'2020-03-12',1545,1610,'unscheduled'),(11073,1,19,157,'2020-03-12',1610,1635,'unscheduled'),(11074,1,19,157,'2020-03-12',1635,1700,'unscheduled'),(11075,1,19,157,'2020-03-12',1700,1725,'unscheduled'),(11076,1,19,157,'2020-03-12',1725,1810,'unscheduled'),(11077,1,19,157,'2020-03-14',840,925,'unscheduled'),(11078,1,19,157,'2020-03-14',925,950,'unscheduled'),(11079,1,19,157,'2020-03-14',950,1015,'unscheduled'),(11080,1,19,157,'2020-03-14',1015,1040,'unscheduled'),(11081,1,19,157,'2020-03-14',1040,1115,'unscheduled'),(11082,1,19,157,'2020-03-14',1115,1140,'unscheduled'),(11083,1,19,157,'2020-03-14',1140,1205,'unscheduled'),(11084,1,19,157,'2020-03-14',1205,1230,'unscheduled'),(11085,1,19,157,'2020-03-14',1230,1255,'unscheduled'),(11086,1,19,157,'2020-03-14',1255,1330,'unscheduled'),(11087,1,19,157,'2020-03-14',1330,1355,'unscheduled'),(11088,1,19,157,'2020-03-14',1355,1420,'unscheduled'),(11089,1,19,157,'2020-03-14',1420,1445,'unscheduled'),(11090,1,19,157,'2020-03-14',1445,1520,'unscheduled'),(11091,1,19,157,'2020-03-14',1520,1545,'unscheduled'),(11092,1,19,157,'2020-03-14',1545,1610,'unscheduled'),(11093,1,19,157,'2020-03-14',1610,1635,'unscheduled'),(11094,1,19,157,'2020-03-14',1635,1700,'unscheduled'),(11095,1,19,157,'2020-03-14',1700,1725,'unscheduled'),(11096,1,19,157,'2020-03-14',1725,1810,'unscheduled'),(11097,1,19,157,'2020-03-15',840,925,'unscheduled'),(11098,1,19,157,'2020-03-15',925,950,'unscheduled'),(11099,1,19,157,'2020-03-15',950,1015,'unscheduled'),(11100,1,19,157,'2020-03-15',1015,1040,'unscheduled'),(11101,1,19,157,'2020-03-15',1040,1115,'unscheduled'),(11102,1,19,157,'2020-03-15',1115,1140,'unscheduled'),(11103,1,19,157,'2020-03-15',1140,1205,'unscheduled'),(11104,1,19,157,'2020-03-15',1205,1230,'unscheduled'),(11105,1,19,157,'2020-03-15',1230,1255,'unscheduled'),(11106,1,19,157,'2020-03-15',1255,1330,'unscheduled'),(11107,1,19,157,'2020-03-15',1330,1355,'unscheduled'),(11108,1,19,157,'2020-03-15',1355,1420,'unscheduled'),(11109,1,19,157,'2020-03-15',1420,1445,'unscheduled'),(11110,1,19,157,'2020-03-15',1445,1520,'unscheduled'),(11111,1,19,157,'2020-03-15',1520,1545,'unscheduled'),(11112,1,19,157,'2020-03-15',1545,1610,'unscheduled'),(11113,1,19,157,'2020-03-15',1610,1635,'unscheduled'),(11114,1,19,157,'2020-03-15',1635,1700,'unscheduled'),(11115,1,19,157,'2020-03-15',1700,1725,'unscheduled'),(11116,1,19,157,'2020-03-15',1725,1810,'unscheduled'),(11117,1,19,157,'2020-03-19',840,925,'unscheduled'),(11118,1,19,157,'2020-03-19',925,950,'unscheduled'),(11119,1,19,157,'2020-03-19',950,1015,'unscheduled'),(11120,1,19,157,'2020-03-19',1015,1040,'unscheduled'),(11121,1,19,157,'2020-03-19',1040,1115,'unscheduled'),(11122,1,19,157,'2020-03-19',1115,1140,'unscheduled'),(11123,1,19,157,'2020-03-19',1140,1205,'unscheduled'),(11124,1,19,157,'2020-03-19',1205,1230,'unscheduled'),(11125,1,19,157,'2020-03-19',1230,1255,'unscheduled'),(11126,1,19,157,'2020-03-19',1255,1330,'unscheduled'),(11127,1,19,157,'2020-03-19',1330,1355,'unscheduled'),(11128,1,19,157,'2020-03-19',1355,1420,'unscheduled'),(11129,1,19,157,'2020-03-19',1420,1445,'unscheduled'),(11130,1,19,157,'2020-03-19',1445,1520,'unscheduled'),(11131,1,19,157,'2020-03-19',1520,1545,'unscheduled'),(11132,1,19,157,'2020-03-19',1545,1610,'unscheduled'),(11133,1,19,157,'2020-03-19',1610,1635,'unscheduled'),(11134,1,19,157,'2020-03-19',1635,1700,'unscheduled'),(11135,1,19,157,'2020-03-19',1700,1725,'unscheduled'),(11136,1,19,157,'2020-03-19',1725,1810,'unscheduled'),(11137,1,19,157,'2020-03-21',840,925,'unscheduled'),(11138,1,19,157,'2020-03-21',925,950,'unscheduled'),(11139,1,19,157,'2020-03-21',950,1015,'unscheduled'),(11140,1,19,157,'2020-03-21',1015,1040,'unscheduled'),(11141,1,19,157,'2020-03-21',1040,1115,'unscheduled'),(11142,1,19,157,'2020-03-21',1115,1140,'unscheduled'),(11143,1,19,157,'2020-03-21',1140,1205,'unscheduled'),(11144,1,19,157,'2020-03-21',1205,1230,'unscheduled'),(11145,1,19,157,'2020-03-21',1230,1255,'unscheduled'),(11146,1,19,157,'2020-03-21',1255,1330,'unscheduled'),(11147,1,19,157,'2020-03-21',1330,1355,'unscheduled'),(11148,1,19,157,'2020-03-21',1355,1420,'unscheduled'),(11149,1,19,157,'2020-03-21',1420,1445,'unscheduled'),(11150,1,19,157,'2020-03-21',1445,1520,'unscheduled'),(11151,1,19,157,'2020-03-21',1520,1545,'unscheduled'),(11152,1,19,157,'2020-03-21',1545,1610,'unscheduled'),(11153,1,19,157,'2020-03-21',1610,1635,'unscheduled'),(11154,1,19,157,'2020-03-21',1635,1700,'unscheduled'),(11155,1,19,157,'2020-03-21',1700,1725,'unscheduled'),(11156,1,19,157,'2020-03-21',1725,1810,'unscheduled'),(11157,1,19,157,'2020-03-22',840,925,'unscheduled'),(11158,1,19,157,'2020-03-22',925,950,'unscheduled'),(11159,1,19,157,'2020-03-22',950,1015,'unscheduled'),(11160,1,19,157,'2020-03-22',1015,1040,'unscheduled'),(11161,1,19,157,'2020-03-22',1040,1115,'unscheduled'),(11162,1,19,157,'2020-03-22',1115,1140,'unscheduled'),(11163,1,19,157,'2020-03-22',1140,1205,'unscheduled'),(11164,1,19,157,'2020-03-22',1205,1230,'unscheduled'),(11165,1,19,157,'2020-03-22',1230,1255,'unscheduled'),(11166,1,19,157,'2020-03-22',1255,1330,'unscheduled'),(11167,1,19,157,'2020-03-22',1330,1355,'unscheduled'),(11168,1,19,157,'2020-03-22',1355,1420,'unscheduled'),(11169,1,19,157,'2020-03-22',1420,1445,'unscheduled'),(11170,1,19,157,'2020-03-22',1445,1520,'unscheduled'),(11171,1,19,157,'2020-03-22',1520,1545,'unscheduled'),(11172,1,19,157,'2020-03-22',1545,1610,'unscheduled'),(11173,1,19,157,'2020-03-22',1610,1635,'unscheduled'),(11174,1,19,157,'2020-03-22',1635,1700,'unscheduled'),(11175,1,19,157,'2020-03-22',1700,1725,'unscheduled'),(11176,1,19,157,'2020-03-22',1725,1810,'unscheduled'),(11177,1,19,157,'2020-03-26',840,925,'unscheduled'),(11178,1,19,157,'2020-03-26',925,950,'unscheduled'),(11179,1,19,157,'2020-03-26',950,1015,'unscheduled'),(11180,1,19,157,'2020-03-26',1015,1040,'unscheduled'),(11181,1,19,157,'2020-03-26',1040,1115,'unscheduled'),(11182,1,19,157,'2020-03-26',1115,1140,'unscheduled'),(11183,1,19,157,'2020-03-26',1140,1205,'unscheduled'),(11184,1,19,157,'2020-03-26',1205,1230,'unscheduled'),(11185,1,19,157,'2020-03-26',1230,1255,'unscheduled'),(11186,1,19,157,'2020-03-26',1255,1330,'unscheduled'),(11187,1,19,157,'2020-03-26',1330,1355,'unscheduled'),(11188,1,19,157,'2020-03-26',1355,1420,'unscheduled'),(11189,1,19,157,'2020-03-26',1420,1445,'unscheduled'),(11190,1,19,157,'2020-03-26',1445,1520,'unscheduled'),(11191,1,19,157,'2020-03-26',1520,1545,'unscheduled'),(11192,1,19,157,'2020-03-26',1545,1610,'unscheduled'),(11193,1,19,157,'2020-03-26',1610,1635,'unscheduled'),(11194,1,19,157,'2020-03-26',1635,1700,'unscheduled'),(11195,1,19,157,'2020-03-26',1700,1725,'unscheduled'),(11196,1,19,157,'2020-03-26',1725,1810,'unscheduled'),(11197,1,19,157,'2020-03-28',840,925,'unscheduled'),(11198,1,19,157,'2020-03-28',925,950,'unscheduled'),(11199,1,19,157,'2020-03-28',950,1015,'unscheduled'),(11200,1,19,157,'2020-03-28',1015,1040,'unscheduled'),(11201,1,19,157,'2020-03-28',1040,1115,'unscheduled'),(11202,1,19,157,'2020-03-28',1115,1140,'unscheduled'),(11203,1,19,157,'2020-03-28',1140,1205,'unscheduled'),(11204,1,19,157,'2020-03-28',1205,1230,'unscheduled'),(11205,1,19,157,'2020-03-28',1230,1255,'unscheduled'),(11206,1,19,157,'2020-03-28',1255,1330,'unscheduled'),(11207,1,19,157,'2020-03-28',1330,1355,'unscheduled'),(11208,1,19,157,'2020-03-28',1355,1420,'unscheduled'),(11209,1,19,157,'2020-03-28',1420,1445,'unscheduled'),(11210,1,19,157,'2020-03-28',1445,1520,'unscheduled'),(11211,1,19,157,'2020-03-28',1520,1545,'unscheduled'),(11212,1,19,157,'2020-03-28',1545,1610,'unscheduled'),(11213,1,19,157,'2020-03-28',1610,1635,'unscheduled'),(11214,1,19,157,'2020-03-28',1635,1700,'unscheduled'),(11215,1,19,157,'2020-03-28',1700,1725,'unscheduled'),(11216,1,19,157,'2020-03-28',1725,1810,'unscheduled'),(11217,1,19,157,'2020-03-29',840,925,'unscheduled'),(11218,1,19,157,'2020-03-29',925,950,'unscheduled'),(11219,1,19,157,'2020-03-29',950,1015,'unscheduled'),(11220,1,19,157,'2020-03-29',1015,1040,'unscheduled'),(11221,1,19,157,'2020-03-29',1040,1115,'unscheduled'),(11222,1,19,157,'2020-03-29',1115,1140,'unscheduled'),(11223,1,19,157,'2020-03-29',1140,1205,'unscheduled'),(11224,1,19,157,'2020-03-29',1205,1230,'unscheduled'),(11225,1,19,157,'2020-03-29',1230,1255,'unscheduled'),(11226,1,19,157,'2020-03-29',1255,1330,'unscheduled'),(11227,1,19,157,'2020-03-29',1330,1355,'unscheduled'),(11228,1,19,157,'2020-03-29',1355,1420,'unscheduled'),(11229,1,19,157,'2020-03-29',1420,1445,'unscheduled'),(11230,1,19,157,'2020-03-29',1445,1520,'unscheduled'),(11231,1,19,157,'2020-03-29',1520,1545,'unscheduled'),(11232,1,19,157,'2020-03-29',1545,1610,'unscheduled'),(11233,1,19,157,'2020-03-29',1610,1635,'unscheduled'),(11234,1,19,157,'2020-03-29',1635,1700,'unscheduled'),(11235,1,19,157,'2020-03-29',1700,1725,'unscheduled'),(11236,1,19,157,'2020-03-29',1725,1810,'unscheduled'),(11237,1,19,157,'2020-04-02',840,925,'unscheduled'),(11238,1,19,157,'2020-04-02',925,950,'unscheduled'),(11239,1,19,157,'2020-04-02',950,1015,'unscheduled'),(11240,1,19,157,'2020-04-02',1015,1040,'unscheduled'),(11241,1,19,157,'2020-04-02',1040,1115,'unscheduled'),(11242,1,19,157,'2020-04-02',1115,1140,'unscheduled'),(11243,1,19,157,'2020-04-02',1140,1205,'unscheduled'),(11244,1,19,157,'2020-04-02',1205,1230,'unscheduled'),(11245,1,19,157,'2020-04-02',1230,1255,'unscheduled'),(11246,1,19,157,'2020-04-02',1255,1330,'unscheduled'),(11247,1,19,157,'2020-04-02',1330,1355,'unscheduled'),(11248,1,19,157,'2020-04-02',1355,1420,'unscheduled'),(11249,1,19,157,'2020-04-02',1420,1445,'unscheduled'),(11250,1,19,157,'2020-04-02',1445,1520,'unscheduled'),(11251,1,19,157,'2020-04-02',1520,1545,'unscheduled'),(11252,1,19,157,'2020-04-02',1545,1610,'unscheduled'),(11253,1,19,157,'2020-04-02',1610,1635,'unscheduled'),(11254,1,19,157,'2020-04-02',1635,1700,'unscheduled'),(11255,1,19,157,'2020-04-02',1700,1725,'unscheduled'),(11256,1,19,157,'2020-04-02',1725,1810,'unscheduled'),(11257,1,19,157,'2020-04-04',840,925,'unscheduled'),(11258,1,19,157,'2020-04-04',925,950,'unscheduled'),(11259,1,19,157,'2020-04-04',950,1015,'unscheduled'),(11260,1,19,157,'2020-04-04',1015,1040,'unscheduled'),(11261,1,19,157,'2020-04-04',1040,1115,'unscheduled'),(11262,1,19,157,'2020-04-04',1115,1140,'unscheduled'),(11263,1,19,157,'2020-04-04',1140,1205,'unscheduled'),(11264,1,19,157,'2020-04-04',1205,1230,'unscheduled'),(11265,1,19,157,'2020-04-04',1230,1255,'unscheduled'),(11266,1,19,157,'2020-04-04',1255,1330,'unscheduled'),(11267,1,19,157,'2020-04-04',1330,1355,'unscheduled'),(11268,1,19,157,'2020-04-04',1355,1420,'unscheduled'),(11269,1,19,157,'2020-04-04',1420,1445,'unscheduled'),(11270,1,19,157,'2020-04-04',1445,1520,'unscheduled'),(11271,1,19,157,'2020-04-04',1520,1545,'unscheduled'),(11272,1,19,157,'2020-04-04',1545,1610,'unscheduled'),(11273,1,19,157,'2020-04-04',1610,1635,'unscheduled'),(11274,1,19,157,'2020-04-04',1635,1700,'unscheduled'),(11275,1,19,157,'2020-04-04',1700,1725,'unscheduled'),(11276,1,19,157,'2020-04-04',1725,1810,'unscheduled'),(11277,1,19,157,'2020-04-05',840,925,'unscheduled'),(11278,1,19,157,'2020-04-05',925,950,'unscheduled'),(11279,1,19,157,'2020-04-05',950,1015,'unscheduled'),(11280,1,19,157,'2020-04-05',1015,1040,'unscheduled'),(11281,1,19,157,'2020-04-05',1040,1115,'unscheduled'),(11282,1,19,157,'2020-04-05',1115,1140,'unscheduled'),(11283,1,19,157,'2020-04-05',1140,1205,'unscheduled'),(11284,1,19,157,'2020-04-05',1205,1230,'unscheduled'),(11285,1,19,157,'2020-04-05',1230,1255,'unscheduled'),(11286,1,19,157,'2020-04-05',1255,1330,'unscheduled'),(11287,1,19,157,'2020-04-05',1330,1355,'unscheduled'),(11288,1,19,157,'2020-04-05',1355,1420,'unscheduled'),(11289,1,19,157,'2020-04-05',1420,1445,'unscheduled'),(11290,1,19,157,'2020-04-05',1445,1520,'unscheduled'),(11291,1,19,157,'2020-04-05',1520,1545,'unscheduled'),(11292,1,19,157,'2020-04-05',1545,1610,'unscheduled'),(11293,1,19,157,'2020-04-05',1610,1635,'unscheduled'),(11294,1,19,157,'2020-04-05',1635,1700,'unscheduled'),(11295,1,19,157,'2020-04-05',1700,1725,'unscheduled'),(11296,1,19,157,'2020-04-05',1725,1810,'unscheduled'),(11297,1,19,157,'2020-04-09',840,925,'unscheduled'),(11298,1,19,157,'2020-04-09',925,950,'unscheduled'),(11299,1,19,157,'2020-04-09',950,1015,'unscheduled'),(11300,1,19,157,'2020-04-09',1015,1040,'unscheduled'),(11301,1,19,157,'2020-04-09',1040,1115,'unscheduled'),(11302,1,19,157,'2020-04-09',1115,1140,'unscheduled'),(11303,1,19,157,'2020-04-09',1140,1205,'unscheduled'),(11304,1,19,157,'2020-04-09',1205,1230,'unscheduled'),(11305,1,19,157,'2020-04-09',1230,1255,'unscheduled'),(11306,1,19,157,'2020-04-09',1255,1330,'unscheduled'),(11307,1,19,157,'2020-04-09',1330,1355,'unscheduled'),(11308,1,19,157,'2020-04-09',1355,1420,'unscheduled'),(11309,1,19,157,'2020-04-09',1420,1445,'unscheduled'),(11310,1,19,157,'2020-04-09',1445,1520,'unscheduled'),(11311,1,19,157,'2020-04-09',1520,1545,'unscheduled'),(11312,1,19,157,'2020-04-09',1545,1610,'unscheduled'),(11313,1,19,157,'2020-04-09',1610,1635,'unscheduled'),(11314,1,19,157,'2020-04-09',1635,1700,'unscheduled'),(11315,1,19,157,'2020-04-09',1700,1725,'unscheduled'),(11316,1,19,157,'2020-04-09',1725,1810,'unscheduled'),(11317,1,19,157,'2020-04-11',840,925,'unscheduled'),(11318,1,19,157,'2020-04-11',925,950,'unscheduled'),(11319,1,19,157,'2020-04-11',950,1015,'unscheduled'),(11320,1,19,157,'2020-04-11',1015,1040,'unscheduled'),(11321,1,19,157,'2020-04-11',1040,1115,'unscheduled'),(11322,1,19,157,'2020-04-11',1115,1140,'unscheduled'),(11323,1,19,157,'2020-04-11',1140,1205,'unscheduled'),(11324,1,19,157,'2020-04-11',1205,1230,'unscheduled'),(11325,1,19,157,'2020-04-11',1230,1255,'unscheduled'),(11326,1,19,157,'2020-04-11',1255,1330,'unscheduled'),(11327,1,19,157,'2020-04-11',1330,1355,'unscheduled'),(11328,1,19,157,'2020-04-11',1355,1420,'unscheduled'),(11329,1,19,157,'2020-04-11',1420,1445,'unscheduled'),(11330,1,19,157,'2020-04-11',1445,1520,'unscheduled'),(11331,1,19,157,'2020-04-11',1520,1545,'unscheduled'),(11332,1,19,157,'2020-04-11',1545,1610,'unscheduled'),(11333,1,19,157,'2020-04-11',1610,1635,'unscheduled'),(11334,1,19,157,'2020-04-11',1635,1700,'unscheduled'),(11335,1,19,157,'2020-04-11',1700,1725,'unscheduled'),(11336,1,19,157,'2020-04-11',1725,1810,'unscheduled'),(11337,1,19,157,'2020-04-12',840,925,'unscheduled'),(11338,1,19,157,'2020-04-12',925,950,'unscheduled'),(11339,1,19,157,'2020-04-12',950,1015,'unscheduled'),(11340,1,19,157,'2020-04-12',1015,1040,'unscheduled'),(11341,1,19,157,'2020-04-12',1040,1115,'unscheduled'),(11342,1,19,157,'2020-04-12',1115,1140,'unscheduled'),(11343,1,19,157,'2020-04-12',1140,1205,'unscheduled'),(11344,1,19,157,'2020-04-12',1205,1230,'unscheduled'),(11345,1,19,157,'2020-04-12',1230,1255,'unscheduled'),(11346,1,19,157,'2020-04-12',1255,1330,'unscheduled'),(11347,1,19,157,'2020-04-12',1330,1355,'unscheduled'),(11348,1,19,157,'2020-04-12',1355,1420,'unscheduled'),(11349,1,19,157,'2020-04-12',1420,1445,'unscheduled'),(11350,1,19,157,'2020-04-12',1445,1520,'unscheduled'),(11351,1,19,157,'2020-04-12',1520,1545,'unscheduled'),(11352,1,19,157,'2020-04-12',1545,1610,'unscheduled'),(11353,1,19,157,'2020-04-12',1610,1635,'unscheduled'),(11354,1,19,157,'2020-04-12',1635,1700,'unscheduled'),(11355,1,19,157,'2020-04-12',1700,1725,'unscheduled'),(11356,1,19,157,'2020-04-12',1725,1810,'unscheduled'),(11357,1,19,157,'2020-04-16',840,925,'unscheduled'),(11358,1,19,157,'2020-04-16',925,950,'unscheduled'),(11359,1,19,157,'2020-04-16',950,1015,'unscheduled'),(11360,1,19,157,'2020-04-16',1015,1040,'unscheduled'),(11361,1,19,157,'2020-04-16',1040,1115,'unscheduled'),(11362,1,19,157,'2020-04-16',1115,1140,'unscheduled'),(11363,1,19,157,'2020-04-16',1140,1205,'unscheduled'),(11364,1,19,157,'2020-04-16',1205,1230,'unscheduled'),(11365,1,19,157,'2020-04-16',1230,1255,'unscheduled'),(11366,1,19,157,'2020-04-16',1255,1330,'unscheduled'),(11367,1,19,157,'2020-04-16',1330,1355,'unscheduled'),(11368,1,19,157,'2020-04-16',1355,1420,'unscheduled'),(11369,1,19,157,'2020-04-16',1420,1445,'unscheduled'),(11370,1,19,157,'2020-04-16',1445,1520,'unscheduled'),(11371,1,19,157,'2020-04-16',1520,1545,'unscheduled'),(11372,1,19,157,'2020-04-16',1545,1610,'unscheduled'),(11373,1,19,157,'2020-04-16',1610,1635,'unscheduled'),(11374,1,19,157,'2020-04-16',1635,1700,'unscheduled'),(11375,1,19,157,'2020-04-16',1700,1725,'unscheduled'),(11376,1,19,157,'2020-04-16',1725,1810,'unscheduled'),(11377,1,19,157,'2020-04-18',840,925,'unscheduled'),(11378,1,19,157,'2020-04-18',925,950,'unscheduled'),(11379,1,19,157,'2020-04-18',950,1015,'unscheduled'),(11380,1,19,157,'2020-04-18',1015,1040,'unscheduled'),(11381,1,19,157,'2020-04-18',1040,1115,'unscheduled'),(11382,1,19,157,'2020-04-18',1115,1140,'unscheduled'),(11383,1,19,157,'2020-04-18',1140,1205,'unscheduled'),(11384,1,19,157,'2020-04-18',1205,1230,'unscheduled'),(11385,1,19,157,'2020-04-18',1230,1255,'unscheduled'),(11386,1,19,157,'2020-04-18',1255,1330,'unscheduled'),(11387,1,19,157,'2020-04-18',1330,1355,'unscheduled'),(11388,1,19,157,'2020-04-18',1355,1420,'unscheduled'),(11389,1,19,157,'2020-04-18',1420,1445,'unscheduled'),(11390,1,19,157,'2020-04-18',1445,1520,'unscheduled'),(11391,1,19,157,'2020-04-18',1520,1545,'unscheduled'),(11392,1,19,157,'2020-04-18',1545,1610,'unscheduled'),(11393,1,19,157,'2020-04-18',1610,1635,'unscheduled'),(11394,1,19,157,'2020-04-18',1635,1700,'unscheduled'),(11395,1,19,157,'2020-04-18',1700,1725,'unscheduled'),(11396,1,19,157,'2020-04-18',1725,1810,'unscheduled'),(11397,1,19,157,'2020-04-19',840,925,'unscheduled'),(11398,1,19,157,'2020-04-19',925,950,'unscheduled'),(11399,1,19,157,'2020-04-19',950,1015,'unscheduled'),(11400,1,19,157,'2020-04-19',1015,1040,'unscheduled'),(11401,1,19,157,'2020-04-19',1040,1115,'unscheduled'),(11402,1,19,157,'2020-04-19',1115,1140,'unscheduled'),(11403,1,19,157,'2020-04-19',1140,1205,'unscheduled'),(11404,1,19,157,'2020-04-19',1205,1230,'unscheduled'),(11405,1,19,157,'2020-04-19',1230,1255,'unscheduled'),(11406,1,19,157,'2020-04-19',1255,1330,'unscheduled'),(11407,1,19,157,'2020-04-19',1330,1355,'unscheduled'),(11408,1,19,157,'2020-04-19',1355,1420,'unscheduled'),(11409,1,19,157,'2020-04-19',1420,1445,'unscheduled'),(11410,1,19,157,'2020-04-19',1445,1520,'unscheduled'),(11411,1,19,157,'2020-04-19',1520,1545,'unscheduled'),(11412,1,19,157,'2020-04-19',1545,1610,'unscheduled'),(11413,1,19,157,'2020-04-19',1610,1635,'unscheduled'),(11414,1,19,157,'2020-04-19',1635,1700,'unscheduled'),(11415,1,19,157,'2020-04-19',1700,1725,'unscheduled'),(11416,1,19,157,'2020-04-19',1725,1810,'unscheduled'),(11417,1,19,157,'2020-04-23',840,925,'unscheduled'),(11418,1,19,157,'2020-04-23',925,950,'unscheduled'),(11419,1,19,157,'2020-04-23',950,1015,'unscheduled'),(11420,1,19,157,'2020-04-23',1015,1040,'unscheduled'),(11421,1,19,157,'2020-04-23',1040,1115,'unscheduled'),(11422,1,19,157,'2020-04-23',1115,1140,'unscheduled'),(11423,1,19,157,'2020-04-23',1140,1205,'unscheduled'),(11424,1,19,157,'2020-04-23',1205,1230,'unscheduled'),(11425,1,19,157,'2020-04-23',1230,1255,'unscheduled'),(11426,1,19,157,'2020-04-23',1255,1330,'unscheduled'),(11427,1,19,157,'2020-04-23',1330,1355,'unscheduled'),(11428,1,19,157,'2020-04-23',1355,1420,'unscheduled'),(11429,1,19,157,'2020-04-23',1420,1445,'unscheduled'),(11430,1,19,157,'2020-04-23',1445,1520,'unscheduled'),(11431,1,19,157,'2020-04-23',1520,1545,'unscheduled'),(11432,1,19,157,'2020-04-23',1545,1610,'unscheduled'),(11433,1,19,157,'2020-04-23',1610,1635,'unscheduled'),(11434,1,19,157,'2020-04-23',1635,1700,'unscheduled'),(11435,1,19,157,'2020-04-23',1700,1725,'unscheduled'),(11436,1,19,157,'2020-04-23',1725,1810,'unscheduled'),(11437,1,19,157,'2020-04-25',840,925,'unscheduled'),(11438,1,19,157,'2020-04-25',925,950,'unscheduled'),(11439,1,19,157,'2020-04-25',950,1015,'unscheduled'),(11440,1,19,157,'2020-04-25',1015,1040,'unscheduled'),(11441,1,19,157,'2020-04-25',1040,1115,'unscheduled'),(11442,1,19,157,'2020-04-25',1115,1140,'unscheduled'),(11443,1,19,157,'2020-04-25',1140,1205,'unscheduled'),(11444,1,19,157,'2020-04-25',1205,1230,'unscheduled'),(11445,1,19,157,'2020-04-25',1230,1255,'unscheduled'),(11446,1,19,157,'2020-04-25',1255,1330,'unscheduled'),(11447,1,19,157,'2020-04-25',1330,1355,'unscheduled'),(11448,1,19,157,'2020-04-25',1355,1420,'unscheduled'),(11449,1,19,157,'2020-04-25',1420,1445,'unscheduled'),(11450,1,19,157,'2020-04-25',1445,1520,'unscheduled'),(11451,1,19,157,'2020-04-25',1520,1545,'unscheduled'),(11452,1,19,157,'2020-04-25',1545,1610,'unscheduled'),(11453,1,19,157,'2020-04-25',1610,1635,'unscheduled'),(11454,1,19,157,'2020-04-25',1635,1700,'unscheduled'),(11455,1,19,157,'2020-04-25',1700,1725,'unscheduled'),(11456,1,19,157,'2020-04-25',1725,1810,'unscheduled'),(11457,1,19,157,'2020-04-26',840,925,'unscheduled'),(11458,1,19,157,'2020-04-26',925,950,'unscheduled'),(11459,1,19,157,'2020-04-26',950,1015,'unscheduled'),(11460,1,19,157,'2020-04-26',1015,1040,'unscheduled'),(11461,1,19,157,'2020-04-26',1040,1115,'unscheduled'),(11462,1,19,157,'2020-04-26',1115,1140,'unscheduled'),(11463,1,19,157,'2020-04-26',1140,1205,'unscheduled'),(11464,1,19,157,'2020-04-26',1205,1230,'unscheduled'),(11465,1,19,157,'2020-04-26',1230,1255,'unscheduled'),(11466,1,19,157,'2020-04-26',1255,1330,'unscheduled'),(11467,1,19,157,'2020-04-26',1330,1355,'unscheduled'),(11468,1,19,157,'2020-04-26',1355,1420,'unscheduled'),(11469,1,19,157,'2020-04-26',1420,1445,'unscheduled'),(11470,1,19,157,'2020-04-26',1445,1520,'unscheduled'),(11471,1,19,157,'2020-04-26',1520,1545,'unscheduled'),(11472,1,19,157,'2020-04-26',1545,1610,'unscheduled'),(11473,1,19,157,'2020-04-26',1610,1635,'unscheduled'),(11474,1,19,157,'2020-04-26',1635,1700,'unscheduled'),(11475,1,19,157,'2020-04-26',1700,1725,'unscheduled'),(11476,1,19,157,'2020-04-26',1725,1810,'unscheduled'),(11477,1,19,157,'2020-04-30',840,925,'unscheduled'),(11478,1,19,157,'2020-04-30',925,950,'unscheduled'),(11479,1,19,157,'2020-04-30',950,1015,'unscheduled'),(11480,1,19,157,'2020-04-30',1015,1040,'unscheduled'),(11481,1,19,157,'2020-04-30',1040,1115,'unscheduled'),(11482,1,19,157,'2020-04-30',1115,1140,'unscheduled'),(11483,1,19,157,'2020-04-30',1140,1205,'unscheduled'),(11484,1,19,157,'2020-04-30',1205,1230,'unscheduled'),(11485,1,19,157,'2020-04-30',1230,1255,'unscheduled'),(11486,1,19,157,'2020-04-30',1255,1330,'unscheduled'),(11487,1,19,157,'2020-04-30',1330,1355,'unscheduled'),(11488,1,19,157,'2020-04-30',1355,1420,'unscheduled'),(11489,1,19,157,'2020-04-30',1420,1445,'unscheduled'),(11490,1,19,157,'2020-04-30',1445,1520,'unscheduled'),(11491,1,19,157,'2020-04-30',1520,1545,'unscheduled'),(11492,1,19,157,'2020-04-30',1545,1610,'unscheduled'),(11493,1,19,157,'2020-04-30',1610,1635,'unscheduled'),(11494,1,19,157,'2020-04-30',1635,1700,'unscheduled'),(11495,1,19,157,'2020-04-30',1700,1725,'unscheduled'),(11496,1,19,157,'2020-04-30',1725,1810,'unscheduled'),(11497,1,19,157,'2020-05-02',840,925,'unscheduled'),(11498,1,19,157,'2020-05-02',925,950,'unscheduled'),(11499,1,19,157,'2020-05-02',950,1015,'unscheduled'),(11500,1,19,157,'2020-05-02',1015,1040,'unscheduled'),(11501,1,19,157,'2020-05-02',1040,1115,'unscheduled'),(11502,1,19,157,'2020-05-02',1115,1140,'unscheduled'),(11503,1,19,157,'2020-05-02',1140,1205,'unscheduled'),(11504,1,19,157,'2020-05-02',1205,1230,'unscheduled'),(11505,1,19,157,'2020-05-02',1230,1255,'unscheduled'),(11506,1,19,157,'2020-05-02',1255,1330,'unscheduled'),(11507,1,19,157,'2020-05-02',1330,1355,'unscheduled'),(11508,1,19,157,'2020-05-02',1355,1420,'unscheduled'),(11509,1,19,157,'2020-05-02',1420,1445,'unscheduled'),(11510,1,19,157,'2020-05-02',1445,1520,'unscheduled'),(11511,1,19,157,'2020-05-02',1520,1545,'unscheduled'),(11512,1,19,157,'2020-05-02',1545,1610,'unscheduled'),(11513,1,19,157,'2020-05-02',1610,1635,'unscheduled'),(11514,1,19,157,'2020-05-02',1635,1700,'unscheduled'),(11515,1,19,157,'2020-05-02',1700,1725,'unscheduled'),(11516,1,19,157,'2020-05-02',1725,1810,'unscheduled'),(11517,1,19,157,'2020-05-03',840,925,'unscheduled'),(11518,1,19,157,'2020-05-03',925,950,'unscheduled'),(11519,1,19,157,'2020-05-03',950,1015,'unscheduled'),(11520,1,19,157,'2020-05-03',1015,1040,'unscheduled'),(11521,1,19,157,'2020-05-03',1040,1115,'unscheduled'),(11522,1,19,157,'2020-05-03',1115,1140,'unscheduled'),(11523,1,19,157,'2020-05-03',1140,1205,'unscheduled'),(11524,1,19,157,'2020-05-03',1205,1230,'unscheduled'),(11525,1,19,157,'2020-05-03',1230,1255,'unscheduled'),(11526,1,19,157,'2020-05-03',1255,1330,'unscheduled'),(11527,1,19,157,'2020-05-03',1330,1355,'unscheduled'),(11528,1,19,157,'2020-05-03',1355,1420,'unscheduled'),(11529,1,19,157,'2020-05-03',1420,1445,'unscheduled'),(11530,1,19,157,'2020-05-03',1445,1520,'unscheduled'),(11531,1,19,157,'2020-05-03',1520,1545,'unscheduled'),(11532,1,19,157,'2020-05-03',1545,1610,'unscheduled'),(11533,1,19,157,'2020-05-03',1610,1635,'unscheduled'),(11534,1,19,157,'2020-05-03',1635,1700,'unscheduled'),(11535,1,19,157,'2020-05-03',1700,1725,'unscheduled'),(11536,1,19,157,'2020-05-03',1725,1810,'unscheduled'),(11537,1,19,157,'2020-05-07',840,925,'unscheduled'),(11538,1,19,157,'2020-05-07',925,950,'unscheduled'),(11539,1,19,157,'2020-05-07',950,1015,'unscheduled'),(11540,1,19,157,'2020-05-07',1015,1040,'unscheduled'),(11541,1,19,157,'2020-05-07',1040,1115,'unscheduled'),(11542,1,19,157,'2020-05-07',1115,1140,'unscheduled'),(11543,1,19,157,'2020-05-07',1140,1205,'unscheduled'),(11544,1,19,157,'2020-05-07',1205,1230,'unscheduled'),(11545,1,19,157,'2020-05-07',1230,1255,'unscheduled'),(11546,1,19,157,'2020-05-07',1255,1330,'unscheduled'),(11547,1,19,157,'2020-05-07',1330,1355,'unscheduled'),(11548,1,19,157,'2020-05-07',1355,1420,'unscheduled'),(11549,1,19,157,'2020-05-07',1420,1445,'unscheduled'),(11550,1,19,157,'2020-05-07',1445,1520,'unscheduled'),(11551,1,19,157,'2020-05-07',1520,1545,'unscheduled'),(11552,1,19,157,'2020-05-07',1545,1610,'unscheduled'),(11553,1,19,157,'2020-05-07',1610,1635,'unscheduled'),(11554,1,19,157,'2020-05-07',1635,1700,'unscheduled'),(11555,1,19,157,'2020-05-07',1700,1725,'unscheduled'),(11556,1,19,157,'2020-05-07',1725,1810,'unscheduled'),(11557,1,19,157,'2020-05-09',840,925,'unscheduled'),(11558,1,19,157,'2020-05-09',925,950,'unscheduled'),(11559,1,19,157,'2020-05-09',950,1015,'unscheduled'),(11560,1,19,157,'2020-05-09',1015,1040,'unscheduled'),(11561,1,19,157,'2020-05-09',1040,1115,'unscheduled'),(11562,1,19,157,'2020-05-09',1115,1140,'unscheduled'),(11563,1,19,157,'2020-05-09',1140,1205,'unscheduled'),(11564,1,19,157,'2020-05-09',1205,1230,'unscheduled'),(11565,1,19,157,'2020-05-09',1230,1255,'unscheduled'),(11566,1,19,157,'2020-05-09',1255,1330,'unscheduled'),(11567,1,19,157,'2020-05-09',1330,1355,'unscheduled'),(11568,1,19,157,'2020-05-09',1355,1420,'unscheduled'),(11569,1,19,157,'2020-05-09',1420,1445,'unscheduled'),(11570,1,19,157,'2020-05-09',1445,1520,'unscheduled'),(11571,1,19,157,'2020-05-09',1520,1545,'unscheduled'),(11572,1,19,157,'2020-05-09',1545,1610,'unscheduled'),(11573,1,19,157,'2020-05-09',1610,1635,'unscheduled'),(11574,1,19,157,'2020-05-09',1635,1700,'unscheduled'),(11575,1,19,157,'2020-05-09',1700,1725,'unscheduled'),(11576,1,19,157,'2020-05-09',1725,1810,'unscheduled'),(11577,1,19,157,'2020-05-10',840,925,'unscheduled'),(11578,1,19,157,'2020-05-10',925,950,'unscheduled'),(11579,1,19,157,'2020-05-10',950,1015,'unscheduled'),(11580,1,19,157,'2020-05-10',1015,1040,'unscheduled'),(11581,1,19,157,'2020-05-10',1040,1115,'unscheduled'),(11582,1,19,157,'2020-05-10',1115,1140,'unscheduled'),(11583,1,19,157,'2020-05-10',1140,1205,'unscheduled'),(11584,1,19,157,'2020-05-10',1205,1230,'unscheduled'),(11585,1,19,157,'2020-05-10',1230,1255,'unscheduled'),(11586,1,19,157,'2020-05-10',1255,1330,'unscheduled'),(11587,1,19,157,'2020-05-10',1330,1355,'unscheduled'),(11588,1,19,157,'2020-05-10',1355,1420,'unscheduled'),(11589,1,19,157,'2020-05-10',1420,1445,'unscheduled'),(11590,1,19,157,'2020-05-10',1445,1520,'unscheduled'),(11591,1,19,157,'2020-05-10',1520,1545,'unscheduled'),(11592,1,19,157,'2020-05-10',1545,1610,'unscheduled'),(11593,1,19,157,'2020-05-10',1610,1635,'unscheduled'),(11594,1,19,157,'2020-05-10',1635,1700,'unscheduled'),(11595,1,19,157,'2020-05-10',1700,1725,'unscheduled'),(11596,1,19,157,'2020-05-10',1725,1810,'unscheduled');
/*!40000 ALTER TABLE `round` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route`
--

DROP TABLE IF EXISTS `route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `route` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `session_id` smallint(6) unsigned NOT NULL,
  `line_name` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8_unicode_ci NOT NULL,
  `roundDuration` tinyint(3) unsigned NOT NULL,
  `public` enum('True','False') COLLATE utf8_unicode_ci NOT NULL,
  `regularService` enum('True','False') COLLATE utf8_unicode_ci NOT NULL,
  `specialDriver` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=608 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route`
--

LOCK TABLES `route` WRITE;
/*!40000 ALTER TABLE `route` DISABLE KEYS */;
INSERT INTO `route` VALUES (607,19,'ABC','active',25,'True','True',0);
/*!40000 ALTER TABLE `route` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `startDateString` varchar(12) COLLATE utf8_unicode_ci NOT NULL,
  `endDateString` varchar(12) COLLATE utf8_unicode_ci NOT NULL,
  `notes` text COLLATE utf8_unicode_ci NOT NULL,
  `holidays` text COLLATE utf8_unicode_ci,
  `availStartDateString` varchar(16) COLLATE utf8_unicode_ci DEFAULT NULL,
  `availEndDateString` varchar(16) COLLATE utf8_unicode_ci DEFAULT NULL,
  `min_operator_hours` tinyint(4) NOT NULL DEFAULT '35',
  `min_operations_hours` tinyint(4) NOT NULL DEFAULT '27',
  `min_trainer_hours` tinyint(4) NOT NULL DEFAULT '27',
  `min_trainee_hours` tinyint(4) NOT NULL DEFAULT '27',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES (19,'First Session','2020-01-01','2020-05-12','','2020-02-14, 2020-03-17, 2020-03-20',NULL,NULL,35,27,27,27),(20,'Winter','2020-01-01','2020-03-31','','2020-01-20, 2020-02-17',NULL,NULL,35,27,27,27),(21,'Regular Schedule','2020-01-06','2020-03-27','','2020-01-20, 2020-02-17',NULL,NULL,35,27,27,27);
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shirt_sizes`
--

DROP TABLE IF EXISTS `shirt_sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shirt_sizes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `size` varchar(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shirt_sizes`
--

LOCK TABLES `shirt_sizes` WRITE;
/*!40000 ALTER TABLE `shirt_sizes` DISABLE KEYS */;
INSERT INTO `shirt_sizes` VALUES (1,'XS'),(2,'S'),(3,'M'),(4,'L'),(5,'XL'),(6,'XXL'),(7,'XXXL');
/*!40000 ALTER TABLE `shirt_sizes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transaction` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `target_user_id` int(10) DEFAULT NULL,
  `round_id` int(10) NOT NULL,
  `target_round_id` int(10) DEFAULT NULL,
  `date` bigint(20) NOT NULL,
  `type` varchar(6) NOT NULL,
  `comment` text NOT NULL,
  `status` varchar(24) CHARACTER SET utf8 NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uci_net_id` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` char(60) COLLATE utf8_unicode_ci NOT NULL,
  `nickname` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `photo` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive','suspended','') COLLATE utf8_unicode_ci NOT NULL,
  `special_route_ok` tinyint(1) NOT NULL,
  `phone` bigint(10) unsigned DEFAULT NULL,
  `email` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `shirt_size_id` int(10) DEFAULT NULL,
  `cell_provider_id` int(10) unsigned DEFAULT NULL,
  `url` varchar(600) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uci_net_id` (`uci_net_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'supertest','Test','Super','$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG',NULL,NULL,'active',1,NULL,'supertest@uci.edu',NULL,NULL,NULL,'2019-12-13 18:49:08'),(2,'testoperator','Operator','Joe','$2y$10$kAkAZgcPR0cK2zCW8PZo..SziHDvZx2Vho6SJqKaks/Z4LXPhD4bW',NULL,NULL,'active',0,NULL,'testoperator@uci.edu',NULL,NULL,NULL,'2019-12-13 20:59:44'),(3,'dpyenson','Pyenson','Daniel','$2y$10$PSUfR0HJNvKv0ZLiS79Iye1y9556.O5Q1dCJMNCr7QwGmHYH4N9Ry',NULL,NULL,'active',1,NULL,'dpyenson@uci.edu',NULL,NULL,NULL,'2019-12-13 21:14:01'),(4,'adowney','Downey','Annie','$2y$10$E.SkAhEANKI89hUbotiXwuuH.iC/OH2esgeQzpgEPsBusNq0fisDO',NULL,NULL,'active',1,NULL,'adowney@uci.edu',NULL,NULL,NULL,'2019-12-13 21:14:43'),(5,'rudek','rudek','tim','$2y$10$GfSUbpnOaMW9O8zOEqRcOewPHEzoTo3g6VfBFMPONgLbCglQ/1vTy',NULL,NULL,'active',1,NULL,'rudek@uci.edu',NULL,NULL,NULL,'2019-12-13 21:15:10');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `granted_by` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (5,1,1,'2019-12-13 20:51:37',1),(6,4,2,'2019-12-13 20:59:44',1),(7,2,3,'2019-12-13 21:14:01',1),(8,2,4,'2019-12-13 21:14:43',1),(9,2,5,'2019-12-13 21:15:10',1),(10,3,2,'2019-12-13 22:24:44',1);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicle` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `VIN` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `make` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `model` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `miles` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle`
--

LOCK TABLES `vehicle` WRITE;
/*!40000 ALTER TABLE `vehicle` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-14  0:51:00
