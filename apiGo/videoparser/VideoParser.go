package videoparser

var messageBuffer []string
var contentAvailable = false

type StatusMessage struct {
	Messages         []string
	ContentAvailable bool
}

func StartReindex() bool {
	messageBuffer = []string{}
	contentAvailable = true

	// todo start reindexing
	return true
}

func GetStatusMessage() StatusMessage {
	msg := StatusMessage{
		Messages:         messageBuffer,
		ContentAvailable: contentAvailable,
	}

	// reset message buffer
	messageBuffer = []string{}

	return msg
}

func StartCleanup() {
	// todo start cleanup
}
