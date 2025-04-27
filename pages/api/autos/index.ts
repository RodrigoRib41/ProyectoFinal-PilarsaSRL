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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const autos = await db.auto.findMany();
      return res.status(200).json(autos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener los autos' });
    }
  }

  if (req.method === 'POST') {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al procesar el formulario' });
      }

      try {
        // 👉 Ahora buscamos foto1, foto2, foto3, foto4
        const fotoKeys = ['foto1', 'foto2', 'foto3', 'foto4'];
        const fotosArray: File[] = [];

        for (const key of fotoKeys) {
          const file = files[key];
          if (file) {
            if (Array.isArray(file)) {
              fotosArray.push(...file);
            } else {
              fotosArray.push(file);
            }
          }
        }


        const uploadedUrls: string[] = [];

        for (const foto of fotosArray) {
          const uploadResult = await cloudinary.uploader.upload(foto.filepath, {
            folder: 'autos',
          });
          uploadedUrls.push(uploadResult.secure_url);
        }

        const nuevoAuto = await db.auto.create({
          data: {
            marca: String(fields.marca),
            modelo: String(fields.modelo),
            version: fields.version ? String(fields.version) : '',
            año: fields.año ? Number(fields.año) : 0,
            precio: fields.precio ? Number(fields.precio) : 0,
            moneda: String(fields.moneda),
            kilometros: fields.kilometros ? Number(fields.kilometros) : 0,
            color: String(fields.color),
            categoria: String(fields.categoria),
            descripcion: String(fields.descripcion),
            foto1: uploadedUrls[0] || null,
            foto2: uploadedUrls[1] || null,
            foto3: uploadedUrls[2] || null,
            foto4: uploadedUrls[3] || null,
          },
        });

        return res.status(200).json(nuevoAuto);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al guardar el auto' });
      }
    });

    return;
  }

  return res.status(405).json({ error: 'Método no permitido' });
};

export default handler;
