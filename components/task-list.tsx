"use client";

import { JSX } from "react";

import { Task } from "../types/task";
import NewTask from "./new-task";
import TaskCard from "./task-card";

// function useForceRedraw() {
//   const [, setRefresh] = useState(true);

//   return () => setRefresh((a) => !a);
// }

export default function TaskList({
  tasks,
  onTaskToggle,
  onTaskUpdate: onTaskSave,
  onTaskDelete,
  onAddTask,
}: {
  tasks: Task[];
  onTaskToggle: (id: number, checked: boolean) => void;
  onTaskUpdate: (id: number, text: string) => void;
  onTaskDelete: (id: number) => void;
  onAddTask: (text: string) => void;
}) {
  // const forceRefresh = useForceRedraw();

  // const handleTaskToggled = (id: number, checked: boolean) => {
  //   const task = findTask(id);
  //   if (task) task.checked = checked;
  //   forceRefresh();
  // };
  // const handleTaskSave = (id: number, newText: string) => {
  //   const task = findTask(id);
  //   console.info(`Saving value\n${newText}\nto task ${task} with id ${id}`);
  //   if (task) task.text = newText;
  //   forceRefresh();
  // };
  // const handleTaskDelete = (id: number) => {
  //   const index = findTaskIndex(id);
  //   if (index >= 0) {
  //     tasks.splice(index, 1);
  //   }
  //   forceRefresh();
  // };

  // const handleAddNewTask = (text: string) => {
  //   tasks.push(
  //     new Task(
  //       tasks.length == 0 ? 0 : tasks[tasks.length - 1].id + 1,
  //       text,
  //       false
  //     )
  //   );
  //   forceRefresh();
  // };

  const cards: JSX.Element[] = tasks
    .toReversed()
    .map((task) => (
      <TaskCard
        key={task.id}
        taskId={task.id}
        taskText={task.text}
        taskChecked={task.checked}
        onTaskToggled={onTaskToggle}
        onSave={onTaskSave}
        onDelete={onTaskDelete}
      />
    ));

  return (
    <div className="mx-16 pt-16">
      <h1 className="text-center text-2xl mb-10">Task-List</h1>
      <NewTask onAddTask={onAddTask} />
      {cards}
    </div>
  );
}
