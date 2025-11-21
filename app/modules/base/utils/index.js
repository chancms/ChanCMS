import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

export const mergeChunks = async ({
  fileHash,
  fileName,
  tempDir,
  uploadDir,
}) => {
  const chunkDir = path.join(tempDir, fileHash);
  const chunks = await fs.promises.readdir(chunkDir);

  // 按数字顺序排序分片
  chunks.sort((a, b) => parseInt(a.split(".")[0]) - parseInt(b.split(".")[0]));

  // 创建目标文件
  const filePath = path.join(
    uploadDir,
    `${fileHash}_${path.basename(fileName)}`
  );
  const writeStream = fs.createWriteStream(filePath);

  // 管道流水线合并
  for (const chunk of chunks) {
    const readStream = fs.createReadStream(path.join(chunkDir, chunk));
    await pipeline(readStream, writeStream, { end: false });
  }

  writeStream.end();
  return filePath;
};
