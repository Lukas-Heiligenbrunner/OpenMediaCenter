import {TagType} from './VideoTypes';
import PlyrJS from 'plyr';

export interface GeneralSuccess {
    result: string;
}

interface TagarrayType {
    [_: string]: TagType;
}

export const DefaultTags: TagarrayType = {
    all: {TagId: 1, TagName: 'all'},
    fullhd: {TagId: 2, TagName: 'fullhd'},
    lowq: {TagId: 3, TagName: 'lowquality'},
    hd: {TagId: 4, TagName: 'hd'}
};

export const DefaultPlyrOptions: PlyrJS.Options = {
    controls: [
        'play-large', // The large play button in the center
        'play', // Play/pause playback
        'progress', // The progress bar and scrubber for playback and buffering
        'current-time', // The current time of playback
        'duration', // The full duration of the media
        'mute', // Toggle mute
        'volume', // Volume control
        'captions', // Toggle captions
        'settings', // Settings menu
        'airplay', // Airplay (currently Safari only)
        'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
        'fullscreen' // Toggle fullscreen
    ]
};
