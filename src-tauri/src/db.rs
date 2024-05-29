use serde::Serialize;

#[derive(Serialize)]
pub struct DatabaseInfoPayload {
    pub name: String,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
    #[serde(rename = "dataSize")]
    pub data_size: String,
    #[serde(rename = "keyCount")]
    pub key_count: String,
}

#[derive(Serialize)]
pub struct GetDatabasesPayload {
    #[serde(rename = "dbNames")]
    pub db_names: Vec<String>,
}