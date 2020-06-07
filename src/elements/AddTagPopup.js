import React from "react";
import Modal from 'react-bootstrap/Modal'
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

class AddTagPopup extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            selection: {
                name: "nothing selected",
                id: -1
            },
            items: []
        };

        this.props = props;
    }

    componentDidMount() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'getAllTags');

        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json())
            .then((result) => {
                this.setState({
                    items: result
                });
            });
    }

    render() {
        return (
            <>
                <Modal
                    show={this.props.show}
                    onHide={this.props.onHide}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add to Tag
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Select a Tag:</h4>
                        <DropdownButton id="dropdown-basic-button" title={this.state.selection.name}>
                            {this.state.items ?
                                this.state.items.map((i) => (
                                    <Dropdown.Item onClick={() => {
                                        this.setState({selection: {name: i.tag_name, id: i.tag_id}})
                                    }}>{i.tag_name}</Dropdown.Item>
                                )) :
                                <Dropdown.Item>loading tags...</Dropdown.Item>}
                        </DropdownButton>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-primary' onClick={() => {
                            this.storeselection();
                        }}>Add
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    storeselection() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'addTag');
        updateRequest.append('id', this.state.selection.id);
        updateRequest.append('movieid', this.props.movie_id);

        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json())
            .then((result) => {
                if (result.result !== "success") {
                    console.log("error occured while writing to db -- todo error handling");
                    console.log(result.result);
                }
                this.props.onHide();
            });
    }
}

export default AddTagPopup;
