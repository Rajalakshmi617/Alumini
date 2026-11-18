CREATE DATABASE IF NOT EXISTS alumni_connect;
USE alumni_connect;

-- 1) Users: login details + role
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','alumni','admin') NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE
);

-- 2) Profiles: extra details (one profile per user)
CREATE TABLE IF NOT EXISTS profiles (
  user_id INT PRIMARY KEY,
  company VARCHAR(100),
  designation VARCHAR(100),
  department VARCHAR(100),
  batch INT,
  skills VARCHAR(255),
  linkedin VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 3) Referral requests: student -> alumni
CREATE TABLE IF NOT EXISTS referral_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  alumni_id INT NOT NULL,
  message TEXT,
  resume_link VARCHAR(255),
  status ENUM('requested','accepted','referred','rejected') DEFAULT 'requested',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (alumni_id) REFERENCES users(id)
);

-- 4) Slots: alumni free time, student_id NULL = free
CREATE TABLE IF NOT EXISTS slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alumni_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  student_id INT NULL,
  room_name VARCHAR(100) NULL,
  UNIQUE (alumni_id, start_time),
  FOREIGN KEY (alumni_id) REFERENCES users(id)
);