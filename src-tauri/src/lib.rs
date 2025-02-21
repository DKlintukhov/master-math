mod generate_expressions;
mod models;
use generate_expressions::generate_expressions;
use models::{ExerciseConfig, Response};

#[tauri::command]
fn start(config: ExerciseConfig) -> Response {
    let expressions = generate_expressions(&config);
    let answers = expressions
        .iter()
        .map(|expr| expr.evaluate().unwrap())
        .collect();
    Response {
        expressions,
        answers,
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
