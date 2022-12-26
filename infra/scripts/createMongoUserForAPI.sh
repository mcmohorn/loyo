
# run this once to create loyo db
use loyo

# create a user for loyo api (and choose a password, save it for later)
db.createUser({
  user: "loyo-api",
  pwd: passwordPrompt(),
	roles: [ { role: "clusterAdmin", db: "admin" },{ role: "readAnyDatabase", db: "admin" },"readWrite"]
})

