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

-- Dumping data for table pointy_nostrils.route: ~15 rows (approximately)
DELETE FROM `route`;
/*!40000 ALTER TABLE `route` DISABLE KEYS */;
INSERT INTO `route` (`id`, `session_id`, `line_name`, `status`, `roundDuration`, `public`, `regularService`, `specialDriver`) VALUES
	(1, 5, 'C', 'active', 8, 'True', 'True', 1),
	(2, 5, 'D', 'inactive', 0, 'True', 'True', 0),
	(3, 5, 'Hs', 'inactive', 0, 'True', 'True', 0),
	(4, 5, 'M', 'active', 0, 'True', 'True', 1),
	(6, 5, 'N', 'active', 0, 'True', 'True', 1),
	(7, 5, 'S', 'active', 0, 'True', 'True', 0),
	(8, 5, 'V', 'active', 0, 'True', 'True', 1),
	(380, 5, 'B', 'inactive', 5, 'True', 'True', 0),
	(538, 5, 'A', 'active', 10, 'True', 'True', 1),
	(582, 6, 'Ae', 'active', 30, 'True', 'True', 1),
	(599, 6, 'Pi', 'active', 30, 'True', 'True', 0),
	(600, 6, 'Ze', 'active', 30, 'True', 'True', 1),
	(601, 17, 'Ap', 'active', 15, 'True', 'True', 0),
	(604, 17, 'Az', 'active', 15, 'True', 'True', 0),
	(605, 18, 'Ar', 'active', 10, 'True', 'True', 0);
/*!40000 ALTER TABLE `route` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
