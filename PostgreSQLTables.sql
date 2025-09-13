CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR (255) UNIQUE NOT NULL,
  username VARCHAR (50),
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE `organizations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR (195) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW() PRIMARY KEY (`id`)
);

CREATE TABLE memberships (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT REFERENCES users (id),
  organization_id INT REFERENCES organizations (id),
  `role` VARCHAR (50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE channels (
  id INT PRIMARY KEY AUTO_INCREMENT,
  org_id INT REFERENCES organizations (id),
  `name` VARCHAR (50),
  `type` ENUM ('channel', 'dm', 'group') NOT NULL,
  created_by INT REFERENCES users (id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

