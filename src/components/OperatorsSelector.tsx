import { Checkbox, Container, FormControlLabel, FormHelperText } from "@mui/material";
import { Operators, OperatorsSymbols, OperatorsToUse, } from "../models";
import { useEffect, useState } from "react";

interface Props {
    onChecked: (ops: OperatorsToUse) => void;
    onError: (iisError: boolean) => void;
}

export function OperatorsSelector({ onChecked, onError }: Props) {
    const [useAdd, setUseAdd] = useState(true);
    const [useSub, setUseSub] = useState(true);
    const [useMul, setUseMul] = useState(false);
    const [useDiv, setUseDiv] = useState(false);
    const [isError, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if ([useAdd, useSub, useMul, useDiv].every((using) => using === false)) {
            onError(true);
            setError(true);
            setErrorMessage("Как минимум один оператор должен быть использован")
            return;
        }

        setErrorMessage("");
        onError(false);
        setError(false);
        onChecked({ useAdd, useSub, useMul, useDiv });
    }, [useAdd, useSub, useMul, useDiv]);

    return (
        <Container style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
        }}>
            <div>
                <FormControlLabel control={
                    <Checkbox checked={useAdd} onChange={(e) => setUseAdd(Boolean(e.target.checked))} />
                } label={"Сложение " + OperatorsSymbols[Operators.Add]} />
                <FormControlLabel control={
                    <Checkbox checked={useSub} onChange={(e) => setUseSub(Boolean(e.target.checked))} />
                } label={"Вычитание " + OperatorsSymbols[Operators.Sub]} />
                <FormControlLabel control={
                    <Checkbox checked={useMul} onChange={(e) => setUseMul(Boolean(e.target.checked))} />
                } label={"Умножение " + OperatorsSymbols[Operators.Mul]} />
                <FormControlLabel control={
                    <Checkbox checked={useDiv} onChange={(e) => setUseDiv(Boolean(e.target.checked))} />
                } label={"Деление " + OperatorsSymbols[Operators.Div]} />
            </div>
            {isError && <FormHelperText error={true}>{errorMessage}</FormHelperText>}
        </Container>
    );
}
