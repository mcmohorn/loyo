package services

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/mcmohorn/loyo/server/app/data"
	"github.com/plaid/plaid-go/plaid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// GetTransactionsForUserAtBusiness gets transactions for a user at a business
func GetTransactionsForUserAtBusiness(pc *plaid.Client, db *mongo.Database, userID primitive.ObjectID, businessID primitive.ObjectID) (results []plaid.Transaction, e error) {

	// retrieve linked bank accounts for logged in user
	accs, err := GetAccountsForUser(userID, db, false)
	if err != nil {
		return nil, err
	}

	// return empty results if no accounts to examine
	if len(accs) < 1 {
		return
	}

	// TODO: HANDLE MULTIPLE ACCOUNTS
	account := accs[0]

	t := time.Now()

	// TODO 2019-01-01 should be replaced with the effective date chosen by the business
	// TODO hopefully plaid has filters to limit the data returned from this call to a targetted business
	transRes, e := pc.GetTransactions(account.Token, "2019-01-01", t.Format("2006-01-02"))
	if e != nil {
		return
	}

	var business data.Business

	e = db.Collection("Businesses").FindOne(context.TODO(), bson.M{"_id": businessID}).Decode(&business)
	if e != nil {
		e = errors.New("Business not found, failed to get transactions")
		return
	}

	for _, v := range transRes.Transactions {
		if strings.Contains(v.Name, business.Name) {

			results = append(results, v)
		}
	}

	return results, nil
}
