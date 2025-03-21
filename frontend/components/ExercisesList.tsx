import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    ListSubheader,
    IconButton,
    Box,
    Divider,
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
    const sorted = exercises.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <List style={{
            width: "100%",
            height: "100%",
        }}
            subheader={
                <ListSubheader sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Доступные упражнения
                </ListSubheader>
            }
        >
            {sorted.map((exercise, id) => (
                <>
                    <ListItem
                        key={id}
                        style={{ minWidth: "400px" }}
                        secondaryAction={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    title="Изменить упражнение"
                                    onClick={() => onEdit(exercise)}
                                    size="small"
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    title="Удалить упражнение"
                                    onClick={() => onDelete(exercise)}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        }
                        disablePadding
                    >
                        <ListItemButton onClick={() => onExerciseSelected(exercise)}>
                            <ListItemText primary={exercise.name} />
                        </ListItemButton>
                    </ListItem>
                    <Divider/>
                </>
            ))}
        </List>
    );
};
