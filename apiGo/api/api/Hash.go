package api

import (
	"encoding/hex"
	"golang.org/x/crypto/argon2"
)

func HashPassword(pwd string) *string {
	// todo generate random salt
	hash := argon2.IDKey([]byte(pwd), []byte(SignKey), 3, 64*1024, 2, 32)
	hexx := hex.EncodeToString(hash)
	return &hexx
}
