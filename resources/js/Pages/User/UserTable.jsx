import DynamicTable from "@/table/DynamicTable";
import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const UserTable = ({ users }) => {
    const userColumns = [
        {
            accessorKey: "id",
            header: "SL",
            cell: ({ row, table }) => {
                // Calculate the index based on the current page and row position
                const pageIndex = table.getState().pagination.pageIndex;
                const pageSize = table.getState().pagination.pageSize;
                const rowIndex = row.index;
                return pageIndex * pageSize + rowIndex + 1;
            },
            enableSorting: false,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => row.original.name || "",
            enableSorting: true,
            filterType: "text",
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => row.original.email || "",
            enableSorting: true,
            filterType: "text",
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.original.role;
                return (
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            role === "superadmin"
                                ? "bg-purple-100 text-purple-700"
                                : role === "admin"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                        }`}
                    >
                        {role}
                    </span>
                );
            },
            enableSorting: true,
            filterType: "select",
            options: [
                { value: "superadmin", label: "Superadmin" },
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
            ],
        },
        {
            accessorKey: "id",
            header: "Actions",
            cell: ({ row }) => (
                <div className="text-center space-x-2">
                    <Link
                        className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                        href={`/users/${row.original.id}/edit`}
                    >
                        <Icon icon="lucide:edit" />
                    </Link>
                    <Link
                        className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                        href={`/users/${row.original.id}/delete`}
                        method="delete"
                        as="button"
                    >
                        <Icon icon="mingcute:delete-2-line" />
                    </Link>
                </div>
            ),
            enableSorting: false,
        },
    ];

    const userFilters = [
        {
            accessorKey: "name",
            label: "Name",
            type: "text",
        },
        {
            accessorKey: "email",
            label: "Email",
            type: "text",
        },
        {
            accessorKey: "role",
            label: "Role",
            type: "select",
            options: [
                { value: "superadmin", label: "Superadmin" },
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
            ],
        },
    ];

    return (
        <div>
            <DynamicTable
                data={users}
                columns={userColumns}
                filters={userFilters}
                exportOptions={{ pdf: true, excel: true, print: true }}
                title="User List"
                addLink="/users/create"
            />
        </div>
    );
};

export default UserTable;
