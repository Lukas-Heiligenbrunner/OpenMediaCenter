import {RouteComponentProps} from 'react-router';
import React from 'react';
import {VideoUnloadedType} from '../../api/VideoTypes';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import {callAPI} from '../../utils/Api';
import {withRouter} from 'react-router-dom';

interface CategoryViewProps extends RouteComponentProps<{ id: string }> {
    setSubTitle: (subtitle: string, title: string) => void
}

interface CategoryViewState {
    loaded: boolean
}

/**
 * plain class (for unit testing only)
 */
export class CategoryView extends React.Component<CategoryViewProps, CategoryViewState> {
    private videodata: VideoUnloadedType[] = [];

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
        // todo heyho need the cateogry name here somehow...
        callAPI<VideoUnloadedType[]>('video.php', {action: 'getMovies', tag: id}, result => {
            this.videodata = result;
            this.setState({loaded: true});
            this.props.setSubTitle(this.videodata.length + ' Videos', '');
        });
    }

}

/**
 * export with react Router wrapped (default use)
 */
export const CategoryViewWR = withRouter(CategoryView);
