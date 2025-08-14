// Package server provides the HTTP server setup and routes for the application.
package server

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/xduwzh/gin-gorm-pg-react/backend/internal/todo"
	"gorm.io/gorm"
)


func New(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		// CORS middleware to allow cross-origin requests
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"ok": true, "env": os.Getenv("APP_PORT")})
	})

	// Load the todo handler	
	todoHandler := todo.NewHandler(db)
	todoGroup := r.Group("/api/todos")
	{
		todoGroup.GET("", todoHandler.List)          // List all todos
		todoGroup.POST("", todoHandler.Create)       // Create a new todo
		todoGroup.PATCH("/:id", todoHandler.Update)  // Update a todo by ID
		todoGroup.DELETE("/:id", todoHandler.Delete) // Delete a todo by ID
	}

	return r
}