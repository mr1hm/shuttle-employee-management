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

-- Dumping data for table anteaterExpress.session: ~5 rows (approximately)
DELETE FROM `session`;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` (`id`, `name`, `startDateString`, `endDateString`, `notes`, `holidays`, `availStartDateString`, `availEndDateString`, `min_operator_hours`, `min_operations_hours`, `min_trainer_hours`, `min_trainee_hours`) VALUES
	(5, 'Fall 2019', '2019-09-20', '2019-12-14', '', NULL, '2019-08-21 10:00', '2019-09-10 18:00', 21, 25, 25, 25),
	(6, 'Winter 2020', '2020-01-06', '2020-03-20', '', NULL, '2019-08-20', '2019-12-20', 20, 35, 20, 15),
	(7, 'Spring 2020', '2020-03-27', '2020-06-16', 'testing1', NULL, '2020-02-14', '2020-03-10', 22, 30, 15, 20),
	(17, 'Summer 2020', '2020-06-20', '2020-08-20', '', NULL, '2020-05-16', '2020-06-05', 20, 30, 0, 0),
	(18, 'Fall 2020', '2020-09-20', '2020-12-27', 'testing3', NULL, '2020-08-15', '2020-09-10', 0, 0, 0, 0);
/*!40000 ALTER TABLE `session` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
