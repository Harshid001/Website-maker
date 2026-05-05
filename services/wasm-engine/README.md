# ShopCraft Rust WebAssembly Engine

Optional browser performance engine for editor math. The frontend wrapper always falls back to JavaScript if this package is not built.

## Build

```bash
cd services/wasm-engine
wasm-pack build --target web
```

Copy or serve the generated package at `/wasm-engine/wasm_engine.js` when wiring this into production.
