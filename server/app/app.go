package app

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/mcmohorn/loyo/server/app/data"
	"github.com/mcmohorn/loyo/server/app/handler"
	"github.com/mcmohorn/loyo/server/app/utils"
	"github.com/mcmohorn/loyo/server/config"
	"github.com/mcmohorn/loyo/server/config/db"
	"github.com/plaid/plaid-go/plaid"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// App has router and db instances
type App struct {
	Router *mux.Router
	DB     *mongo.Database
	PC     *plaid.Client
}

// Initialize initializes the app with predefined configuration
func (a *App) Initialize(config *config.Config) {

	// get mongo client connected
	db, err := db.GetDB(config.DB)
	if err != nil {
		log.Fatal("Could not connect database")
	}

	// get plaid client connected
	opts := plaid.ClientOptions{
		os.Getenv("PLAID_CLIENT_ID"),
		os.Getenv("PLAID_SECRET"),
		os.Getenv("PLAID_PUBLIC_KEY"),
		plaid.Development, // Available environments are Sandbox, Development, and Production
		&http.Client{},    // This parameter is optional
	}
	client, err := plaid.NewClient(opts)
	if err != nil {
		log.Fatal(err)
	}

	a.PC = client
	a.DB = db
	a.Router = mux.NewRouter()
	a.setRouters()

}

func HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
	// A very simple health check.
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// In the future we could report back on the status of our DB, or our cache
	// (e.g. Redis) by performing a simple PING, and include them in the response.
	io.WriteString(w, `{"alive": true}`)
}

// setRouters sets the all required routers
func (a *App) setRouters() {

	// health check
	a.Router.HandleFunc("/health", HealthCheckHandler)

	// api routes
	api := a.Router.PathPrefix("/api/v1/").Subrouter()
	api.HandleFunc("/user", a.handleAuthRequest(handler.GetProfile)).Methods("GET")
	api.HandleFunc("/user", a.handleRequest(handler.CreateUser)).Methods("POST")
	api.HandleFunc("/login", a.handleRequest(handler.LoginUser)).Methods("POST")
	api.HandleFunc("/search", a.handleRequest(handler.SearchBusinesses)).Methods("GET")
	api.HandleFunc("/balances", a.handleAuthRequest(handler.GetTransactions)).Methods("GET")
	api.HandleFunc("/business/{id}", a.handleRequest(handler.GetBusiness)).Methods("GET")
	api.HandleFunc("/business", a.handleAuthRequest(handler.CreateBusiness)).Methods("POST")
	api.HandleFunc("/business/{id}", a.handleAuthRequest(handler.UpdateBusiness)).Methods("PUT")
	api.HandleFunc("/business/{id}", a.handleAuthRequest(handler.DeleteBusiness)).Methods("DELETE")
	api.HandleFunc("/businesses", a.handleAuthRequest(handler.GetUserBusinesses)).Methods("GET")
	api.HandleFunc("/redemption", a.handleAuthRequest(handler.CreateRedemption)).Methods("POST")
	api.HandleFunc("/accounts", a.handleAuthRequest(handler.LinkAccount)).Methods("POST")
	api.HandleFunc("/accounts", a.handleAuthRequest(handler.GetAccounts)).Methods("GET")
	api.HandleFunc("/accounts/{id}", a.handleAuthRequest(handler.DeleteAccount)).Methods("DELETE")

	// Serve static assets directly.
	a.Router.PathPrefix("/dist/").Handler(http.StripPrefix("/dist/", http.FileServer(http.Dir("./dist/"))))

	// Catch-all: Serve our JavaScript application's entry-point (index.html).
	a.Router.PathPrefix("/").HandlerFunc(IndexHandler("./dist/index.html"))

}

// IndexHandler serves the front end (via index.html)
func IndexHandler(entrypoint string) func(w http.ResponseWriter, r *http.Request) {
	fn := func(w http.ResponseWriter, r *http.Request) {

		http.ServeFile(w, r, entrypoint)
	}

	return http.HandlerFunc(fn)
}

// Get wraps the router for GET method
func (a *App) Get(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("GET")
}

// Post wraps the router for POST method
func (a *App) Post(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("POST")
}

// Put wraps the router for PUT method
func (a *App) Put(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("PUT")
}

// Delete wraps the router for DELETE method
func (a *App) Delete(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("DELETE")
}

// Run the app on it's router
func (a *App) Run(host string) {
	fmt.Println("Loyo is listening  at " + host + " \u2318 ... ! Hey this just deployed")

	loggedRouter := handlers.LoggingHandler(os.Stdout, utils.RequestLogger(a.Router))
	// TODO: toggle based on development environment
	log.Fatal(http.ListenAndServe(host, loggedRouter))
	// log.Fatal(http.ListenAndServeTLS(host, "cert.pem", "key.pem", utils.RequestLogger(a.Router)))
}

// RequestHandlerFunction handles non -authorized routes
type RequestHandlerFunction func(db *mongo.Database, w http.ResponseWriter, r *http.Request)

// MyRequestHandlerFunction handles authorized routes
type MyRequestHandlerFunction func(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest)

func (a *App) handleRequest(fn RequestHandlerFunction) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fn(a.DB, w, r)
	}
}

func (a *App) handleAuthRequest(fn MyRequestHandlerFunction) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		u := data.User{}
		m := &data.MyRequest{Request: r, User: u}
		tokenString := r.Header.Get("Authorization")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// verify correct algorithm used to sign token
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method")
			}
			return []byte("dsAugwASDYHGao96598A1kgPjhg"), nil
		})
		if err != nil {
			handler.RespondError(w, http.StatusUnauthorized, "Unauthorized")
			return
		}
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			id, _ := primitive.ObjectIDFromHex(claims["id"].(string))
			m.User = data.User{
				Email: claims["email"].(string),
				ID:    id,
			}
			fn(a.PC, a.DB, w, m)
		} else {
			handler.RespondError(w, http.StatusUnauthorized, "Invalid token")
		}
		return

	}
}
