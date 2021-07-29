package oauth

import (
	"gopkg.in/oauth2.v3"
	"openmediacenter/apiGo/database/settings"
)

type CustomClientStore struct {
	oauth2.ClientStore
}

type CustomClientInfo struct {
	oauth2.ClientInfo
	ID     string
	Secret string
	Domain string
	UserID string
}

func NewCustomStore() oauth2.ClientStore {
	s := new(CustomClientStore)
	return s
}

func (a *CustomClientStore) GetByID(id string) (oauth2.ClientInfo, error) {
	password := settings.GetPassword()
	// if password not set assign default password
	if password == nil {
		defaultpassword := "openmediacenter"
		password = &defaultpassword
	}

	clientinfo := CustomClientInfo{
		ID:     "openmediacenter",
		Secret: *password,
		Domain: "http://localhost:8081",
		UserID: "openmediacenter",
	}

	return &clientinfo, nil
}

func (a *CustomClientInfo) GetID() string {
	return a.ID
}

func (a *CustomClientInfo) GetSecret() string {
	return a.Secret
}

func (a *CustomClientInfo) GetDomain() string {
	return a.Domain
}

func (a *CustomClientInfo) GetUserID() string {
	return a.UserID
}
