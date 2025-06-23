import { Icon } from "@iconify/react";

const UnitCountOne = ({ taskGroups }) => {
    const taskGroupConfig = [
        {
            key: "totalTaskGroup",
            title: "Total Task Group",
            bgClass: "bg-gradient-start-5",
            icon: "lucide:group",
            iconBg: "bg-warning",
        },
        {
            key: "projects",
            title: "Total Projects",
            bgClass: "bg-gradient-start-1",
            icon: "lucide:folder-kanban",
            iconBg: "bg-cyan",
        },
        {
            key: "modules",
            title: "Total Modules",
            bgClass: "bg-gradient-start-2",
            icon: "lucide:box",
            iconBg: "bg-purple",
        },
        {
            key: "subModules",
            title: "Total Sub Modules",
            bgClass: "bg-gradient-start-3",
            icon: "lucide:boxes",
            iconBg: "bg-info",
        },
        {
            key: "features",
            title: "Total Features",
            bgClass: "bg-gradient-start-4",
            icon: "lucide:star",
            iconBg: "bg-success-main",
        },
    ];
    return (
        <div className="row row-cols-xxxl-5 row-cols-lg-4 row-cols-sm-2 row-cols-1 gy-4">
            {taskGroupConfig.map((config, index) => {
                const { total, lastSevenDays } = taskGroups[config.key] || {
                    total: 0,
                    lastSevenDays: 0,
                };
                return (
                    <div className="col" key={config.key}>
                        <div
                            className={`card shadow-none border bg-gradient-start-${
                                index + 1
                            } h-100`}
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

export default UnitCountOne;
