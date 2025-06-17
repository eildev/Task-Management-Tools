import { useEffect, useRef, useState } from "react";
import "./DynamicTable.css";
import $ from "jquery";

const DynamicTable = ({
    columns,
    data,
    actions = [],
    filterableColumns = [],
}) => {
    const tableRef = useRef(null);
    const [filters, setFilters] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!window.$ || !window.$.fn.dataTable) {
            console.error("jQuery or DataTables is not available.");
            setIsLoading(false);
            return;
        }

        // DOM প্রস্তুতি নিশ্চিত করার জন্য অপেক্ষা
        const initializeTable = () => {
            if (!data || data.length === 0) {
                setIsLoading(false); // ডেটা না থাকলে লোডিং বন্ধ
                return;
            }

            const table = $(tableRef.current).DataTable({
                pageLength: 10,
                data: data,
                columns: [
                    {
                        title:
                            '<div className="form-check style-check d-flex align-items-center">' +
                            '<input className="form-check-input" type="checkbox" />' +
                            '<label className="form-check-label">S.L</label></div>',
                        data: null,
                        render: (data, type, row, meta) => {
                            return `<div className="form-check style-check d-flex align-items-center">
                                        <input className="form-check-input" type="checkbox" />
                                        <label className="form-check-label">${
                                            meta.row + 1
                                        }</label>
                                    </div>`;
                        },
                        orderable: false,
                    },
                    ...columns.map((col) => ({
                        title: col.title,
                        data: col.data,
                        render: col.render ? col.render : null,
                        orderable: col.orderable !== false,
                    })),
                    {
                        title: "Action",
                        data: null,
                        render: (data, type, row) => {
                            return actions
                                .map((action) => {
                                    const { icon, className, href, onClick } =
                                        action;
                                    return `<a href="${
                                        href ? href(row) : "#"
                                    }" class="${className}" 
                                        ${
                                            onClick
                                                ? `onclick="${onClick(row)}"`
                                                : ""
                                        }>
                                            <i class="${icon}"></i>
                                        </a>`;
                                })
                                .join("");
                        },
                        orderable: false,
                    },
                ],
                initComplete: function () {
                    setIsLoading(false); // টেবিল লোড হওয়ার পর লোডিং স্টেট বন্ধ
                },
            });

            const applyFilters = () => {
                Object.keys(filters).forEach((key) => {
                    table
                        .column(parseInt(key))
                        .search(filters[key] || "")
                        .draw();
                });
            };

            // ফিল্টার ইভেন্ট সেট করা
            Object.keys(filters).forEach((key) => {
                $(`#filter-${key}`).on("keyup change", function () {
                    setFilters((prev) => ({
                        ...prev,
                        [key]: $(this).val(),
                    }));
                });
            });

            // প্রথমবার ফিল্টার প্রয়োগ
            applyFilters();

            return () => {
                table.destroy(true);
            };
        };

        // DOM এর উপর ইনিশিয়ালাইজেশন
        const timer = setTimeout(() => {
            initializeTable();
        }, 0); // 0ms ডিলে দিয়ে DOM প্রস্তুতির জন্য অপেক্ষা

        return () => clearTimeout(timer); // ক্লিনআপ
    }, [columns, data, actions, filterableColumns]);

    const renderFilterRow = () => {
        const filterInputs = columns.map((col, index) => {
            if (filterableColumns.includes(index)) {
                return (
                    <th key={index}>
                        <select
                            id={`filter-${index}`}
                            className="form-select mb-2"
                            onChange={(e) => {
                                setFilters((prev) => ({
                                    ...prev,
                                    [index]: e.target.value,
                                }));
                            }}
                        >
                            <option value="">All</option>
                            {Array.from(
                                new Set(
                                    data?.map((item) => item[col.data]) || []
                                )
                            )
                                .sort()
                                .map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                        </select>
                        <input
                            id={`filter-${index}-search`}
                            type="text"
                            className="form-control mb-2"
                            placeholder="Search..."
                            onChange={(e) => {
                                setFilters((prev) => ({
                                    ...prev,
                                    [index]: e.target.value,
                                }));
                            }}
                        />
                    </th>
                );
            }
            return <th key={index}></th>;
        });

        return (
            <tr>
                <th></th>
                {filterInputs}
                <th></th>
            </tr>
        );
    };

    return (
        <div className="card basic-data-table">
            <div className="card-header">
                <h5 className="card-title mb-0">Dynamic Data Tables</h5>
            </div>
            <div className="card-body">
                {isLoading ? (
                    <div className="text-center p-4">Loading...</div>
                ) : (
                    <table
                        className="table bordered-table mb-0"
                        id="dataTable"
                        ref={tableRef}
                        data-page-length={10}
                        style={{
                            opacity: isLoading ? 0 : 1,
                            transition: "none",
                        }}
                    >
                        <thead>
                            {renderFilterRow()}
                            <tr>
                                <th>
                                    <div className="form-check style-check d-flex align-items-center">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                        />
                                        <label className="form-check-label">
                                            S.L
                                        </label>
                                    </div>
                                </th>
                                {columns.map((col, index) => (
                                    <th key={index}>{col.title}</th>
                                ))}
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DynamicTable;

// import { useEffect, useRef } from "react";
// import $ from "jquery";

// const DynamicTable = ({
//     columns,
//     data,
//     actions = [],
//     filterableColumns = [],
// }) => {
//     const tableRef = useRef(null);

//     useEffect(() => {
//         if (!window.$ || !window.$.fn.dataTable) {
//             console.error("jQuery or DataTables is not available.");
//             return;
//         }

//         const table = $(tableRef.current).DataTable({
//             pageLength: 10,
//             data: data,
//             columns: [
//                 {
//                     title:
//                         '<div className="form-check style-check d-flex align-items-center">' +
//                         '<input className="form-check-input" type="checkbox" />' +
//                         '<label className="form-check-label">S.L</label></div>',
//                     data: null,
//                     render: (data, type, row, meta) => {
//                         return `<div className="form-check style-check d-flex align-items-center">
//                                     <input className="form-check-input" type="checkbox" />
//                                     <label className="form-check-label">${
//                                         meta.row + 1
//                                     }</label>
//                                 </div>`;
//                     },
//                     orderable: false,
//                 },
//                 ...columns.map((col) => ({
//                     title: col.title,
//                     data: col.data,
//                     render: col.render ? col.render : null,
//                     orderable: col.orderable !== false,
//                 })),
//                 {
//                     title: "Action",
//                     data: null,
//                     render: (data, type, row) => {
//                         return actions
//                             .map((action) => {
//                                 const { icon, className, href, onClick } =
//                                     action;
//                                 return `<a href="${
//                                     href ? href(row) : "#"
//                                 }" class="${className}"
//                                     ${
//                                         onClick
//                                             ? `onclick="${onClick(row)}"`
//                                             : ""
//                                     }>
//                                         <i class="${icon}"></i>
//                                     </a>`;
//                             })
//                             .join("");
//                     },
//                     orderable: false,
//                 },
//             ],
//             initComplete: function () {
//                 const api = this.api();

//                 // Add filters for specified columns
//                 filterableColumns.forEach((colIndex) => {
//                     const column = api.column(colIndex + 1); // +1 for S.L column
//                     const select = $(
//                         '<select class="form-select mb-2"><option value="">All</option></select>'
//                     )
//                         .appendTo($(column.header()).empty())
//                         .on("change", function () {
//                             const val = $.fn.dataTable.util.escapeRegex(
//                                 $(this).val()
//                             );
//                             column
//                                 .search(val ? "^" + val + "$" : "", true, false)
//                                 .draw();
//                         });

//                     column
//                         .data()
//                         .unique()
//                         .sort()
//                         .each(function (d, j) {
//                             select.append(`<option value="${d}">${d}</option>`);
//                         });

//                     // Add search input
//                     const searchInput = $(
//                         '<input class="form-control mb-2" type="text" placeholder="Search..." />'
//                     )
//                         .appendTo($(column.header()))
//                         .on("keyup change", function () {
//                             if (column.search() !== this.value) {
//                                 column.search(this.value).draw();
//                             }
//                         });
//                 });
//             },
//         });

//         return () => {
//             table.destroy(true);
//         };
//     }, [columns, data, actions, filterableColumns]);

//     return (
//         <div className="card basic-data-table">
//             <div className="card-header">
//                 <h5 className="card-title mb-0">Dynamic Data Tables</h5>
//             </div>
//             <div className="card-body">
//                 <table
//                     className="table bordered-table mb-0"
//                     id="dataTable"
//                     ref={tableRef}
//                     data-page-length={10}
//                 >
//                     <thead></thead>
//                     <tbody></tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default DynamicTable;
