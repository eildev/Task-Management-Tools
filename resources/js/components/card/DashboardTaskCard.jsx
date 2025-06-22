import { Icon } from "@iconify/react";

const DashboardTaskCard = ({ tasks }) => {
    const taskConfig = [
        {
            key: "totalTask",
            title: "Total Tasks",
            bgClass: "bg-gradient-start-1",
            icon: "fa-solid:tasks",
            iconBg: "bg-cyan",
        },
        {
            key: "completedTask",
            title: "Completed Tasks",
            bgClass: "bg-gradient-start-2",
            icon: "fa-solid:check-circle",
            iconBg: "bg-success-main",
        },
        {
            key: "inprogressTask",
            title: "In Progress Tasks",
            bgClass: "bg-gradient-start-3",
            icon: "fa-solid:spinner",
            iconBg: "bg-info",
        },
        {
            key: "approvedTask",
            title: "Approved Tasks",
            bgClass: "bg-gradient-start-4",
            icon: "fa-solid:thumbs-up",
            iconBg: "bg-purple",
        },
        {
            key: "pendingTask",
            title: "Pending Tasks",
            bgClass: "bg-gradient-start-5",
            icon: "fa-solid:clock",
            iconBg: "bg-warning",
        },
        {
            key: "unassignTask",
            title: "Unassigned Tasks",
            bgClass: "bg-gradient-start-6",
            icon: "fa-solid:user-slash",
            iconBg: "bg-danger",
        },
    ];

    return (
        <div className="row row-cols-xxxl-5 row-cols-lg-4 row-cols-sm-2 row-cols-1 gy-4">
            {taskConfig.map((config) => {
                const { total, lastSevenDays } = tasks[config.key] || {
                    total: 0,
                    lastSevenDays: 0,
                };
                return (
                    <div className="col" key={config.key}>
                        <div
                            className={`card shadow-none border ${config.bgClass} h-100`}
                        >
                            <div className="card-body p-20">
                                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                    <div>
                                        <p className="fw-medium text-primary-light mb-1">
                                            {config.title}
                                        </p>
                                        <h6 className="mb-0">{total}</h6>
                                    </div>
                                    <div
                                        className={`w-50-px h-50-px ${config.iconBg} rounded-circle d-flex justify-content-center align-items-center`}
                                    >
                                        <Icon
                                            icon={config.icon}
                                            className="text-white text-2xl mb-0"
                                        />
                                    </div>
                                </div>
                                <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                                    <span
                                        className={`d-inline-flex align-items-center gap-1 ${
                                            lastSevenDays >= 0
                                                ? "text-success-main"
                                                : "text-danger-main"
                                        }`}
                                    >
                                        <Icon
                                            icon={
                                                lastSevenDays >= 0
                                                    ? "bxs:up-arrow"
                                                    : "bxs:down-arrow"
                                            }
                                            className="text-xs"
                                        />
                                        {lastSevenDays >= 0 ? "+" : ""}
                                        {lastSevenDays}
                                    </span>
                                    Last 7 days
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DashboardTaskCard;
