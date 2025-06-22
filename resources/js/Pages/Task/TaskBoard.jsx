import Breadcrumb from "@/components/Breadcrumb";
import KanbanLayer from "@/components/KanbanLayer";
import MasterLayout from "@/layout/MasterLayout";
import { usePage } from "@inertiajs/react";

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
