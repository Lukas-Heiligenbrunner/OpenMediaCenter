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

export interface TagType {
    tag_name: string
    tag_id: number
}

export interface ActorType {
    // todo implement if necessary
}
