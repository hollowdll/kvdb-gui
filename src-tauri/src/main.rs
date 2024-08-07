// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use app::{
    connection::{
        __cmd__connect, __cmd__disconnect, __cmd__open_file, __cmd__set_password,
        __cmd__set_tls_cert_path, connect, disconnect, open_file, set_password, set_tls_cert_path,
    },
    db::{
        __cmd__create_database, __cmd__delete_database, __cmd__get_all_databases,
        __cmd__get_database_info, create_database, delete_database, get_all_databases,
        get_database_info,
    },
    grpc::GrpcConnection,
    server::{__cmd__get_server_info, __cmd__get_server_logs, get_server_info, get_server_logs},
    storage::{
        __cmd__delete_all_keys, __cmd__delete_hashmap_fields, __cmd__delete_key,
        __cmd__get_all_hashmap_fields_and_values, __cmd__get_hashmap_field_value, __cmd__get_keys,
        __cmd__get_string, __cmd__get_type_of_key, __cmd__set_hashmap, __cmd__set_string,
        delete_all_keys, delete_hashmap_fields, delete_key, get_all_hashmap_fields_and_values,
        get_hashmap_field_value, get_keys, get_string, get_type_of_key, set_hashmap, set_string,
    },
};
use std::error::Error;
use tauri::{CustomMenuItem, Manager, Menu, Submenu};

const MENU_ITEM_ID_NEW_CONNECTION: &str = "new-connection";
const MENU_ITEM_ID_DISCONNECT: &str = "disconnect";
const MENU_ITEM_ID_LIGHT_MODE: &str = "light-mode";
const MENU_ITEM_ID_DARK_MODE: &str = "dark-mode";

const EVENT_ID_NEW_CONNECTION: &str = "new-connection";
const EVENT_ID_DISCONNECT: &str = "disconnect";
const EVENT_ID_SET_DARK_MODE: &str = "set-dark-mode";

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    tauri::Builder::default()
        .menu(
            Menu::os_default("kvdb-gui")
                .add_submenu(Submenu::new(
                    "Connect",
                    Menu::with_items([
                        CustomMenuItem::new(MENU_ITEM_ID_NEW_CONNECTION, "New Connection").into(),
                        CustomMenuItem::new(MENU_ITEM_ID_DISCONNECT, "Disconnect").into(),
                    ]),
                ))
                .add_submenu(Submenu::new(
                    "Theme",
                    Menu::with_items([
                        CustomMenuItem::new(MENU_ITEM_ID_LIGHT_MODE, "Light Mode").into(),
                        CustomMenuItem::new(MENU_ITEM_ID_DARK_MODE, "Dark Mode").into(),
                    ]),
                )),
        )
        .on_menu_event(|event| match event.menu_item_id() {
            MENU_ITEM_ID_NEW_CONNECTION => {
                println!("Event -> New connection");
                let _ = event.window().emit(EVENT_ID_NEW_CONNECTION, ());
            }
            MENU_ITEM_ID_DISCONNECT => {
                println!("Event -> Disconnect");
                let _ = event.window().emit(EVENT_ID_DISCONNECT, ());
            }
            MENU_ITEM_ID_LIGHT_MODE => {
                println!("Event -> Enable light mode");
                let _ = event.window().emit(EVENT_ID_SET_DARK_MODE, false);
            }
            MENU_ITEM_ID_DARK_MODE => {
                println!("Event -> Enable dark mode");
                let _ = event.window().emit(EVENT_ID_SET_DARK_MODE, true);
            }
            _ => {}
        })
        .setup(|app| {
            app.manage(GrpcConnection::new());

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            connect,
            disconnect,
            get_server_info,
            get_server_logs,
            get_all_databases,
            get_database_info,
            create_database,
            delete_database,
            get_keys,
            get_type_of_key,
            get_string,
            set_string,
            delete_key,
            delete_all_keys,
            set_hashmap,
            get_all_hashmap_fields_and_values,
            delete_hashmap_fields,
            get_hashmap_field_value,
            set_password,
            set_tls_cert_path,
            open_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
