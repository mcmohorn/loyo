FROM golang
MAINTAINER Matt Mohorn <mcmohorn@gmail.com>
RUN go version
COPY . "/go/src/github.com/mcmohorn/loyo/server"
WORKDIR "/go/src/github.com/mcmohorn/loyo/server"
RUN set -x && \
    go get github.com/golang/dep/cmd/dep && \
    dep ensure -v
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build  -o ./loyo
CMD ["./loyo"]
EXPOSE 9080