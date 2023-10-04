import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import * as colors from './colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: colors.PRIMARY_COLOR,
      // dark: will be calculated from palette.primary.main,
      contrastText: colors.WHITE_COLOR,
    },
    secondary: {
      // light: will be calculated from palette.primary.main,
      main: '#f44336',
      // dark: will be calculated from palette.primary.main,
      contrastText: '#f44336',
    },
    light: {
      // light: will be calculated from palette.primary.main,
      main: colors.WHITE_COLOR,
      // dark: will be calculated from palette.primary.main,
    //   contrastText: CONSTANTS.CONTRAST_TEXT,
    },
  },

});

export default function Theme(props) {
  return (
    <ThemeProvider theme={theme}>
      {props.children}
    </ThemeProvider>
  );
}