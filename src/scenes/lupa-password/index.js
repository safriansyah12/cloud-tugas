import React, {useState} from 'react'
// import style from './index.module.css'

//import komponen ui
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import AppLoading from '../../components/AppLoading'

//import validasi 
import isEmail from 'validator/lib/isEmail'


//imp react router
import { Link, Redirect } from 'react-router-dom'

//import firebase hook
import { useFirebase } from "../../components/FirebaseProvider";

//import style 
import useStyles from "./style";

//notistack hook
import {useSnackbar} from 'notistack'


export default function LupaPassword() {

    const classes = useStyles();

    const [form, setform] = useState({
        email : '',
       
      
    });


    const [error, setError] = useState({
        email : '',
       
      
    });

    const [isSubmitting, setSubmitting] = useState(false);

    const {auth , user , loading} = useFirebase();

    const {enqueueSnackbar} = useSnackbar();

    const handleChange = e =>{
        setform({
            ...form,
            [e.target.name] : e.target.value
        });

        setError({
            ...error,
            [e.target.name]:''
        });
    }

    const validate = ()=>{
        const newError = {...error};

        if (!form.email) {
            newError.email = "Email wajib diisi";
        } else if(!isEmail(form.email)) {
            newError.email = "Email tidak valid";
        }

     

        return newError;
    }

   const handleSubmit = async e=>{
        e.preventDefault();
        const findErros = validate();

        if (Object.values(findErros).some(err => err != '')) {
            setError(findErros);
        } else {

            try{
                setSubmitting(true);
                const actionCodeSettings ={
                    url : `${window.location.origin}/login`
                }
            await auth.sendPasswordResetEmail(form.email, actionCodeSettings);
            enqueueSnackbar(`Cek kotak masuk email : ${form.email}, sebuah tautan reset email sudah dikirim`,{
                variant:`success`
            })
            setSubmitting(false);
            } catch(e){
                const newErrors = {};

                switch (e.code) {
                    case 'auth/user-not-found':
                        newErrors.email = 'Email tidak terdaftar';
                        break;

                    case 'auth/invalid-email':
                        newErrors.email = 'Email tidak valid';
                        break;

                    default:
                        newErrors.email = e.message;
                        break;
                }

                setError(newErrors);
                setSubmitting(false);
            }

        }

    }
    
    if (loading) {
        return <AppLoading />
    }

    if (user) {
        return <Redirect to="/" />
    }


  //  console.log(form.password.length);
    return (
      <Container maxWidth="xs">
          <Paper className={classes.paper}>
            <Typography
            variant="h5"
            component="h1"
            className={classes.title}>Halaman Lupa Password</Typography>

            <form onSubmit={handleSubmit} noValidate>
                
                <TextField 
                    id="email"
                    type="email"
                    name="email"
                    margin="normal"
                    label="Alamat Email"
                    fullWidth
                    required
                    value={form.email}
                    onChange={handleChange}
                    helperText ={error.email}
                    error={error.email?true:false}
                    disabled={isSubmitting}
                />

              

                <Grid container className={classes.buttons}>
                    <Grid item xs>
                        <Button type="submit"
                            color="primary"
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                            >Kirim</Button>
                    </Grid>

                    <Grid item>
                        <Button 
                            variant="contained"
                            size="large" component={Link} to="/login">Login</Button>
                    </Grid>
                </Grid>
            </form>
       
        </Paper>
        </Container>
    )
}



