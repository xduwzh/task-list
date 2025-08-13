package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"

	"github.com/xduwzh/gin-gorm-pg-react/backend/internal/db"
	"github.com/xduwzh/gin-gorm-pg-react/backend/internal/server"
	"github.com/xduwzh/gin-gorm-pg-react/backend/internal/todo"
)


func main() {
	_ = godotenv.Load()
	db.Connect()

	if err := db.DB.AutoMigrate(&todo.Todo{}); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	r := server.New()
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatal((err))
	}
}