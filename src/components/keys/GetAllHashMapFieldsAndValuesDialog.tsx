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
import { invokeGetAllHashMapFieldsAndValues } from "../../tauri/command";
import { useLoadingStore } from "../../state/store";
import { useDialogStore } from "../../state/store";
import {
  allyPropsDialogActions,
  allyPropsDialogTextField,
} from "../../utility/props";
import { useConnectionInfoStore } from "../../state/store";

type GetAllHashMapFieldsAndValuesDialogProps = {
  handleDisplayMsg: (msg: string) => void;
  handleDisplayHashMap: (hashMap: Record<string, string>) => void;
  handleHideContent: () => void;
};

export default function GetAllHashMapFieldsAndValuesDialog(
  props: GetAllHashMapFieldsAndValuesDialogProps,
) {
  const [errorMsg, setErrorMsg] = useState("");
  const [keyToUse, setKeyToUse] = useState("");
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );
  const dbToUse = useConnectionInfoStore(
    (state) => state.connectionInfo.defaultDb,
  );
  const setIsOpen = useDialogStore(
    (state) => state.setIsGetAllHashMapFieldsAndValuesDialogOpen,
  );
  const isOpen = useDialogStore(
    (state) => state.isGetAllHashMapFieldsAndValuesDialogOpen,
  );

  const handleClose = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    setKeyToUse("");
    setErrorMsg("");
  };

  const handleGetAllHashMapFieldsAndValues = () => {
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    invokeGetAllHashMapFieldsAndValues(dbToUse, keyToUse)
      .then((result) => {
        handleClose();
        if (result.ok) {
          const fieldValueMap = Object.entries(result.fieldValueMap);
          if (fieldValueMap.length > 0) {
            for (const [field, value] of fieldValueMap) {
              result.fieldValueMap[field] = `"${value}"`;
            }
            props.handleDisplayHashMap(result.fieldValueMap);
          } else {
            props.handleDisplayMsg("HashMap is empty");
          }
        } else {
          props.handleDisplayMsg("Key does not exist");
        }
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`GetAllHashMapFieldsAndValues failed: ${err}`);
        props.handleHideContent();
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
      });
  };

  const inputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyToUse(event.target.value);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>GetAllHashMapFieldsAndValues</DialogTitle>
      <DialogContent>
        <TextField
          label="Key"
          name="key"
          value={keyToUse}
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
        <Button
          variant="contained"
          onClick={handleGetAllHashMapFieldsAndValues}
        >
          Ok
        </Button>
        <Button variant="outlined" onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
