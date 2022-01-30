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


export default function Register() {

    const classes = useStyles();

    const [form, setform] = useState({
        email : '',
        password : '',
        ulangi_password :''
    });


    const [error, setError] = useState({
        email : '',
        password : '',
        ulangi_password :''
    });

    const [isSubmitting, setSubmitting] = useState(false);

    const {auth , user , loading} = useFirebase();

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

        if (!form.password) {
            newError.password = "Password wajid diisi";
        }else if(form.password.length < 5 ){
            newError.password = "Password minimal 6 karakter ";
        }

        if (!form.ulangi_password) {
            newError.ulangi_password = "Ulangi Password wajid diisi";
        } else if(form.ulangi_password !== form.password){
            newError.ulangi_password = "Ulangi Password tidak sama dengan password";
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
                await auth.createUserWithEmailAndPassword(form.email, form.password)

            } catch(e){
                const newErrors = {};

                switch (e.code) {
                    case 'auth/email-already-in-use':
                        newErrors.email = 'Email sudah terdaftar';
                        break;

                    case 'auth/invalid-email':
                        newErrors.email = 'Email tidak valid';
                        break;

                    case 'auth/weak-password':
                        newErrors.password = 'Password lemah';
                        break;

                    case 'auth/operation-not-allowed':
                        newErrors.email = 'Metode email dan password tidak mendukung';
                        break;

                    
                    case 'auth/operation-not-allowed':
                            newErrors.email = 'Metode email dan password tidak mendukung';
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


    console.log(form.password.length);
    return (
      <Container maxWidth="xs">
          <Paper className={classes.paper}>
            <Typography
            variant="h5"
            component="h1"
            className={classes.title}>Halaman Pendaftaran</Typography>

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

                <TextField 
                    id="password"
                    type="password"
                    name="password"
                    margin="normal"
                    label="Password"
                    fullWidth
                    required
                    value={form.password}
                    onChange={handleChange}
                    helperText ={error.password}
                    error={error.password?true:false}
                    disabled={isSubmitting}
                />

                <TextField 
                    id="ulangi_password"
                    type="password"
                    name="ulangi_password"
                    margin="normal"
                    label="Ulangi Password"
                    fullWidth
                    required
                    value={form.ulangi_password}
                    onChange={handleChange}
                    helperText ={error.ulangi_password}
                    error={error.ulangi_password?true:false}
                    disabled={isSubmitting}
                />  

                <Grid container className={classes.buttons}>
                    <Grid item xs>
                        <Button type="submit"
                            color="primary"
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                            >Daftar</Button>
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



