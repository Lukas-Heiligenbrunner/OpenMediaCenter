package config

import "testing"

func TestSaveLoadConfig(t *testing.T) {
	generateNewConfig("", "openmediacenter.cfg")

	Init()
}
