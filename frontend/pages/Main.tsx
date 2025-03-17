
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import { ExercisesList } from "../components";
import { Exercise } from "../models";
import { CoreController } from "../controllers";

interface Props {
    onExerciseSetupNavigate: () => void;
    onExerciseBuilderNavigate: () => void;
    onExerciseSelected: (exercise: Exercise) => void;
}

export function Main({ onExerciseSetupNavigate, onExerciseBuilderNavigate, onExerciseSelected }: Props) {
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const loadExercises = async () => {
        try {
            const exercises = await CoreController.LoadExercises();
            setExercises(exercises);
        } catch (e) {
            console.error(e);
        }
    }

    // it's needed to wait for WebSocket connection
    // TODO: find better solution
    setTimeout(() => loadExercises(), 1000);

    return (
        <Container style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px"
        }}>
            <Container style={{
                display: "flex",
                justifyContent: "center",
                gap: "25px"
            }}>
                <Button variant="outlined" onClick={onExerciseSetupNavigate}>Сгенерировать упражнение</Button>
                <Button variant="outlined" onClick={onExerciseBuilderNavigate}>Создать упражнение</Button>
            </Container>
            <ExercisesList exercises={exercises} onExerciseSelected={onExerciseSelected}></ExercisesList>
        </Container>
    );
}
