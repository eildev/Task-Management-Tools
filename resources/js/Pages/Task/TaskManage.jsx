import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/layout/MasterLayout";
import TaskTable from "@/table/TaskTable";

const TaskManage = () => {
    // console.log(data);
    return (
        <>
            <MasterLayout>
                <Breadcrumb title="Task Manage" />

                <TaskTable />
            </MasterLayout>
        </>
    );
};

export default TaskManage;
