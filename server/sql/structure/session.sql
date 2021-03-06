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

-- Dumping structure for table anteaterExpress.session
CREATE TABLE IF NOT EXISTS `session` (
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
