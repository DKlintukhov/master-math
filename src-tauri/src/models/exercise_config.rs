#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExerciseConfig {
    pub amount: usize,
    pub min: f32,
    pub max: f32,
    pub use_add: bool,
    pub use_sub: bool,
    pub use_mul: bool,
    pub use_div: bool,
}
