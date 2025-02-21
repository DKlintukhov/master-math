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

#[derive(Debug, PartialEq, PartialOrd, serde::Serialize, serde::Deserialize)]
pub enum Operation {
    Add,
    Sub,
    Mul,
    Div,
}

#[derive(Debug, PartialEq, PartialOrd, serde::Serialize, serde::Deserialize)]
pub enum Expression {
    Number(f32),
    Binary(Operation, Box<Expression>, Box<Expression>),
}

impl Expression {
    pub fn evaluate(&self) -> Result<f32, &'static str> {
        match self {
            Expression::Number(n) => Ok(*n),
            Expression::Binary(op, left, right) => {
                let left_val = left.evaluate()?;
                let right_val = right.evaluate()?;
                match op {
                    Operation::Add => Ok(left_val + right_val),
                    Operation::Sub => Ok(left_val - right_val),
                    Operation::Mul => Ok(left_val * right_val),
                    Operation::Div => {
                        if right_val == 0.0 {
                            return Err("Division by `0`");
                        }
                        Ok(left_val / right_val)
                    }
                }
            }
        }
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Response {
    pub expressions: Vec<Expression>,
    pub answers: Vec<f32>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_devision_by_zero() {
        let expression = Expression::Binary(
            Operation::Div,
            Box::new(Expression::Number(5.0)),
            Box::new(Expression::Number(0.0)),
        );
        assert_eq!(expression.evaluate(), Err("Division by `0`"));
    }

    #[test]
    fn test_add_and_mul() {
        let expression = Expression::Binary(
            Operation::Add,
            Box::new(Expression::Number(5.0)),
            Box::new(Expression::Binary(
                Operation::Mul,
                Box::new(Expression::Number(2.0)),
                Box::new(Expression::Number(3.0)),
            )),
        );

        let res = expression.evaluate().unwrap();
        assert_eq!(res, 11.0);
    }

    #[test]
    fn test_sub_and_div() {
        let expression = Expression::Binary(
            Operation::Sub,
            Box::new(Expression::Number(10.0)),
            Box::new(Expression::Binary(
                Operation::Div,
                Box::new(Expression::Number(10.0)),
                Box::new(Expression::Number(2.0)),
            )),
        );

        let res = expression.evaluate().unwrap();
        assert_eq!(res, 5.0);
    }
}
