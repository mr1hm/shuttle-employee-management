-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 13, 2019 at 06:49 PM
-- Server version: 5.7.26-0ubuntu0.18.04.1
-- PHP Version: 7.2.17-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `anteaterExpress`
--

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `uci_net_id`, `last_name`, `first_name`, `password`, `nickname`, `photo`, `status`, `special_route_ok`, `phone`, `email`, `shirt_size_id`, `cell_provider_id`, `url`, `last_update`) VALUES
(1, 'supertest', 'Test', 'Super', '$2y$10$9XZlz5zJ.YEI142.BoKbU.lQ7hP.DtHotozAGKcEALijcKz3YcjxG', NULL, NULL, 'active', 1, NULL, 'supertest@uci.edu', NULL, NULL, NULL, '2019-12-13 18:49:08');
