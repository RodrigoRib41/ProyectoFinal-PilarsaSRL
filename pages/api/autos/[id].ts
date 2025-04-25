import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';
import formidable, { File } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Definimos un tipo para los datos que se van a actualizar
type AutoUpdateData = {
  marca: string;
  modelo: string;
  version: string;
  año: number;
  precio: number;
  moneda: string;
  kilometros: number;
  color: string;
  categoria: string;
  descripcion: string;
  fotos?: string[]; // Este campo es opcional, ya que solo se actualizará si hay fotos nuevas
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  if (req.method === 'PUT') {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'Error al procesar el formulario' });

      try {
        const fotos = Array.isArray(files.fotos) ? files.fotos : files.fotos ? [files.fotos] : [];
        const uploadedUrls: string[] = [];

        // Si hay fotos nuevas, las subimos a Cloudinary
        if (fotos.length > 0) {
          for (const foto of fotos) {
            const file = foto as File;
            const result = await cloudinary.uploader.upload(file.filepath, {
              folder: 'autos',
            });
            uploadedUrls.push(result.secure_url);
          }
        }

        // Creamos el objeto con los datos de actualización
        const updatedAutoData: AutoUpdateData = {
          marca: String(fields.marca),
          modelo: String(fields.modelo),
          version: String(fields.version || ''),
          año: Number(fields.año),
          precio: Number(fields.precio),
          moneda: String(fields.moneda),
          kilometros: Number(fields.kilometros),
          color: String(fields.color),
          categoria: String(fields.categoria),
          descripcion: String(fields.descripcion),
        };

        // Si se han subido fotos, las añadimos al objeto de actualización
        if (uploadedUrls.length > 0) {
          updatedAutoData.fotos = uploadedUrls;
        }

        // Actualizamos el auto en la base de datos
        const updatedAuto = await db.auto.update({
          where: { id },
          data: updatedAutoData,
        });

        return res.status(200).json(updatedAuto);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar el auto' });
      }
    });

  } else {
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}
