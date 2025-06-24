import { useEffect } from "react";
import TaskGroupTableRow from "./TaskGroupTableRow";
import $ from "jquery";
import { usePage } from "@inertiajs/react";

const TaskGroupTable = () => {
    const { props } = usePage();
    const { projects, modules, subModules, features } = props;

    useEffect(() => {
        // Initialize DataTables for each table
        const projectTable = $("#projectTable").DataTable({
            pageLength: 10,
            destroy: true,
        });
        const moduleTable = $("#moduleTable").DataTable({
            pageLength: 10,
            destroy: true,
        });
        const subModuleTable = $("#subModuleTable").DataTable({
            pageLength: 10,
            destroy: true,
        });
        const featureTable = $("#featureTable").DataTable({
            pageLength: 10,
            destroy: true,
        });

        // Adjust DataTables layout when tabs are shown
        $('a[data-bs-toggle="pill"]').on("shown.bs.tab", function (e) {
            $.fn.dataTable
                .tables({ visible: true, api: true })
                .columns.adjust();
        });

        // Cleanup: Destroy DataTables instances on component unmount
        return () => {
            projectTable.destroy(true);
            moduleTable.destroy(true);
            subModuleTable.destroy(true);
            featureTable.destroy(true);
        };
    }, [projects, modules, subModules, features]);
    return (
        <div className="col-md-12">
            <div className="card p-0 overflow-hidden position-relative radius-12 h-100">
                <div className="card-header pt-16 pb-0 px-24 bg-base border border-end-0 border-start-0 border-top-0 d-flex align-items-center flex-wrap justify-content-between">
                    <ul
                        className="nav bordered-tab d-inline-flex nav-pills mb-0"
                        id="pills-tab-six"
                        role="tablist"
                    >
                        <li className="nav-item" role="presentation">
                            <button
                                className="nav-link px-16 py-10 active"
                                id="pills-header-home-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-header-home"
                                type="button"
                                role="tab"
                                aria-controls="pills-header-home"
                                aria-selected="true"
                            >
                                Projects
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className="nav-link px-16 py-10"
                                id="pills-header-details-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-header-details"
                                type="button"
                                role="tab"
                                aria-controls="pills-header-details"
                                aria-selected="false"
                            >
                                Modules
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className="nav-link px-16 py-10"
                                id="pills-header-profile-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-header-profile"
                                type="button"
                                role="tab"
                                aria-controls="pills-header-profile"
                                aria-selected="false"
                            >
                                Sub Modules
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className="nav-link px-16 py-10"
                                id="pills-header-settings-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-header-settings"
                                type="button"
                                role="tab"
                                aria-controls="pills-header-settings"
                                aria-selected="false"
                            >
                                Features
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="card-body p-24 pt-10">
                    <div className="tab-content" id="pills-tabContent-six">
                        <div
                            className="tab-pane fade show active"
                            id="pills-header-home"
                            role="tabpanel"
                            aria-labelledby="pills-header-home-tab"
                            tabIndex={0}
                        >
                            <div>
                                <div className="mb-3 mt-2">
                                    <h6 className="text-md font-bold">
                                        Projects Data Tables
                                    </h6>
                                </div>
                                <table
                                    className="table bordered-table mb-0 mt-3"
                                    id="projectTable"
                                    data-page-length={10}
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                <div className="form-check style-check d-flex align-items-center">
                                                    <label className="form-check-label">
                                                        S.L
                                                    </label>
                                                </div>
                                            </th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Start Date</th>
                                            <th scope="col">End Date</th>
                                            <th scope="col">Image</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.map((project, index) => (
                                            <TaskGroupTableRow
                                                key={project.id}
                                                data={project}
                                                count={index}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-header-details"
                            role="tabpanel"
                            aria-labelledby="pills-header-details-tab"
                            tabIndex={0}
                        >
                            <div>
                                <div className="">
                                    <h6 className="text-md font-bold">
                                        Modules Data Tables
                                    </h6>
                                </div>
                                <table
                                    className="table bordered-table mb-0 mt-3"
                                    id="moduleTable"
                                    data-page-length={10}
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                <div className="form-check style-check d-flex align-items-center">
                                                    <label className="form-check-label">
                                                        S.L
                                                    </label>
                                                </div>
                                            </th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Start Date</th>
                                            <th scope="col">End Date</th>
                                            <th scope="col">Image</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modules.map((project, index) => (
                                            <TaskGroupTableRow
                                                key={project.id}
                                                data={project}
                                                count={index}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-header-profile"
                            role="tabpanel"
                            aria-labelledby="pills-header-profile-tab"
                            tabIndex={0}
                        >
                            <div>
                                <div className="">
                                    <h6 className="text-md font-bold">
                                        Sub Modules Data Tables
                                    </h6>
                                </div>
                                <table
                                    className="table bordered-table mb-0 mt-3"
                                    id="subModuleTable"
                                    data-page-length={10}
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                <div className="form-check style-check d-flex align-items-center">
                                                    <label className="form-check-label">
                                                        S.L
                                                    </label>
                                                </div>
                                            </th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Start Date</th>
                                            <th scope="col">End Date</th>
                                            <th scope="col">Image</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subModules.map((project, index) => (
                                            <TaskGroupTableRow
                                                key={project.id}
                                                data={project}
                                                count={index}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-header-settings"
                            role="tabpanel"
                            aria-labelledby="pills-header-settings-tab"
                            tabIndex={0}
                        >
                            <div>
                                <div className="">
                                    <h6 className="text-md font-bold">
                                        Features Data Tables
                                    </h6>
                                </div>
                                <table
                                    className="table bordered-table mb-0 mt-3"
                                    id="featureTable"
                                    data-page-length={10}
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                <div className="form-check style-check d-flex align-items-center">
                                                    <label className="form-check-label">
                                                        S.L
                                                    </label>
                                                </div>
                                            </th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Start Date</th>
                                            <th scope="col">End Date</th>
                                            <th scope="col">Image</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {features.map((project, index) => (
                                            <TaskGroupTableRow
                                                key={project.id}
                                                data={project}
                                                count={index}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskGroupTable;
