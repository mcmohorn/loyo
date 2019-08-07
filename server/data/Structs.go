package data

// User is the struct for the user data type
type User struct {
	Email        string        `json:"email,required"`
	Password string `json:"password"`
	Name         string        `json:"name,omitempty"`
	Phone        uint64        `json:"phone"`
	Transactions []Transaction `json:"transactions,omitempty"`
	Token string `json:"token,omitempty"`
}

// Business is the struct for the business data type
type Business struct {
	ID           string        `json:"_id,required"`
	Name         string        `json:"name,required"`
	Addresses    []Address     `json:"addresses,omitempty"`
	Description  string        `json:"description,omitempty"`
	Admins       []User        `json:"admins,omitempty"`
	Transactions []Transaction `json:"transactions,omitempty"`
}

// Transaction is the struct for the transaction data type
type Transaction struct {
	Seller Business `json:"seller,required"`
	Buyer  User     `json:"buyer,required"`
	Amount float64  `json:"amount,required"`
}

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