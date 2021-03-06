package api

import (
	"testing"
)

func cleanUp() {
	handlers = make(map[string]Handler)
}

func TestAddHandler(t *testing.T) {
	cleanUp()

	AddHandler("test", ActorNode, func(info *HandlerInfo) []byte {
		return nil
	})
	if len(handlers) != 1 {
		t.Errorf("Handler insertion failed, got: %d handlers, want: %d.", len(handlers), 1)
	}
}

func TestCallOfHandler(t *testing.T) {
	cleanUp()

	i := 0
	AddHandler("test", ActorNode, func(info *HandlerInfo) []byte {
		i++
		return nil
	})

	// simulate the call of the api
	handleAPICall("test", "", ActorNode, nil)

	if i != 1 {
		t.Errorf("Unexpected number of Lambda calls : %d/1", i)
	}
}

func TestDecodingOfArguments(t *testing.T) {
	cleanUp()

	AddHandler("test", ActorNode, func(info *HandlerInfo) []byte {
		var args struct {
			Test    string
			TestInt int
		}
		err := FillStruct(&args, info.Data)
		if err != nil {
			t.Errorf("Error parsing args: %s", err.Error())
			return nil
		}

		if args.TestInt != 42 || args.Test != "myString" {
			t.Errorf("Wrong parsing of argument parameters : %d/42 - %s/myString", args.TestInt, args.Test)
		}

		return nil
	})

	// simulate the call of the api
	handleAPICall("test", `{"Test":"myString","TestInt":42}`, ActorNode, nil)
}

func TestNoHandlerCovers(t *testing.T) {
	cleanUp()

	ret := handleAPICall("test", "", ActorNode, nil)

	if ret != nil {
		t.Error("Expect nil return within unhandled api action")
	}
}
