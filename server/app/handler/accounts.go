package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/mcmohorn/loyo/server/app/data"
	"github.com/mcmohorn/loyo/server/app/services"
	"github.com/mcmohorn/loyo/server/app/utils"
	"github.com/plaid/plaid-go/plaid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// LinkAccount is the handler to link a new bank account to a user's profile
func LinkAccount(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest) {
	accounts := db.Collection("Accounts")
	tokenBody := data.TokenBody{}
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&tokenBody); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
	}
	defer r.Body.Close()

	required := []string{"Token", "AccountId"}

	if err := utils.ValidateRequired(tokenBody, required); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	accessTokenResponse, e := pc.ExchangePublicToken(tokenBody.Token)
	if e != nil {
		RespondError(w, http.StatusBadRequest, e.Error())
		return
	}
	authResponse, e := pc.GetAuth(accessTokenResponse.AccessToken)
	if e != nil {
		RespondError(w, http.StatusBadRequest, e.Error())
		return
	}
	var addr string
	var name string
	var mask string
	for _, v := range authResponse.Numbers.ACH {
		if v.AccountID == tokenBody.AccountID {
			addr = v.Account + ":" + v.Routing
			break
		}
	}
	for _, v := range authResponse.Accounts {
		if v.AccountID == tokenBody.AccountID {
			name = v.Name
			mask = v.Mask
			break
		}
	}

	if len(addr) < 3 {
		RespondError(w, http.StatusBadRequest, "Invalid account id selected")
		return
	}
	var acc data.Account
	err := accounts.FindOne(context.TODO(), bson.D{primitive.E{Key: "address", Value: addr}}).Decode(&acc)

	if err != nil {
		if err.Error() == "mongo: no documents in result" {

			u, err := accounts.InsertOne(context.TODO(), &data.Account{
				Address: addr,
				User:    r.User.ID,
				Token:   accessTokenResponse.AccessToken,
				Name:    name,
				Mask:    mask,
			})

			if err != nil {
				RespondError(w, http.StatusInternalServerError, err.Error())
				return
			}

			objectID, _ := u.InsertedID.(primitive.ObjectID)

			fmt.Println(fmt.Sprintf("%v", u.InsertedID))

			respondJSON(w, http.StatusCreated, &data.Account{
				ID:   objectID,
				Name: name,
				Mask: mask,
			})
			return
		}
		// respond with other error about failed lookup
	}
	RespondError(w, http.StatusBadRequest, "card already linked")

	return

}

// GetAccounts is the handler for getting a list of the user's accounts
func GetAccounts(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest) {
	accs, err := services.GetAccountsForUser(r.User.ID, db, true)
	if err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
	}

	respondJSON(w, http.StatusOK, accs)

	return

}

// DeleteAccount is the handler for deleting an account
func DeleteAccount(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest) {
	accounts := db.Collection("Accounts")

	vars := mux.Vars(r.Request)

	id := vars["id"]
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	var acc data.Account

	selector := bson.D{primitive.E{Key: "_id", Value: objectID}, primitive.E{Key: "user", Value: r.User.ID}}
	// verify the business id is valid, and user from token is the owner
	accounts.FindOne(context.TODO(), selector).Decode(&acc)
	if acc.ID == primitive.NilObjectID {
		RespondError(w, http.StatusBadRequest, "Account not found")
		return
	}

	// Passing bson.D{{}} as the filter matches all documents in the collection
	accounts.FindOneAndDelete(context.TODO(), selector).Decode(&acc)

	if acc.ID == primitive.NilObjectID {
		RespondError(w, http.StatusInternalServerError, "Something went wrong with deleting the document")
		return
	}

	_, err = pc.RemoveItem(acc.Token)
	if err != nil {
		RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	acc.Clean()

	respondJSON(w, http.StatusOK, acc)

	return

}
