import SelectWithButton from "./SelectWithButton";
import SelectSearch from "./SelectSearch";
import { useState, useEffect } from "react"; // Added useEffect
import TaskGroupAddModal from "./TaskGroupAddModal";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

const MainForm = ({ taskGroups: initialTaskGroups, users }) => {
    // Local state for taskGroups
    const [taskGroups, setTaskGroups] = useState(initialTaskGroups || []);

    // Sync initialTaskGroups with local state when props change
    useEffect(() => {
        setTaskGroups(initialTaskGroups || []);
    }, [initialTaskGroups]);

    // Map tasks to options format
    const projects = taskGroups
        .filter((task) => task.type === "project")
        .map((task) => ({ value: task.id, label: task.name }));
    const modules = taskGroups
        .filter((task) => task.type === "module")
        .map((task) => ({ value: task.id, label: task.name }));
    const submodules = taskGroups
        .filter((task) => task.type === "submodule")
        .map((task) => ({ value: task.id, label: task.name }));
    const features = taskGroups
        .filter((task) => task.type === "feature")
        .map((task) => ({ value: task.id, label: task.name }));

    // Map users to options format
    const userOptions = users.map((user) => ({
        value: user.id,
        label: user.name,
    }));

    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState("");

    // Form management with useForm
    const { data, setData, post, errors, reset } = useForm({
        project_id: "",
        module_id: "",
        submodule_id: "",
        feature_id: "",
        task_name: "",
        assign_date: "",
        deadline: "",
        assign_to: "",
        completion_date: "",
        description: "",
        notes: "",
        attachment: null,
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setData(name, files ? files[0] : value);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("task.store"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Task created successfully!");
                reset();
            },
            onError: () => {
                toast.error("Failed to create task. Please check the form.");
            },
        });
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
                                setFormData={setData}
                                formData={data}
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
                                setFormData={setData}
                                formData={data}
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
                                setFormData={setData}
                                formData={data}
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
                                setFormData={setData}
                                formData={data}
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
                            <label className="form-label">
                                Task Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="task_name"
                                className="form-control form-control-sm rounded-2"
                                placeholder="Task Name"
                                value={data.task_name}
                                onChange={handleInputChange}
                            />
                            {errors.task_name && (
                                <div className="text-danger">
                                    {errors.task_name}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Assign Date </label>
                            <input
                                type="date"
                                name="assign_date"
                                className="form-control form-control-sm rounded-2"
                                value={data.assign_date}
                                onChange={handleInputChange}
                            />
                            {errors.assign_date && (
                                <div className="text-danger">
                                    {errors.assign_date}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                className="form-control form-control-sm rounded-2"
                                value={data.deadline}
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
                                setFormData={setData}
                                formData={data}
                                labelKey="label"
                                valueKey="value"
                                renderOption={(user) => `${user.label}`}
                            />
                            {errors.assign_to && (
                                <div className="text-danger">
                                    {errors.assign_to}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">
                                Completion Date
                            </label>
                            <input
                                type="date"
                                name="completion_date"
                                className="form-control form-control-sm rounded-2"
                                value={data.completion_date}
                                onChange={handleInputChange}
                            />
                            {errors.completion_date && (
                                <div className="text-danger">
                                    {errors.completion_date}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                Task Description{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <textarea
                                name="description"
                                className="form-control resize-none"
                                rows={4}
                                cols={50}
                                placeholder="Enter a description..."
                                value={data.description}
                                onChange={handleInputChange}
                            />
                            {errors.description && (
                                <div className="text-danger">
                                    {errors.description}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                Remarks Or Notes
                            </label>
                            <textarea
                                name="notes"
                                className="form-control resize-none"
                                rows={4}
                                cols={50}
                                placeholder="Enter a remarks"
                                value={data.notes}
                                onChange={handleInputChange}
                            />
                            {errors.notes && (
                                <div className="text-danger">
                                    {errors.notes}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Attachment</label>
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
                            <button type="submit" className="btn btn-primary">
                                Save Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <TaskGroupAddModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                type={type}
                onAddTaskGroup={handleTaskGroupAdded} // New callback prop
            />
        </div>
    );
};

export default MainForm;
