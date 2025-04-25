'use client';

import { useState, ChangeEvent, FormEvent, DragEvent } from 'react';

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
  fotos: File[];
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
    fotos: [],
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ toast state

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['año', 'precio', 'kilometros'].includes(name) ? Number(value) : value,
    }));
  };

  const handleImageDrop = (files: FileList | null) => {
    if (!files) return;

    const existingCount = formData.fotos.length;
    const selectedFiles = Array.from(files).slice(0, 4 - existingCount);

    const updatedFotos = [...formData.fotos, ...selectedFiles];
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));

    setFormData(prev => ({ ...prev, fotos: updatedFotos }));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
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
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
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

    formData.fotos.forEach((file, i) => {
      formDataToSend.append(`fotos`, file, `foto${i + 1}.${file.type.split('/')[1]}`);
    });

    try {
      const res = await fetch('/api/autos', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!res.ok) throw new Error('Error al enviar el formulario');

      const data = await res.json();
      console.log('Auto guardado:', data);

      setShowSuccess(true); // ✅ mostrar cartel
      setTimeout(() => setShowSuccess(false), 3000); // ✅ ocultar después de 3s

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
        fotos: [],
      });
      setPreviewUrls([]);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al guardar el auto');
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

        {/* Drag & Drop zona */}
        <div>
          <label
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            htmlFor="fotos"
            className={`border-2 border-dashed p-6 rounded cursor-pointer text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <p className="mb-2">Arrastrá hasta 4 fotos</p>
            <span className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Seleccionar fotos</span>
            <input id="fotos" type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
          </label>

          {/* Previews */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt={`preview-${idx}`} className="h-32 object-cover rounded w-full" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Guardar Auto
        </button>
      </form>

      {/* ✅ Toast de éxito */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          Auto guardado con éxito
        </div>
      )}
    </div>
  );
}
