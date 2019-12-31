package app

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/plaid/plaid-go/plaid"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/mcmohorn/loyo/server/app/data"
	"github.com/mcmohorn/loyo/server/app/handler"
	"github.com/mcmohorn/loyo/server/app/utils"
	"github.com/mcmohorn/loyo/server/config"
	"github.com/mcmohorn/loyo/server/config/db"
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
	// fmt.Println(os.Getenv("PLAID_CLIENT_ID"))
	// fmt.Println(os.Getenv("PLAID_SECRET"))
	// fmt.Println(os.Getenv("PLAID_PUBLIC_KEY"))
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

// setRouters sets the all required routers
func (a *App) setRouters() {
	a.Router.HandleFunc("/", utils.LogHandler(utils.MessageHandler))

	// Routing for handling the projects
	a.Get("/user", a.handleAuthRequest(handler.GetProfile))

	a.Post("/user", a.handleRequest(handler.CreateUser))
	a.Post("/login", a.handleRequest(handler.LoginUser))

	a.Get("/search", a.handleRequest(handler.SearchBusinesses))
	a.Get("/balances", a.handleAuthRequest(handler.GetTransactions))

	a.Get("/business/{id}", a.handleRequest(handler.GetBusiness))
	a.Post("/business", a.handleAuthRequest(handler.CreateBusiness))
	a.Put("/businesss/{id}", a.handleAuthRequest(handler.UpdateBusiness))
	a.Delete("/business/{id}", a.handleAuthRequest(handler.DeleteBusiness))
	a.Get("/businesses", a.handleAuthRequest(handler.GetUserBusinesses))

	a.Post("/redemption", a.handleAuthRequest(handler.CreateRedemption))
	a.Post("/accounts", a.handleAuthRequest(handler.LinkAccount))
	a.Get("/accounts", a.handleAuthRequest(handler.GetAccounts))
	a.Delete("/accounts/{id}", a.handleAuthRequest(handler.DeleteAccount))

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
	fmt.Println("Listening on " + host)
	log.Fatal(http.ListenAndServe(host, utils.RequestLogger(a.Router)))
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
