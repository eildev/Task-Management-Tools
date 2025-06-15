import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import toast from "react-hot-toast";

// Type mapping object
const typeDisplayNames = {
    project: "Projects",
    module: "Modules",
    submodule: "Sub Modules",
    feature: "Feature",
};

// Function to get display name for a given type
const getDisplayName = (type) => {
    return typeDisplayNames[type] || "";
};

const TaskGroupAddModal = ({ show, handleClose, type }) => {
    // console.log("modal", type);
    const [data, setData] = useState({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        image: null,
        type: "",
    });
    const [imagePreview, setImagePreview] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setData((prev) => ({ ...prev, type: type || "" }));
    }, [type]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData((prev) => ({ ...prev, image: file })); // Update only the image field
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview("");
            setData((prev) => ({ ...prev, image: null }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTaskGroupDataSave = () => {
        // Client-side validation
        // if (!data.name) {
        //     setErrors({ name: "Task Group Name is required" });
        //     return;
        // }
        // if (!data.type) {
        //     setErrors({ type: "Type is required" });
        //     return;
        // }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("type", data.type);
        formData.append("description", data.description || "");
        formData.append("start_date", data.start_date || "");
        formData.append("end_date", data.end_date || "");
        if (data.image) {
            formData.append("image", data.image);
        }

        // Send POST request with axios
        axios
            .post(route("task-groups.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            })
            .then((response) => {
                if (response?.data?.success) {
                    console.log(response.data);
                    setData({
                        name: "",
                        description: "",
                        start_date: "",
                        end_date: "",
                        image: null,
                        type: "",
                    }); // Reset form
                    setImagePreview("");
                    setErrors({});
                    handleClose();
                    toast.success(response.data.message);
                    // toast.success("Successfully toasted!");
                } else {
                    console.log(response);
                }
            })
            .catch((error) => {
                console.log(error);
                // Handle errors
                if (error.response && error.response.status === 422) {
                    setErrors(error.response.data.errors);
                }
                toast.error(
                    "Failed to create Task Group. Please check the form."
                );
            });
    };

    // Get display name for the current type
    const displayName = getDisplayName(type);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <h6>Add {displayName} Info</h6>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Title */}
                    <Form.Group className="mb-3" controlId="taskTitle">
                        <Form.Label>{displayName} Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder={`Enter ${displayName} Name`}
                            value={data.name}
                            onChange={handleInputChange}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Start Date */}
                    <Form.Group className="mb-3" controlId="startDate">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="start_date"
                            value={data.start_date}
                            onChange={handleInputChange}
                            isInvalid={!!errors.start_date}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.start_date}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* End Date */}
                    <Form.Group className="mb-3" controlId="endDate">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="end_date"
                            value={data.end_date}
                            onChange={handleInputChange}
                            isInvalid={!!errors.end_date}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.end_date}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Description */}
                    <Form.Group className="mb-3" controlId="taskDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            placeholder="Write some text"
                            value={data.description}
                            onChange={handleInputChange}
                            isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Image */}
                    <Form.Group className="mb-3" controlId="taskImage">
                        <Form.Label>
                            Attachments{" "}
                            <span className="text-muted">
                                (Jpg, Png, PDF format)
                            </span>
                        </Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            isInvalid={!!errors.image}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.image}
                        </Form.Control.Feedback>
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
