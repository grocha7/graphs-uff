import React from 'react';
import { Grid, Typography, TextField, FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// import clsx from 'clsx';
// import { BiDownArrow } from 'react-icons/bi';

// const CustomExpandMore = withStyles(
//   iconStyles
// )(({ className, classes, ...rest }) => (
//   <BiDownArrow size={24} className={clsx(className, classes.selectIcon)} />
// ));
const useStyles = makeStyles({
  root: ({ width, height, minHeight }) => ({
    '& .MuiOutlinedInput-root': {
      width,
      height: height ? height + 5 : 'auto',
      minHeight,
      display: 'flex',
      flexWrap: 'wrap',
      borderRadius: 0,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: '1.5px solid #000000',
    },

    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: '1px solid #000000',
    },

    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: '2px solid #000000',
    },
    '& .MuiOutlinedInput-inputAdornedStart': {
      marginLeft: 35,
    },
  }),
  menuPaper: {
    maxHeight: 300,
  },
  defaultValue: () => ({
    color: 'rgba(0, 0, 0, 0.38)',
  }),
});

const TextInput = ({
  field,
  width,
  height,
  placeholder,
  onChange,
  value,
  type,
  colorTextField,
  marginTop,
  background,
  marginRight,
  money,
  comments,
  select,
  options,
  response,
  step,
  multiline = false,
  error,
  helperText,
  defaultValue,
  minHeight,
  information,
  rows,
  autofocus,
  InputProps,
  disabled,
  maxWidth,
  blur,
  focus,
  label,
}) => {
  const classes = useStyles({ width, height, minHeight });

  return (
    <Grid
      style={{
        width,
        height,
        marginTop,
        marginRight,
        minHeight,
        maxWidth,
      }}
    >
      <Grid>
        <Typography
          style={{
            color: colorTextField || '#5b5b5b',
            marginTop: field ? 0 : 24,
            marginBottom: multiline ? 8 : select && 12,
            fontSize: 12,
          }}
        >
          {field}
        </Typography>
      </Grid>
      {/* <Grid container>
          <Grid>
            <Typography
              style={{
                color: colorTextField || '#f2f2f2',
                marginTop: field ? 0 : 24,
              }}
            >
              {field}
            </Typography>
          </Grid>
          {information && (
            <Grid style={{ marginLeft: 30 }}>
              <Tooltip title={information}>
                <div>
                  <Image src="/assets/information.png" width={20} height={20} />
                </div>
              </Tooltip>
            </Grid>
          )}
        </Grid> */}
      {!select ? (
        <TextField
          className={classes.root}
          variant={multiline ? 'outlined' : 'standard'}
          style={{
            width,
            height,
            background: background || '#ffffff',
            borderRadius: 4,
          }}
          value={!money ? value : `R$ ${value},00`}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          autoFocus={autofocus}
          inputProps={{ step }}
          multiline={multiline}
          error={error}
          fullWidth
          rows={rows}
          helperText={error && helperText}
          InputProps={InputProps}
          label={label}
          disabled={disabled}
          // autoComplete="new-password"
          onFocus={focus}
          onBlur={blur}
        />
      ) : (
        <>
          <Select
            className={classes.root}
            style={{
              width,
              height,
              background: background || '#ffffff',
              borderRadius: width > 100 && 0,
            }}
            value={value}
            onChange={onChange}
            variant="outlined"
            placeholder={placeholder}
            // error={error}
            disabled={disabled}
            // IconComponent={CustomExpandMore}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
              classes: { paper: classes.menuPaper },
            }}
          >
            {defaultValue && (
              <MenuItem value={0}>
                <div className={classes.defaultValue}>{defaultValue}</div>
              </MenuItem>
            )}
            {options &&
              options.map((item, index) => (
                <MenuItem
                  // eslint-disable-next-line no-nested-ternary
                  value={response ? item.id : item}
                >
                  <Typography
                    style={{
                      fontWeight: item === 'Criar nova empresa' && 'bold',
                    }}
                  >
                    {response ? item.name : item}
                  </Typography>
                </MenuItem>
              ))}
          </Select>
          {error && (
            <FormHelperText style={{ color: '#f44366' }}>
              {helperText}
            </FormHelperText>
          )}
        </>
      )}
      {comments && (
        <Typography
          style={{
            fontSize: 12,
            letterSpacing: '0.04em',
            color: '#061B3A',
            marginTop: 8,
          }}
        >
          {comments}
        </Typography>
      )}
    </Grid>
  );
};

export default TextInput;
