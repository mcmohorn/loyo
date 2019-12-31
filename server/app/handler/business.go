package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/mcmohorn/loyo/server/app/data"
	"github.com/mcmohorn/loyo/server/app/services"
	"github.com/mcmohorn/loyo/server/app/utils"
	"github.com/plaid/plaid-go/plaid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	guuid "github.com/google/uuid"
)

// GetBusiness is the service to retrieve  a specific business
func SearchBusinesses(db *mongo.Database, w http.ResponseWriter, r *http.Request) {

	collection := db.Collection("Businesses")
	results := []data.Business{}
	q := r.FormValue("q")
	// tODO filter on max length
	query := bson.M{
		"$text": bson.M{
			"$search": q,
		},
	}

	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	cur, err := collection.Find(ctx, query)
	if err != nil {
		log.Fatal(err)
	}
	defer cur.Close(ctx)
	for cur.Next(ctx) {
		var result data.Business
		err := cur.Decode(&result)
		if err != nil {
			log.Fatal(err)
		}
		results = append(results, result)
	}
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	if err != nil {
		RespondError(w, http.StatusNotFound, "Failed to search businesses")
		return
	}
	respondJSON(w, http.StatusOK, results)

	return

}

// GetBusiness is the service to retrieve  a specific business
func GetBusiness(db *mongo.Database, w http.ResponseWriter, r *http.Request) {

	collection := db.Collection("Businesses")
	vars := mux.Vars(r)

	id := vars["id"]
	var b data.Business
	objectID, _ := primitive.ObjectIDFromHex(id)

	e := collection.FindOne(context.TODO(), bson.D{primitive.E{Key: "_id", Value: objectID}}).Decode(&b)
	if e != nil {
		RespondError(w, http.StatusNotFound, "Business not found")
		return
	}
	respondJSON(w, http.StatusOK, b)

	return

}



// CreateBusiness is the service to create a new business
func CreateBusiness(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest) {
	business := data.Business{}
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&business); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
	}
	defer r.Body.Close()

	required := []string{"Name"}

	if err := utils.ValidateRequired(business, required); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	collection := db.Collection("Businesses")

	business.Owner = r.User.ID

	initRewardIds(business)

	b, err := collection.InsertOne(context.TODO(), business)
	if err != nil {
		RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	objectID, _ := b.InsertedID.(primitive.ObjectID)

	business.ID = objectID
	respondJSON(w, http.StatusCreated, business)

	return
}

// UpdateBusiness is the service to update a business
func UpdateBusiness(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest) {
	vars := mux.Vars(r.Request)
	id := vars["id"]
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		RespondError(w, http.StatusBadRequest, "Bad business id")
		return
	}
	collection := db.Collection("Businesses")
	selector := bson.D{primitive.E{Key: "_id", Value: objectID}, primitive.E{Key: "owner", Value: r.User.ID}}
	// verify the business id is valid, and user from token is the owner
	b := collection.FindOne(context.TODO(), selector)
	if b == nil {
		RespondError(w, http.StatusNotFound, "Business not found")
		return
	}
	// parse the business
	business := data.Business{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&business); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
	}
	defer r.Body.Close()

	b = collection.FindOneAndUpdate(context.TODO(), selector, business)
	respondJSON(w, http.StatusOK, b)

	return
}

// DeleteBusiness is the service to remove a business
func DeleteBusiness(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest) {
	vars := mux.Vars(r.Request)
	id := vars["id"]

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		RespondError(w, http.StatusBadRequest, "Bad business id")
		return
	}
	collection := db.Collection("Businesses")
	var b data.Business
	selector := bson.D{primitive.E{Key: "_id", Value: objectID}, primitive.E{Key: "owner", Value: r.User.ID}}
	// verify the business id is valid, and user from token is the owner

	// TODO if no document found also return bad request
	e := collection.FindOne(context.TODO(), selector).Decode(&b)
	if e != nil {
		RespondError(w, http.StatusNotFound, "Business not found")
		return
	}

	collection.FindOneAndDelete(context.TODO(), selector)
	respondJSON(w, http.StatusOK, b)

	return
}

// GetUserBusinesses is the handler for getting a list of businesses the owner has registered
func GetUserBusinesses(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest) {
	bs, err := services.GetBusinessesForUser(r.User.ID, db)
	if err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
	}

	respondJSON(w, http.StatusOK, bs)

	return

}

func initRewardIds(b data.Business) {
	for i := range b.Rewards {
		b.Rewards[i].ID = guuid.New().String()
	}
}

// //  is the handler for getting a list of businesses the owner has registered
// func GetBusinesses(pc *plaid.Client, db *mongo.Database, w http.ResponseWriter, r *data.MyRequest) {
// 	bs, err := services.GetBusinessesForUser(r.User.ID, db)
// 	if err != nil {
// 		RespondError(w, http.StatusBadRequest, err.Error())
// 	}

// 	respondJSON(w, http.StatusOK, bs)

// 	return

// }
