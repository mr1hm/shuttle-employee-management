-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 13, 2019 at 07:36 PM
-- Server version: 5.7.26-0ubuntu0.18.04.1
-- PHP Version: 7.2.17-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `anteaterExpress`
--

-- --------------------------------------------------------

--
-- Table structure for table `shirt_sizes`
--

CREATE TABLE `shirt_sizes` (
  `id` int(10) UNSIGNED NOT NULL,
  `size` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `shirt_sizes`
--
ALTER TABLE `shirt_sizes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `shirt_sizes`
--
ALTER TABLE `shirt_sizes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
  