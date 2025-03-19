
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress, Container } from "@mui/material";
import { ExercisesList } from "../components";
import { Exercise } from "../models";
import { CoreController } from "../controllers";

interface Props {
    onExerciseSetupNavigate: () => void;
    onExerciseBuilderNavigate: () => void;
    onExerciseSelected: (exercise: Exercise) => void;
    onExerciseEdit: (exercise: Exercise) => void;
}

export function Main({ onExerciseSetupNavigate, onExerciseBuilderNavigate, onExerciseSelected, onExerciseEdit }: Props) {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadExercises = async () => {
        setLoading(true);
        try {
            const exercises = await CoreController.LoadExercises();
            setExercises(exercises);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleExerciseDelete = async (exercise: Exercise) => {
        try {
            await CoreController.DeleteExercise(exercise.name);
            await loadExercises();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    // it's needed to wait for WebSocket connection
    // TODO: find better solution
    useEffect(() => {
        const timeoutId = setTimeout(() => loadExercises(), 1000);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <Container style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "15px",
            paddingTop: "150px",
        }}>
            <Container style={{
                display: "flex",
                justifyContent: "center",
                gap: "25px"
            }}>
                <Button variant="outlined" onClick={onExerciseSetupNavigate}>Сгенерировать упражнение</Button>
                <Button variant="outlined" onClick={onExerciseBuilderNavigate}>Создать упражнение</Button>
            </Container>

            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "40vh",
                height: "40vh",
                overflow: "hidden auto"
            }}>
                {loading
                    ? <CircularProgress size="70px" />
                    : exercises.length > 0
                    && <ExercisesList
                        exercises={exercises}
                        onEdit={onExerciseEdit}
                        onDelete={handleExerciseDelete}
                        onExerciseSelected={onExerciseSelected}
                    />
                }
            </div>

        </Container>
    );
}
