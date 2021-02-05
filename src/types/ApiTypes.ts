import {ActorType, TagType} from './VideoTypes';

export namespace VideoTypes {
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

    export interface startDataType {
        total: number;
        fullhd: number;
        hd: number;
        sd: number;
        tags: number;
    }

    export interface VideoUnloadedType {
        Movie_id: number;
        Movie_name: string
    }
}

export namespace SettingsTypes {
    export interface initialApiCallData {
        DarkMode: boolean;
        Password: boolean;
        Mediacenter_name: string;
    }

    export interface loadGeneralSettingsType {
        video_path: string,
        episode_path: string,
        mediacenter_name: string,
        password: string,
        passwordEnabled: boolean,
        TMDB_grabbing: boolean,

        videonr: number,
        dbsize: number,
        difftagnr: number,
        tagsadded: number
    }

    export interface getStatusMessageType {
        contentAvailable: boolean;
        message: string;
    }
}

export namespace ActorTypes {
    /**
     * result of actor fetch
     */
    export interface videofetchresult {
        videos: VideoTypes.VideoUnloadedType[];
        info: ActorType;
    }
}
