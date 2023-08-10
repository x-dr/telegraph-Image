DROP TABLE IF EXISTS tgimglog;
CREATE TABLE IF NOT EXISTS tgimglog (
	`id` integer PRIMARY KEY NOT NULL,
    `url` text,
    `referer` text,
	`ip` varchar(255),
	`time` DATE
);
INSERT INTO `tgimglog` VALUES (null,"/file/ae81be3de6c1168e0b9b4.png", "https://img.131213.xyz","127.0.0.1", '2023-07-15 20:10:58');
