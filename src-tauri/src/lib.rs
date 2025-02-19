mod models;
mod generate_expressions;
use generate_expressions::generate_expressions;
use models::{ExerciseConfig, Response};

#[tauri::command]
fn start(config: ExerciseConfig) -> Response {
    Response {
        expressions: generate_expressions(&config),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![start])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
