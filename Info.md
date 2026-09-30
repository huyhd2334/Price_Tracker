# Price Tracker — Solution Architecture Learning Project

Project này là một ứng dụng **Price Tracker + Price Alert** được xây dựng với mục tiêu kép:

1. Xây một sản phẩm thực tế có thể phát triển thành app mobile và đưa lên Google Play.
2. Dùng chính project này để học **Solution Architecture / System Design** theo từng giai đoạn.

> Nguyên tắc quan trọng: **không bắt đầu bằng microservices/Kafka/Kubernetes chỉ để cho "xịn".**
> Mỗi công nghệ sẽ được thêm vào khi chúng ta gặp một vấn đề thực tế và cần nó để giải quyết vấn đề đó.

---

## 1. Product

Người dùng có thể:

- Đăng ký / đăng nhập.
- Thêm URL của sản phẩm cần theo dõi.
- Xem giá hiện tại.
- Xem lịch sử thay đổi giá.
- Đặt mức giá mong muốn.
- Nhận push notification khi giá đạt mức mong muốn.

Ví dụ:

```text
User
  ↓
Thêm URL sản phẩm
  ↓
Price Tracker lưu sản phẩm
  ↓
Crawler lấy giá định kỳ
  ↓
Lưu price history
  ↓
So sánh target price
  ↓
Gửi notification
```

---

# 2. Mục tiêu học Solution Architecture

Project này sẽ được phát triển từ kiến trúc đơn giản đến kiến trúc có khả năng scale.

### Giai đoạn 1 — MVP

```text
Mobile/Web
    ↓
Express API
    ↓
PostgreSQL
```

Học:

- HTTP
- REST API
- Authentication
- JWT
- PostgreSQL
- Data modeling
- Index
- Transaction
- API design
- Error handling

---

### Giai đoạn 2 — Caching

```text
Client
  ↓
API
  ↓
Redis
  ↓
PostgreSQL
```

Học:

- Cache
- Cache hit / miss
- TTL
- Cache invalidation
- Redis
- Khi nào cache giúp hệ thống?
- Khi nào cache gây vấn đề?

---

### Giai đoạn 3 — Background Job

```text
Client
  ↓
API
  ↓
Queue
  ↓
Worker
  ↓
PostgreSQL
```

Học:

- Queue
- Worker
- Async processing
- Retry
- Dead Letter Queue
- Idempotency
- Backpressure

---

### Giai đoạn 4 — Price Crawler

```text
Scheduler
    ↓
Queue
    ↓
Crawler Workers
    ↓
Database
```

Học:

- Scheduling
- Distributed workers
- Rate limiting
- Retry
- Timeout
- Failure isolation
- Idempotency

---

### Giai đoạn 5 — Event-driven Architecture

```text
                ┌── Notification Worker
                │
API → Event Bus ┼── Price Alert Worker
                │
                └── Analytics Worker
```

Có thể nghiên cứu:

- Kafka
- Event
- Producer
- Consumer
- Consumer Group
- Partition
- Offset
- At-least-once delivery
- Eventual consistency

Không dùng Kafka từ đầu. Chỉ thêm khi project có lý do cần event-driven architecture.

---

### Giai đoạn 6 — Search

Có thể thêm:

```text
PostgreSQL
     │
     └── OpenSearch
```

Học:

- Full-text search
- Indexing
- Search engine vs relational database
- Denormalization
- Synchronization

---

### Giai đoạn 7 — API Gateway + Load Balancer

Khi backend phát triển thành nhiều service:

```text
                    ┌── Auth Service
                    │
Client
  ↓                 ├── Product Service
API Gateway ────────┤
                    ├── Price Service
                    │
                    └── Notification Service
```

Sau đó:

```text
Client
  ↓
API Gateway
  ↓
Load Balancer
  ↓
┌───────────────┐
│ API instance 1│
│ API instance 2│
│ API instance 3│
└───────────────┘
```

Cần phân biệt:

### API Gateway

Quyết định:

> Request này đi đến service nào?

Có thể xử lý:

- Routing
- Authentication
- Authorization
- Rate limiting
- Request ID
- Logging
- TLS termination

### Load Balancer

Quyết định:

> Request này đi đến instance nào của service?

Ví dụ:

```text
Product Service
├── instance 1
├── instance 2
└── instance 3
```

Load Balancer phân phối traffic giữa các instance.

---

# 3. Kiến trúc hiện tại

Hiện tại **chưa dùng microservices**.

Đây là một:

> Modular Monolith

Cấu trúc:

