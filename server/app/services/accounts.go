package services

import (
	"github.com/plaid/plaid-go/plaid"

	"github.com/mcmohorn/loyo/server/app/data"
)

// GetTransactionsForAccount gets plaid transactions for a given account
func GetTransactionsForAccount(acc *data.Account, pc *plaid.Client) (transactions []plaid.Transaction, e error) {
	response, e := pc.GetTransactions(acc.Token, "2019-01-01", "2019-12-28")
	if e != nil {
		return nil, e
	}
	transactions = response.Transactions
	return
}
