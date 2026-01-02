# Backend Architecture Overview (API · Services · Contracts · Infrastructure · Shared)

This document describes a **generic, endpoint-agnostic backend architecture** for a Nuxt 4 full-stack application.  
The goal is a **clear separation of concerns**, predictable dependencies, and a structure that is clean, maintainable, and not over-engineered.

The architecture follows a **layered model** with a **stable core (use cases)** and **replaceable outer layers (HTTP, infrastructure)**.

---

## High-Level Layers

From a conceptual point of view, the backend consists of the following areas:

1. **API (Transport / HTTP)**
2. **Services (Use Cases / Application Logic)**
3. **Contracts (Interfaces / Stable Boundaries)**
4. **Infrastructure (Technical Implementations)**
5. **Shared (Cross-Boundary DTOs)**
6. **Framework / Runtime Integration (Nuxt)**

Each area has a **single responsibility** and **clear dependency rules**.

---

## 1) `api/` — Transport / HTTP Layer

**Purpose:**  
Handle incoming HTTP requests and outgoing HTTP responses.

**Responsibilities:**
- Parse request data (body, params, query)
- Validate input using schemas
- Call the appropriate service (use case)
- Map domain/application errors to HTTP status codes
- Return response DTOs

**Typical contents:**
- HTTP endpoints (e.g. REST handlers)
- API-specific schemas for request validation

**What must NOT be here:**
- Business logic
- Database queries
- Hashing, mailing, or other technical details

**Dependencies:**
- May depend on:
  - `services/`
  - `api/schemas/`
  - `shared/` (DTOs)
- Must NOT depend on:
  - `infrastructure/`
  - ORM clients or technical libraries

---

## 2) `services/` — Use Cases / Application Logic (Core)

**Purpose:**  
Implement the actual **business use cases** of the application.

This is the **center of the architecture**.

**Responsibilities:**
- Orchestrate workflows (e.g. create user, authenticate, create analysis)
- Enforce business rules
- Decide *what* needs to happen, not *how* it is technically done
- Coordinate repositories and technical helpers via contracts

**Typical contents:**
- Use-case services (one per business action)
- Application-level error types

**What must NOT be here:**
- HTTP concepts (requests, responses, status codes)
- ORM / database logic
- Framework-specific code (Nuxt, Prisma, etc.)

**Dependencies:**
- May depend on:
  - `contracts/`
  - `shared/` (DTOs, if appropriate)
- Must NOT depend on:
  - `api/`
  - Concrete implementations in `infrastructure/`

---

## 3) `contracts/` — Interfaces / Stable Contracts

**Purpose:**  
Define **what the services need**, without defining **how it is implemented**.

This layer provides **stable boundaries** between business logic and technical details.

**Responsibilities:**
- Define repository interfaces
- Define technical capability interfaces (hashing, mail, etc.)
- Optionally define stable data types related to these contracts

**Typical contents:**
- Repository interfaces (e.g. persistence contracts)
- Security or mail interfaces
- Input/output types related to these contracts

**What must NOT be here:**
- Concrete implementations
- Framework imports
- Validation logic
- ORM types

**Dependencies:**
- Should not depend on other layers
- Used by:
  - `services/`
  - `infrastructure/` (for implementation)

---

## 4) `infrastructure/` — Technical Implementations

**Purpose:**  
Provide concrete, replaceable implementations of technical concerns.

**Responsibilities:**
- Database setup and access (ORM, queries)
- Implement repository contracts
- Implement security primitives (hashing)
- Integrate external systems (mail, APIs, logging)

**Typical contents:**
- DB client setup
- Repository implementations
- Hashing implementations
- Mail provider integrations

**What must NOT be here:**
- Business rules
- Use-case orchestration
- HTTP request handling

**Dependencies:**
- May depend on:
  - `contracts/`
  - External libraries (ORM, crypto, mail)
- Must NOT depend on:
  - `services/`
  - `api/`

---

## 5) `shared/` — Shared DTOs (Client ↔ Server Boundary)

**Purpose:**  
Provide **shared data transfer objects (DTOs)** used by **both frontend and backend**.

This folder represents the **explicit contract between client and server**.

**Responsibilities:**
- Define request and response DTOs
- Define shared types exchanged over the API
- Remain framework-agnostic and serializable

**Typical contents:**
- Request DTOs
- Response DTOs
- Shared enums or value types

**What must NOT be here:**
- Business logic
- Validation logic
- ORM or infrastructure types

**Validation:**
- DTOs are validated by schemas located in `api/schemas/`
- DTOs themselves remain **pure data structures**

**Dependencies:**
- May be imported by:
  - `api/`
  - `services/`
  - frontend code
- Must NOT depend on:
  - backend infrastructure
  - frameworks

---

## 6) `api/schemas/` — Request Validation Schemas

**Purpose:**  
Validate incoming API data before it enters the application logic.

**Responsibilities:**
- Define validation schemas (e.g. Zod)
- Validate incoming request DTOs
- Ensure only valid data reaches services

**Important distinction:**
- Schemas validate DTOs
- DTOs do not contain validation logic themselves

**Dependencies:**
- May depend on:
  - `shared/` DTOs
- Must NOT depend on:
  - `services/`
  - `infrastructure/`

---

## 7) Framework / Runtime Directories

Examples:
- `middleware/`
- `plugins/`
- `routes/`

**Purpose:**
- Nuxt runtime integration
- Cross-cutting concerns (auth middleware, bootstrapping, etc.)

These are **outside the core architecture** and may depend on API/services as needed.

---



