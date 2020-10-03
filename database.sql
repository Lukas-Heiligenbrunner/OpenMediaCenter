create table if not exists tags
(
    tag_id   int auto_increment
        primary key,
    tag_name varchar(50) null
);

create table if not exists videos
(
    movie_id    int auto_increment
        primary key,
    movie_name  varchar(200)                       null,
    movie_url   varchar(250)                       null,
    thumbnail   mediumblob                         null,
    poster      mediumblob                         null,
    likes       int      default 0                 null,
    quality     int                                null,
    length      int                                null comment 'in seconds',
    create_date datetime default CURRENT_TIMESTAMP null
);

create table if not exists video_tags
(
    tag_id   int null,
    video_id int null,
    constraint video_tags_tags_tag_id_fk
        foreign key (tag_id) references tags (tag_id),
    constraint video_tags_videos_movie_id_fk
        foreign key (video_id) references videos (movie_id)
            on delete cascade
);

create table if not exists settings
(
    video_path       varchar(255)                          null,
    episode_path     varchar(255)                          null,
    password         varchar(32) default '-1'              null,
    mediacenter_name varchar(32) default 'OpenMediaCenter' null,
    TMDB_grabbing    tinyint           null,
    DarkMode         tinyint default 0 null
);

INSERT INTO tags (tag_id, tag_name)
VALUES (2, 'fullhd');
INSERT INTO tags (tag_id, tag_name)
VALUES (3, 'lowquality');
INSERT INTO tags (tag_id, tag_name)
VALUES (4, 'hd');

INSERT INTO settings (video_path, episode_path, password, mediacenter_name)
VALUES ('./videos/', './tvshows/', -1, 'OpenMediaCenter');
