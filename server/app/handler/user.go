package handler

import (
	"context"
	"encoding/json"
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/mcmohorn/loyo/server/app/data"
	"github.com/mcmohorn/loyo/server/app/utils"
	"github.com/plaid/plaid-go/plaid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var emailLength = []int{7, 345}
var passwordLength = []int{8, 20}
var nameLength = []int{1, 50}

// CreateUser is the service to create a new user
func CreateUser(db *mongo.Database, w http.ResponseWriter, r *http.Request) {
	user := data.User{}
	result := data.User{}
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&user); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
	}
	defer r.Body.Close()

	required := []string{"Email", "Password", "Name"}
	lengths := make(map[string][]int, 3)
	lengths["Email"] = emailLength
	lengths["Password"] = passwordLength
	lengths["Name"] = nameLength
	if err := utils.ValidateRequired(user, required); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := utils.ValidateLengths(user, lengths); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	collection := db.Collection("Users")
	frame := bson.D{primitive.E{Key: "email", Value: user.Email}}
	err := db.Collection("Users").FindOne(context.TODO(), frame ).Decode(&result)
	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 5)

			if err != nil {
				RespondError(w, http.StatusInternalServerError, err.Error())
				return
			}
			user.Password = string(hash)

			u, err := collection.InsertOne(context.TODO(), user)
			if err != nil {
				RespondError(w, http.StatusInternalServerError, err.Error())
				return
			}
			respondJSON(w, http.StatusCreated, u)
			return
		}
	}
	RespondError(w, http.StatusBadRequest, "User Exists + " + err.Error())
	return

}

// LoginUser is the service to refresh a user login
func LoginUser(db *mongo.Database, w http.ResponseWriter, r *http.Request) {

	user := data.User{}
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&user); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
	}
	defer r.Body.Close()

	required := []string{"Email", "Password"}
	lengths := make(map[string][]int, 2)
	lengths["Email"] = emailLength
	lengths["Password"] = passwordLength
	if err := utils.ValidateRequired(user, required); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := utils.ValidateLengths(user, lengths); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	collection := db.Collection("Users")

	var result data.User

	err := collection.FindOne(context.TODO(), bson.D{primitive.E{Key: "email", Value: user.Email}}).Decode(&result)

	if err != nil {
		RespondError(w, http.StatusBadRequest, "User not found")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(user.Password))

	if err != nil {
		RespondError(w, http.StatusBadRequest, "Invalid password")
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": result.Email,
		"id":    result.ID,
	})

	tokenString, err := token.SignedString([]byte("dsAugwASDYHGao96598A1kgPjhg"))

	if err != nil {
		RespondError(w, http.StatusInternalServerError, "Error generating login token.  Please try again.")
		return
	}

	result.Token = tokenString
	result.Password = ""

	respondJSON(w, http.StatusOK, result)

}

// GetProfile retrieves user profile for logged-in user
func GetProfile(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest) {

	respondJSON(w, http.StatusOK, r.User)

	return
}

// GetBalances updates a user's balances with registered businesses
func GetBalances(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest) {

	return
}
