'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  version: string;
  año: number;
  precio: number;
  precioPromocional?: number;
  moneda: string;
  kilometros: number;
  color: string;
  categoria: string;
  descripcion: string;
  foto1?: string;
  foto2?: string;
  foto3?: string;
  foto4?: string;
}

interface SearchFilters {
  marca: string;
  modelo: string;
  año: string;
}

type FotoFields = (File | string | null)[];

export default function ModificarAuto() {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [filteredAutos, setFilteredAutos] = useState<Auto[]>([]);
  const [formData, setFormData] = useState<Omit<Auto, 'foto1' | 'foto2' | 'foto3' | 'foto4'>>(defaultFormData());
  const [fotos, setFotos] = useState<FotoFields>([null, null, null, null]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({ marca: '', modelo: '', año: '' });
  const [marcas, setMarcas] = useState<string[]>([]);
  const [modelos, setModelos] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  function defaultFormData() {
    return {
      id: 0,
      marca: '',
      modelo: '',
      version: '',
      año: 0,
      precio: 0,
      precioPromocional: 0,
      moneda: '$',
      kilometros: 0,
      color: '',
      categoria: 'Usado',
      descripcion: '',
    };
  }

  useEffect(() => {
    const fetchAutos = async () => {
      try {
        const res = await fetch('/api/autos');
        const data: Auto[] = await res.json();
        setAutos(data);
        setFilteredAutos(data);
        setMarcas([...new Set(data.map(a => a.marca))]);
        setModelos([...new Set(data.map(a => a.modelo))]);
      } catch (err) {
        console.error(err);
        alert('Error al obtener autos');
      }
    };
    fetchAutos();
  }, []);

  useEffect(() => {
    setFilteredAutos(
      autos.filter(auto =>
        (!searchFilters.marca || auto.marca.toLowerCase().includes(searchFilters.marca.toLowerCase())) &&
        (!searchFilters.modelo || auto.modelo.toLowerCase().includes(searchFilters.modelo.toLowerCase())) &&
        (!searchFilters.año || auto.año === +searchFilters.año)
      )
    );
  }, [autos, searchFilters]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAutoSelect = (id: number) => {
    const selected = autos.find(a => a.id === id);
    if (selected) {
      setFormData({
        id: selected.id,
        marca: selected.marca,
        modelo: selected.modelo,
        version: selected.version,
        año: selected.año,
        precio: selected.precio,
        precioPromocional: selected.precioPromocional ?? 0,
        moneda: selected.moneda,
        kilometros: selected.kilometros,
        color: selected.color,
        categoria: selected.categoria,
        descripcion: selected.descripcion,
      });

      setFotos([
        selected.foto1 || null,
        selected.foto2 || null,
        selected.foto3 || null,
        selected.foto4 || null,
      ]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'precioPromocional' && +value < 0) return;

    setFormData(prev => ({
      ...prev,
      [name]: ['año', 'precio', 'kilometros', 'precioPromocional'].includes(name) ? +value : value,
    }));
  };

  const handleFotoChange = (index: number, file: File) => {
    setFotos(prev => {
      const newFotos = [...prev];
      newFotos[index] = file;
      return newFotos;
    });
  };

  const handleRemoveFoto = (index: number) => {
    setFotos(prev => {
      const newFotos = [...prev];
      newFotos[index] = null;
      return newFotos;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, String(value));
    });

    fotos.forEach((foto, idx) => {
      const key = `foto${idx + 1}`;
      if (foto instanceof File) {
        formDataToSend.append(key, foto);
      } else if (typeof foto === 'string') {
        formDataToSend.append(key, foto);
      } else {
        formDataToSend.append(key, '');
      }
    });

    try {
      const res = await fetch(`/api/autos/${formData.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!res.ok) throw new Error('Error al actualizar');

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setShowError(true);
    }
  };

  return (
    
    <div className="grid grid-cols-1 gap-4">
      <h1 className="text-2xl font-bold mb-4">Modificar Auto</h1>

      {/* Filtros */}
    
        <h2 className="font-semibold mb-2">Buscar Auto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select name="marca" value={searchFilters.marca} onChange={handleSearchChange} className="border p-2 rounded">
            <option value="">Selecciona una marca...</option>
            {marcas.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select name="modelo" value={searchFilters.modelo} onChange={handleSearchChange} className="border p-2 rounded">
            <option value="">Selecciona un modelo...</option>
            {modelos.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select name="año" value={searchFilters.año} onChange={handleSearchChange} className="border p-2 rounded">
            <option value="">Selecciona un año...</option>
            {Array.from({ length: 26 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
      


      {/* Resultados */}
{/*<section className="mb-6 bg-gray-50 p-4 rounded shadow-sm">*/}
  <h2 className="font-semibold mb-2">Resultados</h2>
  <div className="max-h-64 overflow-y-auto border rounded mb-4">
    <table className="min-w-full text-sm text-left table-fixed">
      <thead className="sticky top-0 bg-white z-10">
        <tr>
          <th className="px-4 py-2 border-b w-1/4">Marca</th>
              <th className="px-4 py-2 border-b w-1/4">Modelo</th>
              <th className="px-4 py-2 border-b w-1/4">Año</th>
              <th className="px-4 py-2 border-b w-1/4">Kilómetros</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {filteredAutos.map(auto => (
          <tr
            key={auto.id}
            onClick={() => {
              handleAutoSelect(auto.id);
              const formSection = document.querySelector('form');
              if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
            }}
            className="cursor-pointer hover:bg-blue-50 transition duration-150"
          >
            <td className="px-4 py-2 text-sm">{auto.marca}</td>
            <td className="px-4 py-2 text-sm">{auto.modelo}</td>
            <td className="px-4 py-2 text-sm">{auto.año}</td>
            <td className="px-4 py-2 text-sm">{auto.kilometros.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
{/*</section>*/}




      {/* Formulario */}
      {formData.marca && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-sm space-y-4">
          <h2 className="text-xl font-bold">Editar Auto</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campos de texto */}
            {['marca', 'modelo', 'version', 'color'].map(name => (
              <div key={name} className="flex flex-col">
                <label htmlFor={name} className="font-medium text-sm mb-1">{name.charAt(0).toUpperCase() + name.slice(1)}</label>
                <input
                  id={name}
                  name={name}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value={(formData as Record<string, any>)[name]}

                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder={name}
                />
              </div>
            ))}
            <div className="flex flex-col">
              <label htmlFor="año" className="font-medium text-sm mb-1">Año</label>
              <input id="año" name="año" value={formData.año} onChange={handleChange} type="number" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="precio" className="font-medium text-sm mb-1">Precio</label>
              <input id="precio" name="precio" value={formData.precio} onChange={handleChange} type="number" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="kilometros" className="font-medium text-sm mb-1">Kilómetros</label>
              <input id="kilometros" name="kilometros" value={formData.kilometros} onChange={handleChange} type="number" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="precioPromocional" className="font-medium text-sm mb-1">Precio Promocional</label>
              <input
                id="precioPromocional"
                name="precioPromocional"
                value={formData.precioPromocional || 0}
                onChange={handleChange}
                type="number"
                className="border p-2 rounded"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="flex flex-col col-span-2">
            <label htmlFor="descripcion" className="font-medium text-sm mb-1">Descripción</label>
            <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4} className="border p-2 rounded" />
          </div>

          {/* Fotos */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Fotos</h3>
            <div className="flex gap-4 flex-wrap">
              {fotos.map((foto, index) => (
                <div key={index} className="relative w-32 h-32 border rounded flex items-center justify-center">
                  {foto ? (
                    <>
                      <img
                        src={foto instanceof File ? URL.createObjectURL(foto) : foto}
                        alt={`foto-${index}`}
                        className="object-cover w-full h-full rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFoto(index)}
                        className="absolute top-0 right-0 bg-white rounded-full p-1"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer">
                      <span className="text-sm text-gray-400">Subir</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFotoChange(index, e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="mt-4">
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Actualizar Auto
            </button>
          </div>

          {/* Modal de éxito */}
 {showSuccess && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
          <p className="text-black font-bold">¡Vehiculo modificado con éxito!</p>
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
            <p className="text-black font-bold">Hubo un error al modificar el vehiculo</p>
            <div className="flex justify-center mt-4">
            <button onClick={() => setShowError(false)} className="bg-red-500 text-white p-2 rounded mt-4">
              Aceptar
            </button>
            </div>
          </div>
        </div>
      )}
        </form>
      )}
    </div>
  );
}