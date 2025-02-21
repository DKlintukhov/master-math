export enum Operation {
    Add = "Add",
    Sub = "Sub",
    Mul = "Mul",
    Div = "Div",
}

export const OperationSymbols: { [key in Operation]: string } = {
    [Operation.Add]: "+",
    [Operation.Sub]: "-",
    [Operation.Mul]: "\u00D7", // Multiplication x symbol
    [Operation.Div]: ":",
};

export interface OperationToUse {
    useAdd: boolean;
    useSub: boolean;
    useMul: boolean;
    useDiv: boolean;
}

// Define the Expression interface as a discriminated union.
export type Expression =
    | { type: "Number"; value: number }
    | { type: "Binary"; op: Operation; left: Expression; right: Expression };

export type ExpressionDTO =
    | { Number: number }
    | { Binary: [Operation, ExpressionDTO, ExpressionDTO] };

export interface TauriResponse {
    expressions: ExpressionDTO[];
    answers: number[];
}

export function mapExpression(jsonExpr: ExpressionDTO): Expression {
    if ("Number" in jsonExpr) {
        return { type: "Number", value: jsonExpr.Number };
    } else if ("Binary" in jsonExpr) {
        const [operation, leftJson, rightJson] = jsonExpr.Binary;
        return {
            type: "Binary",
            op: operation,
            left: mapExpression(leftJson),
            right: mapExpression(rightJson),
        };
    } else {
        throw new Error("Invalid expression format"); // Handle unexpected cases!
    }
}