```text
backend/
├── src/
│   ├── config/
│   │   └── env.js
│   │
│   ├── controllers/
│   │   └── health.controller.js
│   │
│   ├── db/
│   │   ├── index.js
│   │   └── schema.sql
│   │
│   ├── middleware/
│   │   └── error.middleware.js
│   │
│   ├── routes/
│   │   └── health.routes.js
│   │
│   ├── services/
│   │   └── health.service.js
│   │
│   └── app.js
│
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

# 4. Technology Stack

## Backend

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt
- dotenv
- cors

## Infrastructure sẽ học dần

- Docker
- Redis
- Queue
- Kafka
- OpenSearch
- Nginx / Load Balancer
- API Gateway
- Kubernetes
- AWS

## Mobile

Chưa chốt implementation cuối cùng.

Có thể sử dụng:

- Flutter
- React Native

Mobile sẽ được triển khai sau khi backend MVP ổn định.

---

# 5. Database

Database hiện tại:

```text
PostgreSQL
```

Các bảng chính:

```text
users
products
price_history
price_alerts
```

Quan hệ cơ bản:

```text
users
  │
  │ 1:N
  ↓
price_alerts
  ↑
  │ N:1
products
  │
  │ 1:N
  ↓
price_history
```

---

# 6. Data Modeling — quyết định quan trọng

Không thiết kế:

```text
User A
 └── iPhone 17

User B
 └── iPhone 17

User C
 └── iPhone 17
```

thành 3 product record khác nhau.

Thay vào đó:

```text
             ┌── User A
             │
Product ─────┼── User B
             │
             └── User C
```

Một product có thể được nhiều user theo dõi.

Điều này tránh duplicate product data và giúp crawler chỉ cần lấy giá của một product một lần.

---

# 7. PostgreSQL với Docker

PostgreSQL chạy trong Docker.

Start:

```bash
docker compose up -d
```

Kiểm tra:

```bash
docker ps
```

Stop:

```bash
docker compose down
```

Nếu muốn xóa luôn database volume:

```bash
docker compose down -v
```

> Cẩn thận: `-v` sẽ xóa dữ liệu PostgreSQL trong Docker volume.

---

# 8. Backend setup

Install:

```bash
npm install
```

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Backend mặc định:

```text
http://localhost:3000
```

Health endpoint:

```text
GET /api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "price-tracker-api",
  "database": "ok"
}
```

Endpoint này kiểm tra cả:

```text
Express
   +
PostgreSQL connection
```

---

# 9. Environment variables

Tạo file:

```text
.env
```

Ví dụ:

```env
NODE_ENV=development

PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=price_tracker
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=change-this-in-development
```

Không commit `.env` lên Git.

`.gitignore` phải chứa:

```text
.env
node_modules/
```

---

# 10. Development workflow

Mỗi feature nên đi theo flow:

```text
Requirement
    ↓
Problem
    ↓
Naive solution
    ↓
Bottleneck
    ↓
Architecture change
    ↓
Implementation
    ↓
Load test / measurement
    ↓
Trade-off
    ↓
Decision
```

Ví dụ:

> "Tại sao cần Redis?"

Không học Redis bằng cách đọc lý thuyết trước.

Làm:

```text
1000 requests
     ↓
PostgreSQL
```

Đo latency.

Sau đó thêm:

```text
1000 requests
     ↓
Redis
     ↓
PostgreSQL
```

Đo lại.

Sau đó phân tích:

- latency
- throughput
- database load
- memory
- cache hit ratio
- consistency

Từ đó mới hiểu **tại sao architecture thay đổi**.

---

# 11. Architecture Decision Records

Mỗi quyết định kiến trúc quan trọng nên được ghi lại.

Ví dụ:

```text
docs/
└── adr/
    ├── 001-use-postgresql.md
    ├── 002-use-redis.md
    ├── 003-use-queue.md
    └── ...
```

Format:

```markdown
# ADR-001: Use PostgreSQL

## Context

...

## Decision

...

## Alternatives

...

## Trade-offs

...

## Consequences

