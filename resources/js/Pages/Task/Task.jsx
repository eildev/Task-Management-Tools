import Breadcrumb from "@/components/Breadcrumb";
import MainForm from "@/components/MainForm";
import MasterLayout from "@/layout/MasterLayout";

const Task = ({ taskGroups, users }) => {
    // console.log(taskGroups);
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>
                {/* Breadcrumb */}
                <Breadcrumb title="Task" />

                <MainForm taskGroups={taskGroups} users={users} />
            </MasterLayout>
        </>
    );
};

export default Task;
