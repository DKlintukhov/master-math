import { invoke } from "@tauri-apps/api/core";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import { Exercise, ExerciseSetup, Results } from "./pages";
import { useEffect, useState } from "react";
import { ExerciseConfig, Expression, mapExpression, TauriResponse } from "./models";

export function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [expressions, setExpressions] = useState<Expression[]>([]);
    const [answers, setAnswers] = useState<number[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
    const [timeout, setTimeout] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const exerciseStarted = async (config: ExerciseConfig, timeout: number) => {
        try {
            const { expressions, answers } = await invoke<TauriResponse>("start", { config });
            setTimeout(timeout);
            setExpressions(expressions.map(mapExpression));
            setCorrectAnswers([...answers]);
            navigate("/exercise");
        } catch (error) {
            console.error(error);
        }
    }

    const exerciseFinished = (duration: number, answers: number[]) => {
        setDuration(duration);
        setAnswers([...answers]);
        navigate("/results");
    }

    const finished = () => {
        navigate("/");
    }

    useEffect(() => {
        if (location.pathname !== "/") {
            navigate("/");
        }
    }, []);

    return (
        <Container maxWidth="md"
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden"
            }}>
            <Routes>
                <Route path="/" element={<ExerciseSetup onStarted={exerciseStarted} />} />
                <Route path="/exercise" element={<Exercise timeout={timeout} expressions={expressions} onFinished={exerciseFinished} />} />
                <Route path="/results" element={<Results expressions={expressions} duration={duration} answers={answers} correctAnswers={correctAnswers} onFinished={finished} />} />
            </Routes>
        </Container>

    );
}
