import {RouteComponentProps} from 'react-router';
import React from 'react';
import {VideoUnloadedType} from '../../api/VideoTypes';
import PageTitle from '../../elements/PageTitle/PageTitle';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import {callAPI} from '../../utils/Api';
import {withRouter} from 'react-router-dom';

interface CategoryViewProps extends RouteComponentProps<{ id: string }> {

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

        this.fetchVideoData(parseInt(this.props.match.params.id));
    }

    render(): JSX.Element {
        return (
            <>
                <PageTitle
                    title='Categories'
                    subtitle={this.state.loaded ? this.videodata.length + ' Videos' : null}/>

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
        callAPI<VideoUnloadedType[]>('video.php', {action: 'getMovies', tag: id}, result => {
            this.videodata = result;
            this.setState({loaded: true});
        });
    }

}

/**
 * export with react Router wrapped (default use)
 */
export const CategoryViewWR = withRouter(CategoryView);
