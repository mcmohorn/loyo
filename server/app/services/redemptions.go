package services

import (
	"context"

	"github.com/mcmohorn/loyo/server/app/data"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// GetRedemptionsForUserAtBusiness gets transactions for a user at a business
func GetRedemptionsForUserAtBusiness(db *mongo.Database, userID primitive.ObjectID, businessID primitive.ObjectID) (results []data.Redemption, e error) {

	coll := db.Collection("Redemptions")
	rs := make([]data.Redemption, 0)
	cur, err := coll.Find(context.TODO(), bson.D{primitive.E{Key: "businessID", Value: businessID}, primitive.E{Key: "claimer", Value: userID}})
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
	cur.Close(context.TODO())

	return rs, nil
}
