-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : lun. 03 mars 2025 à 20:08
-- Version du serveur : 11.6.2-MariaDB
-- Version de PHP : 8.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `Freelance-app`
--

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` varchar(36) NOT NULL,
  `sender_id` varchar(36) NOT NULL,
  `receiver_id` varchar(36) NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `content`, `is_read`, `created_at`) VALUES
('1', '123', '456', 'Bonjour, je suis intéressé par votre projet', 1, '2025-03-03 01:59:48'),
('2', '456', '123', 'Merci pour votre intérêt ! Pouvez-vous me donner plus de détails sur votre expérience ?', 0, '2025-03-03 01:59:48');

-- --------------------------------------------------------

--
-- Structure de la table `profiles`
--

CREATE TABLE `profiles` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `user_type` enum('client','freelance') NOT NULL,
  `description` text DEFAULT NULL,
  `portfolio_url` varchar(255) DEFAULT NULL,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `skills` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `profiles`
--

INSERT INTO `profiles` (`id`, `user_id`, `name`, `user_type`, `description`, `portfolio_url`, `hourly_rate`, `created_at`, `updated_at`, `skills`) VALUES
('123', 123, 'John Doe', 'freelance', 'Développeur full-stack avec 5 ans d\'expérience', NULL, 50.00, '2025-03-03 01:59:48', '2025-03-03 01:59:48', NULL),
('21ccbf57-f83a-11ef-9022-9256f5cb1b22', 465, 'gogo', 'client', NULL, NULL, NULL, '2025-03-03 14:16:43', '2025-03-03 14:16:43', NULL),
('2e2d2e7c-f82d-11ef-9022-9256f5cb1b22', 462, 'jojo', 'client', NULL, NULL, NULL, '2025-03-03 12:44:00', '2025-03-03 12:44:00', NULL),
('456', 456, 'Entreprise ABC', 'client', 'Entreprise spécialisée dans le e-commerce', NULL, NULL, '2025-03-03 01:59:48', '2025-03-03 01:59:48', NULL),
('5ca0e186-f830-11ef-9022-9256f5cb1b22', 463, 'mama', 'client', NULL, NULL, 199.00, '2025-03-03 13:06:46', '2025-03-03 13:06:46', 'mama'),
('65dccbec-f860-11ef-bc22-c6a3dc6565ca', 466, 'sisi', 'client', NULL, NULL, NULL, '2025-03-03 18:50:38', '2025-03-03 18:50:38', NULL),
('a5a496a3-f831-11ef-9022-9256f5cb1b22', 464, 'zldkl', 'client', NULL, NULL, NULL, '2025-03-03 13:15:58', '2025-03-03 13:15:58', NULL),
('aa9321b8-f82c-11ef-9022-9256f5cb1b22', 460, 'MENSAH', 'client', NULL, NULL, NULL, '2025-03-03 12:40:19', '2025-03-03 12:40:19', NULL),
('d55fc413-f82c-11ef-9022-9256f5cb1b22', 461, 'zldkl', 'client', NULL, NULL, 96.00, '2025-03-03 12:41:31', '2025-03-03 12:41:31', 'papa');

-- --------------------------------------------------------

--
-- Structure de la table `profile_skills`
--

CREATE TABLE `profile_skills` (
  `profile_id` varchar(36) NOT NULL,
  `skill_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `profile_skills`
--

INSERT INTO `profile_skills` (`profile_id`, `skill_id`) VALUES
('123', 1),
('123', 2),
('123', 3);

-- --------------------------------------------------------

--
-- Structure de la table `projects`
--

CREATE TABLE `projects` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `budget` decimal(10,2) NOT NULL,
  `status` enum('en_attente','en_cours','termine') NOT NULL DEFAULT 'en_attente',
  `client_id` varchar(36) NOT NULL,
  `freelance_id` varchar(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `budget`, `status`, `client_id`, `freelance_id`, `created_at`, `updated_at`) VALUES
('1', 'Application Web E-commerce', 'Création d\'une boutique en ligne complète avec panier et paiement', 3000.00, 'en_attente', '456', NULL, '2025-03-03 01:59:48', '2025-03-03 01:59:48'),
('2', 'Refonte de Site Vitrine', 'Modernisation d\'un site existant avec design responsive', 1500.00, 'en_cours', '456', '123', '2025-03-03 01:59:48', '2025-03-03 01:59:48');

-- --------------------------------------------------------

--
-- Structure de la table `proposals`
--

