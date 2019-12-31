package services

import (
	"context"

	"github.com/mcmohorn/loyo/server/app/data"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// GetAllBusinesses gets all businesses registered with loyo
func GetAllBusinesses(db *mongo.Database) (results []*data.Business, e error) {
	coll := db.Collection("Businesses")
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
		results = append(results, &elem)
	}

	if err := cur.Err(); err != nil {
		return nil, err
	}

	cur.Close(context.TODO())

	return results, nil
}
