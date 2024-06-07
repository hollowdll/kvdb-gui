import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useState, ChangeEvent } from "react";
import { invokeSetString } from "../../tauri/command";
import { useLoadingStore } from "../../state/store";
import { allyPropsDialogActions, allyPropsDialogTextField } from "../../utility/props";
import { useConnectionInfoStore } from "../../state/store";

type SetStringParams = {
  key: string,
  value: string,
}

type SetStringDialogProps = {
  isOpen: boolean,
  handleClose: () => void,
  handleDisplayContent: (msg: string) => void,
  handleHideContent: () => void,
}

export default function SetStringDialog(props: SetStringDialogProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [params, setParams] = useState<SetStringParams>({
    key: "",
    value: "",
  });
  const setIsLoadingBackdropOpen = useLoadingStore((state) => state.setIsLoadingBackdropOpen);
  const dbToUse = useConnectionInfoStore((state) => state.connectionInfo.defaultDb);

  const resetForm = () => {
    setParams({
      key: "",
      value: "",
    });
    setErrorMsg("");
  }

  const handleSetString = () => {
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    invokeSetString(dbToUse, params.key, params.value)
      .then((_result) => {
        props.handleClose();
        props.handleDisplayContent("OK");
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`SetString failed: ${err}`);
        props.handleHideContent();
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
      });
  }

  const inputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };

  return (
    <Dialog open={props.isOpen} onClose={props.handleClose}>
      <DialogTitle>SetString</DialogTitle>
      <DialogContent>
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
          <Typography sx={{marginTop: "15px"}}>{errorMsg}</Typography>
        ) : <></>}
      </DialogContent>
      <DialogActions {...allyPropsDialogActions()}>
        <Button variant="contained" onClick={handleSetString}>Ok</Button>
        <Button variant="outlined" onClick={props.handleClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}