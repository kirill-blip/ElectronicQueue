DROP TABLE IF EXISTS entry;
DROP TABLE IF EXISTS user_admin;
DROP TABLE IF EXISTS block_list;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "admin";

CREATE TABLE "user" (
                         id SERIAL PRIMARY KEY,
                         chat_id VARCHAR(255),
                         first_name VARCHAR(100),
                         last_name VARCHAR(100),
                         number_phone VARCHAR(20),
                         UNIQUE (number_phone)
);

CREATE TABLE "admin" (
                         id SERIAL PRIMARY KEY,
                         login VARCHAR(25) NOT NULL,
                         first_name VARCHAR(100) NOT NULL,
                         last_name VARCHAR(100) NOT NULL,
                         password VARCHAR(255) NOT NULL,
                         table_number INTEGER NOT NULL,
                         status BOOLEAN DEFAULT FALSE
);

CREATE TABLE entry (
                         id SERIAL PRIMARY KEY,
                         ticket_number INTEGER NOT NULL,
                         user_id INTEGER REFERENCES "user"(id),
                         admin_id INTEGER REFERENCES "admin"(id),
                         date TIMESTAMP,
                         status VARCHAR(50)
);

CREATE TABLE block_list (
                         id SERIAL PRIMARY KEY,
                         chat_id VARCHAR(255),
                         first_name VARCHAR(100),
                         last_name VARCHAR(100),
                         phone VARCHAR(20)
);

CREATE TABLE user_admin (
                         user_id INTEGER REFERENCES "user"(id)
);
