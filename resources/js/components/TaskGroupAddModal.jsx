import { router } from "@inertiajs/react";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const TaskGroupAddModal = ({ show, handleClose }) => {
    const [imagePreview, setImagePreview] = useState("");
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview("");
        }
    };

    // const handleTaskGroupDataSave = ({}) => {
    //     if (!title || !description || !tag || !date) {
    //         alert("Please fill in all required fields.");
    //         return;
    //     }

    //     const taskData = {
    //         title,
    //         description,
    //         tag,
    //         date,
    //         image: imagePreview || null,
    //     };

    //     handleSave(taskData, isEdit);
    //     setTitle("");
    //     setTag("");
    //     setDate("");
    //     setDescription("");
    //     setImagePreview("");
    // };

    // Form submission
    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (data.image instanceof File) {
            formData.append("image", data.image);
        }

        router.post(route("task-groups.create"), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Task Group Create successfully!");
            },
            onError: (errors) => {
                if (errors.password) {
                    toast.error(errors.password);
                } else {
                    toast.error(
                        "Something went wrong! Check the form for errors."
                    );
                }
            },
        });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <h6>Add Task Group</h6>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={submit}>
                    {/* Title */}
                    <Form.Group className="mb-3" controlId="taskTitle">
                        <Form.Label>Task Group Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Task Title"
                            // value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            name="name"
                        />
                    </Form.Group>

                    {/* Start Date */}
                    <Form.Group className="mb-3" controlId="startDate">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            // value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            name="start_date"
                        />
                    </Form.Group>

                    {/* End Date */}
                    <Form.Group className="mb-3" controlId="startDate">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            // value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            name="end_date"
                        />
                    </Form.Group>

                    {/* Description */}
                    <Form.Group className="mb-3" controlId="taskDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Write some text"
                            // value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            name="description"
                        />
                    </Form.Group>

                    {/* Image */}
                    <Form.Group className="mb-3" controlId="taskImage">
                        <Form.Label>
                            Attachments{" "}
                            <span className="text-muted">
                                (Jpg, Png format)
                            </span>
                        </Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            name="image"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Image_Preview"
                                style={{
                                    width: "100%",
                                    marginTop: "10px",
                                    display: "block",
                                }}
                            />
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleTaskGroupDataSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TaskGroupAddModal;
