-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.28-0ubuntu0.18.04.4 - (Ubuntu)
-- Server OS:                    Linux
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping data for table anteaterExpress.cellProvider: ~10 rows (approximately)
DELETE FROM `cellProvider`;
/*!40000 ALTER TABLE `cellProvider` DISABLE KEYS */;
INSERT INTO `cellProvider` (`id`, `cell_provider`, `cell_domain`) VALUES
	(1, 'ATT', 'txt.att.net'),
	(2, 'Boost Mobile ', 'myboostmobile.com'),
	(3, 'Cricket Wireless', 'mms.cricketwireless.net'),
	(4, 'Project Fi', 'msg.fi.google.com'),
	(5, 'Sprint', 'messaging.sprintpcs.com'),
	(6, 'T-Mobile', 'tmomail.net'),
	(7, 'U.S. Cellular', 'email.uscc.net'),
	(8, 'Verizon', 'vtext.com'),
	(9, 'Virgin Mobile', 'vmobl.com'),
	(10, 'Republic Wireless', 'text.republicwireless.com');
/*!40000 ALTER TABLE `cellProvider` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
