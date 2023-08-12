DROP TABLE IF EXISTS tgimglog;
CREATE TABLE IF NOT EXISTS tgimglog (
	`id` integer PRIMARY KEY NOT NULL,
    `url` text,
    `referer` text,
	`ip` varchar(255),
	`time` DATE
);
DROP TABLE IF EXISTS imginfo;
CREATE TABLE IF NOT EXISTS imginfo (
	`id` integer PRIMARY KEY NOT NULL,
    `url` text,
    `referer` text,
	`ip` varchar(255),
	`rating` text,
	`total` integer,
	`time` DATE
);