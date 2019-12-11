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

-- Dumping structure for table pointy_nostrils.operator_availability
CREATE TABLE IF NOT EXISTS `operator_availability` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `session_id` int(11) NOT NULL,
  `day_of_week` enum('Sun','Mon','Tue','Wed','Thu','Fri','Sat') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `start_time` smallint(4) NOT NULL,
  `end_time` smallint(4) NOT NULL,
  `cont_block` smallint(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
