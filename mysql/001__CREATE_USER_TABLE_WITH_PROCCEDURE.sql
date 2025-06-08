CREATE TABLE IF NOT EXISTS users (
    userId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    type TINYINT UNSIGNED NOT NULL DEFAULT 1,
    active TINYINT(1) NOT NULL DEFAULT 1
);

DELIMITER //

CREATE PROCEDURE addUser (
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_type TINYINT UNSIGNED,
    IN p_active TINYINT(1)
)
BEGIN
    INSERT INTO users (email, password, type, active)
    VALUES (p_email, p_password, p_type, p_active);
END //

DELIMITER ;

CALL addUser('test@test.test', 'testvalue', 1, 1);