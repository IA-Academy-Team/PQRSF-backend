import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AWS_BUCKET, AWS_KEY, AWS_REGION, AWS_SECRET } from "../config/env.config";
import { AppError } from "../middlewares/error.middleware";

const ensureS3Config = () => {
  if (!AWS_BUCKET || !AWS_REGION || !AWS_KEY || !AWS_SECRET) {
    throw new AppError("S3 credentials not configured", 500, "S3_NOT_CONFIGURED");
  }
};

const client = new S3Client({
  region: AWS_REGION || "us-east-1",
  credentials: AWS_KEY && AWS_SECRET ? { accessKeyId: AWS_KEY, secretAccessKey: AWS_SECRET } : undefined,
});

const buildPublicUrl = (key: string) => {
  const safeKey = encodeURIComponent(key).replace(/%2F/g, "/");
  return `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${safeKey}`;
};

export const uploadToS3 = async (params: {
  key: string;
  body: Buffer;
  contentType?: string;
}) => {
  ensureS3Config();
  const command = new PutObjectCommand({
    Bucket: AWS_BUCKET,
    Key: params.key,
    Body: params.body,
    ContentType: params.contentType,
  });
  await client.send(command);
  return buildPublicUrl(params.key);
};
