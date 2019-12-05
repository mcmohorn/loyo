package services

import (
	"context"

	"github.com/mcmohorn/loyo/server/app/data"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// GetAccountsForUser retrieves a list of accounts for the given user, given a user objectid, mongo db, and clean indicates if data should be cleaned
func GetAccountsForUser(userID primitive.ObjectID, db *mongo.Database, clean bool) ([]*data.Account, error) {
	coll := db.Collection("Accounts")
	accounts := make([]*data.Account, 0)
	cur, err := coll.Find(context.TODO(), bson.D{primitive.E{Key: "user", Value: userID}})
	if err != nil {
		return nil, err
	}
	for cur.Next(context.TODO()) {
		var elem data.Account
		err := cur.Decode(&elem)
		if err != nil {
			return nil, err
		}
		if clean {
			elem.Clean()
		}

		accounts = append(accounts, &elem)
	}

	if err := cur.Err(); err != nil {
		return nil, err
	}

	cur.Close(context.TODO())
	return accounts, nil
}

// GetBusinessesForUser retrieves a list of businesses for the given user, given a user objectid, mongo db
func GetBusinessesForUser(userID primitive.ObjectID, db *mongo.Database) ([]*data.Business, error) {
	coll := db.Collection("Businesses")
	bs := make([]*data.Business, 0)
	cur, err := coll.Find(context.TODO(), bson.D{primitive.E{Key: "owner", Value: userID}})
	if err != nil {
		return nil, err
	}
	for cur.Next(context.TODO()) {
		var elem data.Business
		err := cur.Decode(&elem)
		if err != nil {
			return nil, err
		}

		bs = append(bs, &elem)
	}

	if err := cur.Err(); err != nil {
		return nil, err
	}

	cur.Close(context.TODO())
	return bs, nil
}

// GetBusinesses retrieves a list of businesses for the given user, given a user objectid, mongo db
func GetBusinesses(db *mongo.Database) ([]*data.Business, error) {
	coll := db.Collection("Businesses")
	bs := make([]*data.Business, 0)
	cur, err := coll.Find(context.TODO(), bson.D{})
	if err != nil {
		return nil, err
	}
	for cur.Next(context.TODO()) {
		var elem data.Business
		err := cur.Decode(&elem)
		if err != nil {
			return nil, err
		}

		bs = append(bs, &elem)
	}

	if err := cur.Err(); err != nil {
		return nil, err
	}

	cur.Close(context.TODO())
	return bs, nil
}
