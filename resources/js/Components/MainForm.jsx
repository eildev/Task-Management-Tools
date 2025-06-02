const MainForm = () => {
    return (
        <div className="col-md-12">
            <div className="card">
                <div className="card-header">
                    <h6 className="card-title mb-0">Create Task</h6>
                </div>
                <div className="card-body">
                    <div className="row gy-3">
                        <div className="col-md-4">
                            <label className="form-label">Input Small</label>
                            <input
                                type="text"
                                name="#0"
                                className="form-control form-control-sm"
                                placeholder="info@gmail.com"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainForm;
