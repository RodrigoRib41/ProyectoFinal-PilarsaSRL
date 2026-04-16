import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type AutoSaleMetadata = {
  balanceId: number;
  salePrice: number;
  soldAt: string;
};

type AutoSaleMetadataRecord = Record<string, AutoSaleMetadata>;

const metadataFilePath = path.join(process.cwd(), "data", "auto-sale-metadata.json");

async function readMetadataFile() {
  try {
    const content = await readFile(metadataFilePath, "utf8");
    return JSON.parse(content) as AutoSaleMetadataRecord;
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException;
    if (fileError.code === "ENOENT") {
      return {};
    }

    throw error;
  }
}

async function writeMetadataFile(payload: AutoSaleMetadataRecord) {
  await mkdir(path.dirname(metadataFilePath), { recursive: true });
  await writeFile(metadataFilePath, JSON.stringify(payload, null, 2), "utf8");
}

export async function getAutoSaleMetadata(ids?: number[]) {
  const metadata = await readMetadataFile();

  if (!ids?.length) {
    return metadata;
  }

  return Object.fromEntries(
    ids
      .map((id) => [String(id), metadata[String(id)]])
      .filter((entry): entry is [string, AutoSaleMetadata] => Boolean(entry[1])),
  );
}

export async function getAutoSaleRecord(autoId: number) {
  const metadata = await getAutoSaleMetadata([autoId]);
  return metadata[String(autoId)] ?? null;
}

export async function markAutoAsSold(autoId: number, payload: AutoSaleMetadata) {
  const metadata = await readMetadataFile();
  metadata[String(autoId)] = payload;
  await writeMetadataFile(metadata);
}

export async function removeAutoSaleMetadata(autoId: number) {
  const metadata = await readMetadataFile();
  delete metadata[String(autoId)];
  await writeMetadataFile(metadata);
}
