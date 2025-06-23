import moment from "moment";

const NearDeadlineTasks = ({ tasks }) => {
    const nearDeadlineTasks = tasks.filter((task) =>
        moment(task.deadline).isBetween(moment(), moment().add(3, "days"))
    );
    return (
        <div className="card p-24">
            <h6 className="mb-2 fw-bold text-lg">Near Deadline Tasks</h6>
            <ul className="list-group">
                {nearDeadlineTasks.length > 0 ? (
                    nearDeadlineTasks.map((task) => (
                        <li key={task.id} className="list-group-item">
                            {task.name} - Deadline: {task.deadline}
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No tasks near deadline</li>
                )}
            </ul>
        </div>
    );
};

export default NearDeadlineTasks;
