import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    },
    palette: {
        primary: {
            main: '#108ba7'
        },
        common:{
            white: '#fff'
        },
        secondary:{
            main: '#e53935'
        }        
    },
    spacing: 10
});

export default theme;