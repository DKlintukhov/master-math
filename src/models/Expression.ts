export enum Operators {
    Add = "Add",
    Sub = "Sub",
    Mul = "Mul",
    Div = "Div",
}

export const OperatorsSymbols: { [key in Operators]: string } = {
    [Operators.Add]: "+",
    [Operators.Sub]: "-",
    [Operators.Mul]: "\u00D7", // Multiplication x symbol
    [Operators.Div]: ":",
};

export interface OperatorsToUse {
    useAdd: boolean;
    useSub: boolean;
    useMul: boolean;
    useDiv: boolean;
}

export interface SimpleExpression {
    a: number;
    b: number;
    op: Operators;
}
