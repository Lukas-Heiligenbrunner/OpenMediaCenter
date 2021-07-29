import {RouteComponentProps} from 'react-router';
import React from 'react';
import {withRouter} from 'react-router-dom';
import {APINode, callAPI} from '../../utils/Api';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import PageTitle from '../../elements/PageTitle/PageTitle';
import SideBar from '../../elements/SideBar/SideBar';
import {VideoTypes} from '../../types/ApiTypes';

interface params {
    name: string;
}

interface Props extends RouteComponentProps<params> {}

interface state {
    data: VideoTypes.VideoUnloadedType[];
}

export class SearchHandling extends React.Component<Props, state> {
    constructor(props: Props) {
        super(props);

        this.state = {
            data: []
        };
    }

    componentDidMount(): void {
        this.searchVideos(this.props.match.params.name);
    }

    render(): JSX.Element {
        return (
            <>
                <PageTitle title='Search' subtitle={this.props.match.params.name + ': ' + this.state.data.length} />
                <SideBar hiddenFrame />
                {this.getVideoData()}
            </>
        );
    }

    /**
     * get videocontainer if data loaded
     */
    getVideoData(): JSX.Element {
        if (this.state.data.length !== 0) {
            return <VideoContainer data={this.state.data} />;
        } else {
            return <div>No Data found!</div>;
        }
    }

    /**
     * search for a keyword in db and update previews
     *
     * @param keyword The keyword to search for
     */
    searchVideos(keyword: string): void {
        callAPI(APINode.Video, {action: 'getSearchKeyWord', KeyWord: keyword}, (result: VideoTypes.VideoUnloadedType[]) => {
            this.setState({
                data: result
            });
        });
    }
}

export default withRouter(SearchHandling);
