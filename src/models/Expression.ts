export enum Operations {
    Add,
    Sub,
    Mul,
    Div,
}

export interface SimpleExpression {
    a: number;
    b: number;
    op: Operations;
}
