import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  DialogContentText,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { invokeDeleteKeys } from "../../tauri/command";
import { useLoadingStore } from "../../state/store";
import { useDialogStore } from "../../state/store";
import { useConnectionInfoStore } from "../../state/store";
import {
  allyPropsDialogActions,
  allyPropsDialogTextField,
  allyPropsDialogContentText,
} from "../../utility/props";

type DeleteKeyDialogProps = {
  handleDisplayMsg: (msg: string) => void;
  handleHideContent: () => void;
};

export default function DeleteKeysDialog(props: DeleteKeyDialogProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [keysToDelete, setKeysToDelete] = useState<string[]>([""]);
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );
  const dbToUse = useConnectionInfoStore(
    (state) => state.connectionInfo.defaultDb,
  );
  const setIsOpen = useDialogStore((state) => state.setIsDeleteKeysDialogOpen);
  const isOpen = useDialogStore((state) => state.isDeleteKeysDialogOpen);

  const handleClose = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    setKeysToDelete([""]);
    setErrorMsg("");
  };

  const handleDeleteKeys = () => {
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    invokeDeleteKeys(dbToUse, keysToDelete)
      .then((result) => {
        handleClose();
        props.handleDisplayMsg(`Number of keys deleted: ${result}`);
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`DeleteKeys failed: ${err}`);
        props.handleHideContent();
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
      });
  };

  const inputChanged = (index: number, newValue: string) => {
    setKeysToDelete((prevKeys) => {
      const updatedKeys = [...prevKeys];
      updatedKeys[index] = newValue;
      return updatedKeys;
    });
  };

  const handleAddNewField = () => {
    setKeysToDelete((prevKeys) => [...prevKeys, ""]);
  };

  const handleRemoveField = (index: number) => {
    setKeysToDelete((prevKeys) => {
      const updatedKeys = [...prevKeys];
      updatedKeys.splice(index, 1);
      return updatedKeys;
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>DeleteKeys</DialogTitle>
      <DialogContent>
        <DialogContentText {...allyPropsDialogContentText()}>
          Specify the keys to delete.
        </DialogContentText>
        {keysToDelete.map((item, index) => (
          <TextField
            key={index}
            label="Key"
            name="key"
            value={item}
            onChange={(event) => inputChanged(index, event.target.value)}
            {...allyPropsDialogTextField()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveField(index)}
                    sx={{ "&:focus": { outline: "none" } }}
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        ))}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewField}
          sx={{ marginTop: "15px" }}
        >
          New Key
        </Button>
      </DialogContent>
      <Box
        sx={{ marginLeft: "25px", marginRight: "25px", marginBottom: "10px" }}
      >
        {errorMsg !== "" ? (
          <Typography sx={{ marginTop: "15px" }}>{errorMsg}</Typography>
        ) : (
          <></>
        )}
      </Box>
      <DialogActions {...allyPropsDialogActions()}>
        <Button variant="contained" onClick={handleDeleteKeys}>
          Ok
        </Button>
        <Button variant="outlined" onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
