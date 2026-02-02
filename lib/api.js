// lib/api.js
const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

/**
 * Requests a presigned S3 upload URL from your backend.
 * Returns: { url, bucket, key }
 */
export async function getPresignedUpload(contentType = "image/jpeg") {
  const r = await fetch(`${API_BASE}/presign-upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ contentType }),
  });

  const text = await r.text();
  const reqId =
    r.headers?.get?.("apigw-requestid") ?? r.headers?.get?.("x-amzn-RequestId");

  if (!r.ok) {
    throw new Error(
      `Failed to get presigned URL (HTTP ${r.status}) reqId=${reqId ?? "n/a"} body=${text}`
    );
  }

  try {
    return JSON.parse(text); // { url, bucket, key }
  } catch {
    throw new Error(`Presign returned non-JSON: ${text.slice(0, 200)}`);
  }
}

/**
 * Analyze image that already exists in S3.
 * Input: { bucket, key }
 * Output: JSON from your /analyze Lambda
 */
export async function analyzeImage({ bucket, key }) {
  if (!bucket || !key) throw new Error("analyzeImage requires { bucket, key }");

  const r = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bucket, key }),
  });

  const text = await r.text();
  if (!r.ok) throw new Error(`Analyze failed: ${r.status} ${text}`);

  return JSON.parse(text);
}
