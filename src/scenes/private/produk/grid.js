import React, {useState , useEffect} from 'react'

// import material -ui
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import ImageIcon from "@material-ui/icons/Image";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";


// mport style
import useStyles from './style/grid';

//import component 
import AddDialog from "./add";
import AppLoading from "../../../components/AppLoading";

//firebase hook
import { useFirebase } from "../../../components/FirebaseProvider";
import {useCollection} from 'react-firebase-hooks/firestore';

//import helper
import { currency } from "../../../helpers/formatter";

//import react router
import { Link } from 'react-router-dom';


export default function GridProduk() {

    const classes = useStyles();
    const { firestore , user, storage } = useFirebase();
    const produkCol = firestore.collection(`toko/${user.uid}/produk`);
    const [snapshot , loading] = useCollection(produkCol);
    const [produkItems, setProdukItems] = useState([]);

    const [openAddDialog, setOpenAddDialog] = useState(false);

    useEffect(()=>{

        if(snapshot){
            setProdukItems(snapshot.docs);
        }

    },[snapshot]);

    const handleDelete = produkDoc => async e => {
        if(window.confirm(`Anda yakin menghapus data ini ? `)){
            await produkDoc.ref.delete();
            const fotoUrl = produkDoc.data().foto;
            if(fotoUrl) {
                await storage.refFromURL(fotoUrl).delete();
            }
        }
    }

    if(loading){
        return <AppLoading />
    }

    return (
        <div>
          <Typography variant="h5" component="h1">Daftar Produk</Typography>

          {
              produkItems.length <= 0 &&
              <Typography>Belum ada data produk</Typography>
          }

      
          <Grid container spacing={5}>

              {
                  produkItems.map((produkDoc)=>{

                    const produkData = produkDoc.data();
                    return  <Grid key={produkData.id} item={true} xs={12} sm={12} md={6} lg={4}>
                            <Card className={classes.card}>
                                {
                                    produkData.foto &&
                                    <CardMedia className={classes.foto}
                                        image={produkData.foto}
                                        title={produkData.nama}
                                    />
                                }

                                {
                                    !produkData.foto &&
                                    <div className={classes.fotoPlaceholder}>
                                        <ImageIcon />
                                    </div>
                                }
                                <CardContent className={classes.produkDetails}>
                                     <Typography variant="h5" noWarp>{produkData.nama}</Typography>
                                     <Typography variant="subtitle1"> Harga : {currency(produkData.harga)}</Typography>
                                     <Typography > Stock : {produkData.stock}</Typography>
                                </CardContent>
                                <CardActions className={classes.produkActions}>
                                    <IconButton component = {Link} to={`/produk/edit/${produkDoc.id}`}>
                                         <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={handleDelete(produkDoc)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                   
                                </CardActions>
                            </Card>

                        </Grid>

                  })
              }
         
          </Grid>
            <Fab
                className={classes.fab}
                color ="primary"
                onClick={(e) => {
                    setOpenAddDialog(true);
                }}
            >
                <AddIcon />
            </Fab>

            <AddDialog
                open={openAddDialog}
                handleClose={()=>{
                    setOpenAddDialog(false);
                }}
            />
        </div>
    )
}
