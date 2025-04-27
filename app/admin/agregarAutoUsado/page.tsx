'use client';
import { useState, ChangeEvent, FormEvent, DragEvent } from 'react';
import Image from 'next/image';
import { useRef } from 'react';



interface AutoFormData {
  marca: string;
  modelo: string;
  version: string;
  año: number | '';
  precio: number | '';
  moneda: '$' | 'U$D';
  kilometros: number | '';
  color: string;
  categoria: 'Usado' | '0km';
  descripcion: string;
  foto1: File | null;
  foto2: File | null;
  foto3: File | null;
  foto4: File | null;
}

export default function AgregarAuto() {
  const [formData, setFormData] = useState<AutoFormData>({
    marca: '',
    modelo: '',
    version: '',
    año: '',
    precio: '',
    moneda: '$',
    kilometros: '',
    color: '',
    categoria: 'Usado',
    descripcion: '',
    foto1: null,
    foto2: null,
    foto3: null,
    foto4: null,
  });

  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([null, null, null, null]);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);  // Estado para mostrar el mensaje de error

  const inputRef = useRef<HTMLInputElement>(null);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['año', 'precio', 'kilometros'].includes(name) ? Number(value) : value,
    }));
  };

  const handleImageDrop = (files: FileList | null) => {
    if (!files) return;
  
    // Crear un array con las ranuras disponibles
    const availableSlots = [formData.foto1, formData.foto2, formData.foto3, formData.foto4]
      .map((foto, index) => (foto === null ? index : null)) // Si la imagen es nula, marcar ese índice como disponible
      .filter((slot): slot is number => slot !== null);
  
    // Asegurarse de que no excedemos las ranuras disponibles
    const selectedFiles = Array.from(files).slice(0, availableSlots.length);
  
    const updatedPreviews: string[] = [];
    const newData = { ...formData };
  
    // Asignar las nuevas imágenes a las ranuras disponibles
    selectedFiles.forEach((file, idx) => {
      const slot = availableSlots[idx];
      if (slot !== undefined) {
        newData[`foto${slot + 1}` as 'foto1' | 'foto2' | 'foto3' | 'foto4'] = file;
        updatedPreviews.push(URL.createObjectURL(file));
      }
    });
  
    setFormData(newData);
    setPreviewUrls(prev => {
      const newPreviewsArray = [...prev];
      updatedPreviews.forEach((url, idx) => {
        const slot = availableSlots[idx];
        if (slot !== undefined) newPreviewsArray[slot] = url;
      });
      return newPreviewsArray;
    });
  };
  
  

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleImageDrop(e.target.files);
  };

  const handleDrag = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleImageDrop(e.dataTransfer.files);
  };

  const handleRemoveImage = (index: number) => {
    // Limpiar la imagen en formData
    setFormData(prev => ({
      ...prev,
      [`foto${index + 1}`]: null,
    }));
  
    // Limpiar la URL previa de la imagen eliminada
    setPreviewUrls(prev => {
      const newPreviews = [...prev];
      newPreviews[index] = null;
      return newPreviews;
    });
  };
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('marca', formData.marca);
    formDataToSend.append('modelo', formData.modelo);
    formDataToSend.append('version', formData.version);
    formDataToSend.append('año', String(formData.año));
    formDataToSend.append('precio', String(formData.precio));
    formDataToSend.append('moneda', formData.moneda);
    formDataToSend.append('kilometros', String(formData.kilometros));
    formDataToSend.append('color', formData.color);
    formDataToSend.append('categoria', formData.categoria);
    formDataToSend.append('descripcion', formData.descripcion);

    (['foto1', 'foto2', 'foto3', 'foto4'] as const).forEach((fotoKey, idx) => {
      const foto = formData[fotoKey];
      if (foto) {
        formDataToSend.append(fotoKey, foto, `foto${idx + 1}.${foto.type.split('/')[1]}`);
      }
    });

    try {
      const res = await fetch('/api/autos', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!res.ok) throw new Error('Error al enviar el formulario');

      const data = await res.json();
      console.log('Auto guardado:', data);

      setShowSuccess(true);

      setFormData({
        marca: '',
        modelo: '',
        version: '',
        año: '',
        precio: '',
        moneda: '$',
        kilometros: '',
        color: '',
        categoria: 'Usado',
        descripcion: '',
        foto1: null,
        foto2: null,
        foto3: null,
        foto4: null,
      });
      setPreviewUrls([null, null, null, null]);
    } catch (error) {
      console.error(error);
      setShowError(true);  
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Agregar Auto</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="marca" placeholder="Marca" value={formData.marca} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input name="modelo" placeholder="Modelo" value={formData.modelo} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input name="version" placeholder="Versión" value={formData.version} onChange={handleChange} className="border p-2 rounded w-full" />
          <input name="año" type="number" placeholder="Año" value={formData.año} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input
  id="fotos"
  type="file"
  name="fotos"
  multiple
  accept="image/*"
  onChange={handleFileChange}
  className="hidden"
  ref={inputRef} // 👈 Aca
/>

          <div className="flex gap-2">
            <select name="moneda" value={formData.moneda} onChange={handleChange} className="border p-2 rounded">
              <option value="$">$</option>
              <option value="U$D">U$D</option>
            </select>
            <input name="precio" type="number" placeholder="Precio" value={formData.precio} onChange={handleChange} className="border p-2 rounded w-full" required />
          </div>

          <input name="kilometros" type="number" placeholder="Kilómetros" value={formData.kilometros} onChange={handleChange} className="border p-2 rounded w-full" />
          <input name="color" placeholder="Color" value={formData.color} onChange={handleChange} className="border p-2 rounded w-full" />
          <select name="categoria" value={formData.categoria} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="Usado">Usado</option>
            <option value="0km">0km</option>
          </select>
        </div>

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          rows={4}
          required
        />

    
<div>
  <label
    onDragEnter={handleDrag}
    onDragLeave={handleDrag}
    onDragOver={handleDrag}
    onDrop={handleDrop}
    htmlFor="fotos"
    className={`border-4 p-6 rounded-2xl cursor-pointer text-center transition-all w-full ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
    style={{ display: 'block' }} 
  >
    
    <p className="mb-2">Arrastra hasta 4 imágenes aquí o haz clic para seleccionar</p>
    <input id="fotos" type="file" name="fotos" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
  </label>

  {/* Previsualización */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
    {previewUrls.length > 0 ? (
      previewUrls.map((url, index) => (
        url && (
          <div key={index} className="relative">
            <Image
              src={url}
              alt={`Foto ${index + 1}`}
              width={300}
              height={200}
              unoptimized
              className="object-cover rounded w-full h-32"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-sm"
            >
              X
            </button>
          </div>
        )
      ))
    ) : (
      <div className="col-span-4 text-gray-400 text-center">Todavía no subiste imágenes</div>
    )}
  </div>
</div>

 {/* Modal de éxito */}
 {showSuccess && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
          <p className="text-black font-bold">¡Vehiculo agregado con éxito!</p>
          <div className="flex justify-center mt-4">

            <button onClick={() => setShowSuccess(false)} className="bg-green-500 text-white p-2 rounded mt-4">
              Aceptar
            </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {showError && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">Hubo un error al agregar el vehiculo</p>
            <div className="flex justify-center mt-4">
            <button onClick={() => setShowError(false)} className="bg-red-500 text-white p-2 rounded mt-4">
              Aceptar
            </button>
            </div>
          </div>
        </div>
      )}

        <button type="submit" className="bg-blue-500 text-white p-3 rounded w-full">Guardar Auto</button>
      </form>
    </div>
    
  );
}
