import {TagType} from './VideoTypes';

export interface GeneralSuccess {
    result: string
}

interface TagarrayType {
    [_: string]: TagType
}

export const DefaultTags: TagarrayType = {
    all: {TagId: 1, TagName: 'all'},
    fullhd: {TagId: 2, TagName: 'fullhd'},
    lowq: {TagId: 3, TagName: 'lowquality'},
    hd: {TagId: 4, TagName: 'hd'}
};
