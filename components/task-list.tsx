"use client";

import { JSX } from "react";

import { Task } from "../types/task";
import NewTask from "./new-task";
import TaskCard from "./task-card";

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
