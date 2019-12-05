package main

import (
	"github.com/mcmohorn/loyo/server/app"
	"github.com/mcmohorn/loyo/server/config"
)

func main() {
	config := config.GetConfig()

	app := &app.App{}
	app.Initialize(config)
	app.Run(":9080")
}
