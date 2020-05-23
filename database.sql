create table if not exists videos
(
    movie_id   int auto_increment
        primary key,
    movie_name varchar(200)  null,
    movie_url  varchar(200)  null,
    thumbnail  mediumblob    null,
    likes      int default 0 null
);
