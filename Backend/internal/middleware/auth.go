package middleware

import (
	"backend/internal/utils"
	"context"
	"github.com/golang-jwt/jwt/v5"
	"log"
	"net/http"
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
