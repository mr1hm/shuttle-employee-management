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

-- Dumping data for table pointy_nostrils.operator_session_avail: ~83 rows (approximately)
DELETE FROM `operator_session_avail`;
/*!40000 ALTER TABLE `operator_session_avail` DISABLE KEYS */;
INSERT INTO `operator_session_avail` (`id`, `user_id`, `session_id`, `min_avail_hours`, `avail_end_date`, `availEndDateString`) VALUES
	(1, 3, 6, NULL, NULL, NULL),
	(2, 4, 6, 10, 1584282960000, '2019-12-27'),
	(3, 5, 6, 6, 1584282960888, '2019-12-28'),
	(4, 6, 6, 50, 1584282960000, '2019-12-29'),
	(5, 7, 6, NULL, NULL, NULL),
	(6, 8, 6, 30, 1584282960000, '2019-12-30'),
	(7, 9, 6, 11, 1604993910196, '2019-12-24'),
	(8, 10, 6, NULL, NULL, NULL),
	(9, 11, 6, 8, NULL, '2019-12-31'),
	(10, 12, 6, 10, NULL, NULL),
	(11, 13, 6, NULL, NULL, NULL),
	(12, 14, 6, NULL, NULL, NULL),
	(13, 15, 6, NULL, NULL, NULL),
	(14, 16, 6, NULL, NULL, NULL),
	(15, 17, 6, NULL, NULL, NULL),
	(16, 18, 6, NULL, NULL, NULL),
	(17, 19, 6, NULL, NULL, NULL),
	(18, 20, 6, NULL, NULL, NULL),
	(19, 21, 6, NULL, NULL, NULL),
	(20, 22, 6, NULL, NULL, NULL),
	(21, 23, 6, NULL, NULL, NULL),
	(22, 24, 6, NULL, NULL, NULL),
	(23, 25, 6, NULL, NULL, NULL),
	(24, 26, 6, NULL, NULL, NULL),
	(25, 27, 6, NULL, NULL, NULL),
	(26, 28, 6, NULL, NULL, NULL),
	(27, 29, 6, NULL, NULL, NULL),
	(28, 30, 6, NULL, NULL, NULL),
	(29, 31, 6, NULL, NULL, NULL),
	(30, 33, 6, NULL, NULL, NULL),
	(31, 35, 6, NULL, NULL, NULL),
	(32, 37, 6, NULL, NULL, NULL),
	(33, 41, 6, NULL, NULL, NULL),
	(34, 42, 6, NULL, NULL, NULL),
	(35, 43, 6, NULL, NULL, NULL),
	(36, 44, 6, NULL, NULL, NULL),
	(37, 45, 6, NULL, NULL, NULL),
	(38, 46, 6, NULL, NULL, NULL),
	(39, 47, 6, NULL, NULL, NULL),
	(129, 3, 5, NULL, NULL, NULL),
	(130, 4, 5, NULL, NULL, NULL),
	(131, 5, 5, NULL, NULL, NULL),
	(132, 6, 5, NULL, NULL, NULL),
	(145, 80, 5, NULL, NULL, NULL),
	(146, 80, 6, NULL, NULL, NULL),
	(147, 80, 7, 20, 0, '2020-03-12'),
	(148, 80, 17, NULL, NULL, NULL),
	(149, 80, 18, NULL, NULL, NULL),
	(150, 81, 5, NULL, NULL, NULL),
	(151, 81, 6, NULL, NULL, NULL),
	(152, 81, 7, NULL, NULL, NULL),
	(153, 81, 17, NULL, NULL, NULL),
	(154, 81, 18, NULL, NULL, NULL),
	(155, 82, 5, 20, NULL, '2019-09-12'),
	(156, 82, 6, NULL, NULL, NULL),
	(157, 82, 7, NULL, NULL, NULL),
	(158, 82, 17, NULL, NULL, NULL),
	(159, 82, 18, NULL, NULL, NULL),
	(160, 83, 5, NULL, NULL, NULL),
	(161, 83, 6, NULL, NULL, NULL),
	(162, 83, 7, NULL, NULL, NULL),
	(163, 83, 17, NULL, NULL, NULL),
	(164, 83, 18, NULL, NULL, NULL),
	(165, 84, 5, 16, NULL, '2019-09-10 19:00'),
	(166, 84, 6, NULL, NULL, NULL),
	(167, 84, 7, NULL, NULL, NULL),
	(168, 84, 17, 15, NULL, '2020-06-05'),
	(169, 84, 18, NULL, NULL, NULL),
	(170, 85, 5, NULL, NULL, NULL),
	(171, 85, 6, NULL, NULL, NULL),
	(172, 85, 7, NULL, NULL, NULL),
	(173, 85, 17, NULL, NULL, NULL),
	(174, 85, 18, NULL, NULL, NULL),
	(175, 86, 5, NULL, NULL, NULL),
	(176, 86, 6, NULL, NULL, NULL),
	(177, 86, 7, NULL, NULL, NULL),
	(178, 86, 17, NULL, NULL, NULL),
	(179, 86, 18, NULL, NULL, NULL),
	(180, 87, 5, NULL, NULL, NULL),
	(181, 87, 6, NULL, NULL, NULL),
	(182, 87, 7, NULL, NULL, NULL),
	(183, 87, 17, NULL, NULL, NULL),
	(184, 87, 18, NULL, NULL, NULL);
/*!40000 ALTER TABLE `operator_session_avail` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
