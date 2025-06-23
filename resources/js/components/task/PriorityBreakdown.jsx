const PriorityBreakdown = ({ tasks }) => {
    const priorityCounts = {
        High: tasks.filter((task) => task.priority === "high").length,
        Medium: tasks.filter((task) => task.priority === "medium").length,
        Low: tasks.filter((task) => task.priority === "low").length,
    };
    return (
        <div className="card p-24">
            <h6 className="mb-2 fw-bold text-lg">Task Priority Breakdown</h6>
            <div className="row">
                {Object.entries(priorityCounts).map(([priority, count]) => (
                    <div className="col-4" key={priority}>
                        <div className="card shadow-none border">
                            <div className="card-body p-20">
                                <p className="fw-medium text-primary-light mb-1">
                                    {priority}
                                </p>
                                <h6 className="mb-0">{count}</h6>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PriorityBreakdown;
