import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type PromoMetadataRecord = Record<string, { description: string }>;

const metadataFilePath = path.join(
  process.cwd(),
  "data",
  "auto-promo-metadata.json",
);

async function readMetadataFile() {
  try {
    const content = await readFile(metadataFilePath, "utf8");
    const parsed = JSON.parse(content) as PromoMetadataRecord;
    return parsed;
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException;
    if (fileError.code === "ENOENT") {
      return {};
    }

    throw error;
  }
}

async function writeMetadataFile(payload: PromoMetadataRecord) {
  await mkdir(path.dirname(metadataFilePath), { recursive: true });
  await writeFile(metadataFilePath, JSON.stringify(payload, null, 2), "utf8");
}

export async function getAutoPromoDescriptions(ids?: number[]) {
  const metadata = await readMetadataFile();

  if (!ids?.length) {
    return metadata;
  }

  return Object.fromEntries(
    ids
      .map((id) => [String(id), metadata[String(id)]])
      .filter((entry): entry is [string, { description: string }] => Boolean(entry[1])),
  );
}

export async function setAutoPromoDescription(
  autoId: number,
  description: string | null,
) {
  const metadata = await readMetadataFile();
  const key = String(autoId);
  const nextDescription = description?.trim() ?? "";

  if (!nextDescription) {
    delete metadata[key];
    await writeMetadataFile(metadata);
    return;
  }

  metadata[key] = { description: nextDescription };
  await writeMetadataFile(metadata);
}

export async function removeAutoPromoDescription(autoId: number) {
  await setAutoPromoDescription(autoId, null);
}
