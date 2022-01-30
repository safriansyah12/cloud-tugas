import React,{useState} from 'react';
import PropTypes from 'prop-types'


//material -ui 
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

//import firebase hook
import { useFirebase } from "../../../components/FirebaseProvider";

//import router
import {withRouter} from 'react-router-dom'

function AddDialog({history, open, handleClose}) {

    const {firestore , user} = useFirebase();
    const produkCol = firestore.collection(`toko/${user.uid}/produk`)

    const [nama, setNama] = useState('');

    const [error, setError] = useState('');

    const [isSubmitting, setSubmitting] = useState(false);

  

    const handleSimpan = async (e) => {

        setSubmitting(true);
        try{

            if (!nama) {
                throw new Error('Nama Produk harus diisi');
            }

            const produkBaru = await produkCol.add({nama});

            history.push(`produk/edit/${produkBaru.id}`)

        } catch(e){

            setError(e.message);
        }
        setSubmitting(false);

    }
    return (
        <div>
            <Dialog open={open} 
            onClose={handleClose}
            disableEscapeKeyDown={isSubmitting}
            disableBackdropClick={isSubmitting}
            >
                <DialogTitle>Buat Produk Baru</DialogTitle>
                <DialogContent dividers>
                    <TextField 
                        id="nama"
                        label = "Nama Produk"
                        value={nama}
                        onChange={(e) => {
                            setNama(e.target.value);
                        }}
                        helperText={error}
                        error={error?true:false}
                        disabled={isSubmitting}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                    disabled={isSubmitting}
                    onClick={handleClose}
                    >Batal</Button>
                    <Button onClick={handleSimpan} color="primary">Simpan</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

AddDialog.propTypes = {
    open : PropTypes.bool.isRequired,
    handleClose : PropTypes.func.isRequired
}

export default withRouter(AddDialog);