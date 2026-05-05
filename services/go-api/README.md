# ShopCraft Optional Go API

Optional high-performance backend service for future API workloads. This does not replace the current Node.js backend and is not connected to the frontend by default.

## Run

```bash
cd services/go-api
go run main.go
```

Server runs on port `8081`.

## Endpoints

- `GET /health`
- `GET /api/templates`
- `GET /api/projects`
