const TeamPerformance = ({ teams }) => {
    return (
        <div className="col-xxl-6">
            <div className="card h-100">
                <div className="card-body p-24">
                    <h6 className="mb-2 fw-bold text-lg">Team Performance</h6>
                    <table className="table bordered-table mb-0 border-neutral-100">
                        <thead>
                            <tr>
                                <th>Team Member</th>
                                <th>Tasks</th>
                                <th>Completed</th>
                                <th>Overdue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((member, index) => (
                                <tr key={member.id}>
                                    <td>{member.name}</td>
                                    <td>{member.taskCount}</td>
                                    <td>{member.completedTasks || 0}</td>
                                    <td>{member.overdueTasks || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeamPerformance;
