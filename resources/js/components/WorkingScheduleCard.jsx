import React, { useState } from "react";
import PropTypes from "prop-types";
// import "../css/WorkingScheduleCard.css"; // Assuming CSS is in this file

// Sample data for the schedule (can be passed as props)
const defaultSchedule = [
    {
        id: 1,
        time: "10:20 - 11:00",
        period: "AM",
        title: "UI UX Dashboard Project Meeting",
        leader: "Jane Cooper",
        borderColor: "border-purple",
    },
    {
        id: 2,
        time: "10:20 - 11:00",
        period: "AM",
        title: "UI UX Dashboard Project Meeting",
        leader: "Jane Cooper",
        borderColor: "border-warning-600",
    },
    {
        id: 3,
        time: "10:20 - 11:00",
        period: "AM",
        title: "UI UX Dashboard Project Meeting",
        leader: "Jane Cooper",
        borderColor: "border-info-600",
    },
];

// Sample week data
const defaultWeek = [
    { day: "Fr", date: 21 },
    { day: "Sa", date: 22 },
    { day: "Su", date: 23 },
    { day: "Mo", date: 24 },
    { day: "Tu", date: 25, isActive: true },
    { day: "We", date: 26 },
    { day: "Th", date: 27 },
];

// Month options
const months = [
    "Jan 2025",
    "Feb 2025",
    "March 2025",
    "April 2025",
    "May 2025",
    "June 2025",
    "July 2025",
    "Aug 2025",
    "Sep 2025",
    "Oct 2025",
    "Nov 2025",
    "Dec 2025",
];

const WorkingScheduleCard = ({
    schedule = defaultSchedule,
    week = defaultWeek,
    onViewClick,
}) => {
    const [selectedMonth, setSelectedMonth] = useState("June 2025");

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    return (
        <div className="col-xxl-4">
            <div className="card h-100 radius-8 border-0">
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                    <h6 className="text-lg fw-semibold mb-0">
                        Working Schedule
                    </h6>
                    <div>
                        <select
                            className="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        >
                            {months.map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="card-body p-24">
                    <div className="d-flex align-items-center gap-16 justify-content-between flex-wrap">
                        {week.map((item) => (
                            <div
                                key={item.date}
                                className={`week-item text-center ${
                                    item.isActive
                                        ? "bg-purple rounded-pill py-12 px-16"
                                        : ""
                                }`}
                            >
                                <span
                                    className={`text-sm fw-medium ${
                                        item.isActive
                                            ? "text-white"
                                            : "text-neutral-400"
                                    }`}
                                >
                                    {item.day}
                                </span>
                                <h6
                                    className={`text-md mb-0 ${
                                        item.isActive ? "text-white" : ""
                                    }`}
                                >
                                    {item.date}
                                </h6>
                            </div>
                        ))}
                    </div>

                    <div className="mt-24 d-flex flex-column gap-20">
                        {schedule.map((item) => (
                            <div
                                key={item.id}
                                className={`d-flex align-items-center justify-content-between gap-1 ps-10 border-inline-start border-start-width-3-px ${item.borderColor}`}
                            >
                                <div>
                                    <div className="d-flex align-items-center gap-1">
                                        <h6 className="text-lg mb-0">
                                            {item.time}
                                        </h6>
                                        <span className="text-xs text-secondary-light fw-medium">
                                            {item.period}
                                        </span>
                                    </div>
                                    <p className="text-sm text-secondary-light fw-medium mb-1">
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-neutral-400 fw-medium mb-0">
                                        Lead by{" "}
                                        <span className="text-success-600">
                                            {item.leader}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <a
                                        href="#"
                                        className="btn btn-neutral-200 text-sm text-primary-light py-6 px-16"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onViewClick?.(item);
                                        }}
                                    >
                                        View
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

WorkingScheduleCard.propTypes = {
    schedule: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            time: PropTypes.string.isRequired,
            period: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            leader: PropTypes.string.isRequired,
            borderColor: PropTypes.string.isRequired,
        })
    ),
    week: PropTypes.arrayOf(
        PropTypes.shape({
            day: PropTypes.string.isRequired,
            date: PropTypes.number.isRequired,
            isActive: PropTypes.bool,
        })
    ),
    onViewClick: PropTypes.func,
};

export default WorkingScheduleCard;
