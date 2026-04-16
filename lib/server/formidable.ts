import formidable, { type Fields, type Files } from "formidable";
import type { NextApiRequest } from "next";

type ParsedForm = {
  fields: Fields<string>;
  files: Files;
};

export function parseMultipartForm(req: NextApiRequest): Promise<ParsedForm> {
  const form = formidable({ multiples: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ fields, files });
    });
  });
}

export function getFieldValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}
