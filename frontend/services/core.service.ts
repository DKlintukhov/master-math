import {
    GenerateExpressionsConfig,
    GenerateExpressionsResponse,
    GeneratedExpressions
} from "./core.types";

export class CoreService {

    public static async GenerateExpressions(conf: GenerateExpressionsConfig): Promise<GeneratedExpressions | never> {
        const json = await globalThis.webui.call('GenerateExpressions', JSON.stringify(conf));
        const { error, expressions, answers } = JSON.parse(json) as GenerateExpressionsResponse;
        if (error) {
            throw error;
        }

        return { expressions, answers };

        return {
            expressions: ["2+2", "2+3-2+3+(2+3)", "10-3-6+(5/10)"],
            answers: ["4", "5", "7"]
        };
    }
}
