const DashboardCard = () => {
    return (
        <div className="col">
            <div className="card shadow-none border bg-gradient-start-1 h-100">
                <div className="card-body p-20">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div>
                            <p className="fw-medium text-primary-light mb-1">
                                Total Task Group
                            </p>
                            <h6 className="mb-0">20,000</h6>
                        </div>
                        <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                            <Icon
                                icon="gridicons:multiple-users"
                                className="text-white text-2xl mb-0"
                            />
                        </div>
                    </div>
                    <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                        <span className="d-inline-flex align-items-center gap-1 text-success-main">
                            <Icon icon="bxs:up-arrow" className="text-xs" />{" "}
                            +5000
                        </span>
                        Last 30 days users
                    </p>
                </div>
            </div>
            {/* card end */}
        </div>
    );
};

export default DashboardCard;
