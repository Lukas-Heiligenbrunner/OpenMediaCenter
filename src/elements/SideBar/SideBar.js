import React from "react";
import "./SideBar.css"

class SideBar extends React.Component {
    render() {
        return (<div className='sideinfo'>
            {this.props.children}
        </div>);
    }
}

export default SideBar;
