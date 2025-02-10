export enum Operations {
    Add = "Add",
    Sub = "Sub",
    Mul = "Mul",
    Div = "Div",
}

export const OperationSymbols: { [key in Operations]: string } = {
    [Operations.Add]: "+",
    [Operations.Sub]: "-",
    [Operations.Mul]: "\u00B7", // Multiplication dot symbol
    [Operations.Div]: ":",
};

export interface SimpleExpression {
    a: number;
    b: number;
    op: Operations;
}
