DROP TABLE IF EXISTS lists_films;

CREATE TABLE IF NOT EXISTS lists_films (
	list_id serial NOT NULL,
	film_id INTEGER,
	film_type VARCHAR ( 50 ) NOT NULL,
	PRIMARY KEY (list_id, film_id),
	CONSTRAINT fk_list
		FOREIGN KEY(list_id)
			REFERENCES lists(id)
);

DROP TABLE IF EXISTS lists;

CREATE TABLE IF NOT EXISTS lists (
	id SERIAL NOT NULL PRIMARY KEY,
	list_name VARCHAR ( 50 ) NOT NULL,
	description VARCHAR,
	user_id INT,
	CONSTRAINT fk_users
		FOREIGN KEY(user_id)
			REFERENCES users(id)
);


DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
	id SERIAL NOT NULL PRIMARY KEY,
	username VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR NOT NULL,
	created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP 
);




