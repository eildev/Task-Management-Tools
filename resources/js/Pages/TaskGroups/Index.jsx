import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/layout/MasterLayout";
import TaskGroupTable from "@/table/TaskGroupTable";

export default function Index({ projects, modules, subModules, features }) {
    return (
        <MasterLayout>
            {/* Breadcrumb */}
            <Breadcrumb title="Task" />
            <TaskGroupTable
                projects={projects}
                modules={modules}
                subModules={subModules}
                features={features}
            />
        </MasterLayout>
    );
}
