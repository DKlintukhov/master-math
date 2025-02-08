mod models;
use models::{ExerciseConfig, Operations, SimpleExpression, Response};


#[tauri::command]
fn start(config: ExerciseConfig) -> Response {
    Response {
        expressions: vec![
            SimpleExpression::new(5.0, 12.0, Operations::Add),
            SimpleExpression::new(5.0, 12.0, Operations::Sub),
            SimpleExpression::new(5.0, 12.0, Operations::Div),
            SimpleExpression::new(5.0, 12.0, Operations::Mul),
        ],
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
