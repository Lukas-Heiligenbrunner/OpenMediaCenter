import React from "react";
import Preview from "../../elements/Preview/Preview";
import style from "./RandomPage.module.css"
import SideBar, {SideBarTitle} from "../../elements/SideBar/SideBar";
import Tag from "../../elements/Tag/Tag";
import PageTitle from "../../elements/PageTitle/PageTitle";

class RandomPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            videos: [],
            tags: []
        };
    }

    componentDidMount() {
        this.loadShuffledvideos(4);
    }

    render() {
        return (
            <div>
                <PageTitle
                    title='Random Videos'
                    subtitle='4pc'/>

                <SideBar>
                    <SideBarTitle>Visible Tags:</SideBarTitle>
                    {this.state.tags.map((m) => (
                        <Tag
                            key={m.tag_name}
                            viewbinding={this.props.viewbinding}>{m.tag_name}</Tag>
                    ))}
                </SideBar>

                <div className='maincontent'>
                    {this.state.videos.map(elem => (
                        <Preview
                            key={elem.movie_id}
                            name={elem.movie_name}
                            movie_id={elem.movie_id}
                            viewbinding={this.props.viewbinding}/>
                    ))}
                    <div className={style.Shufflebutton}>
                        <button onClick={() => this.shuffleclick()} className={style.btnshuffle}>Shuffle</button>
                    </div>
                </div>
            </div>
        );
    }

    shuffleclick() {
        this.loadShuffledvideos(4);
    }

    loadShuffledvideos(nr) {
        const updateRequest = new FormData();
        updateRequest.append('action', 'getRandomMovies');
        updateRequest.append('number', nr);

        // fetch all videos available
        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    console.log(result);
                    this.setState({
                        videos: result.rows,
                        tags: result.tags
                    });
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    }
}

export default RandomPage;
