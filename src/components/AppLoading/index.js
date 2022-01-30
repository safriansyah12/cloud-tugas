import React from 'react'

import Container from "@material-ui/core/Container";
import LinierProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import useStyles from  "./style.js";

export default function AppLoading() {

    const  classes = useStyles();
    return (
        <Container maxWidth="xs">
            <div className={classes.loadingBox}>
                <Typography
                variant="h6"
                component="h2"
                className={classes.title}
                >
                    Aplikasi Penjualan Loading ...
                </Typography>
                <LinierProgress />
            </div>

        </Container>
    )
}