CREATE TABLE `proposals` (
  `id` varchar(36) NOT NULL,
  `project_id` varchar(36) NOT NULL,
  `freelance_id` varchar(36) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `status` enum('en_attente','accepte','refuse') NOT NULL DEFAULT 'en_attente',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `proposals`
--

INSERT INTO `proposals` (`id`, `project_id`, `freelance_id`, `price`, `description`, `status`, `created_at`, `updated_at`) VALUES
('1', '1', '123', 2800.00, 'Je peux réaliser ce projet en 3 semaines avec toutes les fonctionnalités demandées', 'en_attente', '2025-03-03 01:59:48', '2025-03-03 01:59:48');

-- --------------------------------------------------------

--
-- Structure de la table `reviews`
--

CREATE TABLE `reviews` (
  `id` varchar(36) NOT NULL,
  `project_id` varchar(36) NOT NULL,
  `reviewer_id` varchar(36) NOT NULL,
  `reviewed_id` varchar(36) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reviews`
--

INSERT INTO `reviews` (`id`, `project_id`, `reviewer_id`, `reviewed_id`, `rating`, `comment`, `created_at`) VALUES
('1', '2', '456', '123', 5, 'Excellent travail, livré dans les délais', '2025-03-03 01:59:48');

-- --------------------------------------------------------

--
-- Structure de la table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `skills`
--

INSERT INTO `skills` (`id`, `name`) VALUES
(9, 'Angular'),
(15, 'Content Writing'),
(17, 'DevOps'),
(11, 'Graphic Design'),
(4, 'JavaScript'),
(7, 'Laravel'),
(14, 'Marketing'),
(16, 'Mobile Development'),
(2, 'Node.js'),
(6, 'PHP'),
(5, 'Python'),
(1, 'React'),
(13, 'SEO'),
(3, 'TypeScript'),
(10, 'UI/UX Design'),
(8, 'Vue.js'),
(12, 'WordPress');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `created_at`, `updated_at`, `user_type`) VALUES
(123, 'john.doe@example.com', 'hashed_password', '2025-03-03 01:59:48', '2025-03-03 01:59:48', ''),
(456, 'client@example.com', 'hashed_password', '2025-03-03 01:59:48', '2025-03-03 01:59:48', ''),
(458, 'jeanmarcmensah10@gmail.com', 'qojqp jejf', '2025-03-03 12:26:55', '2025-03-03 12:26:55', 'client'),
(460, 'mensahjeanmarc00@gmail.com', '$2b$10$gzMUC.5QTBBGFUs/mFVKiuCZBjeTpccVUMe98sIVYdpZ66nT/YO2a', '2025-03-03 12:40:19', '2025-03-03 12:40:19', 'client'),
(461, 'djopzd@gmail', '$2b$10$TyJX4tHlQXWVbLne3VF3x.4FqqZT2qu86oWsS4oRLMY/7bDtROq9u', '2025-03-03 12:41:30', '2025-03-03 12:41:30', 'freelance'),
(462, 'jojo@gmail', '$2b$10$Bg0N/IgRqw7u455SBGbH4eGwqT1G5UWhtApujjuNz.EZuRPOj9/3e', '2025-03-03 12:44:00', '2025-03-03 12:44:00', 'client'),
(463, 'mama@gmail', '$2b$10$KH33rZV5xj.4zlD4lFDPge.9yr6/x0J070DV/4uXBa8GBn9QhGWQu', '2025-03-03 13:06:46', '2025-03-03 13:06:46', 'freelance'),
(464, 'mensahjenarc00@gmail.com', '$2b$10$ou7MjMPFXZOkMCAMM5489OCChgL3lEBb6lS.FMBKxX9dTo0aJg7/a', '2025-03-03 13:15:58', '2025-03-03 13:15:58', 'client'),
(465, 'gogo@gmail', '$2b$10$g8l3V/UH.ak.Pjm7eY6ZfOwaIzEprpPxoUibf1cRJehSXt87H9Cj6', '2025-03-03 14:16:42', '2025-03-03 14:16:42', 'client'),
(466, 'sisi@gmail', '$2b$10$g5NtE599CQwIuaEsduA.EegCPn5070iQJ9bL.hljE/t.FjIEdksV2', '2025-03-03 18:50:37', '2025-03-03 18:50:37', 'client');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Index pour la table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profiles_ibfk_1` (`user_id`);

--
-- Index pour la table `profile_skills`
--
ALTER TABLE `profile_skills`
  ADD PRIMARY KEY (`profile_id`,`skill_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Index pour la table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `freelance_id` (`freelance_id`);

--
-- Index pour la table `proposals`
--
ALTER TABLE `proposals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `freelance_id` (`freelance_id`);

--
-- Index pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `reviewer_id` (`reviewer_id`),
  ADD KEY `reviewed_id` (`reviewed_id`);

--
-- Index pour la table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=467;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `profile_skills`
--
ALTER TABLE `profile_skills`
  ADD CONSTRAINT `profile_skills_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `profile_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`freelance_id`) REFERENCES `profiles` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `proposals`
--
ALTER TABLE `proposals`
  ADD CONSTRAINT `proposals_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `proposals_ibfk_2` FOREIGN KEY (`freelance_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`reviewed_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
