package videoparser

import (
	"encoding/json"
)

func AppendMessage(message string) {
	msger := TextMessage{
		MessageBase: MessageBase{Action: "message"},
		Message:     message,
	}
	marshal, err := json.Marshal(msger)
	if err != nil {
		return
	}

	IndexSender.Publish(marshal)
}

func SendEvent(message string) {
	msger := ReindexEvent{
		MessageBase: MessageBase{Action: "reindexAction"},
		Event:       message,
	}
	marshal, err := json.Marshal(msger)
	if err != nil {
		return
	}

	IndexSender.Publish(marshal)
}
