import { Dialog, DialogActions, Button, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import React, { useState, useEffect } from 'react'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
  

const AlertDialog = ({ open, handleClose, message }) => {

    const [openDialog, setOpenDialog] = useState(open ? open : false)

    const handleModalClose = () => {
        if(handleClose) handleClose();
        else {
            setOpenDialog(false)
        } 
    }

    useEffect(() => {
        setOpenDialog(open)
    }, [open])

    return (
        <Dialog
            open={openDialog}
            TransitionComponent={Transition}
            keepMounted
            disableBackdropClick
            disableEscapeKeyDown
            onClose={() => handleModalClose()}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Successful"}</DialogTitle>

            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {message}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                {/* <Button onClick={() => handleModalClose() } color="primary">
                    Disagree
                </Button> */}
                <Button onClick={() => handleModalClose() } color="primary">
                    Okay
                </Button>
            </DialogActions>
        </Dialog>
    )   
}

export default AlertDialog
