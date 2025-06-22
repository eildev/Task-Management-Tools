import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";

const TeamMembers = ({ teams }) => {
    console.log("teams", teams);
    const progressColors = [
        "bg-purple",
        "bg-warning-main",
        "bg-info-main",
        "bg-success-main",
        "bg-red",
    ];

    return (
        <div className="col-xxl-4 col-sm-6">
            <div className="card h-100">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 className="mb-2 fw-bold text-lg">Team Members</h6>
                        <Link
                            href="/team-members"
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon
                                icon="solar:alt-arrow-right-linear"
                                className="icon"
                            />
                        </Link>
                    </div>

                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table mb-0 border-neutral-100">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="border-neutral-100"
                                    >
                                        Team Member
                                    </th>
                                    <th
                                        scope="col"
                                        className="border-neutral-100"
                                    >
                                        Task
                                    </th>
                                    <th
                                        scope="col"
                                        className="border-neutral-100"
                                    >
                                        Progress
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams.map((member, index) => (
                                    <tr key={member.id}>
                                        <td className="border-neutral-100">
                                            <div className="d-flex align-items-center gap-12">
                                                <img
                                                    src={`assets/images/user-grid/user-grid-img${
                                                        (index % 5) + 1
                                                    }.png`}
                                                    alt="User"
                                                    className="object-fit-cover rounded-circle w-40-px h-40-px radius-8 flex-shrink-0 overflow-hidden"
                                                />
                                                <div className="flex-grow-1">
                                                    <h6 className="text-md mb-0 fw-medium">
                                                        {member.name}
                                                    </h6>
                                                    <span className="text-sm text-secondary-light fw-medium">
                                                        {member.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-neutral-100">
                                            {member.taskCount}
                                        </td>
                                        <td className="border-neutral-100">
                                            <div className="max-w-112 mx-auto">
                                                <div className="w-100">
                                                    <div
                                                        className="progress progress-sm rounded-pill"
                                                        role="progressbar"
                                                        aria-label="Progress"
                                                        aria-valuenow={
                                                            member.progress
                                                        }
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    >
                                                        <div
                                                            className={`progress-bar ${
                                                                progressColors[
                                                                    index %
                                                                        progressColors.length
                                                                ]
                                                            } rounded-start-pill`}
                                                            style={{
                                                                width: `${member.progress}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamMembers;
