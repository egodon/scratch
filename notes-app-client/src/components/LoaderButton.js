import React from 'react';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
import './LoaderButton.css';

const styles = () => ({
  root: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

const LoaderButton = ({
  isLoading,
  text,
  loadingText,
  className = '',
  disabled = false,
  ...props
}) => (
  <Button
    variant={!isLoading ? 'raised' : 'flat'}
    color={!isLoading ? 'primary' : 'default'}
    className={`LoaderButton ${props.classes.root} ${className}`}
    disabled={disabled}
    {...props}
  >
    {isLoading && <CircularProgress size={20} />}
    {!isLoading ? text : loadingText}
  </Button>
);

export default withStyles(styles)(LoaderButton);
