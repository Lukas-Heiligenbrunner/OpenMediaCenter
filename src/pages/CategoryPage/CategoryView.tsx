import {RouteComponentProps} from 'react-router';
import React from 'react';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import {callAPI} from '../../utils/Api';
import {withRouter} from 'react-router-dom';
import {VideoTypes} from '../../types/ApiTypes';

interface CategoryViewProps extends RouteComponentProps<{ id: string }> {
    setSubTitle: (title: string) => void
}

interface CategoryViewState {
    loaded: boolean
}

/**
 * plain class (for unit testing only)
 */
export class CategoryView extends React.Component<CategoryViewProps, CategoryViewState> {
    private videodata: VideoTypes.VideoUnloadedType[] = [];

    constructor(props: CategoryViewProps) {
        super(props);

        this.state = {
            loaded: false
        };
    }

    componentDidMount(): void {
        this.fetchVideoData(parseInt(this.props.match.params.id));
    }

    componentDidUpdate(prevProps: Readonly<CategoryViewProps>, prevState: Readonly<CategoryViewState>): void {
        // trigger video refresh if id changed
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({loaded: false});
            this.fetchVideoData(parseInt(this.props.match.params.id));
        }
    }

    render(): JSX.Element {
        return (
            <>
                {this.state.loaded ?
                    <VideoContainer
                        data={this.videodata}/> : null}

                <button data-testid='backbtn' className='btn btn-success'
                        onClick={(): void => {
                            this.props.history.push('/categories');
                        }}>Back to Categories
                </button>
            </>
        );
    }

    /**
     * fetch data for a specific tag from backend
     * @param id tagid
     */
    fetchVideoData(id: number): void {
        callAPI<VideoTypes.VideoUnloadedType[]>('video.php', {action: 'getMovies', tag: id}, result => {
            this.videodata = result;
            this.setState({loaded: true});
            this.props.setSubTitle(this.videodata.length + ' Videos');
        });
    }

}

/**
 * export with react Router wrapped (default use)
 */
export const CategoryViewWR = withRouter(CategoryView);
