package videoparser

import "testing"

func TestDifference(t *testing.T) {
	arr1 := []string{"test1", "test2", "test3"}
	arr2 := []string{"test1", "test3"}

	res := difference(arr1, arr2)
	if len(res) != 1 || res[0] != "test2" {
		t.Errorf("wrong difference result.")
	}
}
