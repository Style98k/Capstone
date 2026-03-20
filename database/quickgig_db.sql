-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 26, 2026 at 12:53 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quickgig_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--
-- Error reading structure for table quickgig_db.applications: #1932 - Table &#039;quickgig_db.applications&#039; doesn&#039;t exist in engine
-- Error reading data for table quickgig_db.applications: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `quickgig_db`.`applications`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--
-- Error reading structure for table quickgig_db.conversations: #1932 - Table &#039;quickgig_db.conversations&#039; doesn&#039;t exist in engine
-- Error reading data for table quickgig_db.conversations: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `quickgig_db`.`conversations`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `gigs`
--
-- Error reading structure for table quickgig_db.gigs: #1932 - Table &#039;quickgig_db.gigs&#039; doesn&#039;t exist in engine
-- Error reading data for table quickgig_db.gigs: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `quickgig_db`.`gigs`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `grade_inquiries`
--

CREATE TABLE `grade_inquiries` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `id_proof_path` varchar(255) DEFAULT NULL,
  `status` enum('pending','under_review','resolved') NOT NULL DEFAULT 'pending',
  `grade_file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--
-- Error reading structure for table quickgig_db.messages: #1932 - Table &#039;quickgig_db.messages&#039; doesn&#039;t exist in engine
-- Error reading data for table quickgig_db.messages: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `quickgig_db`.`messages`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--
-- Error reading structure for table quickgig_db.notifications: #1932 - Table &#039;quickgig_db.notifications&#039; doesn&#039;t exist in engine
-- Error reading data for table quickgig_db.notifications: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `quickgig_db`.`notifications`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--
-- Error reading structure for table quickgig_db.ratings: #1932 - Table &#039;quickgig_db.ratings&#039; doesn&#039;t exist in engine
-- Error reading data for table quickgig_db.ratings: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `quickgig_db`.`ratings`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--
-- Error reading structure for table quickgig_db.transactions: #1932 - Table &#039;quickgig_db.transactions&#039; doesn&#039;t exist in engine
-- Error reading data for table quickgig_db.transactions: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `quickgig_db`.`transactions`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `users`
--
-- Error reading structure for table quickgig_db.users: #1932 - Table &#039;quickgig_db.users&#039; doesn&#039;t exist in engine
-- Error reading data for table quickgig_db.users: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `quickgig_db`.`users`&#039; at line 1
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
