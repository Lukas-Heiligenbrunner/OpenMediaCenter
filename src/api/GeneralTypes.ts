import {TagType} from './VideoTypes';

export interface GeneralSuccess {
    result: string
}

interface TagarrayType {
    [_: string]: TagType
}

export const DefaultTags: TagarrayType = {
    all: {tag_id: 1, tag_name: 'all'},
    fullhd: {tag_id: 2, tag_name: 'fullhd'},
    lowq: {tag_id: 3, tag_name: 'lowquality'},
    hd: {tag_id: 4, tag_name: 'hd'}
};
