package api

import "testing"

func TestJsonify(t *testing.T) {
	var obj = struct {
		ID  uint32
		Str string
		Boo bool
	}{
		ID:  42,
		Str: "teststr",
		Boo: true,
	}

	res := Jsonify(obj)
	exp := `{"ID":42,"Str":"teststr","Boo":true}`

	if string(res) != exp {
		t.Errorf("Invalid json response: %s !== %s", string(res), exp)
	}
}
