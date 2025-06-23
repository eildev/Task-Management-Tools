import TaskEditForm from "@/components/form/TaskEditForm";
import MasterLayout from "@/layout/MasterLayout";
import { usePage } from "@inertiajs/react";
import { Breadcrumb } from "react-bootstrap";

const TaskEditPage = () => {
    const { props } = usePage();
    const { task, taskGroups, users } = props;
    return (
        <MasterLayout>
            <Breadcrumb title="Edit Task" />

            <TaskEditForm task={task} taskGroups={taskGroups} users={users} />
        </MasterLayout>
    );
};

export default TaskEditPage;
