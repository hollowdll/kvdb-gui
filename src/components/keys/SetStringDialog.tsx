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
import { invokeSetString } from "../../tauri/command";
import { useLoadingStore } from "../../state/store";
import { useDialogStore } from "../../state/store";
import {
  allyPropsDialogActions,
  allyPropsDialogContentText,
  allyPropsDialogTextField,
} from "../../utility/props";
import { useConnectionInfoStore } from "../../state/store";
import { textEncoder } from "../../utility/encoding";

type SetStringParams = {
  key: string;
  value: string;
};

type SetStringDialogProps = {
  handleDisplayMsg: (msg: string) => void;
  handleHideContent: () => void;
};

export default function SetStringDialog(props: SetStringDialogProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [params, setParams] = useState<SetStringParams>({
    key: "",
    value: "",
  });
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );
  const dbToUse = useConnectionInfoStore(
    (state) => state.connectionInfo.defaultDb,
  );
  const setIsOpen = useDialogStore((state) => state.setIsSetStringDialogOpen);
  const isOpen = useDialogStore((state) => state.isSetStringDialogOpen);

  const handleClose = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    setParams({
      key: "",
      value: "",
    });
    setErrorMsg("");
  };

  const handleSetString = () => {
    const value = Array.from(textEncoder.encode(params.value));
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    invokeSetString(dbToUse, params.key, value)
      .then(() => {
        handleClose();
        props.handleDisplayMsg("OK");
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`SetString failed: ${err}`);
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
      <DialogTitle>SetString</DialogTitle>
      <DialogContent>
        <DialogContentText {...allyPropsDialogContentText()}>
          Set the value of a String key.
        </DialogContentText>
        <TextField
          label="Key"
          name="key"
          value={params.key}
          onChange={inputChanged}
          {...allyPropsDialogTextField()}
        />
        <TextField
          label="Value"
          name="value"
          value={params.value}
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
        <Button variant="contained" onClick={handleSetString}>
          Ok
        </Button>
        <Button variant="outlined" onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
