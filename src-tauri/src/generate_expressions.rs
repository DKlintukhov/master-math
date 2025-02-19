use rand::{seq::IndexedMutRandom, Rng};

use crate::models::{ExerciseConfig, Expression, Operation};

pub fn generate_expressions(config: &ExerciseConfig) -> Vec<Expression> {
    let mut rng = rand::rng();
    let mut expressions = Vec::with_capacity(config.amount);

    for _ in 0..config.amount {
        expressions.push(generate_expression(&mut rng, config));
    }

    expressions
}

fn generate_expression<R: Rng>(rng: &mut R, config: &ExerciseConfig) -> Expression {
    generate_binary_expression(rng, config)
}

fn generate_number<R: Rng>(rng: &mut R, min: f32, max: f32) -> Expression {
    Expression::Number(rng.random_range(min..=max).trunc())
}

fn generate_binary_expression<R: Rng>(rng: &mut R, config: &ExerciseConfig) -> Expression {
    let mut available_operations = Vec::new();
    if config.use_add {
        available_operations.push(Operation::Add);
    }
    if config.use_sub {
        available_operations.push(Operation::Sub);
    }
    if config.use_mul {
        available_operations.push(Operation::Mul);
    }
    if config.use_div {
        available_operations.push(Operation::Div);
    }

    let operation = available_operations.choose_mut(rng).unwrap();

    let left = Box::new(generate_number(rng, config.min, config.max));
    let right = Box::new(generate_number(rng, config.min, config.max));

    match operation {
        Operation::Add => Expression::Binary(Operation::Add, left, right),
        Operation::Sub => Expression::Binary(Operation::Sub, left, right),
        Operation::Mul => Expression::Binary(Operation::Mul, left, right),
        Operation::Div => Expression::Binary(Operation::Div, left, right),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_expressions() {
        let config = ExerciseConfig {
            amount: 5,
            min: 1.0,
            max: 10.0,
            use_add: true,
            use_sub: true,
            use_mul: true,
            use_div: true,
        };

        let expressions = generate_expressions(&config);
        assert_eq!(expressions.len(), 5);

        for expr in &expressions {
            match expr {
                Expression::Number(n) => assert!(*n >= config.min && *n <= config.max),
                Expression::Binary(_, _, _) => {}
            }
        }
    }

    #[test]
    fn test_generate_expressions_no_operations() {
        let config = ExerciseConfig {
            amount: 2,
            min: 1.0,
            max: 10.0,
            use_add: true,
            use_sub: true,
            use_mul: false,
            use_div: false,
        };

        let expressions = generate_expressions(&config);
        assert_eq!(expressions.len(), 2);

        for expr in &expressions {
            match expr {
                Expression::Number(n) => assert!(*n >= config.min && *n <= config.max),
                Expression::Binary(_, _, _) => {
                    panic!("Should not have generated binary expressions")
                }
            }
        }
    }
}
