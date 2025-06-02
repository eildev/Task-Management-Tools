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
                            <label className="form-label">Task Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control form-control-sm"
                                placeholder="Enter Task Name"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainForm;
