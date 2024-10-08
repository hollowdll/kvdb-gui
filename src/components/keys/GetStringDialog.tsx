import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  DialogContentText,
} from "@mui/material";
import { useState, ChangeEvent } from "react";
import { invokeGetString } from "../../tauri/command";
import { useLoadingStore } from "../../state/store";
import { useDialogStore } from "../../state/store";
import {
  allyPropsDialogActions,
  allyPropsDialogContentText,
  allyPropsDialogTextField,
} from "../../utility/props";
import { useConnectionInfoStore } from "../../state/store";
import { textDecoder } from "../../utility/encoding";

type GetStringParams = {
  key: string;
};

type GetStringDialogProps = {
  handleDisplayMsg: (msg: string) => void;
  handleHideContent: () => void;
};

export default function GetStringDialog(props: GetStringDialogProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [params, setParams] = useState<GetStringParams>({
    key: "",
  });
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );
  const dbToUse = useConnectionInfoStore(
    (state) => state.connectionInfo.defaultDb,
  );
  const setIsOpen = useDialogStore((state) => state.setIsGetStringDialogOpen);
  const isOpen = useDialogStore((state) => state.isGetStringDialogOpen);

  const handleClose = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    setParams({
      key: "",
    });
    setErrorMsg("");
  };

  const handleGetString = () => {
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    invokeGetString(dbToUse, params.key)
      .then((result) => {
        handleClose();
        if (result.ok) {
          const value = textDecoder.decode(new Uint8Array(result.value));
          props.handleDisplayMsg(`"${value}"`);
        } else {
          props.handleDisplayMsg("Key does not exist");
        }
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`GetString failed: ${err}`);
        props.handleHideContent();
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
      });
  };

  const inputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>GetString</DialogTitle>
      <DialogContent>
        <DialogContentText {...allyPropsDialogContentText()}>
          Get the value of a String key.
        </DialogContentText>
        <TextField
          label="Key"
          name="key"
          value={params.key}
          onChange={inputChanged}
          {...allyPropsDialogTextField()}
        />
        {errorMsg !== "" ? (
          <Typography sx={{ marginTop: "15px" }}>{errorMsg}</Typography>
        ) : (
          <></>
        )}
      </DialogContent>
      <DialogActions {...allyPropsDialogActions()}>
        <Button variant="contained" onClick={handleGetString}>
          Ok
        </Button>
        <Button variant="outlined" onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
