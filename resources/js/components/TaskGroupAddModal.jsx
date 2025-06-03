
import { Button, Form, Modal } from "react-bootstrap";

const TaskGroupAddModal = ({ show, handleClose }) => {
    console.log("TaskGroupAddModal rendered, show:", show);
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add New Task Group
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h2>This is Body</h2>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TaskGroupAddModal;