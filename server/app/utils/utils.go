package utils

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"net/http/httputil"
	"time"

	"github.com/mcmohorn/loyo/server/app/data"
)

func Now() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}

// GetBusinessFromName returns true if the list of strings contains the given string
func GetBusinessFromName(arr []*data.Business, item string) *data.Business {
	for _, l := range arr {
		if item == l.Name {
			return l
		}
	}
	return nil
}

// BusinessListContainsName returns true if the list of strings contains the given string
func BusinessListContainsName(arr []*data.Business, item string) bool {
	for _, l := range arr {
		if item == l.Name {
			return true
		}
	}
	return false
}

// Contains returns true if the list of strings contains the given string
func Contains(arr []string, item string) bool {
	for _, l := range arr {
		if item == l {
			return true
		}
	}
	return false
}

func RequestLogger(targetMux http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		targetMux.ServeHTTP(w, r)

		requesterIP := r.RemoteAddr

		log.Printf(
			"%s\t\t%s\t\t%s\t\t%v",
			r.Method,
			r.RequestURI,
			requesterIP,
			time.Since(start),
		)
	})
}

func LogHandler(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		x, err := httputil.DumpRequest(r, true)
		if err != nil {
			http.Error(w, fmt.Sprint(err), http.StatusInternalServerError)
			return
		}
		log.Println(fmt.Sprintf("%q", x))
		rec := httptest.NewRecorder()
		fn(rec, r)
		log.Println(fmt.Sprintf("%q", rec.Body))
	}
}

func MessageHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "A message was received")
}
