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

export type Expression =
    | { type: "constant"; value: number }
    | { type: "binary"; left: Expression; right: Expression; op: Operation; };

export type ExpressionDTO =
    | { constant: number }
    | { binary: [ExpressionDTO, ExpressionDTO, Operation] };

export interface Response {
    expressions: ExpressionDTO[];
    answers: number[];
}

export interface ErrorResponse {
    error: string;
}
