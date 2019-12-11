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

-- Dumping data for table pointy_nostrils.operator_route_preference: ~15 rows (approximately)
DELETE FROM `operator_route_preference`;
/*!40000 ALTER TABLE `operator_route_preference` DISABLE KEYS */;
INSERT INTO `operator_route_preference` (`id`, `user_id`, `route_id`, `session_id`) VALUES
	(1, 4, 1, 1),
	(2, 4, 1, 2),
	(3, 4, 2, 1),
	(4, 10, 3, 2),
	(5, 10, 1, 2),
	(6, 10, 2, 2),
	(7, 9, 1, 1),
	(8, 9, 3, 2),
	(9, 9, 4, 2),
	(10, 4, 3, 1),
	(11, 9, 2, 1),
	(12, 9, 4, 1),
	(13, 10, 3, 1),
	(14, 10, 4, 1),
	(15, 10, 2, 1);
/*!40000 ALTER TABLE `operator_route_preference` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
