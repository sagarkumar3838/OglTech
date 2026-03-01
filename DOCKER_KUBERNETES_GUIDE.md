# Docker & Kubernetes Deployment Guide

## Quick Decision Matrix

| Factor | Docker Compose | Kubernetes |
|--------|---------------|------------|
| **Users** | < 10,000 | > 10,000 |
| **Servers** | 1-2 | 3+ |
| **Cost** | $20-50/month | $200+/month |
| **Complexity** | Low | High |
| **Setup Time** | 1 hour | 1-2 days |
| **Auto-scaling** | No | Yes |
| **Load Balancing** | Basic | Advanced |

**Recommendation**: Start with Docker, migrate to Kubernetes when you hit 10,000+ users.

---

## Docker Setup (Recommended for Start)

### 1. Project Structure

```
your-app/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── Dockerfile             # Multi-stage build
├── docker-compose.yml     # Services orchestration
├── .dockerignore          # Files to exclude
└── nginx.conf             # Reverse proxy config
```

### 2. Dockerfile (Multi-stage Build)

```dockerfile
# Stage 1: Build Client
FROM node:18-alpine AS client-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Stage 2: Build Server
FROM node:18-alpine AS server-builder

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./
RUN npm run build

# Stage 3: Production Image
FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copy server
COPY --from=server-builder --chown=nodejs:nodejs /app/server/dist ./server
COPY --from=server-builder --chown=nodejs:nodejs /app/server/node_modules ./server/node_modules
COPY --from=server-builder --chown=nodejs:nodejs /app/server/package.json ./server/

# Copy client build
COPY --from=client-builder --chown=nodejs:nodejs /app/client/dist ./client/dist

# Switch to non-root user
USER nodejs

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/index.js"]
```

### 3. docker-compose.yml

```yaml
version: '3.8'

services:
  # Main Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: skilleval-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - DEEPGRAM_API_KEY=${DEEPGRAM_API_KEY}
      - RAPIDAPI_KEY=${RAPIDAPI_KEY}
    restart: unless-stopped
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: skilleval-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

  # Redis Cache (Optional)
  redis:
    image: redis:7-alpine
    container_name: skilleval-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped
    networks:
      - app-network
    command: redis-server --appendonly yes

networks:
  app-network:
    driver: bridge

volumes:
  redis-data:
```

### 4. nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general_limit:10m rate=100r/s;

    server {
        listen 80;
        server_name your-domain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Gzip Compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

        # API Routes (with rate limiting)
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Static Files
        location / {
            limit_req zone=general_limit burst=50 nodelay;
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Health Check
        location /health {
            access_log off;
            proxy_pass http://app;
        }
    }
}
```

### 5. .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
dist
build
*.md
.vscode
.idea
coverage
.DS_Store
```

### 6. Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Restart specific service
docker-compose restart app

# View running containers
docker-compose ps

# Execute command in container
docker-compose exec app sh

# Remove everything (including volumes)
docker-compose down -v
```

---

## Kubernetes Setup (For Scale)

### 1. Prerequisites

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify
kubectl version --client
helm version
```

### 2. Kubernetes Manifests

**namespace.yaml**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: skilleval
```

**deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: skilleval-app
  namespace: skilleval
spec:
  replicas: 3
  selector:
    matchLabels:
      app: skilleval
  template:
    metadata:
      labels:
        app: skilleval
    spec:
      containers:
      - name: app
        image: your-registry/skilleval:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: VITE_SUPABASE_URL
          valueFrom:
            secretKeyRef:
              name: skilleval-secrets
              key: supabase-url
        - name: VITE_SUPABASE_ANON_KEY
          valueFrom:
            secretKeyRef:
              name: skilleval-secrets
              key: supabase-anon-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

**service.yaml**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: skilleval-service
  namespace: skilleval
spec:
  selector:
    app: skilleval
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

**hpa.yaml** (Horizontal Pod Autoscaler)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: skilleval-hpa
  namespace: skilleval
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: skilleval-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

**secrets.yaml**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: skilleval-secrets
  namespace: skilleval
type: Opaque
stringData:
  supabase-url: "your-supabase-url"
  supabase-anon-key: "your-anon-key"
  openai-api-key: "your-openai-key"
  deepgram-api-key: "your-deepgram-key"
```

### 3. Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f namespace.yaml

# Create secrets
kubectl apply -f secrets.yaml

# Deploy application
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f hpa.yaml

# Check status
kubectl get pods -n skilleval
kubectl get services -n skilleval
kubectl get hpa -n skilleval

# View logs
kubectl logs -f deployment/skilleval-app -n skilleval

# Scale manually
kubectl scale deployment skilleval-app --replicas=5 -n skilleval

# Update deployment
kubectl set image deployment/skilleval-app app=your-registry/skilleval:v2 -n skilleval

# Rollback
kubectl rollout undo deployment/skilleval-app -n skilleval
```

---

## Cloud Provider Options

### AWS (Elastic Container Service)
```bash
# Cost: ~$50-200/month
# Pros: Easy to use, integrates with AWS services
# Cons: Vendor lock-in

# Setup
aws ecs create-cluster --cluster-name skilleval
aws ecs register-task-definition --cli-input-json file://task-definition.json
aws ecs create-service --cluster skilleval --service-name skilleval-service
```

### Google Cloud (Cloud Run)
```bash
# Cost: ~$30-150/month
# Pros: Serverless, auto-scaling, pay-per-use
# Cons: Cold starts

# Setup
gcloud run deploy skilleval --image gcr.io/your-project/skilleval --platform managed
```

### DigitalOcean (App Platform)
```bash
# Cost: ~$25-100/month
# Pros: Simple, affordable, good for startups
# Cons: Limited features

# Setup via UI or doctl CLI
doctl apps create --spec app-spec.yaml
```

---

## Monitoring & Logging

### Docker Compose Monitoring

```yaml
# Add to docker-compose.yml
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Kubernetes Monitoring

```bash
# Install Prometheus & Grafana
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```

---

## Summary

**For Your Application (SkillEval):**

1. **Start with Docker Compose** (Months 1-6)
   - Deploy on DigitalOcean Droplet ($20/month)
   - Use docker-compose.yml provided above
   - Add Nginx for SSL and reverse proxy
   - Monitor with simple logging

2. **Migrate to Kubernetes** (When you hit 10,000+ users)
   - Use managed Kubernetes (GKE, EKS, or DOKS)
   - Implement auto-scaling
   - Add advanced monitoring
   - Set up CI/CD pipeline

**Next Steps:**
1. Run `FIX_QUESTIONS_SCHEMA.sql` to fix Practice page
2. Set up Docker locally for testing
3. Deploy to DigitalOcean or similar
4. Add monitoring
5. Scale when needed
