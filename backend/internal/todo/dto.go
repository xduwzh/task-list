package todo

type CreateTodoRequest struct {
	Title string `json:"title" binding:"required,min=1,max=200"`
}

type UpdateTodoRequest struct {
	Title *string `json:"title,omitempty" binding:"omitempty,min=1,max=200"`
	Done  *bool   `json:"done,omitempty"`
}
