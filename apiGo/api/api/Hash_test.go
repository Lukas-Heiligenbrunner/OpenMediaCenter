package api

import "testing"

func TestHashlength(t *testing.T) {
	h := HashPassword("test")

	if len(*h) != 64 {
		t.Errorf("Invalid hash length: %d", len(*h))
	}
}
