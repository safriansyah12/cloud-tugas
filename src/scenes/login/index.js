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


export default function Login(props) {

    const classes = useStyles();

    const {location}= props;

    const [form, setform] = useState({
        email : '',
        password : '',
      
    });


    const [error, setError] = useState({
        email : '',
        password : '',
      
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
                await auth.signInWithEmailAndPassword(form.email, form.password)

            } catch(e){
                const newErrors = {};

                switch (e.code) {
                    case 'auth/user-not-found':
                        newErrors.email = 'Email tidak terdaftar';
                        break;

                    case 'auth/invalid-email':
                        newErrors.email = 'Email tidak valid';
                        break;

                    case 'auth/wrong-password':
                        newErrors.password = 'Password salah';
                        break;

                    case 'auth/user-disabled':
                        newErrors.email = 'Pengguna diblokir';
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
        const redirectTo = location.state && location.state.from && 
        location.state.from.pathname ? location.state.from.pathname : '/';
        return <Redirect to={redirectTo} />
    }


    console.log(form.password.length);
    return (
      <Container maxWidth="xs">
          <Paper className={classes.paper}>
            <Typography
            variant="h5"
            component="h1"
            className={classes.title}>Halaman Login</Typography>

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


                <Grid container className={classes.buttons}>
                    <Grid item xs>
                        <Button type="submit"
                            color="primary"
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                            >Login</Button>
                    </Grid>

                    <Grid item>
                        <Button 
                            variant="contained"
                            size="large" component={Link} to="/register">Daftar</Button>
                    </Grid>
                </Grid>

                <div className={classes.forgotPassword}>
                <Typography component={Link} to="/lupa-password">Lupa Password ?</Typography></div>
            </form>
       
        </Paper>
        </Container>
    )
}



