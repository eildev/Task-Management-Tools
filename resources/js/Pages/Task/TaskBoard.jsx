import Breadcrumb from "@/components/Breadcrumb";
import KanbanLayer from "@/components/KanbanLayer";
import MasterLayout from "@/layout/MasterLayout";

const TaskBoard = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>
                {/* Breadcrumb */}
                <Breadcrumb title="Task Board" />

                {/* KanbanLayer */}
                <KanbanLayer />
            </MasterLayout>
        </>
    );
};

export default TaskBoard;