...
```

Mục tiêu là sau này có thể giải thích trong interview:

> "Tại thời điểm đó tôi chọn PostgreSQL vì..."

thay vì:

> "Em dùng PostgreSQL vì tutorial dùng PostgreSQL."

---

# 12. Roadmap

## Phase 1 — Foundation

- [x] Node.js
- [x] Express
- [x] ESM
- [x] PostgreSQL
- [x] Docker
- [x] Database connection
- [x] Health check
- [ ] User registration
- [ ] Login
- [ ] JWT authentication
- [ ] Product CRUD
- [ ] Track product
- [ ] Price history API

## Phase 2 — Redis

- [ ] Redis
- [ ] Cache current price
- [ ] TTL
- [ ] Cache invalidation
- [ ] Load testing
- [ ] Measure before/after

## Phase 3 — Queue

- [ ] Queue
- [ ] Worker
- [ ] Retry
- [ ] DLQ
- [ ] Idempotency

## Phase 4 — Crawler

- [ ] Product crawler
- [ ] Scheduler
- [ ] Multiple workers
- [ ] Rate limiting
- [ ] Timeout
- [ ] Retry strategy

## Phase 5 — Notification

- [ ] FCM
- [ ] Notification worker
- [ ] Price alert processing
- [ ] Deduplication

## Phase 6 — Event-driven

- [ ] Event model
- [ ] Kafka
- [ ] Producer
- [ ] Consumer
- [ ] Consumer groups
- [ ] Partition
- [ ] Offset
- [ ] At-least-once delivery

## Phase 7 — Search

- [ ] OpenSearch
- [ ] Product search
- [ ] Index
- [ ] Synchronization

## Phase 8 — Distributed system

- [ ] API Gateway
- [ ] Load Balancer
- [ ] Multiple API instances
- [ ] Stateless API
- [ ] Horizontal scaling

## Phase 9 — Containers

- [ ] Dockerize backend
- [ ] Docker Compose
- [ ] Multi-container environment
- [ ] CI/CD

## Phase 10 — Kubernetes

- [ ] Pod
- [ ] Deployment
- [ ] Service
- [ ] ConfigMap
- [ ] Secret
- [ ] HPA
- [ ] Rolling update

## Phase 11 — AWS

- [ ] VPC
- [ ] Subnet
- [ ] Security Group
- [ ] Load Balancer
- [ ] EC2 / ECS
- [ ] RDS
- [ ] ElastiCache
- [ ] S3
- [ ] CloudWatch

## Phase 12 — Production readiness

- [ ] Logging
- [ ] Metrics
- [ ] Tracing
- [ ] Alerting
- [ ] Rate limiting
- [ ] Security
- [ ] Backup
- [ ] Disaster recovery
- [ ] Load testing
- [ ] Capacity planning
- [ ] Cost analysis

---

# 13. Important learning rule

Không được thêm technology chỉ vì:

> "System design thường dùng nó."

Mỗi technology phải trả lời được:

1. Problem là gì?
2. Tại sao architecture hiện tại không đủ?
3. Technology mới giải quyết vấn đề gì?
4. Nó hoạt động như thế nào?
5. Trade-off là gì?
6. Có alternative nào?
7. Khi scale lớn hơn thì vấn đề mới nào xuất hiện?

---

# 14. Current architecture

Hiện tại:

```text
                 ┌─────────────────┐
                 │     Client      │
                 │ Mobile / Web    │
                 └────────┬────────┘
                          │
                          │ HTTP
                          ↓
                 ┌─────────────────┐
                 │ Express API     │
                 │ Modular Monolith│
                 └────────┬────────┘
                          │
                          │ pg
                          ↓
                 ┌─────────────────┐
                 │   PostgreSQL    │
                 │     Docker      │
                 └─────────────────┘
```

Đây là architecture cố tình đơn giản.

Sau này nó sẽ tiến hóa thành:

```text
                         Client
                           │
                           ↓
                     API Gateway
                           │
                    Load Balancer
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
     Auth Service    Product Service   Price Service
          │                │                │
          └────────────────┼────────────────┘
                           ↓
                         Redis
                           │
                           ↓
                         Queue
                           │
                ┌──────────┼──────────┐
                ↓          ↓          ↓
             Crawler   Alert Worker  Notification
                │
                ↓
            PostgreSQL
                │
                ↓
            OpenSearch
```

**Không xây architecture cuối cùng ngay.**

Chúng ta sẽ tự tạo bottleneck, đo nó, rồi tiến hóa architecture.

Đó chính là phần quan trọng nhất của project này.

---

# 15. Cách sử dụng AI để học project

Khi hỏi AI, không nên chỉ yêu cầu:

> "Code cái này cho tôi."

Nên hỏi:

> "Hãy giải thích problem trước, đưa ra naive solution, chỉ ra bottleneck, sau đó mới implement."

Ví dụ:

```text
Tôi đang học Solution Architecture bằng project Price Tracker.

Hãy giúp tôi implement Redis caching.

Đừng đưa code ngay.

Trước tiên hãy:
1. Giải thích problem hiện tại.
2. Cho tôi thấy nếu không có cache thì request đi như thế nào.
3. Giải thích bottleneck.
4. Đưa ra architecture trước và sau khi thêm Redis.
5. Phân tích trade-off.
6. Sau đó mới viết code.
7. Cuối cùng hướng dẫn tôi load test để chứng minh Redis có tác dụng.
```

Mục tiêu là **hiểu tại sao architecture thay đổi**, không phải chỉ copy code.

---

# 16. Current next step

Việc tiếp theo:

```text
User Registration
       ↓
PostgreSQL
       ↓
Password Hashing
       ↓
JWT Login
       ↓
Authentication Middleware
```

Sau khi phần này hoàn thành mới chuyển sang Product API.

