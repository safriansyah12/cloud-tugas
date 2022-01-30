import React from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'


// import style s
import useStyles from "./style"


export default function NotFound() {

    const classes = useStyles();

    return (
     <Container maxWidth="xs">
         <Paper className={classes.paper}>
             <Typography variant="subtitile1">
                Halaman Tidak Ditemukan
             </Typography>
             <Typography variant="h3">
                404
             </Typography>
            <Typography component={Link} to="/">
                Kembali Ke Beranda
             </Typography>
         </Paper>
     </Container>
    )
}

