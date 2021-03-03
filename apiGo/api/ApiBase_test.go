package api

import (
	"testing"
)

func cleanUp() {
	handlers = nil
}

func TestAddHandler(t *testing.T) {
	cleanUp()

	AddHandler("test", ActorNode, nil, func() []byte {
		return nil
	})
	if len(handlers) != 1 {
		t.Errorf("Handler insertion failed, got: %d handlers, want: %d.", len(handlers), 1)
	}
}

func TestCallOfHandler(t *testing.T) {
	cleanUp()

	i := 0
	AddHandler("test", ActorNode, nil, func() []byte {
		i++
		return nil
	})

	// simulate the call of the api
	handleAPICall("test", "", ActorNode)

	if i != 1 {
		t.Errorf("Unexpected number of Lambda calls : %d/1", i)
	}
}

func TestDecodingOfArguments(t *testing.T) {
	cleanUp()

	var myvar struct {
		Test    string
		TestInt int
	}
	AddHandler("test", ActorNode, &myvar, func() []byte {
		return nil
	})

	// simulate the call of the api
	handleAPICall("test", `{"Test":"myString","TestInt":42}`, ActorNode)

	if myvar.TestInt != 42 || myvar.Test != "myString" {
		t.Errorf("Wrong parsing of argument parameters : %d/42 - %s/myString", myvar.TestInt, myvar.Test)
	}
}

func TestNoHandlerCovers(t *testing.T) {
	cleanUp()

	ret := handleAPICall("test", "", ActorNode)

	if ret != nil {
		t.Error("Expect nil return within unhandled api action")
	}
}
