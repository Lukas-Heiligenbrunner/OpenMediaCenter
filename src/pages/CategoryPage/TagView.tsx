import {TagType} from '../../types/VideoTypes';
import React from 'react';
import videocontainerstyle from '../../elements/VideoContainer/VideoContainer.module.css';
import {Link} from 'react-router-dom';
import {TagPreview} from '../../elements/Preview/Preview';
import {APINode, callAPI} from '../../utils/Api';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';
import SideBar, {SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import {DefaultTags} from '../../types/GeneralTypes';
import NewTagPopup from '../../elements/Popups/NewTagPopup/NewTagPopup';

interface TagViewState {
    loadedtags: TagType[];
    popupvisible: boolean;
}

interface Props {}

class TagView extends React.Component<Props, TagViewState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loadedtags: [],
            popupvisible: false
        };
    }

    componentDidMount(): void {
        this.loadTags();
    }

    render(): JSX.Element {
        return (
            <>
                <PageTitle title='Categories' subtitle={this.state.loadedtags.length + ' different Tags'} />

                <SideBar>
                    <SideBarTitle>Default Tags:</SideBarTitle>
                    <Tag tagInfo={DefaultTags.all} />
                    <Tag tagInfo={DefaultTags.fullhd} />
                    <Tag tagInfo={DefaultTags.hd} />
                    <Tag tagInfo={DefaultTags.lowq} />

                    <Line />
                    <button
                        data-testid='btnaddtag'
                        className='btn btn-success'
                        onClick={(): void => {
                            this.setState({popupvisible: true});
                        }}>
                        Add a new Tag!
                    </button>
                </SideBar>
                <div className={videocontainerstyle.maincontent}>
                    {this.state.loadedtags
                        ? this.state.loadedtags.map((m) => (
                              <Link to={'/categories/' + m.TagId} key={m.TagId}>
                                  <TagPreview name={m.TagName} />
                              </Link>
                          ))
                        : 'loading'}
                </div>
                {this.handlePopups()}
            </>
        );
    }

    /**
     * load all available tags from db.
     */
    loadTags(): void {
        callAPI<TagType[]>(APINode.Tags, {action: 'getAllTags'}, (result) => {
            this.setState({loadedtags: result});
        });
    }

    private handlePopups(): JSX.Element {
        if (this.state.popupvisible) {
            return (
                <NewTagPopup
                    onHide={(): void => {
                        this.setState({popupvisible: false});
                        this.loadTags();
                    }}
                />
            );
        } else {
            return <></>;
        }
    }
}

export default TagView;
