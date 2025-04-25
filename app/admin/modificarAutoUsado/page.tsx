'use client';
import { useState, useEffect, ChangeEvent, FormEvent, DragEvent } from 'react';

interface Auto {
  id: string;
  marca: string;
  modelo: string;
  version: string;
  año: number;
  precio: number;
  moneda: '$' | 'U$D';
  kilometros: number;
  color: string;
  categoria: 'Usado' | '0km';
  descripcion: string;
  fotos: string[];
}

interface SearchFilters {
  marca: string;
  año: string;
}

type AutoFormData = Omit<Auto, "fotos"> & {
  año: number | null;   // Año puede ser null si no se ha proporcionado
  precio: number | null; // Precio puede ser null si no se ha proporcionado
  kilometros: number | null; // Kilómetros puede ser null si no se ha proporcionado
  fotos: File[];  // Arreglo de fotos
  id: string;  // Id del auto
};


export default function ModificarAuto() {
  const [autos, setAutos] = useState<Auto[]>([]); // Autos cargados
  const [filteredAutos, setFilteredAutos] = useState<Auto[]>([]); // Autos filtrados
  const [formData, setFormData] = useState<AutoFormData>({
    id: '',  // El ID siempre debe estar presente
    marca: '',
    modelo: '',
    version: '',
    año: 0,  // Inicializa como un número
    precio: 0,  // Inicializa como un número
    moneda: '$',
    kilometros: 0,  // Inicializa como un número
    color: '',
    categoria: 'Usado',
    descripcion: '',
    fotos: [],
  });
  
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({ marca: '', año: '' });
  const [marcas, setMarcas] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // URLs que vienen del backend
  const [addedImages, setAddedImages] = useState<File[]>([]); // Imágenes agregadas
  const [removedImages, setRemovedImages] = useState<string[]>([]); // Imágenes eliminadas


  useEffect(() => {
    const fetchAutos = async () => {
      try {
        const res = await fetch('/api/autos');
        if (!res.ok) throw new Error('Error al cargar autos');
        const data: Auto[] = await res.json();
        setAutos(data);
        setFilteredAutos(data);
        setMarcas([...new Set(data.map((auto) => auto.marca))]);
      } catch (err) {
        console.error(err);
        alert('Error al obtener autos');
      }
    };
    fetchAutos();
  }, []);

  useEffect(() => {
    setFilteredAutos(
      autos.filter((auto) =>
        (!searchFilters.marca || auto.marca.toLowerCase().includes(searchFilters.marca.toLowerCase())) &&
        (!searchFilters.año || auto.año === +searchFilters.año)
      )
    );
  }, [autos, searchFilters]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutoSelect = (id: string) => {
    const selected = autos.find((a) => a.id === id);
    if (selected) {
      setFormData({
        id: selected.id || '',  // Asegura que el ID siempre esté presente
        marca: selected.marca || '',
        modelo: selected.modelo || '',
        version: selected.version || '',
        año: selected.año || 0,  // Si no hay valor, asigna 0
        precio: selected.precio || 0,  // Si no hay valor, asigna 0
        moneda: selected.moneda || '$',  // Si no hay valor, asigna '$'
        kilometros: selected.kilometros || 0,  // Si no hay valor, asigna 0
        color: selected.color || '',
        categoria: selected.categoria || 'Usado',  // Asigna valor por defecto
        descripcion: selected.descripcion || '',
        fotos: [],  // Si no hay fotos, asigna un array vacío
      });
      setPreviewUrls(selected.fotos || []);
    }
  };
  

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['año', 'precio', 'kilometros'].includes(name) ? (value === '' ? 0 : +value) : value,
    }));
  };  

  const handleImageDrop = (files: FileList | null) => {
    if (!files) return;
  
    const filesArray = Array.from(files);
    const currentCount = existingImages.filter((img) => !removedImages.includes(img)).length + addedImages.length;
    const spaceLeft = 4 - currentCount;
  
    if (spaceLeft <= 0) return;
  
    const selected = filesArray.slice(0, spaceLeft);
    setAddedImages((prev) => [...prev, ...selected]);
    setPreviewUrls((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))]);
  };
  
  
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleImageDrop(e.target.files);
  };

  const handleDrag = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleImageDrop(e.dataTransfer.files);
  };

  const handleRemoveImage = (i: number) => {
  const imageUrl = previewUrls[i];

  const isExisting = existingImages.includes(imageUrl);
  if (isExisting) {
    setRemovedImages((prev) => [...prev, imageUrl]);
  } else {
    // Es una imagen agregada en esta sesión
    const newAddedImages = [...addedImages];
    newAddedImages.splice(i - existingImages.filter(img => !removedImages.includes(img)).length, 1);
    setAddedImages(newAddedImages);
  }

  setPreviewUrls((prev) => prev.filter((_, idx) => idx !== i));
};

  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();

    // Añadir todos los campos del formulario al FormData
    formDataToSend.append('marca', formData.marca);
    formDataToSend.append('modelo', formData.modelo);
    formDataToSend.append('version', formData.version);
    formDataToSend.append('año', String(formData.año)); // Asegúrate de convertir el número en string
    formDataToSend.append('precio', String(formData.precio)); // Convertir el número en string
    formDataToSend.append('moneda', formData.moneda);
    formDataToSend.append('kilometros', String(formData.kilometros));
    formDataToSend.append('color', formData.color);
    formDataToSend.append('categoria', formData.categoria);
    formDataToSend.append('descripcion', formData.descripcion);

    
    // Añadir las fotos si existen
    // Añadir las fotos nuevas
    // Adjuntar imágenes nuevas
    addedImages.forEach((file, i) => {
      formDataToSend.append('fotos', file, `foto${i + 1}.${file.type.split('/')[1]}`);
    });

    // Adjuntar imágenes eliminadas (referencia por URL o nombre)
    removedImages.forEach((url) => {
      formDataToSend.append('removedImages', url);
    });

    console.log('Form Data to Send:', formDataToSend);

    try {
      // Aquí va la solicitud PUT al backend con todos los campos
      
      const res = await fetch(`/api/autos/${formData.id}`, {
        method: 'PUT',
        headers: {
    'Cache-Control': 'no-cache', // Desactiva caché
  },
      body: formDataToSend,
      });
      if (!res.ok) throw new Error('Error al actualizar');
  
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el auto');
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Modificar Auto</h1>

      {/* Filtros */}
      <section className="mb-6 bg-gray-50 p-4 rounded shadow-sm">
        <h2 className="font-semibold mb-2">Buscar Auto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select name="marca" value={searchFilters.marca} onChange={handleSearchChange} className="border p-2 rounded">
            <option value="">Marca</option>
            {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select name="año" value={searchFilters.año} onChange={handleSearchChange} className="border p-2 rounded">
            <option value="">Año</option>
            {Array.from({ length: 26 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
      </section>

      {/* Resultados */}
      <section className="mb-6 bg-gray-50 p-4 rounded shadow-sm">
        <h2 className="font-semibold mb-2">Resultados</h2>
        <div className="space-y-2">
          {filteredAutos.map((auto) => (
            <button
              key={auto.id}
              onClick={() => handleAutoSelect(auto.id)}
              className="block w-full text-left p-2 border rounded hover:bg-gray-100"
            >
              {auto.marca} {auto.modelo} ({auto.año})
            </button>
          ))}
        </div>
      </section>

      {/* Formulario */}
      {formData.marca && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-sm space-y-4">
          <h2 className="text-xl font-bold">Editar Auto</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campos de texto */}
            {[{ name: 'marca', label: 'Marca' }, { name: 'modelo', label: 'Modelo' }, { name: 'version', label: 'Versión' }, { name: 'color', label: 'Color' }].map(({ name, label }) => (
              <div key={name} className="flex flex-col">
                <label htmlFor={name} className="font-medium text-sm mb-1">{label}</label>
                <input
                  id={name}
                  name={name}
                  value={formData[name as keyof AutoFormData]}

                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder={label}
                />
              </div>
            ))}

            {/* Año */}
            <div className="flex flex-col">
              <label htmlFor="año" className="font-medium text-sm mb-1">Año</label>
              <input
                id="año"
                name="año"
                value={formData.año}
                onChange={handleChange}
                type="number"
                className="border p-2 rounded"
              />
            </div>

            {/* Precio */}
            <div className="flex flex-col">
              <label htmlFor="precio" className="font-medium text-sm mb-1">Precio</label>
              <input
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                type="number"
                className="border p-2 rounded"
              />
            </div>

            {/* Kilómetros */}
            <div className="flex flex-col">
              <label htmlFor="kilometros" className="font-medium text-sm mb-1">Kilómetros</label>
              <input
                id="kilometros"
                name="kilometros"
                value={formData.kilometros}
                onChange={handleChange}
                type="number"
                className="border p-2 rounded"
              />
            </div>

            {/* Descripción */}
            <div className="flex flex-col col-span-2">
              <label htmlFor="descripcion" className="font-medium text-sm mb-1">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className="border p-2 rounded"
                placeholder="Descripción del auto"
              />
            </div>
          </div>

          {/* Fotos */}
          <div>
            <label
              htmlFor="file-upload"
              className="block text-center p-2 border rounded cursor-pointer"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {dragActive ? 'Suelta las fotos aquí' : 'Arrastra y suelta las fotos o haz clic para subir'}
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`foto-${index}`} className="w-32 h-32 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-white p-1 rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botón de envío */}
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Actualizar Auto
            </button>
          </div>
        </form>
      )}

      {/* Mensaje de éxito */}
      {showSuccess && (
        <div className="mt-4 text-center text-green-600">
          <p>¡Auto actualizado con éxito!</p>
        </div>
      )}
    </div>
  );
}
