import React from "react";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import { Button, Container } from "@mui/material";
import { Exercise as ExercisePage, ExerciseBuilder, ExerciseSetup, Results } from "./pages";
import { useEffect, useState } from "react";
import { Main } from "./pages/Main";
import { GenerateExpressionsConfig } from "./services";
import { CoreController } from "./controllers";
import { EMPTY_EXERCISE, Exercise } from "./models";
import { SubmitIssueBtn } from "./components";

export function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [exercise, setExercise] = useState<Exercise>(EMPTY_EXERCISE);
    const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
    const [timeout, setTimeout] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const generatedExerciseStarted = async (config: GenerateExpressionsConfig) => {
        navigate("/");
        try {
            const { problems, answers } = await CoreController.GenerateExpressions(config);

            setTimeout(config.timeout);
            setExercise({ ...exercise, problems, answers: [] });
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
        setExercise(EMPTY_EXERCISE);
        navigate("/builder");
    }

    const exerciseFinished = (duration: number, answers: string[]) => {
        setDuration(duration);
        setExercise({ ...exercise, answers });
        navigate("/results");
    }

    const finished = () => {
        navigate("/");
    }

    const exerciseSelected = (exercise: Exercise) => {
        setExercise(exercise);
        setCorrectAnswers(exercise.answers);
        setTimeout(exercise.timeout);
        navigate("/exercise");
    }

    const handleExerciseEdit = (exercise: Exercise) => {
        setExercise(exercise);
        setCorrectAnswers(exercise.answers);
        setTimeout(exercise.timeout);
        navigate("/builder");
    }

    useEffect(() => {
        if (location.pathname !== "/") {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        setExercise(EMPTY_EXERCISE);
    }, []);

    useEffect(() => {
        if (import.meta.env.MODE === 'production') {
            const handleKeyDown = (event) => {
                // Disable F12 (Inspect Element)
                if (event.key === 'F12') {
                    event.preventDefault();
                    return false;
                }

                // Disable F5 (Refresh)
                if (event.key === 'F5' || (event.ctrlKey && (event.key === 'r' || event.key === 'R'))) {
                    event.preventDefault();
                    return false;
                }
            };

            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }

        return () => { }; // Empty cleanup function for non-production environments
    }, []);

    return (
        <>
            <SubmitIssueBtn></SubmitIssueBtn>

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
                            onExerciseSelected={exerciseSelected}
                            onExerciseEdit={handleExerciseEdit}
                        />
                    } />
                    <Route path="/exercise-setup" element={<ExerciseSetup onStart={generatedExerciseStarted} onCancel={finished} />} />
                    <Route path="/builder" element={<ExerciseBuilder exercise={exercise} onCancel={finished} />} />
                    <Route path="/exercise" element={<ExercisePage timeout={timeout} problems={exercise.problems} onFinish={exerciseFinished} />} />
                    <Route path="/results" element={
                        <Results
                            problems={exercise.problems}
                            duration={duration}
                            answers={exercise.answers}
                            correctAnswers={correctAnswers}
                            onReplay={() => navigate("/exercise")}
                            onFinished={finished}
                        />}
                    />
                </Routes>
            </Container>
        </>
    );
}
