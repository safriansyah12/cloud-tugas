import { makeStyles} from '@material-ui/styles'


const useStyles= makeStyles(theme=>({

    blue : {
        //color : "red"

        color : theme.palette.primary.main
    },
    paper : {
        marginTop : theme.spacing(8),
        padding : theme.spacing(6)
    },
    title :{
        textAlign :"center",
        marginBottom : theme.spacing(3)
    },
    buttons : {
        marginTop : theme.spacing(6)
    }


}))


export default useStyles;
