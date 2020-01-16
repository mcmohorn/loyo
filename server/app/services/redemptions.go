package services

import (
	"context"
	"fmt"

	"github.com/chebyrash/promise"
	"github.com/mcmohorn/loyo/server/app/data"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// GetRedemptionsForUserAtBusiness gets transactions for a user at a business
func GetRedemptionsForUserAtBusiness(db *mongo.Database, userID primitive.ObjectID, businessID primitive.ObjectID) (redemptions []data.Redemption, e error) {

	// retrieve linked bank accounts for logged in user
	accs, e := GetAccountsForUser(userID, db, false)
	if e != nil {
		return
	}

	if len(accs) > 0 {
		var promises []*promise.Promise

		// return each account's list of transactions as a promise
		for _, a := range accs {
			var p = promise.New(func(resolve func(interface{}), reject func(error)) {
				ts, e := GetRedemptionsForAccountAtBusiness(db, a, businessID)
				if e != nil {
					reject(e)
				}
				resolve(ts)
			})
			promises = append(promises, p)

		}
		accountRedemptions, e := promise.All(promises...).Await()
		if e != nil {
			return nil, e
		}
		// for each group of redemptions (for each account's returned list)
		for _, r := range accountRedemptions.([]interface{}) {
			// add each redemption in this group to total list of redemptions
			for _, v := range r.([]data.Redemption) {
				fmt.Println("claimer**" + v.Claimer.Hex())
				redemptions = append(redemptions, v)

			}
		}
	}

	return
}

// GetRedemptionsForAccountAtBusiness gets the redemptions for a particular account at a particular business
func GetRedemptionsForAccountAtBusiness(db *mongo.Database, account *data.Account, businessID primitive.ObjectID) (results []data.Redemption, err error) {
	coll := db.Collection("Redemptions")
	rs := make([]data.Redemption, 0)
	cur, err := coll.Find(context.TODO(), bson.D{primitive.E{Key: "businessID", Value: businessID}, primitive.E{Key: "accountAddress", Value: account.Address}})
	for cur.Next(context.TODO()) {
		var elem data.Redemption
		err := cur.Decode(&elem)
		if err != nil {
			return nil, err
		}

		rs = append(rs, elem)
	}
	if err != nil {
		return nil, err
	}
	results = rs
	cur.Close(context.TODO())
	return
}

// GetRedemptionsForAccount gets the redemptions for a particular accounts
func GetRedemptionsForAccount(db *mongo.Database, account *data.Account) (results []data.Redemption, err error) {
	coll := db.Collection("Redemptions")
	rs := make([]data.Redemption, 0)
	cur, err := coll.Find(context.TODO(), bson.D{primitive.E{Key: "accountAddress", Value: account.Address}})
	for cur.Next(context.TODO()) {
		var elem data.Redemption
		err := cur.Decode(&elem)
		if err != nil {
			return nil, err
		}

		rs = append(rs, elem)
	}
	if err != nil {
		return nil, err
	}
	results = rs
	cur.Close(context.TODO())
	return
}
