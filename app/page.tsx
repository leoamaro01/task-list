"use client";

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import TaskList from "../components/task-list";
import { Task } from "../types/task";
import { backendUrl } from "../utils/backendUrl";

const queryClient = new QueryClient();
let tasksCache: Task[];

function fetchTasks() {
  return fetch(backendUrl + "/task")
    .then((res) => res.json())
    .then((data) => data.items);
}

function updateTask({
  id,
  text,
  checked,
}: {
  id: number;
  text: string | undefined;
  checked: boolean | undefined;
}) {
  return fetch(`${backendUrl}/task/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      checked,
    }),
  });
}

function addNewTask(text: string) {
  return fetch(backendUrl + "/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
}

async function deleteTask(id: number) {
  return fetch(`${backendUrl}/task/${id}`, { method: "delete" });
}

export default function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}

function Home() {
  const queryclient = useQueryClient();

  // Data Fetching
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["fetch-tasks"],
    queryFn: fetchTasks,
    refetchInterval: 10000,
  });

  const createNewTaskMutation = useMutation({
    mutationFn: addNewTask,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["fetch-tasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["fetch-tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["fetch-tasks"] });
    },
  });

  if (isError) return <span>Error: {error.message}</span>;

  if (!isPending)
    // High TypeScript sin, but alas, React Query has horrible typing.
    tasksCache = data as unknown as Task[];

  if (tasksCache == undefined) return <></>;

  return (
    <div>
      <TaskList
        onAddTask={(text) => createNewTaskMutation.mutate(text)}
        onTaskDelete={(id) => deleteTaskMutation.mutate(id)}
        onTaskToggle={(id, checked) =>
          updateTaskMutation.mutate({ id, checked, text: undefined })
        }
        onTaskUpdate={(id, text) =>
          updateTaskMutation.mutate({ id, checked: undefined, text })
        }
        tasks={tasksCache.map((tasksCache) => {
          return {
            id: tasksCache.id,
            text: tasksCache.text,
            checked: tasksCache.checked,
          };
        })}
      />
    </div>
  );
}
