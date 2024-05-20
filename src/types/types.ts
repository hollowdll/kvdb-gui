export interface ConnectionInfo {
  host: string,
  port: number,
}

export interface ServerInfo {
  kvdbVersion: string,
  clientConnections: number,
}

export interface NavItem {
  text: string,
  href: string,
}

export interface NavItemNames {
  connection: string,
  server: string,
  databases: string,
  keys: string,
}