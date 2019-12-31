package data

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// MyRequest is an http request also with user info
type MyRequest struct {
	*http.Request
	User
}

type Balance struct {
	Amount  float64 `json:"amount"`
	Updated int64   `json:"updated"`
}

type TokenBody struct {
	Token     string `json:"token"`
	AccountID string `json:"accountId"`
}

// User is the struct for the user data type
type User struct {
	ID           primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	Accounts     []primitive.ObjectID `json:"accounts"`
	FullAccounts []Account            `json:"fullAccounts"`
	Balances     map[string]Balance   `json:"balances"`
	Email        string               `json:"email,required"`
	Password     string               `json:"password"`
	Name         string               `json:"name,omitempty"`
	Phone        uint64               `json:"phone"`
	Transactions []Transaction        `json:"transactions,omitempty"`
	Token        string               `json:"token,omitempty"`
}

// Account is the struct for an account data type
type Account struct {
	Address string             `json:"address"`
	ID      primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Token   string             `json:"token"`
	Name    string             `json:"name"`
	Mask    string             `json:"mask"`
	User    primitive.ObjectID `json:"user"`
}

// Clean will remove sensitive contents of an account object
func (a *Account) Clean() {
	a.Token = ""
	a.Address = ""
}

// Business is the struct for the business data type
type Business struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name         string             `json:"name,required"`
	Addresses    []Address          `json:"addresses,omitempty"`
	Description  string             `json:"description,omitempty"`
	Owner        primitive.ObjectID `bson:"owner" json:"owner,required"`
	Admins       []User             `json:"admins,omitempty"`
	Transactions []Transaction      `json:"transactions,omitempty"`
	Rewards      []Reward           `json:"rewards,omitempty"`
	Archived     bool               `json:"archived"`
}

// Business is the struct for the business data type
type Redemption struct {
	BusinessID primitive.ObjectID `json:"businessId" bson:"businessId,required"`
	RewardID   string             `json:"rewardId" bson:"rewardId,required"`
	Reward     Reward             `json:"reward,omitempty"`
	Business   Business           `json:"business,omitempty"`
	Claimer    primitive.ObjectID `json:"claimer" bson:"claimer,omitempty"`
}

// Archive archives a business
func (b *Business) Archive() {
	b.Archived = true
}

// Transaction is the struct for the transaction data type
type Transaction struct {
	Seller Business `json:"seller,required"`
	Buyer  User     `json:"buyer,required"`
	Amount float64  `json:"amount,required"`
}

// Reward is the struct for the reward data type
type Reward struct {
	ID          string  `json:"id" bson:"id,omitempty"`
	Cost        float64 `json:"cost,required"`
	Description string  `json:"description,omitempty"`
	Name        string  `json:"name,required"`
	Effective   string  `json:"effective,omitempty"`
	Expiration  string  `json:"expiration,omitempty"`
}

// Network is a group of businesses
type Network struct {
	Creator     string   `json:"creator"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Businesses  []string `json:"businesses"`
}

// Promotions?

// Address is the struct for the address data type
type Address struct {
	Street1 string `json:"street1,required"`
	Street2 string `json:"street2"`
	City    string `json:"city,omitempty"`
	State   string `json:"state,omitempty"`
	Country string `json:"country,omitempty"`
	Zip     string `json:"zip"`
}

type ResponseResult struct {
	Error  string `json:"error"`
	Result string `json:"result"`
}

type Block struct {
	Index     int
	Timestamp string
	BPM       int
	Hash      string
	PrevHash  string
}

type Message struct {
	BPM int
}
