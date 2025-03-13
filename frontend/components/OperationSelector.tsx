import { FormControl, MenuItem, Select } from "@mui/material";
import { Operation, OperationSymbols } from "../models";
import React, { useEffect, useState } from "react";

interface Props {
    onSelect: (op: Operation) => void;
}

export function OperationSelector({ onSelect }: Props) {
    const [operation, setOperation] = useState(Operation.Add);

    useEffect(() => {
    }, [operation]);

    const selectHandler = (event) => {
        const op = event.target.value;
        setOperation(op);
        onSelect(op);
    }

    return (
        <FormControl size="medium">
            <Select
                value={operation}
                onChange={selectHandler}
            >
                <MenuItem value={Operation.Add}>{OperationSymbols[Operation.Add]}</MenuItem>
                <MenuItem value={Operation.Sub}>{OperationSymbols[Operation.Sub]}</MenuItem>
                <MenuItem value={Operation.Mul}>{OperationSymbols[Operation.Mul]}</MenuItem>
                <MenuItem value={Operation.Div}>{OperationSymbols[Operation.Div]}</MenuItem>
            </Select>
        </FormControl>
    );
}
