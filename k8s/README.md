# Kubernetes Deployment Guide

## Prerequisites
- Kubernetes cluster (Minikube, DigitalOcean, AWS EKS, etc.)
- `kubectl` CLI configured
- Docker images pushed to GHCR (done via CI/CD)

## Quick Deploy

```bash
# 1. Create namespace first
kubectl apply -f k8s/namespace.yaml

# 2. Apply secrets and config
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml

# 3. Deploy databases
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml

# 4. Wait for databases to be ready
kubectl wait --for=condition=ready pod -l app=postgres-users -n ecommerce --timeout=120s
kubectl wait --for=condition=ready pod -l app=redis -n ecommerce --timeout=60s

# 5. Deploy microservices
kubectl apply -f k8s/services.yaml

# 6. Deploy ingress
kubectl apply -f k8s/ingress.yaml
```

## Or Apply All at Once
```bash
kubectl apply -f k8s/
```

## Verify Deployment
```bash
# Check all pods
kubectl get pods -n ecommerce

# Check services
kubectl get svc -n ecommerce

# Check ingress
kubectl get ingress -n ecommerce

# View logs
kubectl logs -f deployment/user-service -n ecommerce
```

## Local Testing (Minikube)
```bash
# Start Minikube
minikube start

# Enable ingress
minikube addons enable ingress

# Apply manifests
kubectl apply -f k8s/

# Get Minikube IP
minikube ip

# Access API
curl http://$(minikube ip)/api/users/health
```

## Scaling
```bash
# Scale a service
kubectl scale deployment user-service --replicas=5 -n ecommerce

# Enable HPA (Horizontal Pod Autoscaler)
kubectl autoscale deployment user-service --min=2 --max=10 --cpu-percent=80 -n ecommerce
```

## Cleanup
```bash
kubectl delete -f k8s/
```
