import { useState } from "react";

const MyTasks = ({ tasks }) => {
    const [selectedStatus, setSelectedStatus] = useState("All Tasks");

    // Filter tasks based on selected status
    const filteredTasks =
        selectedStatus === "All Tasks"
            ? tasks
            : tasks.filter(
                  (task) =>
                      task.status.toLowerCase() === selectedStatus.toLowerCase()
              );

    // Status styling configuration
    const statusStyles = {
        pending: { bg: "bg-warning-focus", text: "text-warning-main" },
        completed: { bg: "bg-success-focus", text: "text-success-main" },
        inprogress: { bg: "bg-purple-light", text: "text-purple" },
        cancelled: { bg: "bg-danger-focus", text: "text-danger-main" },
    };

    return (
        <div className="col-xxl-4 col-sm-6">
            <div className="card h-100">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 className="mb-2 fw-bold text-lg">My Tasks</h6>
                        <div>
                            <select
                                className="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8"
                                value={selectedStatus}
                                onChange={(e) =>
                                    setSelectedStatus(e.target.value)
                                }
                            >
                                <option>All Tasks</option>
                                <option>Pending</option>
                                <option>Completed</option>
                                <option>In Progress</option>
                                <option>Canceled</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table mb-0 border-neutral-50">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="border-neutral-50"
                                    >
                                        Project Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="border-neutral-50"
                                    >
                                        Deadline
                                    </th>
                                    <th
                                        scope="col"
                                        className="border-neutral-50"
                                    >
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => (
                                        <tr key={task.id}>
                                            <td className="border-neutral-50">
                                                {task.name}
                                            </td>
                                            <td className="border-neutral-50">
                                                {task.deadline}
                                            </td>
                                            <td className="border-neutral-50 text-center">
                                                <span
                                                    className={`${
                                                        statusStyles[
                                                            task.status.toLowerCase()
                                                        ]?.bg || "bg-gray-200"
                                                    } ${
                                                        statusStyles[
                                                            task.status.toLowerCase()
                                                        ]?.text ||
                                                        "text-gray-700"
                                                    } px-16 py-2 radius-4 fw-medium text-sm`}
                                                >
                                                    {task.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="border-neutral-50 text-center"
                                        >
                                            No tasks found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTasks;
