export interface Todo {
  id: number;
  title: string;
  done: boolean;
  created_at: string;
  updated_at: string;
}

export interface PagedTodos {
  list: Todo[];
  page: number;
  page_size: number;
  total: number;
  total_page: number;
}
