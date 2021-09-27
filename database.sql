create table if not exists actors
(
    actor_id  int auto_increment
        primary key,
    name      varchar(50) null,
    thumbnail mediumblob  null
)
    comment 'informations about different actors';

create table if not exists settings
(
    video_path       varchar(255)                          null,
    episode_path     varchar(255)                          null,
    password         varchar(32) default '-1'              null,
    mediacenter_name varchar(32) default 'OpenMediaCenter' null,
    TMDB_grabbing    tinyint                               null,
    DarkMode         tinyint     default 0                 null
);

create table if not exists tags
(
    tag_id   int auto_increment
        primary key,
    tag_name varchar(50) null
);

create table if not exists tvshow
(
    name       varchar(100) null,
    thumbnail  mediumblob   null,
    id         int auto_increment
        primary key,
    foldername varchar(100) null
);

create table if not exists tvshow_episodes
(
    id        int auto_increment
        primary key,
    name      varchar(100) null,
    season    int          null,
    poster    mediumblob   null,
    tvshow_id int          null,
    episode   int          null,
    filename  varchar(100) null,
    constraint tvshow_episodes_tvshow_id_fk
        foreign key (tvshow_id) references tvshow (id)
);

create table if not exists videos
(
    movie_id    int auto_increment
        primary key,
    movie_name  varchar(200)                         null,
    movie_url   varchar(250)                         null,
    thumbnail   mediumblob                           null,
    poster      mediumblob                           null,
    likes       int      default 0                   null,
    quality     int      default 0                   null,
    length      int      default 0                   null comment 'in seconds',
    create_date datetime default current_timestamp() null
);

create table if not exists actors_videos
(
    actor_id int null,
    video_id int null,
    constraint actors_videos_actors_id_fk
        foreign key (actor_id) references actors (actor_id),
    constraint actors_videos_videos_movie_id_fk
        foreign key (video_id) references videos (movie_id)
);

create index if not exists actors_videos_actor_id_index
    on actors_videos (actor_id);

create index if not exists actors_videos_video_id_index
    on actors_videos (video_id);

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


INSERT IGNORE INTO tags (tag_id, tag_name)
VALUES (2, 'fullhd');
INSERT IGNORE INTO tags (tag_id, tag_name)
VALUES (3, 'lowquality');
INSERT IGNORE INTO tags (tag_id, tag_name)
VALUES (4, 'hd');

INSERT IGNORE INTO settings (video_path, episode_path, password, mediacenter_name)
VALUES ('./videos/', './tvshows/', -1, 'OpenMediaCenter');
