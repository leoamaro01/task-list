"use client";

import { JSX, useState } from "react";

import NewTask from "../components/new-task";
import TaskCard from "../components/task-card";
import { Task } from "./_types/task";

const tasks: Task[] = [
  new Task(
    0,
    "something @dev-team #alldone somebody@gmail.com check this www.google.com",
    true
  ),
  new Task(
    1,
    "oh my a@example.com, is this your tag? @stupid-people #wtf",
    true
  ),
  new Task(2, "wtf u guys talking about?", true),
];

function findTaskIndex(id: number): number {
  const index = tasks.findIndex((t: Task) => t.id == id);
  if (index < 0) {
    console.error(`Failed to find task with id ${id}.`);
    return -1;
  }

  return index;
}

function findTask(id: number): Task | null {
  const index = tasks.findIndex((t: Task) => t.id == id);
  if (index < 0) {
    console.error(`Failed to find task with id ${id}.`);
    return null;
  }

  return tasks[index];
}

function useForceRedraw() {
  const [, setRefresh] = useState(true);

  return () => setRefresh((a) => !a);
}

export default function Home() {
  const forceRefresh = useForceRedraw();

  const handleTaskToggled = (id: number, checked: boolean) => {
    const task = findTask(id);
    if (task) task.checked = checked;
    forceRefresh();
  };
  const handleTaskSave = (id: number, newText: string) => {
    const task = findTask(id);
    console.info(`Saving value\n${newText}\nto task ${task} with id ${id}`);
    if (task) task.text = newText;
    forceRefresh();
  };
  const handleTaskDelete = (id: number) => {
    const index = findTaskIndex(id);
    if (index >= 0) {
      tasks.splice(index, 1);
    }
    forceRefresh();
  };
  const handleAddNewTask = (text: string) => {
    tasks.push(
      new Task(
        tasks.length == 0 ? 0 : tasks[tasks.length - 1].id + 1,
        text,
        false
      )
    );
    forceRefresh();
  };

  const cards: JSX.Element[] = tasks
    .toReversed()
    .map((task) => (
      <TaskCard
        key={task.id}
        taskId={task.id}
        taskText={task.text}
        taskChecked={task.checked}
        onTaskToggled={handleTaskToggled}
        onSave={handleTaskSave}
        onDelete={handleTaskDelete}
      />
    ));

  return (
    <div className="mx-16 pt-16">
      <h1 className="text-center text-2xl mb-10">Task-List</h1>
      <NewTask onAddTask={handleAddNewTask} />
      {cards}
    </div>
  );
}
