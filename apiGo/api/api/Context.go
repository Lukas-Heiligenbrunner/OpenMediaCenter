package api

import (
	"fmt"
	"net/http"
)

type Context interface {
	Json(t interface{})
	Text(msg string)
	Error(msg string)
	Errorf(msg string, args ...interface{})
	GetRequest() *http.Request
	GetWriter() http.ResponseWriter
	UserID() int
	PermID() Perm
}

type apicontext struct {
	writer          http.ResponseWriter
	request         *http.Request
	responseWritten bool
	userid          int
	permid          Perm
}

func (r *apicontext) GetRequest() *http.Request {
	return r.request
}

func (r *apicontext) UserID() int {
	return r.userid
}

func (r *apicontext) GetWriter() http.ResponseWriter {
	return r.writer
}

func (r *apicontext) Json(t interface{}) {
	r.writer.Write(Jsonify(t))
	r.responseWritten = true
}

func (r *apicontext) Text(msg string) {
	r.writer.Write([]byte(msg))
	r.responseWritten = true
}

func (r *apicontext) Error(msg string) {
	type Error struct {
		Message string
	}

	r.writer.WriteHeader(500)
	r.writer.Write(Jsonify(Error{Message: msg}))
	r.responseWritten = true
}

func (r *apicontext) Errorf(msg string, args ...interface{}) {
	r.Error(fmt.Sprintf(msg, &args))
}

func (r *apicontext) PermID() Perm {
	return r.permid
}
