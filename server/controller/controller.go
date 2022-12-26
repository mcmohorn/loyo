package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/mcmohorn/loyo/server/config/db"
	"github.com/mcmohorn/loyo/server/data"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/mongodb/mongo-go-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	var user data.User
	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &user)
	var res data.ResponseResult
	if err != nil {
		res.Error = err.Error()
		json.NewEncoder(w).Encode(res)
		return
	}

	collection, err := db.GetDBCollection()

	if err != nil {
		res.Error = err.Error()
		json.NewEncoder(w).Encode(res)
		return
	}
	var result data.User
	err = collection.FindOne(context.TODO(), bson.D{{"email", user.Email}}).Decode(&result)

	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 5)

			if err != nil {
				res.Error = "Error While Hashing Password, Try Again"
				json.NewEncoder(w).Encode(res)
				return
			}
			user.Password = string(hash)

			_, err = collection.InsertOne(context.TODO(), user)
			if err != nil {
				res.Error = "Error While Creating User, Try Again"
				json.NewEncoder(w).Encode(res)
				return
			}
			res.Result = "Registration Successful"
			json.NewEncoder(w).Encode(res)
			return
		}

		res.Error = err.Error()
		json.NewEncoder(w).Encode(res)
		return
	}

	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte("Error Registering User:" + err.Error()))
	return
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	var user data.User
	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &user)
	if err != nil {
		log.Fatal(err)
	}

	collection, err := db.GetDBCollection()

	if err != nil {
		log.Fatal(err)
	}
	var result data.User
	var res data.ResponseResult

	err = collection.FindOne(context.TODO(), bson.D{{"email", user.Email}}).Decode(&result)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Invalid username"))
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(user.Password))

	if err != nil {
		w.Header().Set("content-type","text")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Invalid password"))
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": result.Email,
		//"firstname": result.FirstName,
		//"lastname":  result.LastName,
	})

	tokenString, err := token.SignedString([]byte("dsAugwASDYHGao96598A1kgPjhg"))

	if err != nil {
		res.Error = "Error while generating token,Try again"
		json.NewEncoder(w).Encode(res)
		return
	}

	result.Token = tokenString
	result.Password = ""

	json.NewEncoder(w).Encode(result)

}

func ProfileHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	tokenString := r.Header.Get("Authorization")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method")
		}
		return []byte("secret"), nil
	})
	var result data.User
	var res data.ResponseResult
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		result.Email = claims["email"].(string)
		//result.FirstName = claims["firstname"].(string)
		//result.LastName = claims["lastname"].(string)

		json.NewEncoder(w).Encode(result)
		return
	} else {
		res.Error = err.Error()
		json.NewEncoder(w).Encode(res)
		return
	}

}
