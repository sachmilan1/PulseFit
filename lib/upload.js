// lib/upload.js

/**
 * Uploads a local file URI to an S3 presigned PUT URL using XMLHttpRequest
 * so we can report upload progress.
 *
 * @param {string} url - Presigned PUT URL from backend
 * @param {string} fileUri - Local file URI from Expo ImagePicker/Camera
 * @param {string} contentType - MUST match the contentType used when presigning
 * @param {(fraction: number) => void} onProgress - progress 0..1
 */
export async function uploadWithProgressXHR(
  url,
  fileUri,
  contentType = "image/jpeg",
  onProgress
) {
  // Convert local file URI into a Blob
  const fileRes = await fetch(fileUri);
  if (!fileRes.ok) {
    throw new Error(`Failed to read local file: ${fileRes.status}`);
  }
  const blob = await fileRes.blob();

  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (typeof onProgress === "function" && e.lengthComputable) {
        onProgress(e.loaded / e.total);
      }
    };

    xhr.onerror = () => reject(new Error("S3 PUT failed: network error"));
    xhr.ontimeout = () => reject(new Error("S3 PUT failed: timeout"));

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`S3 PUT failed: ${xhr.status} ${xhr.responseText || ""}`));
      }
    };

    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType); // MUST match presign
    xhr.send(blob); // raw bytes for presigned PUT
  });
}
