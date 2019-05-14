package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func AllMoviesEndPoint(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "not implemented yet !")
}

func FindMovieEndpoint(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "not implemented yet !")
}

func CreateMovieEndPoint(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "not implemented yet !")
}

func UpdateMovieEndPoint(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "not implemented yet !")
}

func DeleteMovieEndPoint(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "not implemented yet !")
}

func main() {
	r := mux.NewRouter()
	log.Println("Attempt")
	r.HandleFunc("/profile", AllMoviesEndPoint).Methods("GET")     // returns full current user with amount spent at businesses
	r.HandleFunc("/register", CreateMovieEndPoint).Methods("POST") // creates a new user
	r.HandleFunc("/login", CreateMovieEndPoint).Methods("POST")    // creates a new user
	log.Println("Starting on port 5050")
	if err := http.ListenAndServe(":5050", r); err != nil {

		log.Fatal(err)
	}


}
