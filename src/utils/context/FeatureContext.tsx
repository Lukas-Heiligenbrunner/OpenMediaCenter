import React, {FunctionComponent, useState} from 'react';

export interface FeatureContextType {
    setTVShowEnabled: (enabled: boolean) => void;
    TVShowEnabled: boolean;
    setVideosFullyDeleteable: (fullyDeletable: boolean) => void;
    VideosFullyDeleteable: boolean;
}

/**
 * A global context providing a way to interact with user login states
 */
export const FeatureContext = React.createContext<FeatureContextType>({
    setTVShowEnabled: (_) => {},
    TVShowEnabled: false,
    setVideosFullyDeleteable: (_) => {},
    VideosFullyDeleteable: false
});

export const FeatureContextProvider: FunctionComponent = (props): JSX.Element => {
    const [tvshowenabled, settvshowenabled] = useState(false);
    const [fullydeletablevids, setfullydeleteable] = useState(false);

    const value: FeatureContextType = {
        VideosFullyDeleteable: fullydeletablevids,
        TVShowEnabled: tvshowenabled,
        setTVShowEnabled: (e) => settvshowenabled(e),
        setVideosFullyDeleteable: (e) => setfullydeleteable(e)
    };

    return <FeatureContext.Provider value={value}>{props.children}</FeatureContext.Provider>;
};
