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
INSERT INTO `user` (`id`, `uci_net_id`, `last_name`, `first_name`, `password`, `nickname`, `photo`, `status`, `special_route_ok`, `phone`, `email`, `shirt_size_id`, `cell_provider_id`, `url`, `last_update`) VALUES
(1, 'supertest', 'Test', 'Super', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, NULL, 'supertest@uci.edu', NULL, NULL, NULL, '2019-12-13 18:49:08'),
(3, '6765452515', 'Smith', 'Jason', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Jase', '', 'active', 1, 8765432311, 'jsmith@yahoo.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(4, '7765455415', 'Wu', 'Teresa', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Terry', '', 'active', 0, 9495432311, 'teresakwu@uci.edu', NULL, NULL, '', '2019-12-12 23:35:13'),
(5, '6777452505', 'Samuel', 'Martha', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 8765432421, 'martha.samuel@bellsouth.net', NULL, NULL, '', '2019-12-12 23:35:13'),
(6, '6787652915', 'Espinosa', 'Amelia', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Ame', '', 'active', 0, 7656543321, 'espinosa_amelia@frontier.net', NULL, NULL, '', '2019-12-12 23:35:13'),
(7, '6897452508', 'Jones', 'Samantha', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Sam', '', 'active', 0, 8865434411, 'samantha.jones@uci.edu', NULL, NULL, '', '2019-12-12 23:35:13'),
(8, '8895652615', 'Boles', 'Jane', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 8775452313, 'boles.john@att.net', 5, 2, '', '2019-12-13 00:46:32'),
(9, '9875454415', 'French', 'Melissa', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'Missy', '', 'inactive', 1, 8776543322, 'frenchmelissa@bellsouth.net', NULL, NULL, '', '2019-12-12 23:35:13'),
(10, '7797452510', 'Rogers', 'Betty', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 4155452211, 'betty_rogers@myspace.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(13, '2342758749586', 'Cardona', 'Rick', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 9512356560, 'joe@example.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(14, '12345', 'Blade', 'Jack', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 6753245555, 'bladej@mail.com', 3, 4, '', '2019-12-12 23:35:55'),
(17, '2342758749584', 'Torres', 'Karen', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 5763421111, 'torresk@mail.com', NULL, NULL, 'Array', '2019-12-12 23:35:13'),
(19, '2342768749586', 'Mann', 'Otto ', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'inactive', 0, 2134345555, 'littlem@myspace.com', NULL, NULL, '../assets/images/profile/happy otta.jpeg', '2019-12-12 23:35:13'),
(20, '4598956987945', 'Torres', 'Joe', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'inactive', 0, 9517583340, 'yoyo@gmail.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(21, '456123789', 'Cho', 'James', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'James', '', 'active', 1, 1234567891, 'email@email.email', NULL, NULL, '', '2019-12-12 23:35:13'),
(22, '798654321', 'Simpson', 'Henry', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 0, 8486175855, 'henry@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(23, '2798654321', 'Holt', 'Samuel', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 0, 8486195855, 'samuel@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(24, '1798654321', 'Simms', 'Robert', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 8480175855, 'rob@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(25, '3798654321', 'Bryant', 'Kobe', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 0, 8436175855, 'kobe@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(26, '4798654321', 'Leonard', 'Kyle', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 8487175855, 'kyle@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(27, '12798654321', 'Bolt', 'Sean', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 0, 8555195855, 'sean@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(28, '11798654321', 'Simmons', 'Raul', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 5550175855, 'raul@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(30, '14798654321', 'Leo', 'Michael', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 8488875855, 'mike@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(31, '312798654321', 'Harper', 'Jean', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 0, 1555195855, 'jean@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(33, '137654321', 'Davis', 'Anthony', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 0, 8432175555, 'ad@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(35, '311798321', 'Tims', 'Paul', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 1550175855, 'paul@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(37, '147938654321', 'Cane', 'Matt', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 8488875835, 'matt@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(44, '1471938654321', 'Canelo', 'Madison', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 3388875835, 'madison@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(45, '3127954321', 'Ball', 'Ken', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 0, 1555102255, 'ken@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(46, '311734598321', 'Son', 'Pam', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 1525555855, 'pam@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(48, '14719386554321', 'Angelo', 'Mark', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 1, 5588875835, 'mark@email.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(49, 'testadmin123', 'Test', 'Admin', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 0, 1231231234, 'admin@test.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(50, 'testoperator123', 'Test', 'Operator', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', '', '', 'active', 0, 1231231234, 'operator@test.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(51, 'testnoroles123', 'Test', 'NoRoles', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'No Roles Joe', '', 'active', 0, 1231231234, 'noroles@test.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(52, '424242', 'Admin', 'Super', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', 'SuperAdmin', '', 'active', 0, 9879879876, 'superadmin@test.com', NULL, NULL, '', '2019-12-12 23:35:13'),
(65, 'testpassword', 'Password', 'Test', '$2y$10$v/GWffiaPJmFxSVLGGBBhOySN5eG.gN153F2ctDRDnc1AvXsC/6Fe', NULL, NULL, 'active', 0, NULL, 'testpassword@uci.edu', NULL, NULL, NULL, '2019-12-13 18:26:15');

/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
