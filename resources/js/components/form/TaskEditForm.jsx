import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../../css/MainForm.css";
import { handleAttachmentChange } from "@/utils/handleAttachment";
import { Icon } from "@iconify/react";
import SelectWithButton from "../SelectWithButton";
import SelectSearch from "../SelectSearch";
import TaskGroupAddModal from "../TaskGroupAddModal";

const TaskEditForm = ({ task, taskGroups: initialTaskGroups, users }) => {
    const [taskGroups, setTaskGroups] = useState(initialTaskGroups || []);
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attachmentPreview, setAttachmentPreview] = useState(
        typeof task?.attachment === "string" && task.attachment
            ? `/storage/${task.attachment}`
            : null
    );

    // Form state initialized with task data
    const [formData, setFormData] = useState({
        name: task?.name || "",
        project_id: task?.project_id?.toString() || "",
        module_id: task?.module_id?.toString() || "",
        submodule_id: task?.submodule_id?.toString() || "",
        feature_id: task?.feature_id?.toString() || "",
        assign_date: task?.assign_date || "",
        deadline: task?.deadline || "",
        assign_to: task?.assign_to?.toString() || "",
        completion_date: task?.completion_date || "",
        description: task?.description || "",
        notes: task?.remarks || "",
        attachment: null,
        status: task?.status || "",
        priority: task?.priority || "",
    });

    // Sync taskGroups
    useEffect(() => {
        setTaskGroups(initialTaskGroups || []);
    }, [initialTaskGroups]);

    // Map task groups to options
    const projects =
        taskGroups
            ?.filter((task) => task.type === "project")
            .map((task) => ({ value: task.id.toString(), label: task.name })) ||
        [];
    const modules =
        taskGroups
            ?.filter((task) => task.type === "module")
            .map((task) => ({ value: task.id.toString(), label: task.name })) ||
        [];
    const submodules =
        taskGroups
            ?.filter((task) => task.type === "submodule")
            .map((task) => ({ value: task.id.toString(), label: task.name })) ||
        [];
    const features =
        taskGroups
            ?.filter((task) => task.type === "feature")
            .map((task) => ({ value: task.id.toString(), label: task.name })) ||
        [];

    // Map users to options
    const userOptions =
        users?.map((user) => ({
            value: user.id.toString(),
            label: user.name,
        })) || [];

    // Status options
    const statusOptions = [
        { value: "pending", label: "Pending" },
        { value: "inprogress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "hold", label: "On Hold" },
        { value: "rejected", label: "Rejected" },
        { value: "approved", label: "Approved" },
        { value: "issues", label: "Issues" },
    ];

    // Priority options
    const priorityOptions = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
    ];

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    // Client-side validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Task name is required.";
        if (!formData.description)
            newErrors.description = "Description is required.";
        if (!formData.project_id) newErrors.project_id = "Project is required.";
        if (!formData.module_id) newErrors.module_id = "Module is required.";
        if (formData.attachment) {
            if (!allowedTypes.includes(formData.attachment.type)) {
                newErrors.attachment =
                    "Invalid file type. Allowed: JPG, PNG, PDF, DOC, XLS.";
            }
            if (formData.attachment.size > 2 * 1024 * 1024) {
                newErrors.attachment = "File size must be less than 2MB.";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            handleAttachmentChange(
                e,
                setFormData,
                setAttachmentPreview,
                allowedTypes
            );
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // Handle select changes
    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix the form errors.");
            return;
        }

        setIsSubmitting(true);
        const form = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== "") {
                form.append(key, formData[key]);
            }
        });

        try {
            const response = await axios.post(`/task/update/${task.id}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });
            toast.success(response.data.message);
            window.location.href = "/tasks";
        } catch (error) {
            if (error.response?.status === 422) {
                const serverErrors = error.response.data.errors;
                setErrors(serverErrors);
                Object.values(serverErrors).forEach((err) =>
                    toast.error(err[0])
                );
            } else {
                toast.error("Failed to update task. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle add task group
    const handleAddTaskGroup = (value) => {
        setType(value);
        setShowModal(true);
    };

    // Handle new task group addition
    const handleTaskGroupAdded = (newTaskGroup) => {
        setTaskGroups((prev) => [...prev, newTaskGroup]);
    };

    return (
        <div className="col-md-12">
            <div className="card">
                <div className="card-header">
                    <h6 className="card-title mb-0">Edit Task</h6>
                </div>
                <div className="card-body">
                    <form className="row gy-3" onSubmit={handleSubmit}>
                        <div className="col-xl-3 col-md-4 col-sm-6">
                            <SelectWithButton
                                name="project_id"
                                label="Projects"
                                placeholder="Select projects"
                                options={projects}
                                handleAddTaskGroup={handleAddTaskGroup}
                                buttonValue="project"
                                setFormData={(name, value) =>
                                    handleSelectChange(name, value)
                                }
                                formData={formData}
                                labelKey="label"
                                valueKey="value"
                                renderOption={(option) => option.label}
                                isRequired
                            />
                            {errors.project_id && (
                                <div className="text-danger">
                                    {errors.project_id}
                                </div>
                            )}
                        </div>
                        <div className="col-xl-3 col-md-4 col-sm-6">
                            <SelectWithButton
                                name="module_id"
                                label="Modules"
                                placeholder="Select Modules"
                                options={modules}
                                handleAddTaskGroup={handleAddTaskGroup}
                                buttonValue="module"
                                setFormData={(name, value) =>
                                    handleSelectChange(name, value)
                                }
                                formData={formData}
                                labelKey="label"
                                valueKey="value"
                                isRequired
                            />
                            {errors.module_id && (
                                <div className="text-danger">
                                    {errors.module_id}
                                </div>
                            )}
                        </div>
                        <div className="col-xl-3 col-md-4 col-sm-6">
                            <SelectWithButton
                                name="submodule_id"
                                label="Sub Modules"
                                placeholder="Select Sub Modules"
                                options={submodules}
                                handleAddTaskGroup={handleAddTaskGroup}
                                buttonValue="submodule"
                                setFormData={(name, value) =>
                                    handleSelectChange(name, value)
                                }
                                formData={formData}
                                labelKey="label"
                                valueKey="value"
                            />
                            {errors.submodule_id && (
                                <div className="text-danger">
                                    {errors.submodule_id}
                                </div>
                            )}
                        </div>
                        <div className="col-xl-3 col-md-4 col-sm-6">
                            <SelectWithButton
                                name="feature_id"
                                label="Feature"
                                placeholder="Select Feature"
                                options={features}
                                handleAddTaskGroup={handleAddTaskGroup}
                                buttonValue="feature"
                                setFormData={(name, value) =>
                                    handleSelectChange(name, value)
                                }
                                formData={formData}
                                labelKey="label"
                                valueKey="value"
                            />
                            {errors.feature_id && (
                                <div className="text-danger">
                                    {errors.feature_id}
                                </div>
                            )}
                        </div>
                        <div className="col-xl-3 col-md-4 col-sm-6">
                            <label className="form-label fw-semibold">
                                Task Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="form-control form-control-sm rounded-2"
                                placeholder="Task Name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            {errors.name && (
                                <div className="text-danger">{errors.name}</div>
                            )}
                        </div>
                        <div className="col-xl-3 col-md-4 col-sm-6">
                            <SelectSearch
                                name="status"
                                label="Status"
                                placeholder="Select Status"
                                options={statusOptions}
                                setFormData={(name, value) =>
                                    handleSelectChange(name, value)
                                }
                                formData={formData}
                                labelKey="label"
                                valueKey="value"
                                renderOption={(option) => option.label}
                            />
                            {errors.status && (
                                <div className="text-danger">
                                    {errors.status}
                                </div>
                            )}
                        </div>
                        <div className="col-xl-3 col-md-4 col-sm-6">
                            <SelectSearch
                                name="priority"
                                label="Priority"
                                placeholder="Select Priority"
                                options={priorityOptions}
                                setFormData={(name, value) =>
                                    handleSelectChange(name, value)
                                }
                                formData={formData}
                                labelKey="label"
                                valueKey="value"
                                renderOption={(option) => option.label}
                            />
                            {errors.priority && (
                                <div className="text-danger">
                                    {errors.priority}
                                </div>
                            )}
                        </div>
                        <div className="col-xl-3 col-md-4 col-sm-6">
                            <label className="form-label fw-semibold">
                                Assign Date
                            </label>
                            <input
                                type="date"
                                name="assign_date"
                                className="form-control form-control-sm rounded-2"
                                value={formData.assign_date}
                                onChange={handleInputChange}
                            />
                            {errors.assign_date && (
                                <div className="text-danger">
                                    {errors.assign_date}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">
                                Deadline
                            </label>
                            <input
                                type="date"
                                name="deadline"
                                className="form-control form-control-sm rounded-2"
                                value={formData.deadline}
                                onChange={handleInputChange}
                            />
                            {errors.deadline && (
                                <div className="text-danger">
                                    {errors.deadline}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <SelectSearch
                                name="assign_to"
                                label="Assign To"
                                placeholder="Select To Assign"
                                options={userOptions}
                                setFormData={(name, value) =>
                                    handleSelectChange(name, value)
                                }
                                formData={formData}
                                labelKey="label"
                                valueKey="value"
                                renderOption={(user) => user.label}
                            />
                            {errors.assign_to && (
                                <div className="text-danger">
                                    {errors.assign_to}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">
                                Completion Date
                            </label>
                            <input
                                type="date"
                                name="completion_date"
                                className="form-control form-control-sm rounded-2"
                                value={formData.completion_date}
                                onChange={handleInputChange}
                            />
                            {errors.completion_date && (
                                <div className="text-danger">
                                    {errors.completion_date}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">
                                Task Description{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <textarea
                                name="description"
                                className="form-control resize-none"
                                rows={4}
                                cols={50}
                                placeholder="Enter a description..."
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                            {errors.description && (
                                <div className="text-danger">
                                    {errors.description}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">
                                Remarks Or Notes
                            </label>
                            <textarea
                                name="remarks"
                                className="form-control resize-none"
                                rows={4}
                                cols={50}
                                placeholder="Enter a remarks"
                                value={formData.notes}
                                onChange={handleInputChange}
                            />
                            {errors.notes && (
                                <div className="text-danger">
                                    {errors.notes}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">
                                Attachment (JPG, PNG, PDF, DOC, XLS)
                            </label>
                            <input
                                className="form-control form-control-sm"
                                name="attachment"
                                type="file"
                                accept="image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={handleInputChange}
                            />
                            {errors.attachment && (
                                <div className="text-danger">
                                    {errors.attachment}
                                </div>
                            )}
                            {attachmentPreview ? (
                                <div
                                    className="mt-3"
                                    style={{
                                        maxWidth: "100%",
                                        overflow: "hidden",
                                    }}
                                >
                                    {typeof attachmentPreview === "string" &&
                                    (attachmentPreview.startsWith(
                                        "/storage/"
                                    ) ||
                                        attachmentPreview.startsWith(
                                            "data:image"
                                        )) ? (
                                        <img
                                            src={attachmentPreview}
                                            alt="Attachment Preview"
                                            style={{
                                                width: "100%",
                                                maxHeight: "200px",
                                                objectFit: "contain",
                                            }}
                                        />
                                    ) : (
                                        <div className="d-flex align-items-center">
                                            <Icon
                                                icon="bi:file-earmark-text"
                                                width="24"
                                                className="me-2 text-danger"
                                            />
                                            <span>
                                                {typeof attachmentPreview ===
                                                "string"
                                                    ? attachmentPreview
                                                          .split("/")
                                                          .pop()
                                                    : "Unknown file"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : task.attachment ? (
                                <div
                                    className="mt-3"
                                    style={{
                                        maxWidth: "100%",
                                        overflow: "hidden",
                                    }}
                                >
                                    <img
                                        src={`/storage/${task.attachment}`}
                                        alt="Current Attachment"
                                        style={{
                                            width: "100%",
                                            maxHeight: "200px",
                                            objectFit: "contain",
                                        }}
                                    />
                                </div>
                            ) : null}
                        </div>
                        <div className="col-md-12">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Updating..." : "Update Task"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <TaskGroupAddModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                type={type}
                onAddTaskGroup={handleTaskGroupAdded}
            />
        </div>
    );
};

export default TaskEditForm;
