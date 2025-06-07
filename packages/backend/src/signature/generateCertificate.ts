import { createCA, createCert } from "mkcert";

export async function generateCertificate() {
  const ca = await createCA({
    organization: "Digitarillo Signarillo",
    countryCode: "BR",
    state: "Santa Catarina",
    locality: "Joinville",
    validity: 365,
  });

  const cert = await createCert({
    ca: { key: ca.key, cert: ca.cert },
    domains: ["127.0.0.1", "localhost"],
    validity: 365,
  });

  return {
    ca,
    cert,
  };
}
