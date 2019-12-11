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

-- Dumping structure for table pointy_nostrils.bus_info
CREATE TABLE IF NOT EXISTS `bus_info` (
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
) ENGINE=InnoDB AUTO_INCREMENT=156 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
