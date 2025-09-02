# Event Reservation App

Este projeto contém um sistema completo de gerenciamento de reservas de salas (desafio técnico).

## Estrutura

* **backend/** → API REST (Node.js + Express + TypeScript + Sequelize + Redis)
  - **Features:**
    + Express + TypeScript
    + Sequelize ORM com migrations e seeds
    + Autenticação com JWT
    + Segurança com Helmet + Rate Limiting (Redis)
    + Logs estruturados com Winston
    + Cache de listagens com Redis
    + Documentação com Swagger (/docs)
    + Testes (unitários + integração)
    + Dockerfile para produção e desenvolvimento
* **frontend/** → Interface web (React + Axios)

## Como rodar

### Backend (Desenvolvimento com Hot Reload)
```bash
cd backend
docker-compose up backend-dev db redis
```
* App: http://localhost:3000
* Swagger: http://localhost:3000/docs

### Migrations e Seeds
Após subir o backend, execute:
```bash
docker-compose exec backend-dev npm run migrate
docker-compose exec backend-dev npm run seed
``` 

### Frontend
```bash
cd frontend
npm install
npm start
```

## Endpoints Principais

* `POST /reservas` → Criar reserva
* `PATCH /reservas/:id` → Reagendar reserva
* `DELETE /reservas/:id` → Cancelar reserva
* `GET /reservas` → Listar reservas (com paginação, ordenação e filtros)
* `POST /reservas/recorrencia` → Criar reservas recorrentes

## Tecnologias Backend
* Node.js + Express + TypeScript
* Sequelize ORM (MySQL)
* Redis (cache + rate limiting)
* JWT (autenticação)
* Helmet (segurança)
* Winston (logs)
* Swagger (documentação)
* Docker Compose (MySQL + Redis + API)

## Segurança

* Headers seguros com Helmet
* Rate limiting distribuído via Redis
* Autenticação com JWT
* Tratamento centralizado de erros

## Observabilidade
* Logs estruturados em JSON (Winston)
* Logs salvos em arquivos (logs/combined.log, logs/error.log)
* Cache de queries Redis com invalidação automática