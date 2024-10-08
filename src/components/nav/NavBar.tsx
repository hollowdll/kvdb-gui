import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NavItem, NavItemNames } from "../../types/types";
import { useNavigate } from "react-router-dom";
import CableIcon from "@mui/icons-material/Cable";
import StorageIcon from "@mui/icons-material/Storage";
import FolderIcon from "@mui/icons-material/Folder";
import KeyIcon from "@mui/icons-material/Key";
import { useNavigationStore } from "../../state/store";
import { useThemeStore } from "../../state/store";

const drawerWidth = 200;
const navItemNames: NavItemNames = {
  connection: "Connection",
  server: "Server",
  databases: "Databases",
  keys: "Keys",
};
const navItems: NavItem[] = [
  { text: navItemNames.connection, href: "/connection" },
  { text: navItemNames.server, href: "/server" },
  { text: navItemNames.databases, href: "/databases" },
  { text: navItemNames.keys, href: "/keys" },
];

const renderIcon = (item: NavItem) => {
  switch (item.text) {
    case navItemNames.connection:
      return <CableIcon />;
    case navItemNames.server:
      return <StorageIcon />;
    case navItemNames.databases:
      return <FolderIcon />;
    case navItemNames.keys:
      return <KeyIcon />;
  }
};

export function NavBar() {
  const navigate = useNavigate();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const selectedIndex = useNavigationStore(
    (state) => state.selectedNavItemIndex,
  );
  const setSelectedNavItemIndex = useNavigationStore(
    (state) => state.setSelectedNavItemIndex,
  );

  const handleListItemClick = (index: number) => {
    setSelectedNavItemIndex(index);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <List component="nav">
        {navItems.map((item, index) => (
          <ListItem
            key={item.text}
            disablePadding
            onClick={() => navigate(item.href)}
            sx={{
              backgroundColor:
                selectedIndex === index
                  ? isDarkMode
                    ? "rgb(50,50,50)"
                    : "rgb(225,225,225)"
                  : isDarkMode
                    ? "rgb(20,20,20)"
                    : "rgb(255,255,255)",
            }}
          >
            <ListItemButton
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index)}
            >
              <ListItemIcon>{renderIcon(item)}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
