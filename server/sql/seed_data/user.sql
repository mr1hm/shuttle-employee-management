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

-- Dumping data for table anteaterExpress.user: ~40 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `uci_net_id`, `last_name`, `first_name`, `password`, `nickname`, `photo`, `status`, `role`, `special_route_ok`, `phone`, `email`, `shirt_size`, `cell_provider`, `url`, `last_update`) VALUES
	(1, 1, 'unassigned', 'unassigned', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'admin', 1, 8765432311, '', '', '', '', '2019-12-02 12:31:19'),
	(3, 6765452515, 'Smith', 'Jason', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Jase', '', 'active', 'admin', 1, 8765432311, 'jsmith@yahoo.com', 'L', '', '', '2019-12-02 12:31:19'),
	(4, 7765455415, 'Wu', 'Teresa', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Terry', '', 'active', 'operator', 0, 9495432311, 'teresakwu@uci.edu', 'S', '', '', '2019-12-02 12:31:19'),
	(5, 6777452505, 'Samuel', 'Martha', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'trainer', 1, 8765432421, 'martha.samuel@bellsouth.net', 'M', '', '', '2019-12-02 12:31:19'),
	(6, 6787652915, 'Espinosa', 'Amelia', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Ame', '', 'active', 'trainee', 0, 7656543321, 'espinosa_amelia@frontier.net', 'L', '', '', '2019-12-02 12:31:19'),
	(7, 6897452508, 'Jones', 'Samantha', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Sam', '', 'active', 'super_admin', 0, 8865434411, 'samantha.jones@uci.edu', 'XS', '', '', '2019-12-02 12:31:19'),
	(8, 8895652615, 'Boles', 'John', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operations', 1, 8775452313, 'boles.john@att.net', 'XL', '', '', '2019-12-02 12:31:19'),
	(9, 9875454415, 'French', 'Melissa', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Missy', '', 'inactive', 'operator', 1, 8776543322, 'frenchmelissa@bellsouth.net', 'S', '', '', '2019-12-02 12:31:19'),
	(10, 7797452510, 'Rogers', 'Betty', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 4155452211, 'betty_rogers@myspace.com', 'L', '', '', '2019-12-02 12:31:19'),
	(11, 198989898989898, 'Jauregui', 'Raul', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 4544543333, '', '', '', '', '2019-12-02 12:31:19'),
	(12, 198989898979898, 'White', 'Zack', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 4544543333, '', '', '', '', '2019-12-02 12:31:19'),
	(13, 2342758749586, 'Cardona', 'Rick', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 9512356560, 'joe@example.com', 'XXL', 'Project Fi', '', '2019-12-07 10:10:05'),
	(14, 12345, 'Blade', 'Jack', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 6753245555, 'bladej@mail.com', 'S', '  ATT', '', '2019-12-02 12:31:19'),
	(15, 2342754749586, 'White', 'James', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 6754345555, '', 'S', '  ATT', '', '2019-12-02 12:31:19'),
	(16, 284657485737445, 'Watson', 'Bill', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 7852347777, '', '', '', '', '2019-12-02 12:31:19'),
	(17, 2342758749584, 'Torres', 'Karen', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 5763421111, 'torresk@mail.com', 'M', 'Boost Mobile ', 'Array', '2019-12-05 17:26:48'),
	(18, 45989746987945, 'Domes', 'Henry', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 2137777777, '', 'XXL', 'Cricket Wireless', '', '2019-12-02 12:31:19'),
	(19, 2342768749586, 'Mann', 'Otto ', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'inactive', 'operator', 0, 2134345555, 'littlem@myspace.com', 'XL', 'Verizon', '../assets/images/profile/happy otta.jpeg', '2019-12-02 12:31:19'),
	(20, 4598956987945, 'Torres', 'Joe', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'inactive', 'operator', 0, 9517583340, 'yoyo@gmail.com', 'XL', '', '', '2019-12-02 12:31:19'),
	(21, 456123789, 'Cho', 'James', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'James', '', 'active', 'operator', 1, 1234567891, 'email@email.email', 'L', 't-mobile', '', '2019-12-02 12:31:19'),
	(22, 798654321, 'Simpson', 'Henry', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 0, 8486175855, 'henry@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(23, 2798654321, 'Holt', 'Samuel', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 0, 8486195855, 'samuel@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(24, 1798654321, 'Simms', 'Robert', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 8480175855, 'rob@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(25, 3798654321, 'Bryant', 'Kobe', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 0, 8436175855, 'kobe@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(26, 4798654321, 'Leonard', 'Kyle', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 8487175855, 'kyle@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(27, 12798654321, 'Bolt', 'Sean', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 0, 8555195855, 'sean@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(28, 11798654321, 'Simmons', 'Raul', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 5550175855, 'raul@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(30, 14798654321, 'Leo', 'Michael', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 8488875855, 'mike@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(31, 312798654321, 'Harper', 'Jean', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 0, 1555195855, 'jean@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(33, 137654321, 'Davis', 'Anthony', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 0, 8432175555, 'ad@email.com', 'xxl', 'verizon', '', '2019-12-02 12:31:19'),
	(35, 311798321, 'Tims', 'Paul', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 1550175855, 'paul@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(37, 147938654321, 'Cane', 'Matt', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 8488875835, 'matt@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(41, 312798654321, 'Hall', 'Ben', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 0, 1555192255, 'ben@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(42, 31173498321, 'Thompson', 'Paula', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 1554475855, 'paula@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(43, 137654321, 'Davey', 'Tony', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 0, 8432225555, 'tony@email.com', 'xxl', 'verizon', '', '2019-12-02 12:31:19'),
	(44, 1471938654321, 'Canelo', 'Madison', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 3388875835, 'madison@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(45, 3127954321, 'Ball', 'Ken', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 0, 1555102255, 'ken@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(46, 311734598321, 'Son', 'Pam', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 1525555855, 'pam@email.com', 's', 'verizon', '', '2019-12-02 12:31:19'),
	(47, 1376545321, 'Davidson', 'Sonny', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 0, 8430025555, 'sonny@email.com', 'xxl', 'verizon', '', '2019-12-02 12:31:19'),
	(48, 14719386554321, 'Angelo', 'Mark', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 'operator', 1, 5588875835, 'mark@email.com', 's', 'verizon', '', '2019-12-02 12:31:19');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
