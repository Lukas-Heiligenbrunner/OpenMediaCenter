package videoparser

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"nhooyr.io/websocket"
	"sync"
	"time"
)

// subscriber represents a subscriber.
// Messages are sent on the msgs channel and if the client
// cannot keep up with the messages, closeSlow is called.
type subscriber struct {
	msgs      chan []byte
	closeSlow func()
}

type ChatSender struct {
	subscribersMu sync.Mutex
	subscribers   map[*subscriber]struct{}
}

func newChatSender() *ChatSender {
	return &ChatSender{
		subscribers: make(map[*subscriber]struct{}),
	}
}

func (t *ChatSender) TestCall() {
	fmt.Println("hello world")
}

func (t *ChatSender) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	c, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		OriginPatterns: []string{"*"},
	})
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer c.Close(websocket.StatusInternalError, "")

	err = t.subscribe(r.Context(), c)
	if errors.Is(err, context.Canceled) {
		return
	}
	if websocket.CloseStatus(err) == websocket.StatusNormalClosure ||
		websocket.CloseStatus(err) == websocket.StatusGoingAway {
		return
	}
	if err != nil {
		fmt.Println(err.Error())
		return
	}
}

func (t *ChatSender) subscribe(ctx context.Context, c *websocket.Conn) error {
	ctx = c.CloseRead(ctx)

	s := &subscriber{
		msgs: make(chan []byte, 16),
		closeSlow: func() {
			c.Close(websocket.StatusPolicyViolation, "connection too slow to keep up with messages")
		},
	}
	t.addSubscriber(s)
	defer t.deleteSubscriber(s)

	for {
		select {
		case msg := <-s.msgs:
			err := writeTimeout(ctx, time.Second*5, c, msg)
			if err != nil {
				return err
			}
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

type MessageBase struct {
	Action string
}

type TextMessage struct {
	MessageBase

	Message string
}

type ReindexEvent struct {
	MessageBase

	Event string
}

func (t *ChatSender) Publish(msg []byte) {
	t.subscribersMu.Lock()
	defer t.subscribersMu.Unlock()

	for s := range t.subscribers {
		select {
		case s.msgs <- msg:
		default:
			go s.closeSlow()
		}
	}
}

var IndexSender = newChatSender()

func SetupSettingsWebsocket() {
	http.Handle("/subscribe", IndexSender)
}

// addSubscriber registers a subscriber.
func (t *ChatSender) addSubscriber(s *subscriber) {
	t.subscribersMu.Lock()
	t.subscribers[s] = struct{}{}
	t.subscribersMu.Unlock()
}

// deleteSubscriber deletes the given subscriber.
func (t *ChatSender) deleteSubscriber(s *subscriber) {
	t.subscribersMu.Lock()
	delete(t.subscribers, s)
	t.subscribersMu.Unlock()
}

func writeTimeout(ctx context.Context, timeout time.Duration, c *websocket.Conn, msg []byte) error {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	return c.Write(ctx, websocket.MessageText, msg)
}
