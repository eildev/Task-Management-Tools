import { formatDate } from "@/utils/formatDate";
import { Icon } from "@iconify/react";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import "./TaskTable.css";

const TaskTable = () => {
    const { props } = usePage();
    const { data: initialData } = props;

    // Local state to manage table data, filter, sorting, and pagination
    const [data, setData] = useState(initialData);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

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

    // Function to handle task deletion
    const handleDelete = async (taskId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this task? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel",
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`/tasks/delete/${taskId}`, {
                    headers: {
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                });

                if (response.status === 200) {
                    toast.success(response?.data?.message);
                    setData((prevData) =>
                        prevData.filter((task) => task.id !== taskId)
                    );
                    // Reset to first page if current page is empty
                    if (
                        table.getRowModel().rows.length === 1 &&
                        pagination.pageIndex > 0
                    ) {
                        setPagination((prev) => ({
                            ...prev,
                            pageIndex: prev.pageIndex - 1,
                        }));
                    }
                } else {
                    toast.error("Something went wrong");
                }
            } catch (error) {
                console.error("Error deleting task:", error);
                toast.error("Failed to delete task. Please try again.");
            }
        }
    };

    // Define columns for TanStack Table
    const columns = [
        {
            accessorKey: "id",
            header: "S.L",
            cell: ({ row }) => <span>{row.index + 1}</span>,
            enableSorting: false,
        },
        {
            accessorKey: "name",
            header: "Task Name",
            cell: ({ getValue }) => getValue() || "",
            filterFn: (row, id, filterValue) =>
                row.original.name
                    ?.toLowerCase()
                    .includes(filterValue.toLowerCase()),
        },
        {
            accessorKey: "assign_user",
            header: "Assign To",
            cell: ({ getValue }) => (
                <div className="d-flex align-items-center">
                    <img
                        src={
                            getValue()?.image ??
                            "assets/images/user-list/user-list1.png"
                        }
                        alt=""
                        className="flex-shrink-0 me-12 radius-8"
                    />
                    <h6 className="text-md mb-0 fw-medium flex-grow-1">
                        {getValue()?.name ?? "N/A"}
                    </h6>
                </div>
            ),
            filterFn: (row, id, filterValue) =>
                row.original.assign_user?.name
                    ?.toLowerCase()
                    .includes(filterValue.toLowerCase()),
            sortingFn: (rowA, rowB, columnId) =>
                rowA.original.assign_user?.name?.localeCompare(
                    rowB.original.assign_user?.name || ""
                ),
        },
        {
            accessorKey: "assign_date",
            header: "Assign Date",
            cell: ({ getValue }) => formatDate(getValue() || ""),
            sortingFn: (rowA, rowB, columnId) =>
                new Date(rowA.original.assign_date || 0) -
                new Date(rowB.original.assign_date || 0),
        },
        {
            accessorKey: "completion_date",
            header: "Completion Date",
            cell: ({ getValue }) => formatDate(getValue() || ""),
            sortingFn: (rowA, rowB, columnId) =>
                new Date(rowA.original.completion_date || 0) -
                new Date(rowB.original.completion_date || 0),
        },
        {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ getValue }) => {
                const priority = getValue();
                return (
                    <span
                        className={`px-24 py-4 rounded-pill fw-medium text-sm text-capitalize ${
                            {
                                low: "bg-danger-focus text-danger-main",
                                high: "bg-success-focus text-success-main",
                                medium: "bg-warning-focus text-warning-main",
                            }[priority] || "bg-light text-dark"
                        }`}
                    >
                        {priority || ""}
                    </span>
                );
            },
            filterFn: (row, id, filterValue) =>
                row.original.priority
                    ?.toLowerCase()
                    .includes(filterValue.toLowerCase()),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => {
                const status = getValue();
                return (
                    <span
                        className={`px-24 py-4 rounded-pill fw-medium text-sm text-capitalize ${
                            {
                                pending: "bg-warning-focus text-warning-main",
                                inprogress: "bg-info-focus text-info-main",
                                completed: "bg-success-focus text-success-main",
                                cancelled: "bg-danger-focus text-danger-main",
                                hold: "bg-secondary-focus text-secondary-main",
                                rejected: "bg-danger-dark text-danger-dark",
                                approved: "bg-success-light text-success-light",
                                issues: "bg-warning-dark text-warning-dark",
                            }[status] || "bg-light text-dark"
                        }`}
                    >
                        {status || ""}
                    </span>
                );
            },
            filterFn: (row, id, filterValue) =>
                row.original.status
                    ?.toLowerCase()
                    .includes(filterValue.toLowerCase()),
        },
        {
            accessorKey: "id",
            header: "Action",
            cell: ({ getValue }) => {
                const taskId = getValue();
                return (
                    <>
                        <Link
                            href={`tasks/${taskId}`}
                            className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                        >
                            <Icon icon="iconamoon:eye-light" />
                        </Link>
                        <Link
                            href={`/tasks/edit/${taskId}`}
                            className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                        >
                            <Icon icon="lucide:edit" />
                        </Link>
                        <button
                            onClick={() => handleDelete(taskId)}
                            className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                        >
                            <Icon icon="mingcute:delete-2-line" />
                        </button>
                        {data.find((task) => task.id === taskId)?.attachment ? (
                            <Link
                                onClick={(e) =>
                                    handleDownload(
                                        e,
                                        data.find((task) => task.id === taskId)
                                            ?.attachment
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
                    </>
                );
            },
            enableSorting: false,
        },
    ];

    // Initialize TanStack Table with filtering, sorting, and pagination
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter,
            sorting,
            pagination,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        globalFilterFn: "auto",
    });

    return (
        <div className="card basic-data-table">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Task Data Tables</h5>
                <div className="search-box">
                    <input
                        type="text"
                        value={globalFilter || ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search tasks..."
                        className="form-control"
                        style={{ width: "250px" }}
                    />
                </div>
            </div>
            <div className="card-body">
                <table className="table bordered-table mb-0">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup, index) => (
                            <tr key={index}>
                                {headerGroup.headers.map((header, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        onClick={header.column.getToggleSortingHandler()}
                                        style={{
                                            cursor: header.column.getCanSort()
                                                ? "pointer"
                                                : "default",
                                        }}
                                    >
                                        <div className="d-flex align-items-center">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getCanSort() && (
                                                <span className="ms-2">
                                                    {{
                                                        asc: " 🔼",
                                                        desc: " 🔽",
                                                    }[
                                                        header.column.getIsSorted()
                                                    ] || " ↕️"}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, i) => (
                            <tr key={i}>
                                {row.getVisibleCells().map((cell, i) => (
                                    <td key={i}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        <span>
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount() || 1}
                        </span>
                    </div>
                    <div>
                        <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </button>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskTable;
