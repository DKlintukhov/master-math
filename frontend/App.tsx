import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import { Exercise as ExercisePage, ExerciseBuilder, ExerciseSetup, Results } from "./pages";
import { useEffect, useState } from "react";
import { Main } from "./pages/Main";
import { GenerateExpressionsConfig } from "./services";
import { CoreController } from "./controllers";
import { Exercise } from "./models";

export function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [problems, setProblems] = useState<string[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
    const [timeout, setTimeout] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const generatedExerciseStarted = async (config: GenerateExpressionsConfig) => {
        navigate("/");
        try {
            const { problems, answers } = await CoreController.GenerateExpressions(config);

            setTimeout(config.timeout);
            setProblems(problems);
            setCorrectAnswers(answers);
            navigate("/exercise");
        } catch (e) {
            console.error(e);
        }
    }

    const exerciseSetupNavigate = () => {
        navigate("/exercise-setup");
    }

    const exerciseBuilderNavigated = () => {
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

    const excersiseBuilt = ({ timeout, problems, answers }: Exercise) => {
        setProblems(problems);
        setCorrectAnswers(answers);
        setTimeout(timeout);
        navigate("/exercise");
    }

    const excersiseSaved = async (exercise: Exercise) => {
        try {
            await CoreController.SaveExercise(exercise);
        } catch (error) {
            console.error(error);
        }
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
                    <Main
                        onExerciseSetupNavigate={exerciseSetupNavigate}
                        onExerciseBuilderNavigate={exerciseBuilderNavigated}
                        onExerciseSelected={excersiseBuilt}
                    />
                } />
                <Route path="/exercise-setup" element={<ExerciseSetup onStart={generatedExerciseStarted} onCancel={finished} />} />
                <Route path="/builder" element={<ExerciseBuilder onBuilt={excersiseBuilt} onSave={excersiseSaved} onCancel={finished} />} />
                <Route path="/exercise" element={<ExercisePage timeout={timeout} problems={problems} onFinish={exerciseFinished} />} />
                <Route path="/results" element={
                    <Results
                        problems={problems}
                        duration={duration}
                        answers={answers}
                        correctAnswers={correctAnswers}
                        onReplay={() => navigate("/exercise")}
                        onFinished={finished}
                    />}
                />
            </Routes>
        </Container>
    );
}
