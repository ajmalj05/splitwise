import * as Minio from "minio";

const endpoint = process.env.MINIO_ENDPOINT ?? "localhost";
const port = parseInt(process.env.MINIO_PORT ?? "9000", 10);
const useSSL = process.env.MINIO_USE_SSL === "true";
const accessKey = process.env.MINIO_ACCESS_KEY ?? "minioadmin";
const secretKey = process.env.MINIO_SECRET_KEY ?? "minioadmin";
export const BUCKET = process.env.MINIO_BUCKET ?? "naasthamukk-receipts";

let client: Minio.Client | null = null;

export function getMinioClient(): Minio.Client {
  if (!client) {
    client = new Minio.Client({
      endPoint: endpoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });
  }
  return client;
}

export async function ensureBucket(): Promise<void> {
  const mc = getMinioClient();
  const exists = await mc.bucketExists(BUCKET);
  if (!exists) {
    await mc.makeBucket(BUCKET, "us-east-1");
  }
}

export async function uploadReceipt(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const mc = getMinioClient();
  await ensureBucket();
  await mc.putObject(BUCKET, key, buffer, buffer.length, { "Content-Type": contentType });
  return key;
}

export async function getReceiptStream(key: string): Promise<{ stream: NodeJS.ReadableStream; contentType?: string }> {
  const mc = getMinioClient();
  const stat = await mc.statObject(BUCKET, key);
  const stream = await mc.getObject(BUCKET, key);
  return { stream, contentType: stat.metaData?.["content-type"] };
}
