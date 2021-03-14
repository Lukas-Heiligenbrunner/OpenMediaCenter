import {RouteComponentProps} from 'react-router';
import React from 'react';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import {APINode, callAPI} from '../../utils/Api';
import {withRouter} from 'react-router-dom';
import {VideoTypes} from '../../types/ApiTypes';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';
import SideBar, {SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import {DefaultTags, GeneralSuccess} from '../../types/GeneralTypes';
import {Button} from '../../elements/GPElements/Button';
import SubmitPopup from '../../elements/Popups/SubmitPopup/SubmitPopup';

interface CategoryViewProps extends RouteComponentProps<{id: string}> {}

interface CategoryViewState {
    loaded: boolean;
    submitForceDelete: boolean;
}

/**
 * plain class (for unit testing only)
 */
export class CategoryView extends React.Component<CategoryViewProps, CategoryViewState> {
    private videodata: VideoTypes.VideoUnloadedType[] = [];

    constructor(props: CategoryViewProps) {
        super(props);

        this.state = {
            loaded: false,
            submitForceDelete: false
        };
    }

    componentDidMount(): void {
        this.fetchVideoData(parseInt(this.props.match.params.id));
    }

    componentDidUpdate(prevProps: Readonly<CategoryViewProps>): void {
        // trigger video refresh if id changed
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({loaded: false});
            this.fetchVideoData(parseInt(this.props.match.params.id));
        }
    }

    render(): JSX.Element {
        return (
            <>
                <PageTitle title='Categories' subtitle={this.videodata.length + ' Videos'} />

                <SideBar>
                    <SideBarTitle>Default Tags:</SideBarTitle>
                    <Tag tagInfo={DefaultTags.all} />
                    <Tag tagInfo={DefaultTags.fullhd} />
                    <Tag tagInfo={DefaultTags.hd} />
                    <Tag tagInfo={DefaultTags.lowq} />

                    <Line />
                    <Button
                        title='Delete Tag'
                        onClick={(): void => {
                            this.deleteTag(false);
                        }}
                        color={{backgroundColor: 'red'}}
                    />
                </SideBar>
                {this.state.loaded ? <VideoContainer data={this.videodata} /> : null}

                <button
                    data-testid='backbtn'
                    className='btn btn-success'
                    onClick={(): void => {
                        this.props.history.push('/categories');
                    }}>
                    Back to Categories
                </button>
                {this.handlePopups()}
            </>
        );
    }

    private handlePopups(): JSX.Element {
        if (this.state.submitForceDelete) {
            return (
                <SubmitPopup
                    onHide={(): void => this.setState({submitForceDelete: false})}
                    submit={(): void => {
                        this.deleteTag(true);
                    }}
                />
            );
        } else {
            return <></>;
        }
    }

    /**
     * fetch data for a specific tag from backend
     * @param id tagid
     */
    private fetchVideoData(id: number): void {
        callAPI<VideoTypes.VideoUnloadedType[]>(APINode.Video, {action: 'getMovies', tag: id}, (result) => {
            this.videodata = result;
            this.setState({loaded: true});
        });
    }

    /**
     * delete the current tag
     */
    private deleteTag(force: boolean): void {
        callAPI<GeneralSuccess>(
            APINode.Tags,
            {
                action: 'deleteTag',
                TagId: parseInt(this.props.match.params.id),
                Force: force
            },
            (result) => {
                console.log(result.result);
                if (result.result === 'success') {
                    this.props.history.push('/categories');
                } else if (result.result === 'not empty tag') {
                    // show submisison tag to ask if really delete
                    this.setState({submitForceDelete: true});
                }
            }
        );
    }
}

/**
 * export with react Router wrapped (default use)
 */
export const CategoryViewWR = withRouter(CategoryView);
