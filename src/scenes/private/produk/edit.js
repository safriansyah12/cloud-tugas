import React ,{useState , useEffect , useRef}  from 'react'

//material -ui
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import UploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";

// firebase hook
import { useFirebase } from "../../../components/FirebaseProvider";
import { useDocument } from "react-firebase-hooks/firestore";


//import component 
import AppPageLoading from '../../../components/AppLoading';

//import notifikasi
import {useSnackbar} from 'notistack'

//import styles
import useStyles from "./style/edit";

//import react router dom
import { Prompt } from "react-router-dom";

export default function EditProduk({match}) {

    const {firestore, user, storage} = useFirebase();

    const produkDoc = firestore.doc(`toko/${user.uid}/produk/${match.params.produkId}`);
    const [snapshot , loading] = useDocument(produkDoc);
    const produkStorageRef = storage.ref(`toko/${user.uid}/produk`);

    const {enqueueSnackbar} = useSnackbar();

    const classes = useStyles();

    const [form, setForm] = useState({
        nama :'',
        sku : '',
        harga : 0,
        stock : 0,
        deskripsi : '',
        foto : ''
      
    });

    const [error, setError] = useState({
        nama :'',
        sku : '',
        harga : '',
        stock:'',
        deskripsi : '',
     
    });

    const [isSubmitting, setSubmitting] = useState(false);
    const [isSomethingChange, setSomethingChange] = useState(false);

    useEffect(()=>{
        if(snapshot){
            setForm(currentForm=>({...currentForm,...snapshot.data()}) );
        }
    }, [snapshot]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

        setError({
            ...error,
            [e.target.name] : ''
        })

        setSomethingChange(true);
    }

    const validate = ()=>{
        const newError = {...error};
        
        if(!form.nama){
            newError.nama = "Nama harus diisi";

        }

        if(!form.harga){
            newError.harga = "Harga harus diisi";

        }

        if(!form.stock){
            newError.stock = "Stock harus diisi";

        }

        return newError;


    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const findErrors = validate();

        if(Object.values(findErrors).some(err => err !== '')){

            setError(findErrors);

        }else{

            setSubmitting(true);
            try{

                await produkDoc.set(form,{merge:true});
                enqueueSnackbar("Data Produk berhasil disimpan", {variant : 'success'});
                setSomethingChange(false);

            } catch(e) {
                enqueueSnackbar(e.message, {variant : 'error'});
            }
            setSubmitting(false)

        }

    }

    const handleUploadFile = async (e) => {
        const file = e.target.files[0];

        console.log(file);

        if(!['image/jpeg','image/png'].includes(file.type)){
            setError(error => ({
                ...error,
                foto : `Tipe file tidak didukung : ${file.type}`
            }))
        } else if(file.size >= 512000) {

            setError(error => ({
                ...error,
                foto : `Ukuran terlalu besar melebihi 500kb`
            }))
        } else {

            const reader = new FileReader();

            reader.onabort = ()=>{
                setError(error => ({
                    ...error,
                    foto : `Proses pembacaan file dibatalkan`
                }))
            }

            reader.onerror = ()=>{
                setError(error => ({
                    ...error,
                    foto : `File tidak bisa dibaca`
                }))
                
            }

            reader.onload = async  ()=>{

                setError(error => ({
                    ...error,
                    foto : ``
                }))

                setSubmitting(true);

                try{

                    const fotoExt = file.name.substring(file.name.lastIndexOf('.'));

                    const fotoRef = produkStorageRef.child(`${match.params.produkId}${fotoExt}`);

                    const fotoSnapshot = await fotoRef.putString(reader.result,'data_url');

                    const fotoUrl = await fotoSnapshot.ref.getDownloadURL();

                    setForm(currentForm=>({
                        ...currentForm,
                        foto: fotoUrl
                    }))

                    setSomethingChange(true);

                } catch(e){

                    setError(error => ({
                        ...error,
                        foto : e.message
                    }))

                }

               setSubmitting(false);
            }

            reader.readAsDataURL(file);
        }
        
        
    }

    if(loading){
        return <AppPageLoading />
    }

    console.log(error);
    return (
        <div>
            <Typography variant="h5" component="h1">Edit Produk: {form.nama}</Typography>
            <Grid container alignItems="center" justiify="center">
                <Grid item xs={12} sm={6}>
                    <form id="produk-form" onSubmit={handleSubmit} noValidate>
                        <TextField 
                            id="nama"
                            name="nama"
                            label="Nama Produk"
                            margin="normal"
                            fullWidth
                            value={form.nama}
                            onChange={handleChange}
                            helperText={error.nama}
                            error={error.nama?true:false}
                            disabled={isSubmitting}
                        />

                        <TextField 
                            id="sku"
                            name="sku"
                            label="SKU Produk"
                            margin="normal"
                            fullWidth
                            value={form.sku}
                            onChange={handleChange}
                            helperText={error.sku}
                            error={error.sku?true:false}
                            disabled={isSubmitting}
                        />  

                        <TextField 
                            id="harga"
                            name="harga"
                            label="Harga Produk"
                            type="number"
                            margin="normal"
                            fullWidth
                            value={form.harga}
                            onChange={handleChange}
                            helperText={error.harga}
                            error={error.harga?true:false}
                            disabled={isSubmitting}
                        />


                    <TextField 
                            id="stock"
                            name="stock"
                            label="Stock Produk"
                            type="number"
                            margin="normal"
                            fullWidth
                            value={form.stock}
                            onChange={handleChange}
                            helperText={error.stock}
                            error={error.stock?true:false}
                            disabled={isSubmitting}
                        />

                    <TextField 
                            id="deskripsi"
                            name="deskripsi"
                            label="Deskripsi Produk"
                            margin="normal"
                            fullWidth
                            multiline
                            rowsMax={3}
                            value={form.deskripsi}
                            onChange={handleChange}
                            helperText={error.deskripsi}
                            error={error.deskripsi?true:false}
                            disabled={isSubmitting}
                        />          
                    </form>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div className={classes.uploadFotoProduk}>
                        { form.foto &&  
                        <img src={form.foto} className={classes.previewFoto} alt={`Foto Produk ${form.nama}`} /> }
                       
                        <input
                            className={classes.hideInputFile}
                            type="file"
                            id="upload-foto-produk"
                            accept="image/jpeg,image/png"
                            onChange={handleUploadFile}
                        />
                          <label htmlFor="upload-foto-produk">
                            <Button
                                disabled={isSubmitting}
                                component="span"
                                variant="outlined"
                            
                            >
                                Upload Foto Produk
                                <UploadIcon  className={classes.iconRight}/>
                            </Button>

                            {
                              
                                error.foto &&
                                    <Typography color="error">
                                        {error.foto}
                                    </Typography>

                            }
                          </label>
                    </div>
                  
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.actionButton}>
                        <Button
                            disabled={isSubmitting }
                            form="produk-form"
                            type="submit"
                            color="primary" 
                            variant="contained">
                            <SaveIcon className={classes.iconLeft}/>
                            Simpan
                        </Button>
                    </div>
                </Grid>
            </Grid>
            <Prompt 
                when={isSomethingChange}
                message="Terdapat perubahan yang belum disimpan, Apakah anda yakin meninggalkan halaman ?"
            />
        </div>
    )
}
