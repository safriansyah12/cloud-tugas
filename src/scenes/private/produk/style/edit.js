import { makeStyles} from '@material-ui/styles'


const useStyles= makeStyles(theme=>({

        hideInputFile :{
            display :'none'
        },
        uploadFotoProduk : {
            padding : theme.spacing(3),
            textAlign : "center"
        },
        previewFoto : {
            width :"100%",
            height : "auto"
        },
        iconRight : {
            marginLeft : theme.spacing(1)
        },
        iconLeft : {
            marginRight : theme.spacing(1)
        },
        actionButton : {
            paddingTop : theme.spacing(2)
        }

}))


export default useStyles;
