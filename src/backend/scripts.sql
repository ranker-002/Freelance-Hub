-- Schéma MySQL pour la plateforme de freelance

-- Suppression des tables si elles existent déjà
DROP TABLE IF EXISTS reviews, messages, proposals, projects, profile_skills, skills, profiles, users;

-- Table des utilisateurs
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des profils
CREATE TABLE profiles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  user_type ENUM('client', 'freelance') NOT NULL,
  description TEXT,
  portfolio_url VARCHAR(255),
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des compétences
CREATE TABLE skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Table de relation entre profils et compétences
CREATE TABLE profile_skills (
  profile_id VARCHAR(36) NOT NULL,
  skill_id INT NOT NULL,
  PRIMARY KEY (profile_id, skill_id),
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Table des projets
CREATE TABLE projects (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  status ENUM('en_attente', 'en_cours', 'termine') NOT NULL DEFAULT 'en_attente',
  client_id VARCHAR(36) NOT NULL,
  freelance_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (freelance_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Table des propositions
CREATE TABLE proposals (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  freelance_id VARCHAR(36) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('en_attente', 'accepte', 'refuse') NOT NULL DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (freelance_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Table des messages (Correction : read → is_read)
CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY,
  sender_id VARCHAR(36) NOT NULL,
  receiver_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE, -- Correction ici
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Table des évaluations
CREATE TABLE reviews (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  reviewer_id VARCHAR(36) NOT NULL,
  reviewed_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Insertion de données de démonstration

-- Compétences
INSERT INTO skills (name) VALUES 
('React'), ('Node.js'), ('TypeScript'), ('JavaScript'), ('Python'), ('PHP'), ('Laravel'),
('Vue.js'), ('Angular'), ('UI/UX Design'), ('Graphic Design'), ('WordPress'), ('SEO'),
('Marketing'), ('Content Writing'), ('Mobile Development'), ('DevOps');

-- Utilisateurs et profils de démonstration
INSERT INTO users (id, email, password_hash) VALUES
('123', 'john.doe@example.com', 'hashed_password'),
('456', 'client@example.com', 'hashed_password');

INSERT INTO profiles (id, user_id, name, user_type, description, hourly_rate) VALUES
('123', '123', 'John Doe', 'freelance', 'Développeur full-stack avec 5 ans d\'expérience', 50),
('456', '456', 'Entreprise ABC', 'client', 'Entreprise spécialisée dans le e-commerce', NULL);

-- Relation profil-compétences
INSERT INTO profile_skills (profile_id, skill_id) VALUES
('123', 1), -- John Doe - React
('123', 2), -- John Doe - Node.js
('123', 3); -- John Doe - TypeScript

-- Projets de démonstration
INSERT INTO projects (id, title, description, budget, status, client_id, freelance_id) VALUES
('1', 'Application Web E-commerce', 'Création d\'une boutique en ligne complète avec panier et paiement', 3000, 'en_attente', '456', NULL),
('2', 'Refonte de Site Vitrine', 'Modernisation d\'un site existant avec design responsive', 1500, 'en_cours', '456', '123');

-- Propositions de démonstration
INSERT INTO proposals (id, project_id, freelance_id, price, description, status) VALUES
('1', '1', '123', 2800, 'Je peux réaliser ce projet en 3 semaines avec toutes les fonctionnalités demandées', 'en_attente');

-- Messages de démonstration (Correction de `read` → `is_read`)
INSERT INTO messages (id, sender_id, receiver_id, content, is_read) VALUES
('1', '123', '456', 'Bonjour, je suis intéressé par votre projet', TRUE),
('2', '456', '123', 'Merci pour votre intérêt ! Pouvez-vous me donner plus de détails sur votre expérience ?', FALSE);

-- Évaluations de démonstration
INSERT INTO reviews (id, project_id, reviewer_id, reviewed_id, rating, comment) VALUES
('1', '2', '456', '123', 5, 'Excellent travail, livré dans les délais');
