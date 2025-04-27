import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';
import formidable, { File } from 'formidable';

// Configuración para desactivar el bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Tipos
type FotoFields = 'foto1' | 'foto2' | 'foto3' | 'foto4';

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
  foto1?: string | null;
  foto2?: string | null;
  foto3?: string | null;
  foto4?: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  if (req.method === 'PUT') {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'Error al procesar el formulario' });

      try {
        const fotoKeys: FotoFields[] = ['foto1', 'foto2', 'foto3', 'foto4'];
        const updatedAutoData: AutoUpdateData = {
          marca: String(fields.marca),
          modelo: String(fields.modelo),
          version: String(fields.version || ''),
          año: fields.año ? Number(fields.año) : 0,
          precio: fields.precio ? Number(fields.precio) : 0,
          moneda: String(fields.moneda),
          kilometros: fields.kilometros ? Number(fields.kilometros) : 0,
          color: String(fields.color),
          categoria: String(fields.categoria),
          descripcion: String(fields.descripcion),
        };

        for (let idx = 0; idx < fotoKeys.length; idx++) {
          const key = fotoKeys[idx];
          const fileOrUrl = files[key] ?? fields[key];

          if (fileOrUrl) {
            if (Array.isArray(fileOrUrl)) {
              // Si es array, agarramos el primero (por seguridad)
              const item = fileOrUrl[0];
            
              if (typeof item === 'object' && 'filepath' in item) {
                const uploadResult = await cloudinary.uploader.upload(item.filepath, { folder: 'autos' });
                updatedAutoData[key] = uploadResult.secure_url;
              }
               else if (typeof item === 'string') {
                updatedAutoData[key] = item;
              }
            }
            else {
              if (typeof fileOrUrl === 'object' && fileOrUrl !== null && 'filepath' in fileOrUrl) {
                const file = fileOrUrl as File;
                const uploadResult = await cloudinary.uploader.upload(file.filepath, { folder: 'autos' });
                updatedAutoData[key] = uploadResult.secure_url;
              } else if (typeof fileOrUrl === 'string') {
                updatedAutoData[key] = fileOrUrl;
              }
            }
          } else {
            updatedAutoData[key] = null; // Si no hay nada, eliminamos la foto
          }
        }

        // Actualizar en la base de datos
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
