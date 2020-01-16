package handler

import (
	"net/http"

	"github.com/chebyrash/promise"
	"github.com/mcmohorn/loyo/server/app/data"
	"github.com/mcmohorn/loyo/server/app/services"
	"github.com/mcmohorn/loyo/server/app/utils"
	"github.com/plaid/plaid-go/plaid"
	"go.mongodb.org/mongo-driver/mongo"
)

// GetTransactions is the service to retrieve  a list of transactions
func GetTransactions(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest) {

	// retrieve linked bank accounts for logged in user
	accs, err := services.GetAccountsForUser(r.User.ID, db, false)
	if err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
	}

	// Get list of businesses so we can filter which plaid transaction are important
	allBusinesses, er := services.GetAllBusinesses(db)
	if er != nil {
		RespondError(w, http.StatusInternalServerError, "Failed to retrieve businesses to list transactinos")
		return
	}

	balances := make(map[string]*data.Balance, 0)

	if len(accs) < 1 {
		respondJSON(w, http.StatusOK, balances)
		return
	}

	var promises []*promise.Promise

	// return each account's list of transactions as a promise
	for _, a := range accs {
		var p = promise.New(func(resolve func(interface{}), reject func(error)) {
			ts, e := services.GetTransactionsForAccount(a, pc)
			if e != nil {
				reject(e)
			}
			resolve(ts)
		})
		promises = append(promises, p)

	}

	// wait for all transactions
	results, _ := promise.All(promises...).Await()

	// for each group of transactions (for each account's returned list)
	for _, r := range results.([]interface{}) {
		// for each transaction in this group
		for _, v := range r.([]plaid.Transaction) {
			// fmt.Println("bname**" + v.Name)

			// check if business is a loyo business
			b := utils.GetBusinessFromName(allBusinesses, v.Name)

			if b != nil {
				// its a loyo business so either add it to the map or update existing balance
				id := b.ID.Hex()
				if balances[id] != nil {
					// update existing balance
					balances[id] = &data.Balance{
						Business: balances[id].Business,
						Amount:   balances[id].Amount + v.Amount,
						Updated:  utils.Now(),
					}
				} else {
					// add new balance
					balances[id] = &data.Balance{
						Business: b,
						Amount:   v.Amount,
						Updated:  utils.Now(),
					}
				}
			}

		}
	}

	// deduct from balances the amount redeemed so far
	var promises2 []*promise.Promise

	// return each account's list of redemptions as a promise
	for _, a := range accs {
		var p = promise.New(func(resolve func(interface{}), reject func(error)) {
			rs, e := services.GetRedemptionsForAccount(db, a)
			if e != nil {
				reject(e)
			}
			resolve(rs)
		})
		promises2 = append(promises2, p)
	}

	// wait for all transactions
	results2, _ := promise.All(promises2...).Await()

	// for each group of redemptions (for each account's returned list)
	for _, r := range results2.([]interface{}) {
		// for each redemption in this group
		for _, v := range r.([]data.Redemption) {

			// find the matching balance in by businessID
			if balances[v.BusinessID.Hex()] != nil {
				// deduct amount of this redemption
				balances[v.BusinessID.Hex()].Amount = balances[v.BusinessID.Hex()].Amount - v.Reward.Cost
			}

		}
	}

	respondJSON(w, http.StatusOK, balances)

	return

}
