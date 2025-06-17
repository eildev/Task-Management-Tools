import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/layout/MasterLayout";
import TaskTable from "@/table/TaskTable";

const TaskManage = ({ data }) => {
    console.log(data);
    return (
        <>
            <MasterLayout>
                <Breadcrumb title="Task Manage" />

                <TaskTable data={data} />
            </MasterLayout>
        </>
    );
};

export default TaskManage;
