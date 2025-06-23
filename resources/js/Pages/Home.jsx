import { usePage } from "@inertiajs/react";
import Breadcrumb from "../components/Breadcrumb";
import MasterLayout from "../layout/MasterLayout";
import UnitCountOne from "@/components/UnitCountOne";
import DashboardTaskCard from "@/components/card/DashboardTaskCard";
import TeamMembers from "@/components/TeamMembers";
import MyTasks from "@/components/task/MyTasks";
import TaskProgressChart from "@/components/task/TaskProgressChart";
import TaskCalendar from "@/components/task/TaskCalendar";
import TeamPerformance from "@/components/task/TeamPerformance";
import PriorityBreakdown from "@/components/task/PriorityBreakdown";
import NearDeadlineTasks from "@/components/task/NearDeadlineTasks";

export default function Home() {
    const { props } = usePage();
    const { taskGroups, tasks, teams, myTasks, allTask, userRole } = props;
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
                <DashboardTaskCard tasks={tasks} userRole={userRole} />

                <div className="row my-5 gy-3">
                    {/* team members */}
                    {(userRole === "admin" || userRole === "superadmin") &&
                        teams.length > 0 && <TeamMembers teams={teams} />}

                    {/* my Task  */}
                    <MyTasks tasks={myTasks} />

                    {/* Task Progress Chart */}
                    <div className="col-md-4">
                        <TaskProgressChart tasks={allTask} />
                    </div>

                    <div className="col-md-6">
                        <TaskCalendar tasks={allTask} />
                    </div>

                    <TeamPerformance teams={teams} />

                    {/* <div className="col-md-6">
                        <PriorityBreakdown tasks={allTask} />
                    </div> */}

                    {/* <div className="col-md-6">
                        <NearDeadlineTasks tasks={allTask} />
                    </div> */}
                </div>
            </MasterLayout>
        </>
    );
}
