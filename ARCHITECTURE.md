# ShopCraft Studio Architecture

This project is being upgraded with a future-ready multi-language architecture while keeping the current React app and existing UI intact.

## Frontend

- React continues to power the current app.
- TypeScript is enabled gradually with `allowJs`, so existing `.js` and `.jsx` files keep working.
- New future-facing modules can use `.ts` and `.tsx`.
- Shared flexible types live in `frontend/src/types`.
- The current template library, sidebar, navbar, dashboard layout, and routes are not redesigned by this architecture layer.

Run:

```bash
cd frontend
npm run dev
```

## Template Library And Workspaces

- Existing template UI remains in place.
- Safe project/template helpers live in:
  - `frontend/src/utils/templateClone.ts`
  - `frontend/src/utils/templateRouter.ts`
  - `frontend/src/utils/projectStorage.ts`
- Workspace route helpers support:
  - website -> `/workspace/website/:projectId`
  - 2D -> `/workspace/design/:projectId`
  - 3D -> `/workspace/3d/:projectId`
  - animation -> `/workspace/animation/:projectId`

## 2D Editor

- Future editor scaffold: `frontend/src/features/design-editor`
- Uses Konva / React-Konva.
- Includes a default canvas, toolbar, properties panel, template loader, and basic canvas rendering.

## 3D Editor

- Future editor scaffold: `frontend/src/features/three-editor`
- Uses Three.js, React Three Fiber, and Drei.
- Includes a default scene, lights, camera, orbit controls, cube placeholder, toolbar, properties panel, and template loader.

## Animation Editor

- Future editor scaffold: `frontend/src/features/animation-editor`
- Uses Framer Motion and GSAP.
- Includes CSS animation preview, Framer Motion placeholder, GSAP placeholder, speed, loop, and color controls.

## Node Backend

- Existing Node.js + Express backend remains the primary API.
- Existing routes are preserved.
- Added safe health and AI proxy integration points:
  - `GET /api/health`
  - `POST /api/ai/chat`
  - `POST /api/ai/generate-template`
  - `POST /api/ai/suggest-layout`
  - `POST /api/ai/improve-copy`
- AI proxy target defaults to `http://localhost:8001`.

Run:

```bash
cd backend
npm run dev
```

## Python AI Service

- Standalone FastAPI service: `services/ai-service`
- Does not affect frontend startup.
- Returns placeholder responses when provider keys are missing.

Run:

```bash
cd services/ai-service
python -m venv venv
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

Environment variables:

```env
OPENAI_API_KEY=
GEMINI_API_KEY=
CLAUDE_API_KEY=
```

## Optional Go API

- Optional future high-performance backend: `services/go-api`
- Not connected to the frontend by default.

Run:

```bash
cd services/go-api
go run main.go
```

Default port: `8081`

## Optional Rust WebAssembly Engine

- Optional browser performance engine: `services/wasm-engine`
- Intended for editor math such as zoom, pan, snapping, bounds, and layout optimization.
- Frontend wrapper lives in `frontend/src/services/wasm/wasmEngine.ts`.
- The wrapper falls back to JavaScript if WASM is missing.

Build:

```bash
cd services/wasm-engine
wasm-pack build --target web
```
