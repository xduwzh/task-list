package todo

import "time"

// Todo represents a task in the todo list.
// It includes fields for the task ID, title, completion status, and timestamps for creation and last update.
type Todo struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Title     string    `json:"title"`
	Done      bool      `json:"done"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
