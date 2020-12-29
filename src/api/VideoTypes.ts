export interface loadVideoType {
    movie_url: string
    thumbnail: string
    movie_id: number
    movie_name: string
    likes: number
    quality: number
    length: number
    tags: TagType[]
    suggesttag: TagType[]
    actors: ActorType[]
}

export interface VideoUnloadedType {
    movie_id: number;
    movie_name: string
}

/**
 * type accepted by Tag component
 */
export interface TagType {
    tag_name: string
    tag_id: number
}

export interface ActorType {
    thumbnail: string;
    name: string;
    actor_id: number;
}
