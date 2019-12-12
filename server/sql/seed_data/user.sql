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

-- Dumping data for table anteaterExpress.user: ~43 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `uci_net_id`, `last_name`, `first_name`, `password`, `nickname`, `photo`, `status`, `special_route_ok`, `phone`, `email`, `shirt_size`, `cell_provider`, `url`, `last_update`) VALUES
	(1, '(none)', 'unassigned', 'unassigned', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 8765432311, '', NULL, NULL, NULL, '2019-12-11 17:32:47'),
	(3, 'jsmith', 'Smith', 'Jason', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Jase', NULL, 'active', 1, 8765432311, 'jsmith@yahoo.com', 'L', NULL, NULL, '2019-12-11 17:32:05'),
	(4, 'twu', 'Wu', 'Teresa', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Terry', NULL, 'active', 0, 9495432311, 'teresakwu@uci.edu', 'S', NULL, NULL, '2019-12-11 17:32:05'),
	(5, 'msamuel', 'Samuel', 'Martha', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 8765432421, 'martha.samuel@bellsouth.net', 'M', NULL, NULL, '2019-12-11 17:32:06'),
	(6, 'aespinosa', 'Espinosa', 'Amelia', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Ame', NULL, 'active', 0, 7656543321, 'espinosa_amelia@frontier.net', 'L', NULL, NULL, '2019-12-11 17:32:06'),
	(7, 'sjones', 'Jones', 'Samantha', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Sam', NULL, 'active', 0, 8865434411, 'samantha.jones@uci.edu', 'XS', NULL, NULL, '2019-12-11 17:32:07'),
	(8, 'jboles', 'Boles', 'John', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 8775452313, 'boles.john@att.net', 'XL', NULL, NULL, '2019-12-11 17:32:08'),
	(9, 'mfrench', 'French', 'Melissa', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Missy', NULL, 'inactive', 1, 8776543322, 'frenchmelissa@bellsouth.net', 'S', NULL, NULL, '2019-12-11 17:32:09'),
	(10, 'brogers', 'Rogers', 'Betty', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 4155452211, 'betty_rogers@myspace.com', 'L', NULL, NULL, '2019-12-11 17:32:10'),
	(11, 'rjauregui', 'Jauregui', 'Raul', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 4544543333, '', NULL, NULL, NULL, '2019-12-11 17:32:10'),
	(12, 'zwhite', 'White', 'Zack', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 4544543333, '', NULL, NULL, NULL, '2019-12-11 17:32:11'),
	(13, 'rcardona', 'Cardona', 'Rick', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 9512356560, 'joe@example.com', 'XXL', 'Project Fi', NULL, '2019-12-11 17:30:41'),
	(14, 'jblade', 'Blade', 'Jack', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 6753245555, 'bladej@mail.com', 'S', '  ATT', NULL, '2019-12-11 17:30:42'),
	(15, 'jwhite', 'White', 'James', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 6754345555, '', 'S', '  ATT', NULL, '2019-12-11 17:30:43'),
	(16, 'bwatson', 'Watson', 'Bill', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 7852347777, '', NULL, NULL, NULL, '2019-12-11 17:32:12'),
	(17, 'ktorres', 'Torres', 'Karen', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 5763421111, 'torresk@mail.com', 'M', 'Boost Mobile ', NULL, '2019-12-11 17:30:44'),
	(18, 'hdomes', 'Domes', 'Henry', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 2137777777, '', 'XXL', 'Cricket Wireless', NULL, '2019-12-11 17:30:45'),
	(19, 'omann', 'Mann', 'Otto ', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'inactive', 0, 2134345555, 'littlem@myspace.com', 'XL', 'Verizon', 'happy otta.jpeg', '2019-12-11 17:31:25'),
	(20, 'jtorres', 'Torres', 'Joe', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'inactive', 0, 9517583340, 'yoyo@gmail.com', 'XL', NULL, NULL, '2019-12-11 17:32:13'),
	(21, 'jcho', 'Cho', 'James', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'James', NULL, 'active', 1, 1234567891, 'email@email.email', 'L', 't-mobile', NULL, '2019-12-11 17:30:47'),
	(22, 'hsimpson', 'Simpson', 'Henry', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 0, 8486175855, 'henry@email.com', 's', 'verizon', NULL, '2019-12-11 17:30:48'),
	(23, 'sholt', 'Holt', 'Samuel', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 0, 8486195855, 'samuel@email.com', 's', 'verizon', NULL, '2019-12-11 17:30:51'),
	(24, 'rsimms', 'Simms', 'Robert', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 8480175855, 'rob@email.com', 's', 'verizon', NULL, '2019-12-11 17:30:52'),
	(25, 'kbryant', 'Bryant', 'Kobe', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 0, 8436175855, 'kobe@email.com', 's', 'verizon', NULL, '2019-12-11 17:30:52'),
	(26, 'kleonard', 'Leonard', 'Kyle', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 8487175855, 'kyle@email.com', 's', 'verizon', NULL, '2019-12-11 17:30:53'),
	(27, 'sbolt', 'Bolt', 'Sean', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 0, 8555195855, 'sean@email.com', 's', 'verizon', NULL, '2019-12-11 17:30:54'),
	(28, 'rsimmons', 'Simmons', 'Raul', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 5550175855, 'raul@email.com', 's', 'verizon', NULL, '2019-12-11 17:30:55'),
	(30, 'mleo', 'Leo', 'Michael', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 8488875855, 'mike@email.com', 's', 'verizon', NULL, '2019-12-11 17:30:55'),
	(31, 'jharper', 'Harper', 'Jean', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 0, 1555195855, 'jean@email.com', 's', 'verizon', NULL, '2019-12-11 17:30:56'),
	(33, 'adavis', 'Davis', 'Anthony', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 0, 8432175555, 'ad@email.com', 'xxl', 'verizon', NULL, '2019-12-11 17:30:57'),
	(35, 'ptims', 'Tims', 'Paul', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 1550175855, 'paul@email.com', 's', 'verizon', NULL, '2019-12-11 17:31:00'),
	(37, 'mcane', 'Cane', 'Matt', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 8488875835, 'matt@email.com', 's', 'verizon', NULL, '2019-12-11 17:31:01'),
	(41, 'bhall', 'Hall', 'Ben', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 0, 1555192255, 'ben@email.com', 's', 'verizon', NULL, '2019-12-11 17:31:02'),
	(42, 'pthompson', 'Thompson', 'Paula', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 1554475855, 'paula@email.com', 's', 'verizon', NULL, '2019-12-11 17:31:02'),
	(43, 'tdavey', 'Davey', 'Tony', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 0, 8432225555, 'tony@email.com', 'xxl', 'verizon', NULL, '2019-12-11 17:31:03'),
	(44, 'mcanelo', 'Canelo', 'Madison', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 3388875835, 'madison@email.com', 's', 'verizon', NULL, '2019-12-11 17:31:04'),
	(45, 'kball', 'Ball', 'Ken', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 0, 1555102255, 'ken@email.com', 's', 'verizon', NULL, '2019-12-11 17:31:04'),
	(46, 'pson', 'Son', 'Pam', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 1525555855, 'pam@email.com', 's', 'verizon', NULL, '2019-12-11 17:31:05'),
	(47, 'sdavidson', 'Davidson', 'Sonny', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 0, 8430025555, 'sonny@email.com', 'xxl', 'verizon', NULL, '2019-12-11 17:31:06'),
	(48, 'mangelo', 'Angelo', 'Mark', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, 5588875835, 'mark@email.com', 's', 'verizon', NULL, '2019-12-11 17:31:07'),
	(49, 'atest', 'Test', 'Admin', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 0, 1231231234, 'admin@test.com', NULL, NULL, NULL, '2019-12-11 17:31:14'),
	(50, 'otest', 'Test', 'Operator', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 0, 1231231234, 'operator@test.com', NULL, NULL, NULL, '2019-12-11 17:31:14'),
	(51, 'ntest', 'Test', 'NoRoles', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'No Roles Joe', NULL, 'active', 0, 1231231234, 'noroles@test.com', NULL, NULL, NULL, '2019-12-11 17:31:12');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
