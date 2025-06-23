import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskProgressChart = ({ tasks }) => {
    const statusCounts = {
        Pending: tasks.filter((task) => task.status === "pending").length,
        InProgress: tasks.filter((task) => task.status === "inprogress").length,
        Completed: tasks.filter((task) => task.status === "completed").length,
    };

    const data = {
        labels: ["Pending", "In Progress", "Completed"],
        datasets: [
            {
                data: [
                    statusCounts.Pending,
                    statusCounts.InProgress,
                    statusCounts.Completed,
                ],
                backgroundColor: ["#FFCA28", "#0288D1", "#4CAF50"],
            },
        ],
    };

    return (
        <div className="card p-24">
            <h6 className="mb-2 fw-bold text-lg">Task Progress</h6>
            <Pie data={data} />
        </div>
    );
};
export default TaskProgressChart;
