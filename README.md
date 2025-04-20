# DDD Patterns Implementation

This project implements Domain-Driven Design (DDD) patterns using TypeScript, focusing on a customer management system with order processing capabilities.

## Project Structure

```
src/
├── domain/                    # Core domain logic
│   ├── @shared/              # Shared domain concepts
│   ├── customer/             # Customer domain
│   │   ├── entity/           # Customer entity
│   │   ├── event/            # Customer domain events
│   │   ├── factory/          # Customer factory
│   │   ├── repository/       # Customer repository interface
│   │   └── value-object/     # Customer value objects
│   ├── product/              # Product domain
│   └── checkout/             # Order domain
└── infrastructure/           # Infrastructure layer
    ├── customer/             # Customer infrastructure
    ├── product/              # Product infrastructure
    └── order/                # Order infrastructure
```

## Key Features

### Customer Domain
- Customer entity with validation
- Address value object
- Domain events for customer creation and address changes
- Reward points system
- Customer repository interface and implementation

### Product Domain
- Product entity
- Product factory
- Product repository

### Order Domain
- Order entity
- Order items
- Order service for business logic
- Order repository

## Domain Events

### Customer Created Event
- Triggered when a new customer is created
- Two handlers:
  1. `EnviaConsoleLog1Handler`: "Esse é o primeiro console.log do evento: CustomerCreated"
  2. `EnviaConsoleLog2Handler`: "Esse é o segundo console.log do evento: CustomerCreated"

### Customer Address Changed Event
- Triggered when customer address is updated
- Handler: `EnviaConsoleLogHandler`
- Message: "Endereço do cliente: {id}, {nome} alterado para: {endereco}"

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- SQLite (for tests)

### Installation
```bash
# Install dependencies
npm install

# Run tests
npm test
```

## Testing
The project uses Jest for testing. All domain entities, events, and infrastructure components have corresponding test files.

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Design Patterns Used
- Domain-Driven Design (DDD)
- Repository Pattern
- Factory Pattern
- Event-Driven Architecture
- Value Objects
- Domain Events

## Technologies
- TypeScript
- Jest (Testing)
- Sequelize (ORM)
- SQLite (Testing Database)

## License
This project is licensed under the MIT License. 