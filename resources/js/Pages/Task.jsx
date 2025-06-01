import Breadcrumb from "@/components/Breadcrumb";
import KanbanLayer from "@/components/KanbanLayer";
import MasterLayout from "@/layout/MasterLayout";

const Task = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>
                {/* Breadcrumb */}
                <Breadcrumb title="Task" />

                {/* KanbanLayer */}
                <KanbanLayer />
            </MasterLayout>
        </>
    );
};

export default Task;
