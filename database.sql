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
    movie_url   varchar(200)                       null,
    thumbnail   mediumblob                         null,
    likes       int      default 0                 null,
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
);