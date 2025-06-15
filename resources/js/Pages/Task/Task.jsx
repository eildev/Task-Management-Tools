import Breadcrumb from "@/components/Breadcrumb";
import MainForm from "@/components/MainForm";
import MasterLayout from "@/layout/MasterLayout";

const Task = ({ taskGroups }) => {
    // console.log(taskGroups);
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>
                {/* Breadcrumb */}
                <Breadcrumb title="Task" />

                <MainForm taskGroups={taskGroups} />
            </MasterLayout>
        </>
    );
};

export default Task;
