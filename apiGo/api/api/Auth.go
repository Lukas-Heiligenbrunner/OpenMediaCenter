package api

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"openmediacenter/apiGo/database"
	"strconv"
	"time"
)

type Perm uint8

const (
	PermAdmin Perm = iota
	PermUser
	PermUnauthorized
)

func (p Perm) String() string {
	return [...]string{"PermAdmin", "PermUser", "PermUnauthorized"}[p]
}

const SignKey = "89013f1753a6890c6090b09e3c23ff43"
const TokenExpireHours = 24

type Token struct {
	Token     string
	ExpiresAt int64
}

func TokenValid(token string) (int, Perm) {
	t, err := jwt.ParseWithClaims(token, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SignKey), nil
	})
	if err != nil {
		return -1, PermUnauthorized
	}

	claims := t.Claims.(*jwt.StandardClaims)

	id, err := strconv.Atoi(claims.Issuer)
	permid, err := strconv.Atoi(claims.Subject)
	if err != nil {
		return -1, PermUnauthorized
	}
	return id, Perm(permid)
}

func InitOAuth() {
	AddHandler("login", LoginNode, PermUnauthorized, func(ctx Context) {
		var t struct {
			Password string
		}

		if DecodeRequest(ctx.GetRequest(), &t) != nil {
			fmt.Println("Error accured while decoding Testrequest!!")
		}

		// empty check
		if t.Password == "" {
			ctx.Error("empty password")
			return
		}

		// generate Argon2 Hash of passed pwd
		HashPassword(t.Password)
		// todo use hashed password

		var password string

		err := database.QueryRow("SELECT password FROM settings WHERE 1").Scan(&password)
		if err != nil || t.Password != password {
			ctx.Error("unauthorized")
			return
		}

		expires := time.Now().Add(time.Hour * TokenExpireHours).Unix()
		claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
			Issuer:    strconv.Itoa(int(0)),
			Subject:   strconv.Itoa(int(PermUser)),
			ExpiresAt: expires,
		})

		token, err := claims.SignedString([]byte(SignKey))
		if err != nil {
			fmt.Println(err.Error())
			ctx.Error("failed to generate authorization token")
			return
		}

		type ResponseType struct {
			Token Token
		}

		ctx.Json(Token{
			Token:     token,
			ExpiresAt: expires,
		})
	})
}
