import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState, ChangeEvent } from "react";
import { invokeCreateDatabase } from "../../tauri/command";
import { successAlert } from "../../utility/alert";
import { useDatabaseStore } from "../../state/store";
import { useLoadingStore } from "../../state/store";
import { allyPropsDialogActions } from "../../utility/props";

export default function CreateDatabaseDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dbName, setDbName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const getAllDatabases = useDatabaseStore((state) => state.getAllDatabases);
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const resetForm = () => {
    setDbName("");
    setErrorMsg("");
  };

  const handleCreateDb = () => {
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    invokeCreateDatabase(dbName)
      .then((result) => {
        setDialogOpen(false);
        successAlert(`Created database ${result}`);
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`Failed to create database: ${err}`);
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
        getAllDatabases();
      });
  };

  const inputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setDbName(event.target.value);
  };

  return (
    <>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
        New
      </Button>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Create a new database</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={dbName}
            onChange={inputChanged}
            fullWidth
            sx={{ marginTop: "10px" }}
          />
          {errorMsg !== "" ? (
            <Typography sx={{ marginTop: "15px" }}>{errorMsg}</Typography>
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions {...allyPropsDialogActions()}>
          <Button variant="contained" onClick={handleCreateDb}>
            Create
          </Button>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
