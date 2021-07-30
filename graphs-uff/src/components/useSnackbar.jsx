import { useSnackbar as useSnackbarNotistack } from 'notistack';

const useSnackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbarNotistack();

  const successSnack = (message, options = {}) => {
    enqueueSnackbar(message, { variant: 'success', ...options });
  };

  const errorSnack = (message) => {
    enqueueSnackbar(message, { variant: 'error' });
  };

  const warnSnack = (message) => {
    enqueueSnackbar(message, { variant: 'warning' });
  };

  const copySnack = (message) => {
    enqueueSnackbar(message, {
      variant: 'default',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    });
  };

  return {
    closeSnackbar,
    successSnack,
    errorSnack,
    warnSnack,
    copySnack,
  };
};

export default useSnackbar;
