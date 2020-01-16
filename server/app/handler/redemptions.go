package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/mcmohorn/loyo/server/app/data"
	"github.com/mcmohorn/loyo/server/app/services"
	"github.com/mcmohorn/loyo/server/app/utils"
	"github.com/plaid/plaid-go/plaid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// CreateRedemption is the service to insert a new redemption record
func CreateRedemption(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest) {
	redemption := data.Redemption{}
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&redemption); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
	}
	defer r.Body.Close()

	required := []string{"BusinessID", "RewardID", "AccountID"}

	if err := utils.ValidateRequired(redemption, required); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	// find the business, find corresponding reward, throw 400s if bad
	var business data.Business
	var account *data.Account

	// TODO leave this part here, if user specifies an account id then use that one
	// for now we are just using the first one (see next part)
	// e := db.Collection("Accounts").FindOne(context.TODO(), bson.M{"_id": redemption.AccountID}).Decode(&account)
	// if e != nil {
	// 	RespondError(w, http.StatusNotFound, "Account not found")
	// 	return
	// }

	// retrieve linked bank accounts for logged in user
	accs, err := services.GetAccountsForUser(r.User.ID, db, false)
	if err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
	}

	if len(accs) > 0 {
		account = accs[0]
	} else {
		RespondError(w, http.StatusNotFound, "User has no accounts to redeem from")
		return
	}

	e := db.Collection("Businesses").FindOne(context.TODO(), bson.M{"_id": redemption.BusinessID}).Decode(&business)
	if e != nil {
		RespondError(w, http.StatusNotFound, "Business not found")
		return
	}

	var reward data.Reward
	for _, r := range business.Rewards {
		if r.ID == redemption.RewardID {
			reward = r
		}
	}

	// TODO validate expiration dates

	if reward.ID == "" {
		RespondError(w, http.StatusBadRequest, "Reward has been changed or deleted, please refresh and try again.")
		return
	}

	// reward and business are valid

	// grab transactions for user at this business and calculate sum
	transactions, e := services.GetTransactionsForUserAtBusiness(pc, db, r.User.ID, business.ID)

	if e != nil {
		RespondError(w, http.StatusNotFound, "Failed to retrieve transactions for user")
		return
	}

	transactionsTotal := 0.0
	for _, t := range transactions {
		transactionsTotal = transactionsTotal + t.Amount
	}

	// grab redemtions for this user at this business and calculate sum
	redemptions, e := services.GetRedemptionsForUserAtBusiness(db, r.User.ID, business.ID)
	if e != nil {
		RespondError(w, http.StatusNotFound, "Failed to retrieve redemptions for user")
		return
	}

	redemptionTotal := 0.0
	for _, r := range redemptions {
		redemptionTotal = redemptionTotal + r.Reward.Cost
	}

	// throw bad request if user does not have funds
	if transactionsTotal-redemptionTotal < reward.Cost {
		RespondError(w, http.StatusBadRequest, "You do not have enough points to redeem this reward")
		return
	}

	// user has available funds so create redemption resource

	// TODO add redemption.date
	redemption.Claimer = r.User.ID
	redemption.Reward = reward
	redemption.BusinessID = business.ID
	redemption.AccountAddress = account.Address

	// TODO: depending on account balances, perhaps you need to deduct from a second account
	// insert a second redemption linking to another account then

	redemptionResult, err := db.Collection("Redemptions").InsertOne(context.TODO(), redemption)

	if err != nil {
		RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, redemptionResult)

	return
}
