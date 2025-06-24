import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/layout/MasterLayout";
import TaskGroupTable from "@/table/TaskGroupTable";

export default function Index() {
    return (
        <MasterLayout>
            {/* Breadcrumb */}
            <Breadcrumb title="Task" />
            <TaskGroupTable />
        </MasterLayout>
    );
}
