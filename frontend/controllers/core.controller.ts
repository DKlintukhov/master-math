import { GeneratedExpressionsView, Operation, OperationSymbols } from "../models";
import { GeneratedExpressions } from "../services";

export class CoreController {

    public static GeneratedExpressionsToView({ expressions, answers }: GeneratedExpressions): GeneratedExpressionsView {
        const expressionsView = expressions.map((expression) => {
            let res = expression
                .replaceAll("+", ` ${OperationSymbols[Operation.Add]} `)
                .replaceAll("-", ` ${OperationSymbols[Operation.Sub]} `)
                .replaceAll("*", ` ${OperationSymbols[Operation.Mul]} `)
                .replaceAll("/", ` ${OperationSymbols[Operation.Div]} `);

            return res;
        });

        return { expressions: expressionsView, answers }
    }
}