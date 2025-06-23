import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);

const TaskCalendar = ({ tasks }) => {
    const events = tasks.map((task) => ({
        title: task.name,
        start: new Date(task.deadline),
        end: new Date(task.deadline),
        allDay: true,
    }));

    return (
        <div className="card p-24">
            <h6 className="mb-2 fw-bold text-lg">Task Deadlines</h6>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 400 }}
            />
        </div>
    );
};

export default TaskCalendar;
