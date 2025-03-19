import React from "react";
import { Button } from "@mui/material";

export function SubmitIssueBtn() {
    return (
        <Button
            style={{
                position: "static"
            }}
            component="a"
            href="https://github.com/DKlintukhov/master-math/issues/new"
            target="_blank"
            rel="noopener noreferrer"
        >
            Сообщить о проблеме
        </Button>
    );
}
