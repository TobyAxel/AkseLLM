# AkseLLM

A web application for managing and deploying custom Large Language Models on Kubernetes.

## Overview

AkseLLM provides a streamlined interface for creating, configuring, and managing custom LLM deployments in a Kubernetes cluster. Built for solo developers and small teams who need flexible LLM infrastructure without the complexity of enterprise solutions.

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: .NET WebAPI (C#)
- **Database**: Supabase (Postgres)
- **Infrastructure**: Kubernetes (K8s)
- **Containerization**: Docker

## Current Status

🚧 **Early Development** 🚧

Currently implemented:
- ✅ Basic frontend UI design
- ✅ Frontend Docker containerization
- ✅ Kubernetes deployment configuration for frontend
- ✅ Backend API scaffolding (.NET WebAPI with controllers)

In progress:
- 🔨 Backend services for K8s cluster management
- 🔨 LLM deployment orchestration
- 🔨 Model configuration management
- 🔨 Authentication & user management

## Planned Features

- Create and configure custom LLM instances
- Deploy models to Kubernetes pods
- Manage multiple LLM deployments from a single interface
- Monitor model performance and resource usage
- API proxy for inference requests
- User authentication and workspace management

## Architecture
```
┌─────────────────┐
│  React Frontend │ (K8s Deployment)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  .NET Backend   │ (K8s Deployment - planned)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   LLM Pods      │ (K8s Deployments - planned)
└─────────────────┘
```

## Getting Started

### Prerequisites

- Docker
- Kubernetes cluster (local or cloud)
- kubectl configured
- .NET 8 SDK (for backend development)
- Node.js & npm (for frontend development)

### Running Locally

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
dotnet restore
dotnet run
```

### Deploying to Kubernetes

**Using pre-built images:**
```bash
kubectl apply -f k8s/frontend/
```

**Building your own version:**

If you want to modify the code and use your own Docker Hub repository:
```bash
# Build and push to your own Docker Hub
cd frontend
docker build -t YOUR_DOCKERHUB_USERNAME/aksellm-frontend:latest .
docker push YOUR_DOCKERHUB_USERNAME/aksellm-frontend:latest

# Update k8s/frontend/ manifests to use your image, then deploy
kubectl apply -f k8s/frontend/
```

This will pull the pre-built images and deploy AkseLLM to your cluster.

## Project Structure
```
aksellm/
├── frontend/          # React + TypeScript application
│   ├── src/
│   ├── Dockerfile
│   └── ...
├── backend/           # .NET WebAPI
│   ├── Controllers/
│   ├── Services/
│   ├── Models/
│   └── ...
└── k8s/               # Kubernetes manifests
    ├── frontend/      # Frontend deployment & service
    ├── backend/       # Backend deployment & service (planned)
    └── llm/           # LLM pod deployments (planned)
```

## Roadmap

- [ ] Implement K8s service layer in backend
- [ ] Build model deployment functionality
- [ ] Add authentication system
- [ ] Create inference proxy endpoint
- [ ] Implement monitoring dashboard
- [ ] Add support for popular LLM formats (GGUF, SafeTensors, etc.)
- [ ] Resource usage tracking and auto-scaling

## Contributing

This is currently a solo project in early stages. Contributions, suggestions, and feedback are welcome once core functionality is implemented.

## License

AGPL-3.0 license

---

**Note**: This project is in active development. APIs and architecture may change significantly.
