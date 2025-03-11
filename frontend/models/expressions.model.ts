export enum Operation {
    Add,
    Sub,
    Mul,
    Div,
}

export const OperationSymbols: { [key in Operation]: string } = {
    [Operation.Add]: "+",
    [Operation.Sub]: "-",
    [Operation.Mul]: "\u00D7",
    [Operation.Div]: ":",
};

export interface OperationToUse {
    useAdd: boolean;
    useSub: boolean;
    useMul: boolean;
    useDiv: boolean;
}

export interface GeneratedExpressionsView {
    expressions: string[];
    answers: string[];
}
