import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Button from "@mui/material/Button";
import {
    FormControl,
    OutlinedInput,
    InputLabel,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Operations, OperationSymbols, SimpleExpression } from "../models";

interface Props {
    onStarted: (timeout: number, expressions: SimpleExpression[]) => void;
}

export function ExerciseSetup({ onStarted }: Props) {
    const [timeout, setTimeout] = useState(5);
    const [amount, setAmount] = useState(15);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(100);
    const [useAdd, setUseAdd] = useState(true);
    const [useSub, setUseSub] = useState(true);
    const [useMul, setUseMul] = useState(false);
    const [useDiv, setUseDiv] = useState(false);

    async function start() {
        const { expressions } = await invoke<{ expressions: SimpleExpression[] }>("start", {
            config: {
                amount,
                min,
                max,
                useAdd,
                useSub,
                useMul,
                useDiv
            }
        });
        onStarted(timeout, expressions);
    }

    return (
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
            <Grid size={6}>
                <FormControl variant="outlined" fullWidth={true}>
                    <InputLabel htmlFor="timeoutInput">Время (мин.)</InputLabel>
                    <OutlinedInput
                        label="Время (мин.)"
                        id="timeoutInput"
                        defaultValue={timeout}
                        onChange={(e) => setTimeout(Number(e.target.value) * 60000)}
                    />
                </FormControl>
            </Grid>

            <Grid size={6}>
                <FormControl variant="outlined" fullWidth={true}>
                    <InputLabel htmlFor="amountInput">Количество примеров</InputLabel>
                    <OutlinedInput
                        label="Количество примеров"
                        id="amountInput"
                        defaultValue={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                </FormControl>
            </Grid>

            <Grid size={6}>
                <FormControl variant="outlined" fullWidth={true}>
                    <InputLabel htmlFor="minInput">Мин. число</InputLabel>
                    <OutlinedInput
                        label="Мин. число"
                        id="minInput"
                        defaultValue={min}
                        onChange={(e) => setMin(Number(e.target.value))}
                    />
                </FormControl>
            </Grid>

            <Grid size={6}>
                <FormControl variant="outlined" fullWidth={true}>
                    <InputLabel htmlFor="maxInput">Макс. число</InputLabel>
                    <OutlinedInput
                        label="Макс. число"
                        id="maxInput"
                        defaultValue={max}
                        onChange={(e) => setMax(Number(e.target.value))}
                    />
                </FormControl>
            </Grid>

            <Grid size={12} style={{
                display: "flex",
                justifyContent: "center",
            }}>
                <FormControlLabel control={
                    <Checkbox checked={useAdd} onChange={(e) => setUseAdd(Boolean(e.target.value))} />
                } label={"Сложение " + OperationSymbols[Operations.Add]} />
                <FormControlLabel control={
                    <Checkbox checked={useSub} onChange={(e) => setUseSub(Boolean(e.target.value))} />
                } label={"Вычитание " + OperationSymbols[Operations.Sub]} />
                <FormControlLabel control={
                    <Checkbox checked={useMul} onChange={(e) => setUseMul(Boolean(e.target.value))} />
                } label={"Умножение " + OperationSymbols[Operations.Mul]} />
                <FormControlLabel control={
                    <Checkbox checked={useDiv} onChange={(e) => setUseDiv(Boolean(e.target.value))} />
                } label={"Деление " + OperationSymbols[Operations.Div]} />
            </Grid>

            <Grid size={12} style={{
                display: "flex",
                justifyContent: "center",
            }}>
                <Button variant="outlined" onClick={() => start()}>Начать</Button>
            </Grid>
        </Grid>
    );
}
