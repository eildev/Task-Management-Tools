import SelectSearch from "./SelectSearch";

const options = [
    {
        value: 1,
        label: "Dhaka",
    },
    {
        value: 2,
        label: "chittagram",
    },
    {
        value: 3,
        label: "Rangpur",
    },
    {
        value: 3,
        label: "Rajshahi",
    },
];

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
                            {/* <label className="form-label">
                                Select Projects
                            </label> */}
                            {/* <input
                                type="text"
                                name="name"
                                className="form-control form-control-sm rounded-2"
                                placeholder="Enter Task Name"
                            /> */}

                            <SelectSearch
                                name="name"
                                label="Select Projects"
                                placeholder="Select projects"
                                options={options}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Task Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control form-control-sm rounded-2"
                                placeholder="Enter Task Name"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Task Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control form-control-sm rounded-2"
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
