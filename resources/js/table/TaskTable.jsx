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
                                            {task?.assigned_user?.name ?? "N/A"}
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
                                        href={`tasks/${task.id}`}
                                        className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                                    >
                                        <Icon icon="iconamoon:eye-light" />
                                    </Link>
                                    <Link
                                        href={`/tasks/edit/${task.id}`}
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
            </div>
        </div>
    );
};

export default TaskTable;
