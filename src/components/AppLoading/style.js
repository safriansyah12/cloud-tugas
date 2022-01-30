import { makeStyles} from '@material-ui/styles'


const useStyles= makeStyles(theme=>({

    title :{
        textAlign :"center",
        color : theme.palette.primary.main
    },

    loadingBox :{
        display : 'flex',
        flexDirection:'column',
        justifyContent:'center',
        height:'100vh'
    }

}))


export default useStyles;
