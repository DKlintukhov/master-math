export class ExerciseConfig {
  constructor(
    public amount: number,
    public min: number,
    public max: number,
    public useAdd: boolean,
    public useSub: boolean,
    public useMul: boolean,
    public useDiv: boolean,
  ) {}
}
