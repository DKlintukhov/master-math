import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Button, Container } from "@mui/material";
import { Exercise, ExerciseBuilder, ExerciseSetup, Results } from "./pages";
import { useEffect, useState } from "react";
import { ExerciseConfig, Expression, Response } from "./models";
import { Main } from "./pages/Main";

export function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [expressions, setExpressions] = useState<Expression[]>([]);
    const [answers, setAnswers] = useState<number[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
    const [timeout, setTimeout] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const generatedExerciseStarted = async (config: ExerciseConfig, timeout: number) => {
        navigate("/");
        try {
            const json = await window.webui.call('GenerateExpressions', JSON.stringify(config));
            const { error, expressions, answers } = JSON.parse(json) as Response;
            if (error) {
                throw error;
            }

            setTimeout(timeout);
            setExpressions(expressions);
            setCorrectAnswers([...answers]);
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

    const exerciseFinished = (duration: number, answers: number[]) => {
        setDuration(duration);
        setAnswers([...answers]);
        navigate("/results");
    }

    const finished = () => {
        navigate("/");
    }

    const mainNaviaged = () => {
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
                <Route path="/" element={
                    <Main onGeneratedExcersizeNavigated={generatedExcersizeNavigated}
                        onExcersizeBuilderNavigated={excersizeBuilderNavigated} />
                } />
                <Route path="/exercise-setup" element={<ExerciseSetup onStart={generatedExerciseStarted} onCancel={finished} />} />
                <Route path="/builder" element={<ExerciseBuilder onCancel={finished} />} />
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
