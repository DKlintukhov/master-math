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
import { SimpleExpression } from "../models";

interface Props {
    started: Function;
}

export function Main({ started }: Props) {
    const [expressions, setExpressions] = useState<{ expressions: SimpleExpression[] }>({ expressions: [] });
    const [timeout, setTimeout] = useState(5);
    const [amount, setAmount] = useState(15);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(100);
    const [useAdd, setUseAdd] = useState(true);
    const [useSub, setUseSub] = useState(true);
    const [useMul, setUseMul] = useState(false);
    const [useDiv, setUseDiv] = useState(false);

    async function start() {
        setExpressions(await invoke("start", {
            config: {
                amount,
                min,
                max,
                useAdd,
                useSub,
                useMul,
                useDiv
            }
        }));
        started();
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
                        onChange={(e) => setTimeout(Number(e.target.value))}
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
                } label="Сложение +" />
                <FormControlLabel control={
                    <Checkbox checked={useSub} onChange={(e) => setUseSub(Boolean(e.target.value))} />
                } label="Вычитание -" />
                <FormControlLabel control={
                    <Checkbox checked={useMul} onChange={(e) => setUseMul(Boolean(e.target.value))} />
                } label={"Умножение " + "\u00B7"} />
                <FormControlLabel control={
                    <Checkbox checked={useDiv} onChange={(e) => setUseDiv(Boolean(e.target.value))} />
                } label="Деление :" />
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
