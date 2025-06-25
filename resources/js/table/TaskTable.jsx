import { formatDate } from "@/utils/formatDate";
import { Icon } from "@iconify/react";
import { Link, usePage } from "@inertiajs/react";
import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import "./TaskTable.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TaskTable = () => {
    const { props } = usePage();
    const { data: initialData, isAdmin, user, taskGroups, users } = props;

    // Local state to manage table data, filter, sorting, and pagination
    const [data, setData] = useState(initialData);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Filter state
    const [filters, setFilters] = useState({
        project_id: "",
        module_id: "",
        status: "",
        priority: "",
        assign_to: "",
        assign_date_start: "",
        assign_date_end: "",
        completion_date_start: "",
        completion_date_end: "",
    });

    // Filter options from MainForm structure
    const projects = taskGroups
        .filter((task) => task.type === "project")
        .map((task) => ({ value: task.id.toString(), label: task.name }));
    const modules = taskGroups
        .filter((task) => task.type === "module")
        .map((task) => ({ value: task.id.toString(), label: task.name }));
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
    const priorityOptions = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
    ];
    const userOptions = users.map((user) => ({
        value: user.id.toString(),
        label: user.name,
    }));

    // Filtered data based on filter state
    const filteredData = useMemo(() => {
        return initialData.filter((task) => {
            const matchesProject = filters.project_id
                ? task.project_id.toString() === filters.project_id
                : true;
            const matchesModule = filters.module_id
                ? task.module_id.toString() === filters.module_id
                : true;
            const matchesStatus = filters.status
                ? task.status === filters.status
                : true;
            const matchesPriority = filters.priority
                ? task.priority === filters.priority
                : true;
            const matchesAssignTo = filters.assign_to
                ? task.assign_to.toString() === filters.assign_to
                : true;
            const matchesAssignDate =
                (!filters.assign_date_start ||
                    new Date(task.assign_date) >=
                        new Date(filters.assign_date_start)) &&
                (!filters.assign_date_end ||
                    new Date(task.assign_date) <=
                        new Date(filters.assign_date_end));
            const matchesCompletionDate =
                (!filters.completion_date_start ||
                    new Date(task.completion_date) >=
                        new Date(filters.completion_date_start)) &&
                (!filters.completion_date_end ||
                    new Date(task.completion_date) <=
                        new Date(filters.completion_date_end));
            return (
                matchesProject &&
                matchesModule &&
                matchesStatus &&
                matchesPriority &&
                matchesAssignTo &&
                matchesAssignDate &&
                matchesCompletionDate
            );
        });
    }, [initialData, filters]);

    // Function to handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
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

    // Function to export table to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [
                [
                    "S.L",
                    "Task Name",
                    ...(isAdmin ? ["Assign To"] : []),
                    "Project Name",
                    "Module Name",
                    "Assign Date",
                    "Completion Date",
                    "Priority",
                    "Status",
                ],
            ],
            body: table
                .getFilteredRowModel()
                .rows.map((row) => [
                    row.index + 1,
                    row.original.name || "",
                    ...(isAdmin
                        ? [row.original.assign_user?.name || "N/A"]
                        : []),
                    row.original.project || "",
                    row.original.module || "",
                    formatDate(row.original.assign_date || ""),
                    formatDate(row.original.completion_date || ""),
                    row.original.priority || "",
                    row.original.status || "",
                ]),
        });
        doc.save("task_table.pdf");
    };

    // Function to export table to Excel
    const exportToExcel = () => {
        const tableData = table.getFilteredRowModel().rows.map((row) => ({
            "S.L": row.index + 1,
            "Task Name": row.original.name || "",
            ...(isAdmin
                ? { "Assign To": row.original.assign_user?.name || "N/A" }
                : {}),
            "Project Name": row.original.project || "",
            "Module Name": row.original.module || "",
            "Assign Date": formatDate(row.original.assign_date || ""),
            "Completion Date": formatDate(row.original.completion_date || ""),
            Priority: row.original.priority || "",
            Status: row.original.status || "",
        }));
        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
        XLSX.writeFile(workbook, "task_table.xlsx");
    };

    // Function to print table
    const printTable = () => {
        const printWindow = window.open("", "_blank");
        const tableData = table
            .getFilteredRowModel()
            .rows.map(
                (row) => `
                <tr>
                    <td>${row.index + 1}</td>
                    <td>${row.original.name || ""}</td>
                    ${
                        isAdmin
                            ? `<td>${
                                  row.original.assign_user?.name || "N/A"
                              }</td>`
                            : ""
                    }
                    <td>${row.original.project || ""}</td>
                    <td>${row.original.module || ""}</td>
                    <td>${formatDate(row.original.assign_date || "")}</td>
                    <td>${formatDate(row.original.completion_date || "")}</td>
                    <td>${row.original.priority || ""}</td>
                    <td>${row.original.status || ""}</td>
                </tr>
            `
            )
            .join("");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Task Table</title>
                    <style>
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h2 style="text-align: center;">Task Report</h2>
                    <h3>${user?.name}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>S.L</th>
                                <th>Task Name</th>
                                ${isAdmin ? `<th>Assign To</th>` : ""}
                                <th>Project Name</th>
                                <th>Module Name</th>
                                <th>Assign Date</th>
                                <th>Completion Date</th>
                                <th>Priority</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableData}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
        setTimeout(() => {
            if (!printWindow.closed) printWindow.close();
        }, 1000);
    };

    // Define columns for TanStack Table (unchanged for brevity)
    const columns = [
        // ... (Previous columns definition remains the same)
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
        ...(isAdmin
            ? [
                  {
                      accessorKey: "assigned_user",
                      header: "Assign To",
                      cell: ({ getValue }) => (
                          <div className="d-flex align-items-center">
                              <img
                                  src={
                                      getValue()?.image ??
                                      "assets/images/user-list/user-list1.png"
                                  }
                                  alt="user image"
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
                      sortingFn: (rowA, rowB) =>
                          rowA.original.assign_user?.name?.localeCompare(
                              rowB.original.assign_user?.name || ""
                          ),
                  },
              ]
            : []),
        {
            accessorKey: "project",
            header: "Project Name",
            cell: ({ getValue }) => getValue() || "",
            filterFn: (row, id, filterValue) =>
                row.original.project
                    ?.toLowerCase()
                    .includes(filterValue.toLowerCase()),
        },
        {
            accessorKey: "module",
            header: "Module Name",
            cell: ({ getValue }) => getValue() || "",
            filterFn: (row, id, filterValue) =>
                row.original.module
                    ?.toLowerCase()
                    .includes(filterValue.toLowerCase()),
        },
        {
            accessorKey: "assign_date",
            header: "Assign Date",
            cell: ({ getValue }) => formatDate(getValue() || ""),
            sortingFn: (rowA, rowB) =>
                new Date(rowA.original.assign_date || 0) -
                new Date(rowB.original.assign_date || 0),
        },
        {
            accessorKey: "completion_date",
            header: "Completion Date",
            cell: ({ getValue }) => formatDate(getValue() || ""),
            sortingFn: (rowA, rowB) =>
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
                            href={`/tasks/${taskId}`}
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
                        <Link
                            href={`/tasks/delete/${taskId}`}
                            method="delete"
                            as="button"
                            className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                            onBefore={async () => {
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
                                return result.isConfirmed;
                            }}
                            onSuccess={() => {
                                toast.success("Task deleted successfully!");
                                setData((prevData) =>
                                    prevData.filter(
                                        (task) => task.id !== taskId
                                    )
                                );
                                if (
                                    table.getRowModel().rows.length === 1 &&
                                    pagination.pageIndex > 0
                                ) {
                                    setPagination((prev) => ({
                                        ...prev,
                                        pageIndex: prev.pageIndex - 1,
                                    }));
                                }
                            }}
                            onError={() => {
                                toast.error(
                                    "Failed to delete task. Please try again."
                                );
                            }}
                        >
                            <Icon icon="mingcute:delete-2-line" />
                        </Link>
                        {data.find((task) => task.id === taskId)?.attachment ? (
                            <Link
                                onClick={(e) =>
                                    handleDownload(
                                        e,
                                        data.find((task) => task.id === taskId)
                                            ?.attachment
                                    )
                                }
                                href="#"
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

    // Initialize TanStack Table
    const table = useReactTable({
        data: filteredData, // Use filtered data
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
            <div className="card-header">
                <h5 className="card-title mb-3">Task Data Tables</h5>
                <div className="d-flex justify-content-between align-items-start">
                    {/* Filter Options */}
                    <div className="filter-options me-3 d-flex flex-wrap align-items-start">
                        {/* Project Filter */}
                        <div className="filter-group me-2 mb-1">
                            <label
                                className="form-label form-label-sm"
                                htmlFor="filter-project_id"
                            >
                                Project
                            </label>
                            <select
                                id="filter-project_id"
                                name="project_id"
                                value={filters.project_id}
                                onChange={handleFilterChange}
                                className="form-control form-control-sm"
                                style={{ width: "120px", height: "30px" }}
                            >
                                <option value="">All Projects</option>
                                {projects.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Module Filter */}
                        <div className="filter-group me-2 mb-1">
                            <label
                                className="form-label form-label-sm"
                                htmlFor="filter-module_id"
                            >
                                Module
                            </label>
                            <select
                                id="filter-module_id"
                                name="module_id"
                                value={filters.module_id}
                                onChange={handleFilterChange}
                                className="form-control form-control-sm"
                                style={{ width: "120px", height: "30px" }}
                            >
                                <option value="">All Modules</option>
                                {modules.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="filter-group me-2 mb-1">
                            <label
                                className="form-label form-label-sm"
                                htmlFor="filter-status"
                            >
                                Status
                            </label>
                            <select
                                id="filter-status"
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="form-control form-control-sm"
                                style={{ width: "120px", height: "30px" }}
                            >
                                <option value="">All Status</option>
                                {statusOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Priority Filter */}
                        <div className="filter-group me-2 mb-1">
                            <label
                                className="form-label form-label-sm"
                                htmlFor="filter-priority"
                            >
                                Priority
                            </label>
                            <select
                                id="filter-priority"
                                name="priority"
                                value={filters.priority}
                                onChange={handleFilterChange}
                                className="form-control form-control-sm"
                                style={{ width: "120px", height: "30px" }}
                            >
                                <option value="">All Priority</option>
                                {priorityOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Assign To Filter (Conditional) */}
                        {isAdmin && (
                            <div className="filter-group me-2 mb-1">
                                <label
                                    className="form-label form-label-sm"
                                    htmlFor="filter-assign_to"
                                >
                                    Assign To
                                </label>
                                <select
                                    id="filter-assign_to"
                                    name="assign_to"
                                    value={filters.assign_to}
                                    onChange={handleFilterChange}
                                    className="form-control form-control-sm"
                                    style={{ width: "120px", height: "30px" }}
                                >
                                    <option value="">All Users</option>
                                    {userOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Assign Date Start Filter */}
                        <div className="filter-group me-2 mb-1">
                            <label
                                className="form-label form-label-sm"
                                htmlFor="filter-assign_date_start"
                            >
                                Assign Start
                            </label>
                            <input
                                id="filter-assign_date_start"
                                type="date"
                                name="assign_date_start"
                                value={filters.assign_date_start}
                                onChange={handleFilterChange}
                                className="form-control form-control-sm"
                                style={{ width: "120px", height: "30px" }}
                            />
                        </div>

                        {/* Assign Date End Filter */}
                        <div className="filter-group me-2 mb-1">
                            <label
                                className="form-label form-label-sm"
                                htmlFor="filter-assign_date_end"
                            >
                                Assign End
                            </label>
                            <input
                                id="filter-assign_date_end"
                                type="date"
                                name="assign_date_end"
                                value={filters.assign_date_end}
                                onChange={handleFilterChange}
                                className="form-control form-control-sm"
                                style={{ width: "120px", height: "30px" }}
                            />
                        </div>

                        {/* Completion Date Start Filter */}
                        <div className="filter-group me-2 mb-1">
                            <label
                                className="form-label form-label-sm"
                                htmlFor="filter-completion_date_start"
                            >
                                Complete Start
                            </label>
                            <input
                                id="filter-completion_date_start"
                                type="date"
                                name="completion_date_start"
                                value={filters.completion_date_start}
                                onChange={handleFilterChange}
                                className="form-control form-control-sm"
                                style={{ width: "120px", height: "30px" }}
                            />
                        </div>

                        {/* Completion Date End Filter */}
                        <div className="filter-group me-2 mb-1">
                            <label
                                className="form-label form-label-sm"
                                htmlFor="filter-completion_date_end"
                            >
                                Complete End
                            </label>
                            <input
                                id="filter-completion_date_end"
                                type="date"
                                name="completion_date_end"
                                value={filters.completion_date_end}
                                onChange={handleFilterChange}
                                className="form-control form-control-sm"
                                style={{ width: "120px", height: "30px" }}
                            />
                        </div>

                        {/* Clear Filters Button */}
                        <div className="filter-group me-2 mb-1 d-flex align-items-end">
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                style={{ height: "30px", padding: "4px 8px" }}
                                onClick={() =>
                                    setFilters({
                                        project_id: "",
                                        module_id: "",
                                        status: "",
                                        priority: "",
                                        assign_to: "",
                                        assign_date_start: "",
                                        assign_date_end: "",
                                        completion_date_start: "",
                                        completion_date_end: "",
                                    })
                                }
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                    {/* Search and Export Buttons */}
                    <div className="d-flex justify-start align-items-start">
                        <div className="search-box me-2">
                            <input
                                type="text"
                                value={globalFilter || ""}
                                onChange={(e) =>
                                    setGlobalFilter(e.target.value)
                                }
                                placeholder="Search tasks..."
                                className="form-control form-control-sm"
                                style={{ width: "150px", height: "30px" }}
                            />
                        </div>
                        <button
                            className="btn btn-primary btn-sm py-6 text-sm me-2"
                            onClick={exportToPDF}
                        >
                            PDF
                        </button>
                        <button
                            className="btn btn-success btn-sm py-6 text-sm me-2"
                            onClick={exportToExcel}
                        >
                            Excel
                        </button>
                        <button
                            className="btn btn-info btn-sm py-6 text-sm me-2"
                            onClick={printTable}
                        >
                            Print
                        </button>
                        <Link
                            href="/task"
                            type="button"
                            className="btn rounded-circle btn-outline-secondary btn-sm p-2 d-flex align-items-center justify-content-center"
                        >
                            <Icon icon="ic:round-plus" className="text-2xl" />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="card-body table-responsive">
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
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </button>
                        <button
                            className="btn btn-outline-primary btn-sm"
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
