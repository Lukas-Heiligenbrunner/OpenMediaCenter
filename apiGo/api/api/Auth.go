package api

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"gopkg.in/oauth2.v3"
	"gopkg.in/oauth2.v3/server"
	"net/http"
	"openmediacenter/apiGo/database"
	"strconv"
	"time"
)

var srv *server.Server

const (
	PermAdmin        uint8 = iota
	PermUser         uint8 = iota
	PermUnauthorized uint8 = iota
)

const SignKey = "89013f1753a6890c6090b09e3c23ff43"
const TokenExpireHours = 24

type Token struct {
	Token     string
	ExpiresAt int64
}

func TokenValid(token string) (int, uint8) {
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
	return id, uint8(permid)
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

func ValidateToken(f func(rw http.ResponseWriter, req *http.Request, node int, tokenInfo *oauth2.TokenInfo), node int) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokeninfo, err := srv.ValidationBearerToken(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		f(w, r, node, &tokeninfo)
	}
}
