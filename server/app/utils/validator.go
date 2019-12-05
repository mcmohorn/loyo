package utils

import (
	"errors"
	"fmt"
	"reflect"
	"strconv"
)

func ValidateRequired(obj interface{}, required []string) (e error) {
	for _, name := range required {
		r := reflect.ValueOf(obj)
		f := reflect.Indirect(r).FieldByName(name)

		if len(f.String()) < 1 {
			e = errors.New(name + " is required")
			break
		}
	}
	return
}

func ValidateLengths(obj interface{}, lengths map[string][]int) (e error) {
	for name, values := range lengths {
		fmt.Print(name)
		r := reflect.ValueOf(obj)
		f := reflect.Indirect(r).FieldByName(name)

		if len(f.String()) < values[0] {
			e = errors.New(name + " violates min length of " + strconv.Itoa(values[0]))
			break
		}
		if len(f.String()) > values[1] {
			e = errors.New(name + " exceeds max length of " + strconv.Itoa(values[1]))
			break
		}
	}
	return
}
