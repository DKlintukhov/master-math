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

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub enum Operators {
    Add,
    Sub,
    Mul,
    Div,
}

trait Expression {
    fn solve(&self) -> Result<f32, &'static str>;
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct SimpleExpression {
    a: f32,
    b: f32,
    op: Operators,
}

impl Expression for SimpleExpression {
    fn solve(&self) -> Result<f32, &'static str> {
        match self.op {
            Operators::Add => Ok(self.a + self.b),
            Operators::Sub => Ok(self.a - self.b),
            Operators::Mul => Ok(self.a * self.b),
            Operators::Div => {
                if self.b == 0.0 {
                    return Err("Division by `0`");
                }

                Ok(self.a / self.b)
            }
        }
    }
}

impl SimpleExpression {
    pub fn new(a: f32, b: f32, op: Operators) -> Self {
        Self { a, b, op }
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Response {
    pub expressions: Vec<SimpleExpression>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simple_expression() {
        {
            let se = SimpleExpression::new(5.0, 10.0, Operators::Add);
            let res = se.solve().unwrap();
            assert_eq!(res, 15.0);
        }
        {
            let se = SimpleExpression::new(5.0, 10.0, Operators::Sub);
            let res = se.solve().unwrap();
            assert_eq!(res, -5.0);
        }
        {
            let se = SimpleExpression::new(5.0, 10.0, Operators::Mul);
            let res = se.solve().unwrap();
            assert_eq!(res, 50.0);
        }
        {
            let se = SimpleExpression::new(4.0, 2.0, Operators::Div);
            let res = se.solve().unwrap();
            assert_eq!(res, 2.0);
        }
        {
            let se = SimpleExpression::new(4.0, 0.0, Operators::Div);
            let res = se.solve();
            assert_eq!(res.unwrap_err(), String::from("Division by `0`"));
        }
    }
}
