export type TauriInvokeCommands = {
  connect: string;
  disconnect: string;
  getServerInfo: string;
  getServerLogs: string;
  getAllDatabases: string;
  getDatabaseInfo: string;
  createDatabase: string;
  deleteDatabase: string;
  getKeys: string;
  getTypeOfKey: string;
  deleteKey: string;
  deleteAllKeys: string;
  getString: string;
  setString: string;
  setHashMap: string;
  getAllHashMapFieldsAndValues: string;
  deleteHashMapFields: string;
  getHashMapFieldValue: string;
  setPassword: string;
  setTLSCertPath: string;
  openFile: string;
};

export type TauriListenEvents = {
  newConnection: string;
  disconnect: string;
  setDarkMode: string;
};
