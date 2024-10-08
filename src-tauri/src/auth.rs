use crate::{
    error::NO_CONNECTION_FOUND_MSG,
    grpc::{hakjdb_api::AuthenticateRequest, GrpcConnection},
};
use tauri::State;

#[tauri::command]
pub async fn authenticate(
    connection: State<'_, GrpcConnection>,
    password: &str,
) -> Result<(), String> {
    if let Some(ref mut client) = *connection.client.lock().await {
        let req = tonic::Request::new(AuthenticateRequest {
            password: password.to_owned(),
        });

        let resp = client.auth_client.authenticate(req).await;
        match resp {
            Ok(resp) => {
                connection
                    .set_auth_token(resp.get_ref().auth_token.clone())
                    .await;
                if let Some(ref _auth_token) = *connection.auth_token.lock().await {
                    println!("auth token set");
                } else {
                    println!("auth token not set");
                }
                return Ok(());
            }
            Err(e) => return Err(e.message().to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}
