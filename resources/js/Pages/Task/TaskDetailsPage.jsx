import MasterLayout from "@/layout/MasterLayout";
import { Icon } from "@iconify/react";
import { usePage } from "@inertiajs/react";
import { Badge, Breadcrumb, Card, Col, Row } from "react-bootstrap";

const TaskDetailsPage = () => {
    const { props } = usePage();
    const task = props.tasks;

    // console.log(task);

    const getFileType = (filePath) => {
        if (!filePath) return null;
        const extension = filePath.split(".").pop()?.toLowerCase();
        if (["jpg", "jpeg", "png"].includes(extension)) return "image";
        if (extension === "pdf") return "pdf";
        if (["doc", "docx"].includes(extension)) return "word";
        if (["xls", "xlsx"].includes(extension)) return "excel";
        return "unknown";
    };

    const fileTypeIcons = {
        image: "bi:file-earmark-image",
        pdf: "bi:file-earmark-pdf",
        word: "bi:file-earmark-word",
        excel: "bi:file-earmark-excel",
        unknown: "bi:file-earmark",
    };

    const statusStyles = {
        pending: { bg: "bg-warning-focus", text: "text-warning-main" },
        inprogress: { bg: "bg-purple-light", text: "text-purple" },
        completed: { bg: "bg-success-focus", text: "text-success-main" },
        cancelled: { bg: "bg-danger-focus", text: "text-danger-main" },
        hold: { bg: "bg-gray-200", text: "text-gray-700" },
        rejected: { bg: "bg-danger-focus", text: "text-danger-main" },
        approved: { bg: "bg-success-focus", text: "text-success-main" },
        issues: { bg: "bg-danger-focus", text: "text-danger-main" },
    };

    const priorityStyles = {
        low: { bg: "bg-info-focus", text: "text-info-main" },
        medium: { bg: "bg-warning-focus", text: "text-warning-main" },
        high: { bg: "bg-danger-focus", text: "text-danger-main" },
    };
    return (
        <MasterLayout>
            <Breadcrumb title="Task Details" />

            <Card className="shadow-none border mb-24">
                <Card.Body className="p-24">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
                        <div>
                            <h3 className="fw-bold text-lg mb-0">
                                {task.name}
                            </h3>
                            <p>{task.description}</p>
                        </div>

                        <div className="d-flex gap-2">
                            <Badge
                                className={`${
                                    statusStyles[task.status.toLowerCase()]?.bg
                                } ${
                                    statusStyles[task.status.toLowerCase()]
                                        ?.text
                                } px-3 py-2 fw-medium`}
                            >
                                {task.status.charAt(0).toUpperCase() +
                                    task.status.slice(1)}
                            </Badge>
                            <Badge
                                className={`${
                                    priorityStyles[task.priority.toLowerCase()]
                                        ?.bg
                                } ${
                                    priorityStyles[task.priority.toLowerCase()]
                                        ?.text
                                } px-3 py-2 fw-medium`}
                            >
                                {task.priority.charAt(0).toUpperCase() +
                                    task.priority.slice(1)}
                            </Badge>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 text-primary-light">
                        <span className="d-flex justify-content-center align-items-center">
                            <Icon icon="lucide:calendar" className="mr-1" />
                            Deadline: {task.deadline || "N/A"}
                        </span>
                        <span className="d-flex justify-content-center align-items-center">
                            <Icon icon="lucide:check-circle" className="mr-1" />
                            Completion: {task.completion_date || "N/A"}
                        </span>
                    </div>
                </Card.Body>
            </Card>

            <Row>
                <Col md={6}>
                    <Card className="shadow-none border mb-24 h-100">
                        <Card.Body className="p-24">
                            <h6 className="fw-semibold text-lg mb-3">
                                Task Details
                            </h6>
                            <div className="mb-3">
                                <strong className="text-primary-light text-sm">
                                    Description:
                                </strong>
                                <p className="text-secondary mt-1">
                                    {task.description ||
                                        "No description provided"}
                                </p>
                            </div>
                            <div className="mb-3">
                                <strong className="text-primary-light text-sm">
                                    Assigned By:
                                </strong>
                                <p className="text-secondary mt-1">
                                    {task?.assign_by?.name ?? "N/A"}
                                </p>
                            </div>
                            <div className="mb-3">
                                <strong className="text-primary-light text-sm">
                                    Assigned To:
                                </strong>
                                <p className="text-secondary mt-1">
                                    {task.assignUser?.name ?? "N/A"}
                                </p>
                            </div>
                            <div className="mb-3">
                                <strong className="text-primary-light text-sm">
                                    Assigned Date:
                                </strong>
                                <p className="text-secondary mt-1">
                                    {task.assign_date || "N/A"}
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow-none border mb-24 h-100">
                        <Card.Body className="p-24">
                            <h6 className="fw-semibold text-lg mb-3">
                                Attachment
                            </h6>
                            {task.attachment ? (
                                <div className="text-center">
                                    {getFileType(task.attachment) ===
                                    "image" ? (
                                        <img
                                            src={`/${task.attachment}`}
                                            alt="Attachment"
                                            className="img-fluid rounded-8 mb-3"
                                            style={{
                                                maxHeight: "300px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <div className="d-flex flex-column align-items-center mb-3">
                                            <Icon
                                                icon={
                                                    fileTypeIcons[
                                                        getFileType(
                                                            task.attachment
                                                        )
                                                    ] || fileTypeIcons.unknown
                                                }
                                                width="48"
                                                className="text-primary mb-2"
                                            />
                                            <span className="text-secondary">
                                                {task.attachment
                                                    .split("/")
                                                    .pop()}
                                            </span>
                                        </div>
                                    )}
                                    <a
                                        href={`/${task.attachment}`}
                                        download
                                        className="btn btn-primary btn-sm"
                                    >
                                        <Icon
                                            icon="lucide:download"
                                            className="mr-1"
                                        />
                                        Download Attachment
                                    </a>
                                </div>
                            ) : (
                                <p className="text-secondary">
                                    No attachment available
                                </p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* রিলেটেড ইনফো সেকশন */}
            <Card className="shadow-none border mb-24">
                <Card.Body className="p-24">
                    <h6 className="fw-semibold text-lg mb-3">
                        Related Information
                    </h6>
                    <Row>
                        <Col md={3}>
                            <div className="mb-3">
                                <strong className="text-primary-light text-sm">
                                    Project:
                                </strong>
                                <p className="text-secondary mt-1">
                                    {task.project?.name || "N/A"}
                                </p>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="mb-3">
                                <strong className="text-primary-light text-sm">
                                    Module:
                                </strong>
                                <p className="text-secondary mt-1">
                                    {task.module?.name || "N/A"}
                                </p>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="mb-3">
                                <strong className="text-primary-light text-sm">
                                    Submodule:
                                </strong>
                                <p className="text-secondary mt-1">
                                    {task.submodule?.name || "N/A"}
                                </p>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="mb-3">
                                <strong className="text-primary-light text-sm">
                                    Feature:
                                </strong>
                                <p className="text-secondary mt-1">
                                    {task.feature?.name || "N/A"}
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* রিমার্কস সেকশন */}
            <Card className="shadow-none border mb-24">
                <Card.Body className="p-24">
                    <h6 className="fw-semibold text-lg mb-3">Remarks</h6>
                    <p className="text-secondary">
                        {task.remarks || "No remarks provided"}
                    </p>
                </Card.Body>
            </Card>
        </MasterLayout>
    );
};

export default TaskDetailsPage;
