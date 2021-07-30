import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {Grid} from '@material-ui/core';
import Input from './TextInput';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({open, handleClose, linkColor, handleChangeDeleteLink, handleChangeColorLink, linkLabel}) {
const [color, setColor] = React.useState(linkColor)
const [label, setlabel] = React.useState(linkLabel)


  return (
    <div>
      
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">O que você deseja fazer?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Grid container alignItems='center'>
            <Input
                field="Cor"
                select
                options={['blue', 'yellow', 'green', 'purple', 'black', 'grey', 'pink']}
                onChange={event =>
                  setColor(event.target.value)
                }
                value={color}
                width={100}
                marginRight={20}
              />
              <Input
                field="Peso"
                onChange={event =>
                  setlabel(event.target.value)
                }
                value={label}
                width={50}
                marginRight={20}
              />
              <Button onClick={() => {
                handleChangeColorLink(color, label);
                handleClose();
              }} color="secondary">
           Salvar
          </Button>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => {
          handleChangeDeleteLink();
          handleClose();
        }} color="secondary">
            EXCLUIR LINK
          </Button>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}