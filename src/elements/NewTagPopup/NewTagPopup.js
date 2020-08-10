import React from "react";
import Modal from 'react-bootstrap/Modal'
import {Form} from "react-bootstrap";

/**
 * creates modal overlay to define a new Tag
 */
class NewTagPopup extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.props = props;
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
                            Create a new Tag!
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Tag Name:</Form.Label>
                            <Form.Control id='namefield' type="text" placeholder="Enter Tag name" onChange={(v) => {
                                this.value = v.target.value
                            }}/>
                            <Form.Text className="text-muted">
                                This Tag will automatically show up on category page.
                            </Form.Text>
                        </Form.Group>
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

    /**
     * store the filled in form to the backend
     */
    storeselection() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'createTag');
        updateRequest.append('tagname', this.value);

        fetch('/api/tags.php', {method: 'POST', body: updateRequest})
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

export default NewTagPopup;
