[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-red.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

# AkseLLM

A web application for managing and deploying custom Large Language Models on Kubernetes.

## Project structure
```
LICENSE
backend/          # .NET 10 Web API
frontend/         # React + Vite frontend
k8s/              # Kubernetes deployment/service manifests
```

### Backend
- **Language:** C# (.NET 10)
- **Features:**
  - JWT authentication
  - CRUD operations for LLM configurations
  - Supabase integration via helper services
  - Controllers for user and LLM management
  - Domain models, DTOs and validation attributes
- **Entry point:** `Program.cs`
- **Configuration files:** `appsettings.json`, `appsettings.Development.json`

### Frontend
- **Stack:** TypeScript, React 18, Vite
- **State management:** Zustand (`useUserStore`, `useLLMStore`, `useModalStore`)
- **API services:** `src/services` handles auth and LLM calls
- **UI:** component library under `src/components`, modal system via `ModalRenderer`

### Kubernetes
- Separate deployment and service manifests for backend and frontend
- `ingress.yaml` configures ingress routing for the cluster

## Running the application locally

### Prerequisites
- .NET 10 SDK
- Node.js (v18+)
- Docker/Kubernetes (only if you plan to deploy containers)
- Supabase project or CLI for database/auth

### Backend
```bash
cd backend
dotnet restore
dotnet build
dotnet run
```
Default URL: `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Default URL: `http://localhost:5173`

## Kubernetes deployment
Before applying the backend deployment, create a secret containing the Supabase URL and public key:
```bash
kubectl create secret generic backend-secrets \
  --from-literal=SupabaseUrl=<your-url> \
  --from-literal=SupabasePublicKey=<your-key>
```
Then apply the manifests under `k8s` to deploy both services:
```bash
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml
kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/service.yaml
kubectl apply -f k8s/ingress.yaml
```

## Development notes
- **Validation:** Custom attributes enforce provider/model compatibility.
- **Error handling:** Global exception filter standardizes API responses.
- **Supabase:** Helper classes manage authentication and data access.

## To do
1. Implement backend endpoint for orchestrating LLM containers on Kubernetes.
2. Add monitoring/healthchecks for running model instances.
3. Enforce resource limits and security on deployed workloads.

## License
This project is licensed under a CC BY-NC-SA 4.0 license. See the [LICENSE](LICENSE) file for full details.
