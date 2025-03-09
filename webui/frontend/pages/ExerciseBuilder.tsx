import Button from "@mui/material/Button";
import { Expression, Operation } from "../models";
import React, { useState } from "react";
import { Container } from "@mui/material";
import { OperationSelector } from "../components";

interface Props {
    onStart: () => Expression[];
    onCancel: () => void;
}

export function ExerciseBuilder({ onStart, onCancel }: Props) {
    const [expressions, setExpressions] = useState<Expression[]>([]);

    const operationSelected = (op: Operation) => {
        console.log(op)
    }

    return (
        <Container>
            <OperationSelector onSelect={operationSelected}/>
            <Button variant="outlined" onClick={onCancel}>Отмена</Button>
        </Container>
    );
}
