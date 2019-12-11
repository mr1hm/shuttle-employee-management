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

-- Dumping data for table pointy_nostrils.transaction: ~31 rows (approximately)
DELETE FROM `transaction`;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` (`id`, `user_id`, `target_user_id`, `round_id`, `target_round_id`, `date`, `type`, `comment`, `status`) VALUES
	(1, 10, NULL, 2, NULL, 1570731610899, 'post', 'need the money', 'pending'),
	(17, 14, NULL, 6, NULL, 1566100800, 'post', 'test', 'pending'),
	(18, 14, NULL, 7, NULL, 1566100800, 'post', 'test', 'pending'),
	(19, 14, NULL, 6, NULL, 1566100800, 'post', 'test', 'pending'),
	(20, 14, NULL, 7, NULL, 1566100800, 'post', 'test', 'pending'),
	(21, 14, NULL, 6, NULL, 1566100800, 'post', 'Posting my shifts for someone to take', 'pending'),
	(22, 14, NULL, 7, NULL, 1566100800, 'post', 'Posting my shifts for someone to take', 'pending'),
	(23, 14, NULL, 6, NULL, 1566100800, 'post', 'I need someone to take my shift', 'pending'),
	(24, 14, NULL, 7, NULL, 1571781976939, 'post', 'I need someone to take my shift', 'pending'),
	(36, 14, 6, 6, NULL, 1571862138207, 'post', 'no', 'pending'),
	(37, 14, 6, 7, NULL, 1571862138207, 'post', 'no', 'pending'),
	(38, 14, 4, 6, NULL, 1571869221681, 'post', 'no', 'pending'),
	(39, 14, 4, 7, NULL, 1571869221681, 'post', 'no', 'pending'),
	(40, 14, 12, 12, NULL, 1571869609089, 'post', 'no', 'accepted'),
	(41, 14, 12, 13, NULL, 1571869609089, 'post', 'no', 'accepted'),
	(42, 14, 12, 6, NULL, 1572025227487, 'post', 'no', 'pending'),
	(43, 14, 12, 7, NULL, 1572025227487, 'post', 'no', 'pending'),
	(44, 14, 19, 265, NULL, 1572025903207, 'post', 'no', 'declined'),
	(45, 14, 19, 266, NULL, 1572025903207, 'post', 'no', 'declined'),
	(46, 14, 19, 267, NULL, 1572025903207, 'post', 'no', 'declined'),
	(47, 14, 19, 265, NULL, 1572025971326, 'post', 'no', 'declined'),
	(48, 14, 19, 266, NULL, 1572025971326, 'post', 'no', 'declined'),
	(49, 14, 19, 267, NULL, 1572025971326, 'post', 'no', 'declined'),
	(50, 14, 19, 287, NULL, 1572026993472, 'post', 'no', 'declined'),
	(51, 14, 19, 288, NULL, 1572026993472, 'post', 'no', 'declined'),
	(52, 14, 19, 2847, NULL, 1572027112702, 'post', 'no', 'declined'),
	(53, 14, 19, 2848, NULL, 1572027112702, 'post', 'no', 'accepted'),
	(54, 14, 19, 12, NULL, 1572027536233, 'post', 'no', 'accepted'),
	(55, 14, 19, 13, NULL, 1572027536233, 'post', 'no', 'accepted'),
	(56, 14, 19, 14, NULL, 1572027536233, 'post', 'no', 'pending'),
	(57, 14, 19, 15, NULL, 1572027536233, 'post', 'no', 'pending');
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
