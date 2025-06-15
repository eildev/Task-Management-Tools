import { Icon } from "@iconify/react";
import SelectWithButton from "./SelectWithButton";
import SelectSearch from "./SelectSearch";
import { useState } from "react";
import TaskGroupAddModal from "./TaskGroupAddModal";

const MainForm = ({ taskGroups, users }) => {
    console.log("users", users);
    const projects = taskGroups.filter((task) => task.type === "project");
    const modules = taskGroups.filter((task) => task.type === "module");
    const submodules = taskGroups.filter((task) => task.type === "submodule");
    const features = taskGroups.filter((task) => task.type === "feature");

    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState("");

    // handle add Task Group
    const handleAddTaskGroup = (value) => {
        setType(value);
        setShowModal(true);
    };

    return (
        <>
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header">
                        <h6 className="card-title mb-0">Create Task</h6>
                    </div>
                    <div className="card-body">
                        <div className="row gy-3">
                            <div className="col-md-4">
                                <SelectWithButton
                                    name="name"
                                    label="Projects"
                                    placeholder="Select projects"
                                    options={projects}
                                    handleAddTaskGroup={handleAddTaskGroup}
                                    buttonValue="project"
                                />
                            </div>
                            <div className="col-md-4">
                                <SelectWithButton
                                    name="module"
                                    label="Modules"
                                    placeholder="Select Modules"
                                    options={modules}
                                    handleAddTaskGroup={handleAddTaskGroup}
                                    buttonValue="module"
                                />
                            </div>
                            <div className="col-md-4">
                                <SelectWithButton
                                    name="sub_module"
                                    label="Sub Modules"
                                    placeholder="Select Sub Modules"
                                    options={submodules}
                                    handleAddTaskGroup={handleAddTaskGroup}
                                    buttonValue="submodule"
                                />
                            </div>
                            <div className="col-md-4">
                                <SelectWithButton
                                    name="name"
                                    label="Feature"
                                    placeholder="Select Feature"
                                    options={features}
                                    handleAddTaskGroup={handleAddTaskGroup}
                                    buttonValue="feature"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Task Name</label>
                                <input
                                    type="text"
                                    name="task_name"
                                    className="form-control form-control-sm rounded-2"
                                    placeholder="Task Name"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">
                                    Assign Date
                                </label>
                                <input
                                    type="date"
                                    name="assign_date"
                                    className="form-control form-control-sm rounded-2"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Deadline</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    className="form-control form-control-sm rounded-2"
                                />
                            </div>
                            <div className="col-md-4">
                                <SelectSearch
                                    name="assign_to"
                                    label="Assign To"
                                    placeholder="Select To Assign"
                                    options={users}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">
                                    Completion Date
                                </label>
                                <input
                                    type="date"
                                    name="completion_date"
                                    className="form-control form-control-sm rounded-2"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">
                                    Task Description
                                </label>
                                <textarea
                                    name="description"
                                    className="form-control resize-none"
                                    rows={4}
                                    cols={50}
                                    placeholder="Enter a description..."
                                    defaultValue={""}
                                />
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
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Attachment</label>
                                <input
                                    className="form-control form-control-sm"
                                    name="attachment"
                                    type="file"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TaskGroupAddModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                type={type}
            />
        </>
    );
};

export default MainForm;
