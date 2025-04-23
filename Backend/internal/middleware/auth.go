package middleware

import (
	"backend/internal/utils"
	"context"
	"log"
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
)

func TokenAuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenString := utils.ExtractToken(r)

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte("ACCESS_SSECRETT"), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		adminIDFloat, ok := claims["admin_id"].(float64)
		if !ok {
			log.Println("admin_id is missing or not a number")
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		adminID := int(adminIDFloat)
		ctx := context.WithValue(r.Context(), "admin_id", adminID)

		next(w, r.WithContext(ctx))
	}
}

func AdminAuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("admin_id")
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		adminID, err := strconv.Atoi(cookie.Value)
		if err != nil {
			http.Error(w, "invalid admin_id", http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), "admin_id", adminID)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func UserMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("user")

		if err != nil {
			http.Error(w, "Incorrect value", http.StatusUnauthorized)
			return
		}

		userId, err := strconv.Atoi(cookie.Value)

		if err != nil {
			http.Error(w, "invalid user", http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), "user", userId)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func UserOrAdminMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var ctx = r.Context()
		var hasAccess bool

		if cookie, err := r.Cookie("admin_id"); err == nil {
			if adminID, err := strconv.Atoi(cookie.Value); err == nil {
				ctx = context.WithValue(ctx, "admin_id", adminID)
				hasAccess = true
			}
		}

		if cookie, err := r.Cookie("user"); err == nil {
			if userID, err := strconv.Atoi(cookie.Value); err == nil {
				ctx = context.WithValue(ctx, "user", userID)
				hasAccess = true
			}
		}

		if !hasAccess {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
