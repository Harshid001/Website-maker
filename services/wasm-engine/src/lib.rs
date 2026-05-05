use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

#[derive(Serialize, Deserialize)]
pub struct Bounds {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
}

#[wasm_bindgen]
pub fn calculate_zoom(current_zoom: f64, delta: f64, min: f64, max: f64) -> f64 {
    (current_zoom + delta).max(min).min(max)
}

#[wasm_bindgen]
pub fn calculate_pan(x: f64, y: f64, dx: f64, dy: f64) -> JsValue {
    serde_wasm_bindgen::to_value(&Point { x: x + dx, y: y + dy }).unwrap_or(JsValue::NULL)
}

#[wasm_bindgen]
pub fn snap_to_grid(value: f64, grid_size: f64) -> f64 {
    if grid_size <= 0.0 {
        return value;
    }
    (value / grid_size).round() * grid_size
}

#[wasm_bindgen]
pub fn calculate_bounds(x: f64, y: f64, width: f64, height: f64) -> JsValue {
    serde_wasm_bindgen::to_value(&Bounds { x, y, width, height }).unwrap_or(JsValue::NULL)
}

#[wasm_bindgen]
pub fn optimize_layout(layout_json: String) -> String {
    layout_json
}
