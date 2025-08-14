package todo

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct {
	DB *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{DB: db}
}

// List GET /api/todos?page=1&page_size=10
func (h *Handler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	if page < 1 {
		page = 1
	}
	if size < 1 || size > 100 {
		size = 10
	}

	var items []Todo
	var total int64

	h.DB.Model(&Todo{}).Count(&total)
	h.DB.Order("created_at DESC").
		Limit(size).Offset((page - 1) * size).
		Find(&items)

	c.JSON(http.StatusOK, gin.H{
		"list":       items,
		"page":       page,
		"page_size":  size,
		"total":      total,
		"total_page": (total + int64(size) - 1) / int64(size),
	})
}

// Create POST /api/todos  {"title":"Buy milk"}
func (h *Handler) Create(c *gin.Context) {
	var req CreateTodoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}
	item := Todo{Title: req.Title, Done: false}
	if err := h.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db create failed"})
		return
	}
	c.JSON(http.StatusCreated, item)
}

// Update handles PATCH /api/todos/:id with payload {"title":"New title","done":true}
func (h *Handler) Update(c *gin.Context) {
	
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	fmt.Printf("Param id =%d\n", id)


	var req UpdateTodoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	var item Todo
	if err := h.DB.First(&item, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db query failed"})
		}
		return
	}

	// Partial update with pointer fields
	if req.Title != nil {
		item.Title = *req.Title
	}
	if req.Done != nil {
		item.Done = *req.Done
	}

	if err := h.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db update failed"})
		return
	}
	c.JSON(http.StatusOK, item)
}

// Delete /api/todos/:id
func (h *Handler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	if err := h.DB.Delete(&Todo{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db delete failed"})
		return
	}
	c.Status(http.StatusNoContent)
}
