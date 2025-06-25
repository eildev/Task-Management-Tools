import { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./TaskTable.css";

const DynamicTable = ({
    data,
    columns,
    filters = [],
    exportOptions = { pdf: true, excel: true, print: true },
    title = "Data Table",
    addLink,
    onDelete,
    customActions,
}) => {
    // State for table management
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [filterValues, setFilterValues] = useState({});

    // Filtered data based on custom filters
    const filteredData = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];
        return data.filter((item) => {
            return filters.every((filter) => {
                const value = filterValues[filter.accessorKey];
                if (!value) return true;

                if (filter.type === "text") {
                    return item[filter.accessorKey]
                        ?.toLowerCase()
                        .includes(value.toLowerCase());
                } else if (filter.type === "select") {
                    return item[filter.accessorKey] === value;
                } else if (filter.type === "date") {
                    const itemDate = new Date(item[filter.accessorKey]);
                    const [start, end] = value.split("|");
                    return (
                        (!start || itemDate >= new Date(start)) &&
                        (!end || itemDate <= new Date(end))
                    );
                }
                return true;
            });
        });
    }, [data, filterValues, filters]);

    // Handle filter change
    const handleFilterChange = (accessorKey, value) => {
        setFilterValues((prev) => ({ ...prev, [accessorKey]: value }));
    };

    // Export to PDF
    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            autoTable(doc, {
                head: [columns.map((col) => col.header)],
                body: filteredData.map((item, index) =>
                    columns.map((col) => {
                        if (col.accessorKey === "id" && col.header === "SL") {
                            const pageIndex =
                                table.getState().pagination.pageIndex;
                            const pageSize =
                                table.getState().pagination.pageSize;
                            return pageIndex * pageSize + index + 1;
                        }
                        if (col.cell) {
                            try {
                                return col.cell({
                                    row: { original: item, index },
                                    table,
                                });
                            } catch (error) {
                                console.warn(
                                    `Error rendering cell for column ${col.header}:`,
                                    error
                                );
                                return item[col.accessorKey] || "";
                            }
                        }
                        return item[col.accessorKey] || "";
                    })
                ),
            });
            doc.save(`${title.toLowerCase().replace(" ", "_")}.pdf`);
            toast.success("PDF exported successfully!");
        } catch (error) {
            console.error("PDF export failed:", error);
            toast.error("Failed to export PDF. Please try again.");
        }
    };

    // Export to Excel
    const exportToExcel = () => {
        try {
            const tableData = filteredData.map((item, index) => {
                const rowData = {};
                columns.forEach((col) => {
                    if (col.accessorKey === "id" && col.header === "SL") {
                        const pageIndex = table.getState().pagination.pageIndex;
                        const pageSize = table.getState().pagination.pageSize;
                        rowData[col.header] = pageIndex * pageSize + index + 1;
                    } else {
                        rowData[col.header] = col.cell
                            ? col.cell({
                                  row: { original: item, index },
                                  table,
                              })
                            : item[col.accessorKey] || "";
                    }
                });
                return rowData;
            });
            const worksheet = XLSX.utils.json_to_sheet(tableData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, title);
            XLSX.writeFile(
                workbook,
                `${title.toLowerCase().replace(" ", "_")}.xlsx`
            );
            toast.success("Excel exported successfully!");
        } catch (error) {
            console.error("Excel export failed:", error);
            toast.error("Failed to export Excel. Please try again.");
        }
    };

    // Print table
    const printTable = () => {
        try {
            const printWindow = window.open("", "_blank");
            const tableData = filteredData
                .map(
                    (item, index) => `
                <tr>
                    ${columns
                        .map((col) => {
                            if (
                                col.accessorKey === "id" &&
                                col.header === "SL"
                            ) {
                                const pageIndex =
                                    table.getState().pagination.pageIndex;
                                const pageSize =
                                    table.getState().pagination.pageSize;
                                return `<td>${
                                    pageIndex * pageSize + index + 1
                                }</td>`;
                            }
                            return `<td>${
                                col.cell
                                    ? col.cell({
                                          row: { original: item, index },
                                          table,
                                      })
                                    : item[col.accessorKey] || ""
                            }</td>`;
                        })
                        .join("")}
                </tr>`
                )
                .join("");
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print ${title}</title>
                        <style>
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                        </style>
                    </head>
                    <body>
                        <h2 style="text-align: center;">${title}</h2>
                        <table>
                            <thead>
                                <tr>${columns
                                    .map((col) => `<th>${col.header}</th>`)
                                    .join("")}</tr>
                            </thead>
                            <tbody>${tableData}</tbody>
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
            toast.success("Print initiated successfully!");
        } catch (error) {
            console.error("Print failed:", error);
            toast.error("Failed to print. Please try again.");
        }
    };

    // Initialize TanStack Table
    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { globalFilter, sorting, pagination },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        globalFilterFn: "auto",
    });

    // Render filters
    const renderFilters = () => (
        <div className="filter-options me-3 d-flex flex-wrap align-items-start">
            {filters.map((filter) => (
                <div
                    key={filter.accessorKey}
                    className="filter-group me-2 mb-1"
                >
                    <label
                        className="form-label form-label-sm"
                        htmlFor={`filter-${filter.accessorKey}`}
                    >
                        {filter.label}
                    </label>
                    {filter.type === "text" && (
                        <input
                            id={`filter-${filter.accessorKey}`}
                            type="text"
                            value={filterValues[filter.accessorKey] || ""}
                            onChange={(e) =>
                                handleFilterChange(
                                    filter.accessorKey,
                                    e.target.value
                                )
                            }
                            className="form-control form-control-sm"
                            style={{ width: "120px", height: "30px" }}
                            placeholder={`Filter ${filter.label}`}
                        />
                    )}
                    {filter.type === "select" && (
                        <select
                            id={`filter-${filter.accessorKey}`}
                            value={filterValues[filter.accessorKey] || ""}
                            onChange={(e) =>
                                handleFilterChange(
                                    filter.accessorKey,
                                    e.target.value
                                )
                            }
                            className="form-control form-control-sm"
                            style={{ width: "120px", height: "30px" }}
                        >
                            <option value="">All {filter.label}</option>
                            {filter.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}
                    {filter.type === "date" && (
                        <>
                            <input
                                id={`filter-${filter.accessorKey}-start`}
                                type="date"
                                value={
                                    filterValues[filter.accessorKey]?.split(
                                        "|"
                                    )[0] || ""
                                }
                                onChange={(e) =>
                                    handleFilterChange(
                                        filter.accessorKey,
                                        `${e.target.value}|${
                                            filterValues[
                                                filter.accessorKey
                                            ]?.split("|")[1] || ""
                                        }`
                                    )
                                }
                                className="form-control form-control-sm"
                                style={{ width: "120px", height: "30px" }}
                            />
                            <input
                                id={`filter-${filter.accessorKey}-end`}
                                type="date"
                                value={
                                    filterValues[filter.accessorKey]?.split(
                                        "|"
                                    )[1] || ""
                                }
                                onChange={(e) =>
                                    handleFilterChange(
                                        filter.accessorKey,
                                        `${
                                            filterValues[
                                                filter.accessorKey
                                            ]?.split("|")[0] || ""
                                        }|${e.target.value}`
                                    )
                                }
                                className="form-control form-control-sm"
                                style={{ width: "120px", height: "30px" }}
                            />
                        </>
                    )}
                </div>
            ))}
            {filters.length > 0 && (
                <div className="filter-group me-2 mb-1 d-flex align-items-end">
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        style={{ height: "30px", padding: "4px 8px" }}
                        onClick={() => setFilterValues({})}
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="card basic-data-table">
            <div className="card-header">
                <h5 className="card-title mb-3">{title}</h5>
                <div className="d-flex justify-content-between align-items-start">
                    {renderFilters()}
                    <div className="d-flex justify-start align-items-start">
                        <div className="search-box me-2">
                            <input
                                type="text"
                                value={globalFilter || ""}
                                onChange={(e) =>
                                    setGlobalFilter(e.target.value)
                                }
                                placeholder={`Search ${title.toLowerCase()}...`}
                                className="form-control form-control-sm"
                                style={{ width: "150px", height: "30px" }}
                            />
                        </div>
                        {exportOptions.pdf && (
                            <button
                                className="btn btn-primary btn-sm py-6 text-sm me-2"
                                onClick={exportToPDF}
                            >
                                PDF
                            </button>
                        )}
                        {exportOptions.excel && (
                            <button
                                className="btn btn-success btn-sm py-6 text-sm me-2"
                                onClick={exportToExcel}
                            >
                                Excel
                            </button>
                        )}
                        {exportOptions.print && (
                            <button
                                className="btn btn-info btn-sm py-6 text-sm me-2"
                                onClick={printTable}
                            >
                                Print
                            </button>
                        )}
                        {addLink && (
                            <Link
                                href={addLink}
                                className="btn rounded-circle btn-outline-secondary btn-sm p-2 d-flex align-items-center justify-content-center"
                            >
                                <Icon
                                    icon="ic:round-plus"
                                    className="text-2xl"
                                />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <div className="card-body table-responsive">
                <table className="table bordered-table mb-0">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
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
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-6 text-gray-500"
                                >
                                    No data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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

export default DynamicTable;
