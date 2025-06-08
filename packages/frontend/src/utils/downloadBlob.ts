export function downloadBlob(fileName: string, blobPath: string) {
  const link = document.createElement("a");
  link.href = blobPath;
  link.download = fileName;
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}
