import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    ListSubheader,
} from '@mui/material';
import { Exercise } from '../models';

interface Props {
    exercises: Exercise[];
    onExerciseSelected: (exercise: Exercise) => void;
}

export function ExercisesList({ exercises, onExerciseSelected }: Props) {

    return (
        <List
            subheader={
                <ListSubheader component="div">
                    Доступные упражнения
                </ListSubheader>
            }
        >
            {exercises.map((exercise, id) => (
                <ListItem key={id}>
                    <ListItemButton onClick={() => onExerciseSelected(exercise)}>
                        <ListItemText primary={exercise.name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};
