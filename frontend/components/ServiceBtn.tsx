import React from "react";
import { Button } from "@mui/material";

interface Props {
    href: string;
    label: string;
}

export function ServiceBtn({ href, label }: Props) {
    return (
        <Button
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
        >
            {label}
        </Button>
    );
}
