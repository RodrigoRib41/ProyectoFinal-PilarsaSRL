// pages/api/autos/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db'; // Asegurate de que esté bien configurado
import { v2 as cloudinary } from 'cloudinary';
import formidable, { File } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error al procesar el formulario' });
    }

    try {
      const fotos = Array.isArray(files.fotos) ? files.fotos : [files.fotos];
      const uploadedUrls: string[] = [];

      for (const foto of fotos) {
        const file = foto as File;
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: 'autos',
        });
        uploadedUrls.push(result.secure_url);
      }

      const nuevoAuto = await db.auto.create({
        data: {
          marca: String(fields.marca),
          modelo: String(fields.modelo),
          version: fields.version ? String(fields.version) : '',
          año: Number(fields.año),
          precio: Number(fields.precio),
          moneda: String(fields.moneda),
          kilometros: Number(fields.kilometros),
          color: String(fields.color),
          categoria: String(fields.categoria),
          descripcion: String(fields.descripcion),
          fotos: uploadedUrls,
        },
      });

      res.status(200).json(nuevoAuto);
    } catch {
        res.status(500).json({ error: 'Error al guardar el auto' });
      }
      
  });
};

export default handler;
