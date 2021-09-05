import {ActorType, TagType} from './VideoTypes';

export namespace VideoTypes {
    export interface loadVideoType {
        MovieUrl: string;
        Poster: string;
        MovieId: number;
        MovieName: string;
        Likes: number;
        Quality: number;
        Length: number;
        Tags: TagType[];
        SuggestedTag: TagType[];
        Actors: ActorType[];
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
        MovieName: string;
    }
}

export namespace SettingsTypes {
    export interface initialApiCallData {
        DarkMode: boolean;
        Password: boolean;
        MediacenterName: string;
        VideoPath: string;
        TVShowPath: string;
        TVShowEnabled: boolean;
        FullDeleteEnabled: boolean;
    }

    export interface SettingsType {
        VideoPath: string;
        EpisodePath: string;
        MediacenterName: string;
        Password: string;
        PasswordEnabled: boolean;
        TMDBGrabbing: boolean;
        DarkMode: boolean;
    }

    export interface SizesType {
        VideoNr: number;
        DBSize: number;
        DifferentTags: number;
        TagsAdded: number;
    }

    export interface getStatusMessageType {
        ContentAvailable: boolean;
        Messages: string[];
    }
}

export namespace TVShow {
    /**
     * result of actor fetch
     */
    export interface TVshowType {
        Id: number;
        Name: string;
    }
}

export namespace ActorTypes {
    /**
     * result of actor fetch
     */
    export interface videofetchresult {
        Videos: VideoTypes.VideoUnloadedType[];
        Info: ActorType;
    }
}
