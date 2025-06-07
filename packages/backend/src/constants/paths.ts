import path from "path"
import { cwd } from "process";

export const pathForReceipts = path.resolve(cwd(), "receipts");
export const pathForReports = path.resolve(cwd(), "reports");

export const caFile = path.resolve(cwd(), "keys", "ca.pem");
export const certFile = path.resolve(cwd(), "keys", "digitarillo-cert.pem");
export const certKeyFile = path.resolve(cwd(), "keys", "digitarillo-key.pem");
export const pfxCertFile = path.resolve(cwd(), "keys", "digitarillo.pfx");

export const privateKeyFile = path.resolve(cwd(), "keys", "private-key.pem");
export const publicKeyFile = path.resolve(cwd(), "keys", "public-key.pem");
