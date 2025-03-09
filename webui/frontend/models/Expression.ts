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
    | { constant: number }
    | { binary: [Operation, Expression, Expression] };

interface SerializedConstantExpression {
    type: "constant";
    value: number;
}

interface SerializedBinaryExpression {
    type: "binary";
    op: Operation;
    left: SerializedExpression;
    right: SerializedExpression;
}

type SerializedExpression = SerializedConstantExpression | SerializedBinaryExpression;

export const serializeExpression = (expr: Expression): SerializedExpression => {
    if ("constant" in expr) {
        return { type: "constant", value: expr.constant };
    } else {
        const [op, left, right] = expr.binary;
        return {
            type: "binary",
            op,
            left: serializeExpression(left),
            right: serializeExpression(right),
        };
    }
}

export const serializeExpressions = (expressions: Expression[]): SerializedExpression[] => {
    return expressions.map(serializeExpression);
}
