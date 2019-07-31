-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 31, 2019 at 10:25 PM
-- Server version: 5.7.26-0ubuntu0.18.04.1
-- PHP Version: 7.2.19-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `anteaterExpress`
--

-- --------------------------------------------------------

--
-- Table structure for table `busInfo`
--

CREATE TABLE `busInfo` (
  `id` mediumint(9) NOT NULL,
  `serial` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `make` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `model` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `miles` mediumint(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `busInfo`
--

INSERT INTO `busInfo` (`id`, `serial`, `make`, `model`, `miles`) VALUES
(1, 'AB123456C', 'Chevrolet', 'Express', 1200),
(2, 'CD123456E', 'GMC', 'Savannah', 2000);

-- --------------------------------------------------------

--
-- Table structure for table `routeBusDayInfo`
--

CREATE TABLE `routeBusDayInfo` (
  `id` mediumint(9) NOT NULL,
  `routeID` mediumint(9) NOT NULL,
  `dayOfWeek` tinyint(4) NOT NULL,
  `busID` mediumint(9) NOT NULL,
  `startTime` smallint(6) NOT NULL,
  `endTime` smallint(6) NOT NULL,
  `authorID` mediumint(9) NOT NULL,
  `ownerID` mediumint(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `routeBusDayInfo`
--

INSERT INTO `routeBusDayInfo` (`id`, `routeID`, `dayOfWeek`, `busID`, `startTime`, `endTime`, `authorID`, `ownerID`) VALUES
(1, 2, 0, 1, 800, 1449, 2, 1),
(2, 1, 3, 2, 700, 2300, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `routeMetaData`
--

CREATE TABLE `routeMetaData` (
  `id` mediumint(9) NOT NULL,
  `startTime` smallint(6) NOT NULL,
  `stopTime` smallint(6) NOT NULL,
  `legDuration` tinyint(4) NOT NULL,
  `startDuration` tinyint(4) NOT NULL,
  `endDuration` tinyint(4) NOT NULL,
  `lineName` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8_unicode_ci NOT NULL,
  `authorID` mediumint(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `routeMetaData`
--

INSERT INTO `routeMetaData` (`id`, `startTime`, `stopTime`, `legDuration`, `startDuration`, `endDuration`, `lineName`, `status`, `authorID`) VALUES
(1, 600, 2400, 30, 60, 45, 'M Weekday', 'active', 2),
(2, 815, 2145, 15, 15, 30, 'E', 'active', 2);

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` smallint(6) NOT NULL,
  `title` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `status` enum('active','inactive') COLLATE utf8_unicode_ci NOT NULL,
  `authorID` mediumint(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id`, `title`, `startDate`, `endDate`, `status`, `authorID`) VALUES
(1, 'Summer 2019', '2019-05-30', '2019-08-10', 'active', 2),
(2, 'Fall 2019', '2019-08-11', '2019-11-30', 'inactive', 2);

-- --------------------------------------------------------

--
-- Table structure for table `shift`
--

CREATE TABLE `shift` (
  `id` mediumint(9) NOT NULL,
  `startTime` smallint(6) NOT NULL,
  `endTime` smallint(6) NOT NULL,
  `routeInfoID` mediumint(9) NOT NULL,
  `authorID` mediumint(9) NOT NULL,
  `sessionID` smallint(6) NOT NULL,
  `status` enum('scheduled','posted','traded','swapped') COLLATE utf8_unicode_ci NOT NULL,
  `ownerID` mediumint(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `shift`
--

INSERT INTO `shift` (`id`, `startTime`, `endTime`, `routeInfoID`, `authorID`, `sessionID`, `status`, `ownerID`) VALUES
(1, 600, 1100, 2, 2, 1, 'scheduled', 1),
(2, 1330, 1630, 1, 2, 1, 'posted', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` mediumint(9) NOT NULL,
  `name` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `added` datetime NOT NULL,
  `addedBy` mediumint(9) NOT NULL,
  `status` enum('admin','driver','manager','') COLLATE utf8_unicode_ci NOT NULL,
  `rights` mediumint(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `added`, `addedBy`, `status`, `rights`) VALUES
(1, 'Lisa Lopez', 'llopez@uci.edu', '2019-07-31 00:00:00', 2, 'driver', 256),
(2, 'Tim Smith', 'tsmith@uci.edu', '2019-07-30 00:00:00', 2, 'manager', 256);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `busInfo`
--
ALTER TABLE `busInfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `routeBusDayInfo`
--
ALTER TABLE `routeBusDayInfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `routeMetaData`
--
ALTER TABLE `routeMetaData`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shift`
--
ALTER TABLE `shift`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `busInfo`
--
ALTER TABLE `busInfo`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `routeBusDayInfo`
--
ALTER TABLE `routeBusDayInfo`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `routeMetaData`
--
ALTER TABLE `routeMetaData`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=201;
--
-- AUTO_INCREMENT for table `shift`
--
ALTER TABLE `shift`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2001;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
