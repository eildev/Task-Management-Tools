import { formatDate } from "@/utils/formatDate";
import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";
import $ from "jquery";
import { useEffect, useState } from "react";
import "./TaskTable.css";

const TaskTable = ({ data }) => {
    useEffect(() => {
        const table = $("#dataTable").DataTable({
            pageLength: 10,
        });
        return () => {
            table.destroy(true);
        };
    }, []);

    // State for modal and selected task
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // Function to open modal
    const handleViewClick = (e, task) => {
        e.preventDefault();
        console.log("hello world", isModalOpen);
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    // Function to close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    // Function to trigger file download
    const handleDownload = (e, imageUrl) => {
        e.preventDefault();
        if (imageUrl) {
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = imageUrl.split("/").pop() || "image.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.warn("No image URL available for download.");
        }
    };

    return (
        <div className="card basic-data-table">
            <div className="card-header">
                <h5 className="card-title mb-0">Task Data Tables</h5>
            </div>
            <div className="card-body">
                <table
                    className="table bordered-table mb-0"
                    id="dataTable"
                    data-page-length={10}
                >
                    <thead>
                        <tr>
                            <th scope="col">
                                <div className="form-check style-check d-flex align-items-center">
                                    <label className="form-check-label">
                                        S.L
                                    </label>
                                </div>
                            </th>
                            <th scope="col">Task Name</th>
                            <th scope="col">Assign To</th>
                            <th scope="col">Assign Date</th>
                            <th scope="col">Completion Date</th>
                            <th scope="col">Priority</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((task, key) => (
                            <tr key={key}>
                                <td>
                                    <div className="form-check style-check d-flex align-items-center">
                                        <label className="form-check-label">
                                            {key + 1}
                                        </label>
                                    </div>
                                </td>
                                <td>{task?.name ?? ""}</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={
                                                task?.assign_user?.image ??
                                                "assets/images/user-list/user-list1.png"
                                            }
                                            alt=""
                                            className="flex-shrink-0 me-12 radius-8"
                                        />
                                        <h6 className="text-md mb-0 fw-medium flex-grow-1">
                                            {task?.assign_user?.name ?? "N/A"}
                                        </h6>
                                    </div>
                                </td>
                                <td>{formatDate(task?.assign_date ?? "")}</td>
                                <td>
                                    {formatDate(task?.completion_date ?? "")}
                                </td>
                                <td>
                                    <span
                                        className={`px-24 py-4 rounded-pill fw-medium text-sm text-capitalize ${
                                            {
                                                low: "bg-danger-focus text-danger-main",
                                                high: "bg-success-focus text-success-main",
                                                medium: "bg-warning-focus text-warning-main",
                                            }[task?.priority] ||
                                            "bg-light text-dark"
                                        }`}
                                    >
                                        {task?.priority ?? ""}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        className={`px-24 py-4 rounded-pill fw-medium text-sm text-capitalize ${
                                            {
                                                pending:
                                                    "bg-warning-focus text-warning-main",
                                                inprogress:
                                                    "bg-info-focus text-info-main",
                                                completed:
                                                    "bg-success-focus text-success-main",
                                                cancelled:
                                                    "bg-danger-focus text-danger-main",
                                                hold: "bg-secondary-focus text-secondary-main",
                                                rejected:
                                                    "bg-danger-dark text-danger-dark",
                                                approved:
                                                    "bg-success-light text-success-light",
                                                issues: "bg-warning-dark text-warning-dark",
                                            }[task?.status] ||
                                            "bg-light text-dark"
                                        }`}
                                    >
                                        {task?.status ?? ""}
                                    </span>
                                </td>
                                <td>
                                    <Link
                                        to="#"
                                        onClick={(e) =>
                                            handleViewClick(e, task)
                                        }
                                        className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                                    >
                                        <Icon icon="iconamoon:eye-light" />
                                    </Link>
                                    <Link
                                        to="#"
                                        className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                    >
                                        <Icon icon="lucide:edit" />
                                    </Link>
                                    <Link
                                        to="#"
                                        className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                    >
                                        <Icon icon="mingcute:delete-2-line" />
                                    </Link>
                                    {task?.attachment ? (
                                        <Link
                                            onClick={(e) =>
                                                handleDownload(
                                                    e,
                                                    task?.attachment
                                                )
                                            }
                                            to="#"
                                            className="w-32-px h-32-px me-8 bg-info-focus text-info-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                        >
                                            <Icon icon="material-symbols:download-rounded" />
                                        </Link>
                                    ) : (
                                        ""
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal */}
                {isModalOpen && selectedTask && (
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    >
                        <div className="modal-dialog modal-dialog-centered modal-xl">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Task Details - {selectedTask?.name}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseModal}
                                    ></button>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <div className="card shadow-sm">
                                                <div className="card-body">
                                                    <h6 className="card-subtitle mb-2 text-muted">
                                                        Task Information
                                                    </h6>
                                                    <div className="row g-2">
                                                        <div className="col-6">
                                                            <p className="mb-1">
                                                                <strong>
                                                                    Task Name:
                                                                </strong>{" "}
                                                                {selectedTask?.name ??
                                                                    "N/A"}
                                                            </p>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="mb-1">
                                                                <strong>
                                                                    Assigned To:
                                                                </strong>{" "}
                                                                {selectedTask
                                                                    ?.assign_user
                                                                    ?.name ??
                                                                    "N/A"}
                                                            </p>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="mb-1">
                                                                <strong>
                                                                    Assign Date:
                                                                </strong>{" "}
                                                                {formatDate(
                                                                    selectedTask?.assign_date ??
                                                                        ""
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="mb-1">
                                                                <strong>
                                                                    Completion
                                                                    Date:
                                                                </strong>{" "}
                                                                {formatDate(
                                                                    selectedTask?.completion_date ??
                                                                        ""
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="mb-1">
                                                                <strong>
                                                                    Priority:
                                                                </strong>{" "}
                                                                <span
                                                                    className={`px-2 py-1 rounded-pill fw-medium text-sm text-capitalize ${
                                                                        {
                                                                            low: "bg-danger-focus text-danger-main",
                                                                            high: "bg-success-focus text-success-main",
                                                                            medium: "bg-warning-focus text-warning-main",
                                                                        }[
                                                                            selectedTask
                                                                                ?.priority
                                                                        ] ||
                                                                        "bg-light text-dark"
                                                                    }`}
                                                                >
                                                                    {selectedTask?.priority ??
                                                                        "N/A"}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="mb-1">
                                                                <strong>
                                                                    Status:
                                                                </strong>{" "}
                                                                <span
                                                                    className={`px-2 py-1 rounded-pill fw-medium text-sm text-capitalize ${
                                                                        {
                                                                            pending:
                                                                                "bg-warning-focus text-warning-main",
                                                                            inprogress:
                                                                                "bg-info-focus text-info-main",
                                                                            completed:
                                                                                "bg-success-focus text-success-main",
                                                                            cancelled:
                                                                                "bg-danger-focus text-danger-main",
                                                                            hold: "bg-secondary-focus text-secondary-main",
                                                                            rejected:
                                                                                "bg-danger-dark text-danger-dark",
                                                                            approved:
                                                                                "bg-success-light text-success-light",
                                                                            issues: "bg-warning-dark text-warning-dark",
                                                                        }[
                                                                            selectedTask
                                                                                ?.status
                                                                        ] ||
                                                                        "bg-light text-dark"
                                                                    }`}
                                                                >
                                                                    {selectedTask?.status ??
                                                                        "N/A"}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {selectedTask?.assign_user
                                                        ?.image && (
                                                        <div className="mt-3">
                                                            <p className="mb-1">
                                                                <strong>
                                                                    Assigned
                                                                    User Image:
                                                                </strong>
                                                            </p>
                                                            <img
                                                                src={
                                                                    selectedTask
                                                                        ?.assign_user
                                                                        ?.image
                                                                }
                                                                alt="User"
                                                                className="img-fluid rounded"
                                                                style={{
                                                                    maxWidth:
                                                                        "150px",
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskTable;
