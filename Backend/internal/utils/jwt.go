package utils

import (
	"backend/models"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"strings"
	"time"
)

func CreateTokens(adminID int) (*models.TokenDetails, error) {
	td := &models.TokenDetails{}
	td.AtExpires = time.Now().Add(15 * time.Minute).Unix()
	td.RtExpires = time.Now().Add(7 * 24 * time.Hour).Unix()

	var err error

	atClaims := jwt.MapClaims{
		"authorized": true,
		"admin_id":   adminID,
		"exp":        td.AtExpires,
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = accessToken.SignedString([]byte("ACCESS_SSECRETT"))
	if err != nil {
		return nil, err
	}

	rtClaims := jwt.MapClaims{
		"admin_id": adminID,
		"exp":      td.RtExpires,
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	td.RefreshToken, err = refreshToken.SignedString([]byte("REFRESH_SSECRETT"))
	if err != nil {
		return nil, err
	}

	return td, nil
}

func CreateAccessToken(adminID int) (string, error) {
	expirationTime := time.Now().Add(15 * time.Minute).Unix()

	atClaims := jwt.MapClaims{
		"authorized": true,
		"admin_id":   adminID,
		"exp":        expirationTime,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	accessToken, err := token.SignedString([]byte("ACCESS_SSECRETT"))
	if err != nil {
		return "", err
	}

	return accessToken, nil
}

func ExtractToken(r *http.Request) string {
	bearerToken := r.Header.Get("Authorization")
	parts := strings.Split(bearerToken, " ")
	if len(parts) == 2 {
		return parts[1]
	}
	return ""
}
