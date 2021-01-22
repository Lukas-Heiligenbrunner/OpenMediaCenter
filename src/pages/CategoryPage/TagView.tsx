import {TagType} from '../../types/VideoTypes';
import React from 'react';
import videocontainerstyle from '../../elements/VideoContainer/VideoContainer.module.css';
import {Link} from 'react-router-dom';
import {TagPreview} from '../../elements/Preview/Preview';
import {callAPI} from '../../utils/Api';

interface TagViewState {
    loadedtags: TagType[];
}

interface props {
    setSubTitle: (title: string) => void
}

class TagView extends React.Component<props, TagViewState> {
    constructor(props: props) {
        super(props);

        this.state = {loadedtags: []};
    }

    componentDidMount(): void {
        this.loadTags();
    }

    render(): JSX.Element {
        return (
            <>
                <div className={videocontainerstyle.maincontent}>
                    {this.state.loadedtags ?
                        this.state.loadedtags.map((m) => (
                            <Link to={'/categories/' + m.tag_id}><TagPreview
                                key={m.tag_id}
                                name={m.tag_name}/></Link>
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
            this.props.setSubTitle(result.length + ' different Tags');
        });
    }
}

export default TagView;
