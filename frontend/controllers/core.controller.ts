import { Exercise, Operation, OperationSymbols } from "../models";
import { CoreService, GenerateExpressionsConfig } from "../services";

export class CoreController {

    public static async GenerateExpressions(config: GenerateExpressionsConfig): Promise<Exercise | never> {
        try {
            const { expressions, answers } = await CoreService.GenerateExpressions(config);
            const problems = expressions.map((expression) => {
                let res = expression
                    .replaceAll("+", ` ${OperationSymbols[Operation.Add]} `)
                    .replaceAll("-", ` ${OperationSymbols[Operation.Sub]} `)
                    .replaceAll("*", ` ${OperationSymbols[Operation.Mul]} `)
                    .replaceAll("/", ` ${OperationSymbols[Operation.Div]} `);

                return res;
            });

            return { name: config.name, timeout: config.timeout, problems, answers }
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    public static async SaveExercise(exercise: Exercise): Promise<void | never> {
        try {
            await CoreService.SaveExercise({ exercise });
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    public static async DeleteExercise(name: string): Promise<void | never> {
        try {
            await CoreService.DeleteExercise({ name });
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    public static async LoadExercises(): Promise<Exercise[] | never> {
        try {
            const exercises = await CoreService.LoadExercises();
            return exercises
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }
}
