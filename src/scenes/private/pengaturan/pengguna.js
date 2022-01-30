import React,{useRef, useState} from 'react'

//material -ui 
import TextField from '@material-ui/core/TextField'
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

//  firebase hook
import { useFirebase } from "../../../components/FirebaseProvider";

//import notifikasi
import {useSnackbar} from 'notistack'

//import validator
import isEmail from 'validator/lib/isEmail'

//import style
import useStyles from './style/pengguna'

export default function Pengguna() {

    const { user } = useFirebase();
    const [error, setError] = useState({
        displayName : '',
        email : '',
        password: ''

    });

    const classes = useStyles();

    const displayNameRef =  useRef();
    const emailRef =  useRef();
    const passwordRef =  useRef();

    const [isSubmitting, setSubmitting] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const saveDisplayName = async (e)=>{
        const displayName = displayNameRef.current.value;
        console.log(displayName)

        if (!displayName) {
            setError({
                displayName : "Nama harus diisi !"
            })
        } else if(displayName !== user.displayName){

            setError({
                displayName : ''
            })

            setSubmitting(true);
            await user.updateProfile({
                displayName
            });
            setSubmitting(false);
            enqueueSnackbar('Data pengguna berhasil diupdate', {variant : 'success'});
        }

       
    }

    const updateEmail = async (e)=>{
        const email = emailRef.current.value;

        if (!email) {
            setError({
                email : 'Email harus diisi !'
            })
        } else if(!isEmail(email)) {

            setError({
                email : 'Email tidak valid'
            })
        } else if(email !== user.email){


            setError({
                email : ''
            })

            setSubmitting(true);
           
            try {

                await user.updateEmail(email);
                enqueueSnackbar("Email berhasil diupdate ", {variant:'success'});

            } catch(e){
               
                let emailError = '';

                switch (e.code) {
                    case 'auth/email-already-in-use':
                        emailError="Email sudah digunakan user lain";
                        break;

                    case 'auth/invalid-email':
                        emailError="Email tidak valid";
                        break;

                     case 'auth/requires-recent-login':
                        emailError="Silahkan logout kemudian login kembali untuk update email";
                        break;
                
                    default:
                        emailError= e.message;
                        break;
                }

                setError({
                    email : emailError
                })

            }

            setSubmitting(false);
        }
    }


    const sendEmailVerification = async (e)=>{

        const actionCodeSettings ={
            url : `${window.location.origin}/login`
        };

        setSubmitting(true);
        await user.sendEmailVerification(actionCodeSettings);
        enqueueSnackbar(`Email verifikasi berhasil dikirim ke ${emailRef.current.value}`,{variant : "success"});

        setSubmitting(false);

    }

    const updatePassword = async (e)=>{
            const password = passwordRef.current.value;

            if (!password) {

                setError({

                    password : "Password harus diisi !"
                })
                
            } else {
                
                setSubmitting(true);
                try{

                    await user.updatePassword(password);

                    enqueueSnackbar("Password berhasil diupdate", {variant :"success"});


                } catch(e){

                    let errorPassword = "";

                    switch (e.code) {
                        case 'auth/weak-password':
                            errorPassword="Password Anda lemah";
                            break;
                        
                        case 'auth/requires-recent-login':
                            errorPassword="Silahkan logout kemudian login kembali untuk update password";
                            break;
                    
                        default:
                            errorPassword=e.message;
                            break;
                    }

                    setError({
                        password : errorPassword
                    })

                }
            }
    }

    return (
        <div className={classes.pengaturanPengguna}>
            <TextField 
                id="displayName"
                name="displayName"
                label="Nama"
                margin="normal"
                defaultValue={user.displayName}
                inputProps={{
                    ref : displayNameRef,
                    onBlur: saveDisplayName,
                }}
                disabled={isSubmitting}
                helperText={error.displayName}
                error={error.displayName ? true : false}
            />

            <TextField 
                id="email"
                name ="email"
                label = "Email"
                type="email"
                margin="normal"
                defaultValue={user.email}
                inputProps={{
                    ref : emailRef,
                    onBlur: updateEmail,
                }}
                disabled={isSubmitting}
                helperText={error.email}
                error={error.email ? true : false}

            />
            {
                user.emailVerified?
                <Typography variant="subtitle1" color="primary">
                    Email sudah terverifikasi
                </Typography>
                :
                <Button
                variant="outlined"
                onClick={sendEmailVerification}
                disabled={isSubmitting}
                >
                    Kirim email verifikasi
                </Button>
            }
            <TextField 
                id="password"
                name="password"
                type="password"
                label="Password Baru"
                margin="normal"
                inputProps={{
                    ref :passwordRef,
                    onBlur: updatePassword
                }}
                autoComplete="new-password"
                disabled={isSubmitting}
                helperText={error.password}
                error={error.password ? true : false}
            
            />

          
        </div>
    )
}
