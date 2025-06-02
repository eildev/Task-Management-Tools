import KanbanLayer from "@/components/KanbanLayer";
import MasterLayout from "@/layout/MasterLayout";
import { Breadcrumb } from "react-bootstrap";

const TaskManage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>
                {/* Breadcrumb */}
                <Breadcrumb title="Task Manage" />

                {/* KanbanLayer */}
                <KanbanLayer />
            </MasterLayout>
        </>
    );
};

export default TaskManage;
