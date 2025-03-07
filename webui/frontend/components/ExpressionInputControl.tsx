import { OutlinedInput } from "@mui/material";
import { OperationSymbols, Expression } from "../models";


interface Props {
    expression: Expression;
    readOnly: boolean,
}

export function ExpressionInputControl({ expression, readOnly }: Props) {
    if (expression.type === "constant") {
        return (
            <OutlinedInput
                style={{ height: "25px", width: "90px", textAlign: "center", textAlignLast: "center" }}
                size="small"
                type={readOnly ? "text" : "number"}
                readOnly={readOnly}
                defaultValue={expression.value}
            // onBlur={(e) => onChange(Number(e.target.value))}
            />
        );
    } else {
        const { left, right, op } = expression;
        const opSymbol = OperationSymbols[op];

        return (
            <>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <ExpressionInputControl expression={left} readOnly={readOnly} />
                    <span style={{ width: "7px", textAlign: "center" }}> {opSymbol} </span>
                    <ExpressionInputControl expression={right} readOnly={readOnly} />
                </div>
            </>
        );
    }
}
