import { client } from "./client";
import type { Todo, PagedTodos } from "../types/todo";

export async function listTodos(page = 1, pageSize = 10): Promise<PagedTodos> {
  const { data } = await client.get<PagedTodos>("/todos", {
    params: {
      page,
      page_size: pageSize,
    },
  });
  return data;
}

export async function createTodo(title: string): Promise<Todo> {
  const { data } = await client.post<Todo>("/todos", { title });
  return data;
}

export async function updateTodo(
  id: number,
  patch: { title?: string; done?: boolean }
): Promise<Todo> {
  const { data } = await client.patch<Todo>(`/todos/${id}`, patch);
  return data;
}

export async function deleteTodo(id: number): Promise<void> {
  await client.delete(`/todos/${id}`);
}
