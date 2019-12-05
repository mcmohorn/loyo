package handler

import (
	"context"
	"fmt"
	"net/http"

	"github.com/mcmohorn/loyo/server/app/data"
	"github.com/mcmohorn/loyo/server/app/services"
	"github.com/mcmohorn/loyo/server/app/utils"
	"github.com/plaid/plaid-go/plaid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// GetTransactions is the service to retrieve  a list of transactions
func GetTransactions(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest) {

	// businesses, err := services.GetBusinesses(db)

	accs, err := services.GetAccountsForUser(r.User.ID, db, false)
	if err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
	}

	// claims, err := services.GetClaimsForUser(r.User.ID, db)
	// if err != nil {
	// 	RespondError(w, http.StatusBadRequest, err.Error())
	// }

	account := accs[0]

	// return json to user
	transRes, e := pc.GetTransactions(account.Token, "2019-01-01", "2019-08-15")
	if e != nil {
		RespondError(w, http.StatusNotFound, e.Error())
		return
	}
	// HERE COUNT NUMBER FOR EACH ONE
	busList := []string{"McDonald's", "VISA #2278 STAR MINI MART", "Food Lion"}
	// bus list should have the date they joined
	balances := make(map[string]*data.Balance, 0)

	for _, v := range transRes.Transactions {
		fmt.Println("name" + v.Name)
		if utils.Contains(busList, v.Name) {
			if balances[v.Name] != nil {
				// update existing balance
				balances[v.Name] = &data.Balance{
					Amount:  balances[v.Name].Amount + v.Amount,
					Updated: utils.Now(),
				}
			} else {
				// add new balance
				balances[v.Name] = &data.Balance{
					Amount:  v.Amount,
					Updated: utils.Now(),
				}
			}
		}

	}

	// var result data.User
	filter := bson.D{primitive.E{Key: "email", Value: r.User.Email}}
	innerUpdate := bson.D{primitive.E{Key: "balances", Value: balances}}
	update := bson.D{primitive.E{Key: "$set", Value: innerUpdate}}
	//]filter := bson.D{{"email", r.User.Email}}
	// update := bson.D{{"$set",
	// 	bson.D{
	// 		{"balances", balances},
	// 	},
	// }}
	users := db.Collection("Users")
	_, err = users.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		RespondError(w, http.StatusInternalServerError, e.Error())
		return
	}

	respondJSON(w, http.StatusOK, balances)

	return

}
