import { formatDate } from "@/utils/formatDate";
import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";

const TaskGroupTableRow = ({ data, count }) => {
    const { description, name, start_date, end_date, image } = data;
    // console.log(data);
    return (
        <>
            <tr>
                <td>{count + 1}</td>
                <td>{name ?? ""}</td>
                <td>{description ?? ""}</td>
                <td>{formatDate(start_date) ?? ""}</td>
                <td>{formatDate(end_date) ?? ""}</td>
                <td>
                    <img
                        src={image ?? "assets/images/user-list/user-list1.png"}
                        alt="image"
                        className="flex-shrink-0 me-12 radius-8"
                        style={{ height: "70px", objectFit: "cover" }}
                    />
                </td>
                <td>
                    <Link
                        to="#"
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
                </td>
            </tr>
        </>
    );
};

export default TaskGroupTableRow;
