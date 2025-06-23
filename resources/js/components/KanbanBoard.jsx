import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { usePage, router } from "@inertiajs/react";
import toast from "react-hot-toast";
import Column from "./Column";

const KanbanBoard = () => {
    const { props } = usePage();
    const { inProgress = [], completed = [], pending = [] } = props;

    const [data, setData] = useState({
        tasks: {},
        columns: {
            "column-1": { id: "column-1", title: "In Progress", taskIds: [] },
            "column-2": { id: "column-2", title: "Pending", taskIds: [] },
            "column-3": { id: "column-3", title: "Done", taskIds: [] },
        },
        columnOrder: ["column-1", "column-2", "column-3"],
    });

    useEffect(() => {
        const tasks = {};
        const inProgressIds = [];
        const pendingIds = [];
        const completedIds = [];

        inProgress.forEach((task) => {
            tasks[`task-${task.id}`] = {
                id: `task-${task.id}`,
                title: task.name,
                description: task.description || "",
                tag: task.priority || "No Tag",
                date: task.assign_date || "",
                image: task.attachment || null,
            };
            inProgressIds.push(`task-${task.id}`);
        });

        pending.forEach((task) => {
            tasks[`task-${task.id}`] = {
                id: `task-${task.id}`,
                title: task.name,
                description: task.description || "",
                tag: task.priority || "No Tag",
                date: task.assign_date || "",
                image: task.attachment || null,
            };
            pendingIds.push(`task-${task.id}`);
        });

        completed.forEach((task) => {
            tasks[`task-${task.id}`] = {
                id: `task-${task.id}`,
                title: task.name,
                description: task.description || "",
                tag: task.priority || "No Tag",
                date: task.assign_date || "",
                image: task.attachment || null,
            };
            completedIds.push(`task-${task.id}`);
        });

        setData({
            tasks,
            columns: {
                "column-1": {
                    id: "column-1",
                    title: "In Progress",
                    taskIds: inProgressIds,
                },
                "column-2": {
                    id: "column-2",
                    title: "Pending",
                    taskIds: pendingIds,
                },
                "column-3": {
                    id: "column-3",
                    title: "Done",
                    taskIds: completedIds,
                },
            },
            columnOrder: ["column-1", "column-2", "column-3"],
        });
    }, [inProgress, completed, pending]);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const startColumn = data.columns[source.droppableId];
        const endColumn = data.columns[destination.droppableId];

        const statusMap = {
            "column-1": "inprogress",
            "column-2": "pending",
            "column-3": "completed",
        };
        const newStatus = statusMap[destination.droppableId];

        // স্থানীয় স্টেট আপডেট
        if (startColumn === endColumn) {
            const newTaskIds = Array.from(startColumn.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = { ...startColumn, taskIds: newTaskIds };

            setData({
                ...data,
                columns: { ...data.columns, [newColumn.id]: newColumn },
            });
        } else {
            const startTaskIds = Array.from(startColumn.taskIds);
            startTaskIds.splice(source.index, 1);
            const newStart = { ...startColumn, taskIds: startTaskIds };

            const endTaskIds = Array.from(endColumn.taskIds);
            endTaskIds.splice(destination.index, 0, draggableId);
            const newEnd = { ...endColumn, taskIds: endTaskIds };

            setData({
                ...data,
                columns: {
                    ...data.columns,
                    [newStart.id]: newStart,
                    [newEnd.id]: newEnd,
                },
            });
        }

        // Axios দিয়ে ব্যাকএন্ডে রিকোয়েস্ট
        const taskId = draggableId.replace("task-", "");
        axios
            .patch(`/tasks/${taskId}/status`, { status: newStatus })
            .then((response) => {
                toast.success(
                    response.data.message || "Task status updated successfully!"
                );
            })
            .catch((error) => {
                console.error("Error updating task status:", error);
                toast.error(
                    error.response?.data?.error ||
                        "Failed to update task status."
                );
            });
    };

    return (
        <div className="kanban-wrapper p-4">
            <DragDropContext onDragEnd={onDragEnd}>
                <div
                    className="d-flex align-items-start gap-4"
                    style={{ overflowX: "auto" }}
                >
                    {data.columnOrder.map((columnId) => {
                        const column = data.columns[columnId];
                        const tasks = column.taskIds.map(
                            (taskId) => data.tasks[taskId]
                        );
                        return (
                            <Column
                                key={column.id}
                                column={column}
                                tasks={tasks}
                            />
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
