import { OutlinedInput } from "@mui/material";
import { OperationSymbols, Expression } from "../models";

interface Props {
    expression: Expression;
    onAnswer: (answer: number) => void;
}

export function ExpressionInputControl({ expression, onAnswer }: Props) {
    if (expression.type === "Number") {
        return (
            <OutlinedInput
                style={{ height: "25px", width: "80px" }}
                size="small"
                type="number"
                defaultValue={expression.value}
                onBlur={(e) => onAnswer(Number(e.target.value))}
            />
        );
    } else {
        const { op, left, right } = expression;
        const opSymbol = OperationSymbols[op];

        return (
            <>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <ExpressionInputControl expression={left} onAnswer={onAnswer} />
                    <span style={{ width: "7px", textAlign: "center" }}> {opSymbol} </span>
                    <ExpressionInputControl expression={right} onAnswer={onAnswer} />
                </div>
            </>
        );
    }
}
