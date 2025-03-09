import { Checkbox, Container, FormControlLabel, FormHelperText } from "@mui/material";
import { Operation, OperationToUse, OperationSymbols, } from "../models";
import { useEffect, useState } from "react";

interface Props {
    onCheck: (ops: OperationToUse) => void;
    onError: (iisError: boolean) => void;
}

export function OperationMultiSelect({ onCheck, onError }: Props) {
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
        onCheck({ useAdd, useSub, useMul, useDiv });
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
                } label={"Сложение " + OperationSymbols[Operation.Add]} />
                <FormControlLabel control={
                    <Checkbox checked={useSub} onChange={(e) => setUseSub(Boolean(e.target.checked))} />
                } label={"Вычитание " + OperationSymbols[Operation.Sub]} />
                <FormControlLabel control={
                    <Checkbox checked={useMul} onChange={(e) => setUseMul(Boolean(e.target.checked))} />
                } label={"Умножение " + OperationSymbols[Operation.Mul]} />
                <FormControlLabel control={
                    <Checkbox checked={useDiv} onChange={(e) => setUseDiv(Boolean(e.target.checked))} />
                } label={"Деление " + OperationSymbols[Operation.Div]} />
            </div>
            {isError && <FormHelperText error={true}>{errorMessage}</FormHelperText>}
        </Container>
    );
}
