import {ActorType, TagType} from './VideoTypes';

export namespace VideoTypes {
    export interface loadVideoType {
        MovieUrl: string
        Poster: string
        MovieId: number
        MovieName: string
        Likes: number
        Quality: number
        Length: number
        Tags: TagType[]
        SuggestedTag: TagType[]
        Actors: ActorType[]
    }

    export interface startDataType {
        VideoNr: number;
        FullHdNr: number;
        HDNr: number;
        SDNr: number;
        DifferentTags: number;
        Tagged: number;
    }

    export interface VideoUnloadedType {
        MovieId: number;
        MovieName: string
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
