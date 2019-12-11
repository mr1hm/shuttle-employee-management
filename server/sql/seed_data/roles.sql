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

-- Dumping data for table anteaterExpress.roles: ~6 rows (approximately)
DELETE FROM `roles`;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` (`id`, `mid`, `display_name`, `description`, `updated_at`, `created_at`) VALUES
	(1, 'super_admin', 'Super Admin', NULL, '2019-12-02 20:14:59', '2019-12-02 20:14:59'),
	(2, 'admin', 'Admin', NULL, '2019-12-02 20:14:59', '2019-12-02 20:14:59'),
	(3, 'operations', 'Operations', NULL, '2019-12-02 20:16:37', '2019-12-02 20:16:37'),
	(4, 'operators', 'Operators', NULL, '2019-12-02 20:16:37', '2019-12-02 20:16:37'),
	(5, 'trainers', 'Trainers', NULL, '2019-12-02 20:16:37', '2019-12-02 20:16:37'),
	(6, 'trainees', 'Trainees', NULL, '2019-12-02 20:16:37', '2019-12-02 20:16:37');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
