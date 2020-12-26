import {RouteComponentProps} from 'react-router';
import React from 'react';
import {withRouter} from 'react-router-dom';
import {callAPI} from '../../utils/Api';
import {VideoUnloadedType} from '../../api/VideoTypes';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import PageTitle from '../../elements/PageTitle/PageTitle';
import SideBar from '../../elements/SideBar/SideBar';

interface params {
    name: string;
}

interface props extends RouteComponentProps<params> {}

interface state {
    data: VideoUnloadedType[];
}

class SearchHandling extends React.Component<props, state> {
    constructor(props: props) {
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
                <PageTitle title='Search' subtitle={this.props.match.params.name + ': ' + this.state.data.length}/>
                <SideBar hiddenFrame/>
                {this.getVideoData()}
            </>
        );
    }

    getVideoData(): JSX.Element {
        if (this.state.data.length !== 0) {
            return (
                <VideoContainer data={this.state.data}/>
            );
        } else {
            return (<div>No Data found!</div>);
        }
    }

    /**
     * search for a keyword in db and update previews
     *
     * @param keyword The keyword to search for
     */
    searchVideos(keyword: string): void {
        callAPI('video.php', {action: 'getSearchKeyWord', keyword: keyword}, (result: VideoUnloadedType[]) => {
            this.setState({
                data: result
            });
        });
    }
}

export default withRouter(SearchHandling);
