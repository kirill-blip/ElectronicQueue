FROM golang:1.23.1 AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o electronicqueue ./cmd/main.go



FROM debian:bookworm-slim

WORKDIR /app

COPY --from=builder /app/electronicqueue .

CMD ["./electronicqueue"]
