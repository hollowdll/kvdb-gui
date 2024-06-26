import "./App.css";
import { Box } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ConnectionView from "./components/views/ConnectionView";
import ServerView from "./components/views/server/ServerView";
import DatabasesView from "./components/views/DatabasesView";
import KeysView from "./components/views/KeysView";
import ConnectionManager from "./components/connect/ConnectionManager";
import HomeView from "./components/views/HomeView";
import LoadingBackdrop from "./components/common/LoadingBackdrop";

function App() {
  return (
    <>
      <Router>
        <Box sx={{ display: "flex" }}>
          <ConnectionManager />
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/connection" element={<ConnectionView />} />
            <Route path="/server" element={<ServerView />} />
            <Route path="/databases" element={<DatabasesView />} />
            <Route path="/keys" element={<KeysView />} />
          </Routes>
        </Box>
      </Router>
      <Toaster />
      <LoadingBackdrop />
    </>
  );
}

export default App;
