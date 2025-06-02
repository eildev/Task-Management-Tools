import Breadcrumb from "@/components/Breadcrumb";
import MainForm from "@/components/MainForm";
import MasterLayout from "@/layout/MasterLayout";

const Task = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>
                {/* Breadcrumb */}
                <Breadcrumb title="Task" />

                <MainForm />
            </MasterLayout>
        </>
    );
};

export default Task;
