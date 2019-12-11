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

-- Dumping data for table anteaterExpress.busDaysActive: ~66 rows (approximately)
DELETE FROM `busDaysActive`;
/*!40000 ALTER TABLE `busDaysActive` DISABLE KEYS */;
INSERT INTO `busDaysActive` (`id`, `bus_id`, `daysActive`) VALUES
	(1, 64, 'Tuesday'),
	(2, 64, 'Wednesday'),
	(3, 85, 'Monday'),
	(4, 85, 'Wednesday'),
	(5, 86, 'Thursday'),
	(6, 86, 'Friday'),
	(7, 87, 'Thursday'),
	(8, 87, 'Friday'),
	(9, 88, 'Wednesday'),
	(10, 88, 'Thursday'),
	(11, 89, 'Monday'),
	(12, 89, 'Tuesday'),
	(13, 21, 'Monday'),
	(14, 102, 'Monday'),
	(16, 104, 'Monday'),
	(19, 116, 'Monday'),
	(26, 121, 'Tuesday'),
	(27, 122, 'Tuesday'),
	(28, 122, 'Thursday'),
	(30, 127, 'Monday'),
	(31, 128, 'Tuesday'),
	(32, 129, 'Wednesday'),
	(33, 129, 'Thursday'),
	(34, 130, 'Friday'),
	(35, 130, 'Saturday'),
	(38, 135, 'Monday'),
	(39, 135, 'Wednesday'),
	(40, 136, 'Monday'),
	(41, 136, 'Wednesday'),
	(42, 137, 'Tuesday'),
	(43, 137, 'Thursday'),
	(44, 138, 'Monday'),
	(45, 138, 'Thursday'),
	(46, 139, 'Tuesday'),
	(47, 139, 'Wednesday'),
	(48, 140, 'Monday'),
	(49, 140, 'Tuesday'),
	(50, 140, 'Wednesday'),
	(51, 141, 'Monday'),
	(52, 141, 'Thursday'),
	(53, 142, 'Tuesday'),
	(54, 142, 'Wednesday'),
	(55, 143, 'Monday'),
	(56, 143, 'Thursday'),
	(57, 144, 'Wednesday'),
	(58, 145, 'Wednesday'),
	(59, 146, 'Monday'),
	(60, 146, 'Tuesday'),
	(61, 147, 'Monday'),
	(62, 147, 'Wednesday'),
	(63, 147, 'Friday'),
	(64, 148, 'Monday'),
	(65, 148, 'Thursday'),
	(66, 149, 'Monday'),
	(67, 149, 'Friday'),
	(68, 150, 'Monday'),
	(69, 150, 'Wednesday'),
	(70, 150, 'Friday'),
	(71, 151, 'Wednesday'),
	(72, 151, 'Thursday'),
	(73, 151, 'Friday'),
	(74, 152, 'Monday'),
	(75, 152, 'Wednesday'),
	(76, 152, 'Friday'),
	(81, 155, 'Friday'),
	(82, 155, 'Saturday');
/*!40000 ALTER TABLE `busDaysActive` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
