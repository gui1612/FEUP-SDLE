import { IconButton, Snackbar } from '@mui/material';
import { Share } from '@mui/icons-material';
import { useState } from 'react';

const CopyToClipboardButton = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(window.location.toString());
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Share />
      </IconButton>

      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
    </>
  );
};

export default CopyToClipboardButton;
