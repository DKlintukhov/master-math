import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { ExpressionInputControl } from "../components";

interface Props {
    onBuilt: (expressions: string[], answers: string[]) => void;
    onCancel: () => void;
}

export function ExerciseBuilder({ onBuilt, onCancel }: Props) {
    const [expression, setExpression] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [expressions, setExpressions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);

    const expressionAdded = () => {
        setExpressions([...expressions, expression]);
        setAnswers([...answers, answer]);
        setExpression("");
        setAnswer("");
    }

    const expressionDeleted = () => {
        expressions.pop();
        answers.pop();
        setExpressions([...expressions]);
        setAnswers([...answers]);
    }

    const expressionChanged = (id, expression: string) => {
        expressions[id] = expression;
    }

    const answerChanged = (id: number, answer: string) => {
        answers[id] = answer;
    }

    const newExpressionChanged = (expr: string) => {
        setExpression(expr);
    }

    const newAnswerChanged = (answer: string) => {
        setAnswer(answer);
    }

    const started = () => {
        onBuilt(expressions, answers);
    }

    return (
        <Container style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            padding: "5px 0"
        }}>
            <div style={{
                alignContent: "center",
                overflowY: "auto",
                height: "100%"
            }}>
                <Container style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    padding: "5px 0",
                }}>
                    {expressions.map((expr, id) => (
                        <Container
                            key={id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr auto auto',
                                alignItems: 'center',
                                gridColumnGap: '10px',
                                padding: '8px',
                                width: "fit-content"
                            }}
                        >
                            <span>{id + 1}) </span>
                            <ExpressionInputControl
                                expression={expr}
                                readOnly={false}
                                answer={answers[id]}
                                onChange={(expr) => expressionChanged(id, expr)}
                                onAnswer={(answer) => answerChanged(id, answer)}>
                            </ExpressionInputControl>
                        </Container>
                    ))}
                    <Container
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr auto auto',
                            alignItems: 'center',
                            gridColumnGap: '10px',
                            padding: '8px',
                            width: "fit-content"
                        }}
                    >
                        <span>{expressions.length + 1}) </span>
                        <ExpressionInputControl
                            expression={expression}
                            readOnly={false}
                            answer={answer}
                            onChange={newExpressionChanged}
                            onAnswer={newAnswerChanged}>
                        </ExpressionInputControl>
                    </Container>
                    <Container style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "15px"
                    }}>
                        <Button variant="outlined" onClick={expressionDeleted} disabled={expressions.length < 1}>Удалить</Button>
                        <Button variant="outlined" onClick={expressionAdded} disabled={!expression}>Добавить</Button>
                    </Container>
                </Container>
            </div>

            <Container style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "15px",
                padding: '10px 0',
                height: "10%",
            }}>
                <Button variant="outlined" onClick={started} disabled={expressions.length < 1}>Сохранить</Button>
                <Button variant="outlined" onClick={started} disabled={expressions.length < 1}>Начать</Button>
                <Button variant="outlined" onClick={onCancel}>Назад</Button>
            </Container>
        </Container>
    );
}
