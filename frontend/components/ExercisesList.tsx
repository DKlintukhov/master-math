import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    ListSubheader,
    IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Exercise } from '../models';

interface Props {
    exercises: Exercise[];
    onEdit: (exercise: Exercise) => void;
    onDelete: (exercise: Exercise) => void;
    onExerciseSelected: (exercise: Exercise) => void;
}

export function ExercisesList({ exercises, onExerciseSelected, onEdit, onDelete }: Props) {

    return (
        <List style={{
            height: "30vh",
            width: "400px",
            overflow: "hidden auto"
        }}
            subheader={
                <ListSubheader component="div">
                    Доступные упражнения
                </ListSubheader>
            }
        >
            {exercises.map((exercise, id) => (
                <ListItem key={id}
                    secondaryAction={
                        <div>
                            <IconButton
                                edge="end"
                                aria-label="edit"
                                title="Изменить упражнение"
                                onClick={() => onEdit(exercise)}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                title="Удалить упражнение"
                                onClick={() => onDelete(exercise)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    }
                >
                    <ListItemButton onClick={() => onExerciseSelected(exercise)}>
                        <ListItemText primary={exercise.name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};
