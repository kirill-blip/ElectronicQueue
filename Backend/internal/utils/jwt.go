package utils

import (
	"backend/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"net/http"
	"strings"
	"time"
)

func CreateTokens(adminID int) (*models.TokenDetails, error) {
	td := &models.TokenDetails{}
	td.AtExpires = time.Now().Add(15 * time.Minute).Unix()
	td.AccessUuid = uuid.New().String()

	td.RtExpires = time.Now().Add(7 * 24 * time.Hour).Unix()
	td.RefreshUuid = uuid.New().String()

	var err error

	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["admin_id"] = adminID
	atClaims["exp"] = td.AtExpires
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = token.SignedString([]byte("ACCESS_SSECRETT"))
	if err != nil {
		return nil, err
	}

	rtClaims := jwt.MapClaims{}
	rtClaims["admin_id"] = adminID
	rtClaims["exp"] = td.RtExpires
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	td.RefreshToken, err = refreshToken.SignedString([]byte("REFRESH_SSECRETT"))
	if err != nil {
		return nil, err
	}

	return td, nil
}

func ExtractToken(r *http.Request) string {
	bearerToken := r.Header.Get("Authorization")
	parts := strings.Split(bearerToken, " ")
	if len(parts) == 2 {
		return parts[1]
	}
	return ""
}
