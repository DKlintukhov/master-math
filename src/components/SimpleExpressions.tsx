import { OutlinedInput } from "@mui/material";
import { OperatorsSymbols, SimpleExpression } from "../models";

interface Props {
    id: number;
    expression: SimpleExpression;
    onAnswer: (answer: number) => void;
}

function formatExpression(id: number, expression: SimpleExpression): string {
    const opSymbol = OperatorsSymbols[expression.op];
    return `${id + 1}) ${expression.a} ${opSymbol} ${expression.b} = `;
}

export function SimpleExpressionWithInput({ id, expression, onAnswer }: Props) {
    const formattedExpression = formatExpression(id, expression);
    return (
        <div style={{ display: "flex", gap: "5px", width: "200px" }}>
            <span style={{minWidth: "fit-content"}}>{formattedExpression}</span>
            <OutlinedInput
                style={{ height: "25px" }}
                size="small"
                type="number"
                onChange={(e) => onAnswer(Number(e.target.value))}
            />
        </div >

    );
}
