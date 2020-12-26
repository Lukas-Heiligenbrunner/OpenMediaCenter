import {TagType} from '../../api/VideoTypes';
import React from 'react';
import PageTitle from '../../elements/PageTitle/PageTitle';
import videocontainerstyle from '../../elements/VideoContainer/VideoContainer.module.css';
import {Link} from 'react-router-dom';
import {TagPreview} from '../../elements/Preview/Preview';
import {callAPI} from '../../utils/Api';

interface TagViewState {
    loadedtags: TagType[];
}

class TagView extends React.Component<{}, TagViewState> {
    constructor(props: {}) {
        super(props);

        this.state = {loadedtags: []};
    }

    componentDidMount(): void {
        this.loadTags();
    }

    render(): JSX.Element {
        return (
            <>
                <PageTitle
                    title='Categories'
                    subtitle={this.state.loadedtags.length !== 0 ? this.state.loadedtags.length + ' different Tags' : null}/>
                <div className={videocontainerstyle.maincontent}>
                    {this.state.loadedtags ?
                        this.state.loadedtags.map((m) => (
                            <Link to={'/categories/' + m.tag_id}><TagPreview
                                key={m.tag_id}
                                name={m.tag_name}
                                tag_id={m.tag_id}/></Link>
                        )) :
                        'loading'}
                </div>
            </>
        );
    }

    /**
     * load all available tags from db.
     */
    loadTags(): void {
        callAPI<TagType[]>('tags.php', {action: 'getAllTags'}, result => {
            this.setState({loadedtags: result});
        });
    }
}

export default TagView;
