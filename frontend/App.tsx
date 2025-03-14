import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Button, Container } from "@mui/material";
import { Exercise, ExerciseBuilder, ExerciseSetup, Results } from "./pages";
import { useEffect, useState } from "react";
import { Main } from "./pages/Main";
import { CoreService, GenerateExpressionsConfig } from "./services";
import { CoreController } from "./controllers";

export function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [expressions, setExpressions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
    const [timeout, setTimeout] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const generatedExerciseStarted = async (config: GenerateExpressionsConfig, timeout: number) => {
        navigate("/");
        try {
            const response = await CoreService.GenerateExpressions(config);
            const { expressions, answers } = CoreController.GeneratedExpressionsToView(response);

            setTimeout(timeout);
            setExpressions(expressions);
            setCorrectAnswers(answers);
            navigate("/exercise");
        } catch (e) {
            console.error(e);
        }
    }

    const generatedExcersizeNavigated = () => {
        navigate("/exercise-setup");
    }

    const excersizeBuilderNavigated = () => {
        navigate("/builder");
    }

    const exerciseFinished = (duration: number, answers: string[]) => {
        setDuration(duration);
        setAnswers(answers);
        navigate("/results");
    }

    const finished = () => {
        navigate("/");
    }

    const excersiseBuilt = (expressions: string[], answers: string[]) => {
        setExpressions(expressions);
        setCorrectAnswers(answers);
        setTimeout(5);
        navigate("/exercise");
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
                <Route path="/" element={
                    <Main onGeneratedExcersizeNavigated={generatedExcersizeNavigated}
                        onExcersizeBuilderNavigated={excersizeBuilderNavigated} />
                } />
                <Route path="/exercise-setup" element={<ExerciseSetup onStart={generatedExerciseStarted} onCancel={finished} />} />
                <Route path="/builder" element={<ExerciseBuilder onBuilt={excersiseBuilt} onCancel={finished} />} />
                <Route path="/exercise" element={<Exercise timeout={timeout} expressions={expressions} onFinish={exerciseFinished} />} />
                <Route path="/results" element={<Results
                    expressions={expressions}
                    duration={duration}
                    answers={answers}
                    correctAnswers={correctAnswers}
                    onReplay={() => navigate("/exercise")}
                    onFinished={finished} />}
                />
            </Routes>
        </Container>
    );
}
