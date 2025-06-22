import { usePage } from "@inertiajs/react";
import Breadcrumb from "../components/Breadcrumb";
import DashboardLayerOne from "../dashboard/DashboardLayerOne";
import MasterLayout from "../layout/MasterLayout";
import UnitCountOne from "@/components/UnitCountOne";
import DashboardTaskCard from "@/components/card/DashboardTaskCard";
import TeamMembers from "@/components/TeamMembers";

export default function Home() {
    const { props } = usePage();
    const { taskGroups, tasks, teams } = props;
    return (
        <>
            <MasterLayout>
                {/* <a href="/task">This is Task</a> */}
                <Breadcrumb title="Dashboard" />

                {/* Task Group  */}
                <h6 className="text-lg mb-2 font-semibold">Task Group</h6>
                <UnitCountOne taskGroups={taskGroups} />

                {/* Task */}
                <h6 className="text-lg mt-5 mb-2 font-semibold">Task</h6>
                <DashboardTaskCard tasks={tasks} />

                {/* team members */}
                <div className="my-5">
                    <TeamMembers teams={teams} />
                </div>
            </MasterLayout>
        </>
    );
}
