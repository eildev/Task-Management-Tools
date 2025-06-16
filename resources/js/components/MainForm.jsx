import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectWithButton from "./SelectWithButton";
import SelectSearch from "./SelectSearch";
import TaskGroupAddModal from "./TaskGroupAddModal";
import toast from "react-hot-toast";
import "../css/MainForm.css";

const MainForm = ({ taskGroups: initialTaskGroups, users }) => {
    const [taskGroups, setTaskGroups] = useState(initialTaskGroups || []);
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        project_id: "",
        module_id: "",
        submodule_id: "",
        feature_id: "",
        assign_date: "",
        deadline: "",
        assign_to: "",
        completion_date: "",
        description: "",
        notes: "",
        attachment: null,
        status: "",
        priority: "",
    });

    // Sync taskGroups
    useEffect(() => {
        setTaskGroups(initialTaskGroups || []);
    }, [initialTaskGroups]);

    // Map task groups to options
    const projects = taskGroups
        .filter((task) => task.type === "project")
        .map((task) => ({ value: task.id.toString(), label: task.name }));
    const modules = taskGroups
        .filter((task) => task.type === "module")
        .map((task) => ({ value: task.id.toString(), label: task.name }));
    const submodules = taskGroups
        .filter((task) => task.type === "submodule")
        .map((task) => ({ value: task.id.toString(), label: task.name }));
    const features = taskGroups
        .filter((task) => task.type === "feature")
        .map((task) => ({ value: task.id.toString(), label: task.name }));

    // Map users to options
    const userOptions = users.map((user) => ({
        value: user.id.toString(),
        label: user.name,
    }));

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

    // Priority options (optional)
    const priorityOptions = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
    ];

    // Client-side validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Task name is required.";
        if (!formData.description)
            newErrors.description = "Description is required.";
        if (!formData.project_id) newErrors.project_id = "Project is required.";
        if (!formData.module_id) newErrors.module_id = "Module is required.";
        if (!formData.status) newErrors.status = "Status is required.";
        if (formData.attachment) {
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ];
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

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
        // Clear error for this field
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Handle select changes (for SelectWithButton and SelectSearch)
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
            const response = await axios.post("/task", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });
            toast.success(response.data.message);
            setFormData({
                name: "",
                project_id: "",
                module_id: "",
                submodule_id: "",
                feature_id: "",
                assign_date: "",
                deadline: "",
                assign_to: "",
                completion_date: "",
                description: "",
                notes: "",
                attachment: null,
                status: "",
                priority: "",
            });
            setErrors({});
        } catch (error) {
            if (error.response?.status === 422) {
                const serverErrors = error.response.data.errors;
                setErrors(serverErrors);
                Object.values(serverErrors).forEach((err) =>
                    toast.error(err[0])
                );
            } else {
                toast.error("Failed to create task. Please try again.");
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
                    <h6 className="card-title mb-0">Create Task</h6>
                </div>
                <div className="card-body">
                    <form className="row gy-3" onSubmit={handleSubmit}>
                        <div className="col-md-4">
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
                        <div className="col-md-4">
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
                        <div className="col-md-4">
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
                        <div className="col-md-4">
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
                        <div className="col-md-4">
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
                        <div className="col-md-4">
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
                                isRequired
                            />
                            {errors.status && (
                                <div className="text-danger">
                                    {errors.status}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
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
                        <div className="col-md-4">
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
                        <div className="col-md-6">
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
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Remarks Or Notes
                            </label>
                            <textarea
                                name="notes"
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
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Attachment
                            </label>
                            <input
                                className="form-control form-control-sm"
                                name="attachment"
                                type="file"
                                onChange={handleInputChange}
                            />
                            {errors.attachment && (
                                <div className="text-danger">
                                    {errors.attachment}
                                </div>
                            )}
                        </div>
                        <div className="col-md-12">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save Task"}
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

export default MainForm;

// import SelectWithButton from "./SelectWithButton";
// import SelectSearch from "./SelectSearch";
// import { useState, useEffect } from "react"; // Added useEffect
// import TaskGroupAddModal from "./TaskGroupAddModal";
// import { useForm } from "@inertiajs/react";
// import toast from "react-hot-toast";
// import { taskPriority, taskStatus } from "@/data/simpleData";

// const MainForm = ({ taskGroups: initialTaskGroups, users }) => {
//     // Local state for taskGroups
//     const [taskGroups, setTaskGroups] = useState(initialTaskGroups || []);

//     // Sync initialTaskGroups with local state when props change
//     useEffect(() => {
//         setTaskGroups(initialTaskGroups || []);
//     }, [initialTaskGroups]);

//     // Map tasks to options format
//     const projects = taskGroups
//         .filter((task) => task.type === "project")
//         .map((task) => ({ value: task.id, label: task.name }));
//     const modules = taskGroups
//         .filter((task) => task.type === "module")
//         .map((task) => ({ value: task.id, label: task.name }));
//     const submodules = taskGroups
//         .filter((task) => task.type === "submodule")
//         .map((task) => ({ value: task.id, label: task.name }));
//     const features = taskGroups
//         .filter((task) => task.type === "feature")
//         .map((task) => ({ value: task.id, label: task.name }));

//     // Map users to options format
//     const userOptions = users.map((user) => ({
//         value: user.id,
//         label: user.name,
//     }));

//     const [showModal, setShowModal] = useState(false);
//     const [type, setType] = useState("");

//     // Form management with useForm
//     const { data, setData, post, errors, reset } = useForm({
//         project_id: "",
//         module_id: "",
//         submodule_id: "",
//         feature_id: "",
//         task_name: "",
//         assign_date: "",
//         deadline: "",
//         assign_to: "",
//         completion_date: "",
//         description: "",
//         notes: "",
//         attachment: null,
//     });

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value, files } = e.target;
//         setData(name, files ? files[0] : value);
//     };

//     // Handle form submission
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         post(route("task.store"), {
//             preserveScroll: true,
//             onSuccess: () => {
//                 toast.success("Task created successfully!");
//                 reset();
//             },
//             onError: () => {
//                 toast.error("Failed to create task. Please check the form.");
//             },
//         });
//     };

//     // Handle add task group
//     const handleAddTaskGroup = (value) => {
//         setType(value);
//         setShowModal(true);
//     };

//     // Handle new task group addition
//     const handleTaskGroupAdded = (newTaskGroup) => {
//         setTaskGroups((prev) => [...prev, newTaskGroup]);
//     };

//     return (
//         <div className="col-md-12">
//             <div className="card">
//                 <div className="card-header">
//                     <h6 className="card-title mb-0">Create Task</h6>
//                 </div>
//                 <div className="card-body">
//                     <form className="row gy-3" onSubmit={handleSubmit}>
//                         <div className="col-md-4">
//                             <SelectWithButton
//                                 name="project_id"
//                                 label="Projects"
//                                 placeholder="Select projects"
//                                 options={projects}
//                                 handleAddTaskGroup={handleAddTaskGroup}
//                                 buttonValue="project"
//                                 setFormData={setData}
//                                 formData={data}
//                                 labelKey="label"
//                                 valueKey="value"
//                                 renderOption={(option) => option.label}
//                                 isRequired
//                             />
//                             {errors.project_id && (
//                                 <div className="text-danger">
//                                     {errors.project_id}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-4">
//                             <SelectWithButton
//                                 name="module_id"
//                                 label="Modules"
//                                 placeholder="Select Modules"
//                                 options={modules}
//                                 handleAddTaskGroup={handleAddTaskGroup}
//                                 buttonValue="module"
//                                 setFormData={setData}
//                                 formData={data}
//                                 labelKey="label"
//                                 valueKey="value"
//                                 isRequired
//                             />
//                             {errors.module_id && (
//                                 <div className="text-danger">
//                                     {errors.module_id}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-4">
//                             <SelectWithButton
//                                 name="submodule_id"
//                                 label="Sub Modules"
//                                 placeholder="Select Sub Modules"
//                                 options={submodules}
//                                 handleAddTaskGroup={handleAddTaskGroup}
//                                 buttonValue="submodule"
//                                 setFormData={setData}
//                                 formData={data}
//                                 labelKey="label"
//                                 valueKey="value"
//                             />
//                             {errors.submodule_id && (
//                                 <div className="text-danger">
//                                     {errors.submodule_id}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-4">
//                             <SelectWithButton
//                                 name="feature_id"
//                                 label="Feature"
//                                 placeholder="Select Feature"
//                                 options={features}
//                                 handleAddTaskGroup={handleAddTaskGroup}
//                                 buttonValue="feature"
//                                 setFormData={setData}
//                                 formData={data}
//                                 labelKey="label"
//                                 valueKey="value"
//                             />
//                             {errors.feature_id && (
//                                 <div className="text-danger">
//                                     {errors.feature_id}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-4">
//                             <label className="form-label">
//                                 Task Name <span className="text-danger">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 name="task_name"
//                                 className="form-control form-control-sm rounded-2"
//                                 placeholder="Task Name"
//                                 value={data.task_name}
//                                 onChange={handleInputChange}
//                             />
//                             {errors.task_name && (
//                                 <div className="text-danger">
//                                     {errors.task_name}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-4">
//                             <label className="form-label">Assign Date </label>
//                             <input
//                                 type="date"
//                                 name="assign_date"
//                                 className="form-control form-control-sm rounded-2"
//                                 value={data.assign_date}
//                                 onChange={handleInputChange}
//                             />
//                             {errors.assign_date && (
//                                 <div className="text-danger">
//                                     {errors.assign_date}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-4">
//                             <label className="form-label">Deadline</label>
//                             <input
//                                 type="date"
//                                 name="deadline"
//                                 className="form-control form-control-sm rounded-2"
//                                 value={data.deadline}
//                                 onChange={handleInputChange}
//                             />
//                             {errors.deadline && (
//                                 <div className="text-danger">
//                                     {errors.deadline}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-4">
//                             <SelectSearch
//                                 name="assign_to"
//                                 label="Assign To"
//                                 placeholder="Select To Assign"
//                                 options={userOptions}
//                                 setFormData={setData}
//                                 formData={data}
//                                 labelKey="label"
//                                 valueKey="value"
//                                 renderOption={(user) => `${user.label}`}
//                             />
//                             {errors.assign_to && (
//                                 <div className="text-danger">
//                                     {errors.assign_to}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-4">
//                             <SelectSearch
//                                 name="status"
//                                 label="Task Status"
//                                 placeholder="Select Task Status"
//                                 options={taskStatus}
//                                 setFormData={setData}
//                                 formData={data}
//                                 labelKey="label"
//                                 valueKey="value"
//                                 renderOption={(status) => `${status.label}`}
//                             />
//                             {errors.status && (
//                                 <div className="text-danger">
//                                     {errors.status}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-4">
//                             <SelectSearch
//                                 name="priority"
//                                 label="Task Priority"
//                                 placeholder="Select Task Priority"
//                                 options={taskPriority}
//                                 setFormData={setData}
//                                 formData={data}
//                                 labelKey="label"
//                                 valueKey="value"
//                                 renderOption={(priority) => `${priority.label}`}
//                             />
//                             {errors.status && (
//                                 <div className="text-danger">
//                                     {errors.status}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-4">
//                             <label className="form-label">
//                                 Completion Date
//                             </label>
//                             <input
//                                 type="date"
//                                 name="completion_date"
//                                 className="form-control form-control-sm rounded-2"
//                                 value={data.completion_date}
//                                 onChange={handleInputChange}
//                             />
//                             {errors.completion_date && (
//                                 <div className="text-danger">
//                                     {errors.completion_date}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-6">
//                             <label className="form-label">
//                                 Task Description{" "}
//                                 <span className="text-danger">*</span>
//                             </label>
//                             <textarea
//                                 name="description"
//                                 className="form-control resize-none"
//                                 rows={4}
//                                 cols={50}
//                                 placeholder="Enter a description..."
//                                 value={data.description}
//                                 onChange={handleInputChange}
//                             />
//                             {errors.description && (
//                                 <div className="text-danger">
//                                     {errors.description}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-6">
//                             <label className="form-label">
//                                 Remarks Or Notes
//                             </label>
//                             <textarea
//                                 name="notes"
//                                 className="form-control resize-none"
//                                 rows={4}
//                                 cols={50}
//                                 placeholder="Enter a remarks"
//                                 value={data.notes}
//                                 onChange={handleInputChange}
//                             />
//                             {errors.notes && (
//                                 <div className="text-danger">
//                                     {errors.notes}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-6">
//                             <label className="form-label">Attachment</label>
//                             <input
//                                 className="form-control form-control-sm"
//                                 name="attachment"
//                                 type="file"
//                                 onChange={handleInputChange}
//                             />
//                             {errors.attachment && (
//                                 <div className="text-danger">
//                                     {errors.attachment}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="col-md-12">
//                             <button type="submit" className="btn btn-primary">
//                                 Save Task
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//             <TaskGroupAddModal
//                 show={showModal}
//                 handleClose={() => setShowModal(false)}
//                 type={type}
//                 onAddTaskGroup={handleTaskGroupAdded} // New callback prop
//             />
//         </div>
//     );
// };

// export default MainForm;
