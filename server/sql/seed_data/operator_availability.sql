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

-- Dumping data for table anteaterExpress.operator_availability: ~184 rows (approximately)
DELETE FROM `operator_availability`;
/*!40000 ALTER TABLE `operator_availability` DISABLE KEYS */;
INSERT INTO `operator_availability` (`id`, `user_id`, `session_id`, `day_of_week`, `start_time`, `end_time`, `cont_block`) VALUES
	(1, 4, 1, 'Mon', 700, 930, 0),
	(2, 9, 1, 'Tue', 700, 1000, 0),
	(3, 4, 1, 'Wed', 700, 930, 0),
	(4, 4, 1, 'Fri', 700, 930, 0),
	(5, 9, 1, 'Thu', 700, 1000, 0),
	(6, 10, 1, 'Sat', 800, 1200, 0),
	(7, 10, 1, 'Sun', 800, 2400, 0),
	(8, 4, 1, 'Fri', 1230, 1400, 0),
	(9, 11, 1, 'Sun', 1000, 1400, 0),
	(10, 12, 1, 'Sun', 1500, 1900, 0),
	(11, 13, 6, 'Sun', 1600, 2000, 0),
	(12, 11, 1, 'Tue', 800, 1300, 0),
	(13, 12, 1, 'Mon', 600, 900, 0),
	(14, 12, 1, 'Wed', 600, 900, 0),
	(15, 12, 1, 'Fri', 1100, 1800, 0),
	(16, 13, 6, 'Tue', 1000, 1300, 0),
	(17, 13, 6, 'Thu', 1000, 1300, 0),
	(18, 13, 6, 'Tue', 1600, 2000, 0),
	(19, 13, 6, 'Thu', 1600, 2000, 0),
	(20, 11, 1, 'Thu', 800, 1300, 0),
	(26, 14, 1, 'Mon', 1100, 1900, 0),
	(27, 14, 1, 'Wed', 1100, 1900, 0),
	(28, 14, 1, 'Sat', 700, 1300, 0),
	(29, 15, 1, 'Tue', 1500, 2000, 0),
	(30, 15, 1, 'Thu', 1500, 2000, 0),
	(31, 16, 1, 'Mon', 600, 1200, 0),
	(32, 16, 1, 'Wed', 600, 1200, 0),
	(49, 16, 1, 'Fri', 600, 1200, 0),
	(50, 16, 1, 'Fri', 1500, 2000, 0),
	(51, 17, 1, 'Sun', 600, 1000, 0),
	(52, 17, 1, 'Sat', 600, 1000, 0),
	(53, 19, 1, 'Sat', 600, 1400, 0),
	(54, 19, 1, 'Sun', 600, 1400, 0),
	(55, 19, 1, 'Mon', 1100, 1700, 0),
	(56, 19, 1, 'Sun', 1500, 2000, 0),
	(57, 21, 1, 'Sun', 600, 2200, 0),
	(58, 21, 1, 'Mon', 600, 2200, 0),
	(59, 21, 1, 'Tue', 600, 2200, 0),
	(60, 21, 1, 'Wed', 600, 2200, 0),
	(61, 21, 1, 'Thu', 600, 2200, 0),
	(62, 21, 1, 'Fri', 600, 2200, 0),
	(63, 21, 1, 'Sat', 600, 2200, 0),
	(64, 22, 1, 'Sun', 600, 2200, 0),
	(65, 22, 1, 'Mon', 600, 2200, 0),
	(66, 22, 1, 'Tue', 600, 2200, 0),
	(67, 22, 1, 'Wed', 600, 2200, 0),
	(68, 22, 1, 'Thu', 600, 2200, 0),
	(69, 22, 1, 'Fri', 600, 2200, 0),
	(70, 22, 1, 'Sat', 600, 2200, 0),
	(71, 23, 1, 'Sun', 600, 2200, 0),
	(72, 23, 1, 'Mon', 600, 2200, 0),
	(73, 23, 1, 'Tue', 600, 2200, 0),
	(74, 23, 1, 'Wed', 600, 2200, 0),
	(75, 23, 1, 'Thu', 600, 2200, 0),
	(76, 23, 1, 'Fri', 600, 2200, 0),
	(77, 23, 1, 'Sat', 600, 2200, 0),
	(78, 24, 1, 'Sun', 600, 2200, 0),
	(79, 24, 1, 'Mon', 600, 2200, 0),
	(80, 24, 1, 'Tue', 600, 2200, 0),
	(81, 24, 1, 'Wed', 600, 2200, 0),
	(82, 24, 1, 'Thu', 600, 2200, 0),
	(83, 24, 1, 'Fri', 600, 2200, 0),
	(84, 24, 1, 'Sat', 600, 2200, 0),
	(85, 25, 1, 'Sun', 600, 2400, 0),
	(86, 25, 1, 'Mon', 600, 2400, 0),
	(87, 25, 1, 'Tue', 600, 2400, 0),
	(88, 25, 1, 'Wed', 600, 2400, 0),
	(89, 25, 1, 'Thu', 600, 2400, 0),
	(90, 25, 1, 'Fri', 600, 2400, 0),
	(91, 25, 1, 'Sat', 600, 2400, 0),
	(92, 26, 1, 'Sun', 600, 2400, 0),
	(93, 26, 1, 'Mon', 600, 2400, 0),
	(94, 26, 1, 'Tue', 600, 2400, 0),
	(95, 26, 1, 'Wed', 600, 2400, 0),
	(96, 26, 1, 'Thu', 600, 2400, 0),
	(97, 26, 1, 'Fri', 600, 2400, 0),
	(98, 26, 1, 'Sat', 600, 2400, 0),
	(99, 27, 1, 'Sun', 600, 2400, 0),
	(100, 27, 1, 'Mon', 600, 2400, 0),
	(101, 27, 1, 'Tue', 600, 2400, 0),
	(102, 27, 1, 'Wed', 600, 2400, 0),
	(103, 27, 1, 'Thu', 600, 2400, 0),
	(104, 27, 1, 'Fri', 600, 2400, 0),
	(105, 27, 1, 'Sat', 600, 2400, 0),
	(106, 28, 1, 'Sun', 600, 2400, 0),
	(107, 28, 1, 'Mon', 600, 2400, 0),
	(108, 28, 1, 'Tue', 600, 2400, 0),
	(109, 28, 1, 'Wed', 600, 2400, 0),
	(110, 28, 1, 'Thu', 600, 2400, 0),
	(111, 28, 1, 'Fri', 600, 2400, 0),
	(112, 28, 1, 'Sat', 600, 2400, 0),
	(113, 30, 1, 'Sun', 600, 2400, 0),
	(114, 30, 1, 'Mon', 600, 2400, 0),
	(115, 30, 1, 'Tue', 600, 2400, 0),
	(116, 30, 1, 'Wed', 600, 2400, 0),
	(117, 30, 1, 'Thu', 600, 2400, 0),
	(118, 30, 1, 'Fri', 600, 2400, 0),
	(119, 30, 1, 'Sat', 600, 2400, 0),
	(120, 31, 1, 'Sun', 600, 2400, 0),
	(121, 31, 1, 'Mon', 600, 2400, 0),
	(122, 31, 1, 'Tue', 600, 2400, 0),
	(123, 31, 1, 'Wed', 600, 2400, 0),
	(124, 31, 1, 'Thu', 600, 2400, 0),
	(125, 31, 1, 'Fri', 600, 2400, 0),
	(126, 31, 1, 'Sat', 600, 2400, 0),
	(127, 33, 1, 'Sun', 600, 2400, 0),
	(128, 33, 1, 'Mon', 600, 2400, 0),
	(129, 33, 1, 'Tue', 600, 2400, 0),
	(130, 33, 1, 'Wed', 600, 2400, 0),
	(131, 33, 1, 'Thu', 600, 2400, 0),
	(132, 33, 1, 'Fri', 600, 2400, 0),
	(133, 33, 1, 'Sat', 600, 2400, 0),
	(134, 35, 1, 'Sun', 600, 2400, 0),
	(135, 35, 1, 'Mon', 600, 2400, 0),
	(136, 35, 1, 'Tue', 600, 2400, 0),
	(137, 35, 1, 'Wed', 600, 2400, 0),
	(138, 35, 1, 'Thu', 600, 2400, 0),
	(139, 35, 1, 'Fri', 600, 2400, 0),
	(140, 35, 1, 'Sat', 600, 2400, 0),
	(141, 37, 1, 'Sun', 600, 2400, 0),
	(142, 37, 1, 'Mon', 600, 2400, 0),
	(143, 37, 1, 'Tue', 600, 2400, 0),
	(144, 37, 1, 'Wed', 600, 2400, 0),
	(145, 37, 1, 'Thu', 600, 2400, 0),
	(146, 37, 1, 'Fri', 600, 2400, 0),
	(147, 37, 1, 'Sat', 600, 2400, 0),
	(148, 41, 1, 'Sun', 600, 2400, 0),
	(149, 41, 1, 'Mon', 600, 2400, 0),
	(150, 41, 1, 'Tue', 600, 2400, 0),
	(151, 41, 1, 'Wed', 600, 2400, 0),
	(152, 41, 1, 'Thu', 600, 2400, 0),
	(153, 41, 1, 'Fri', 600, 2400, 0),
	(154, 41, 1, 'Sat', 600, 2400, 0),
	(155, 42, 1, 'Sun', 600, 2400, 0),
	(156, 42, 1, 'Mon', 600, 2400, 0),
	(157, 42, 1, 'Tue', 600, 2400, 0),
	(158, 42, 1, 'Wed', 600, 2400, 0),
	(159, 42, 1, 'Thu', 600, 2400, 0),
	(160, 42, 1, 'Fri', 600, 2400, 0),
	(161, 42, 1, 'Sat', 600, 2400, 0),
	(162, 43, 1, 'Sun', 600, 2400, 0),
	(163, 43, 1, 'Mon', 600, 2400, 0),
	(164, 43, 1, 'Tue', 600, 2400, 0),
	(165, 43, 1, 'Wed', 600, 2400, 0),
	(166, 43, 1, 'Thu', 600, 2400, 0),
	(167, 43, 1, 'Fri', 600, 2400, 0),
	(168, 43, 1, 'Sat', 600, 2400, 0),
	(169, 44, 1, 'Sun', 600, 2400, 0),
	(170, 44, 1, 'Mon', 600, 2400, 0),
	(171, 44, 1, 'Tue', 600, 2400, 0),
	(172, 44, 1, 'Wed', 600, 2400, 0),
	(173, 44, 1, 'Thu', 600, 2400, 0),
	(174, 44, 1, 'Fri', 600, 2400, 0),
	(175, 44, 1, 'Sat', 600, 2400, 0),
	(176, 45, 1, 'Sun', 600, 2400, 0),
	(177, 45, 1, 'Mon', 600, 2400, 0),
	(178, 45, 1, 'Tue', 600, 2400, 0),
	(179, 45, 1, 'Wed', 600, 2400, 0),
	(180, 45, 1, 'Thu', 600, 2400, 0),
	(181, 45, 1, 'Fri', 600, 2400, 0),
	(182, 45, 1, 'Sat', 600, 2400, 0),
	(183, 46, 1, 'Sun', 600, 2400, 0),
	(184, 46, 1, 'Mon', 600, 2400, 0),
	(185, 46, 1, 'Tue', 600, 2400, 0),
	(186, 46, 1, 'Wed', 600, 2400, 0),
	(187, 46, 1, 'Thu', 600, 2400, 0),
	(188, 46, 1, 'Fri', 600, 2400, 0),
	(189, 46, 1, 'Sat', 600, 2400, 0),
	(190, 47, 1, 'Sun', 600, 2400, 0),
	(191, 47, 1, 'Mon', 600, 2400, 0),
	(192, 47, 1, 'Tue', 600, 2400, 0),
	(193, 47, 1, 'Wed', 600, 2400, 0),
	(194, 47, 1, 'Thu', 600, 2400, 0),
	(195, 47, 1, 'Fri', 600, 2400, 0),
	(196, 47, 1, 'Sat', 600, 2400, 0),
	(197, 48, 1, 'Sun', 600, 2400, 0),
	(198, 48, 1, 'Mon', 600, 2400, 0),
	(199, 48, 1, 'Tue', 600, 2400, 0),
	(200, 48, 1, 'Wed', 600, 2400, 0),
	(201, 48, 1, 'Thu', 600, 2400, 0),
	(202, 48, 1, 'Fri', 600, 2400, 0),
	(203, 48, 1, 'Sat', 600, 2400, 0),
	(204, 9, 6, 'Mon', 930, 1545, 0),
	(205, 9, 6, 'Wed', 1515, 2400, 0);
/*!40000 ALTER TABLE `operator_availability` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
