"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

type Auto = {
  id: number;
  marca: string;
  modelo: string;
  año: number;
};

export default function AutoEditForm() {
  const { register, handleSubmit, setValue } = useForm<Auto>();
  const [autos, setAutos] = useState<Auto[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Cargar autos desde la base de datos
  useEffect(() => {
    axios.get("/api/autos")
      .then(res => setAutos(res.data))
      .catch(err => console.error("Error cargando autos:", err));
  }, []);

  // Cuando se selecciona un auto, setear los campos en el formulario
  useEffect(() => {
    if (selectedId !== null) {
      const auto = autos.find(a => a.id === selectedId);
      if (auto) {
        setValue("marca", auto.marca);
        setValue("modelo", auto.modelo);
        setValue("año", auto.año);
      }
    }
  }, [selectedId, autos, setValue]);

  const onSubmit = (data: Auto) => {
    if (selectedId === null) return;

    axios.put(`/api/autos/${selectedId}`, data)
      .then(() => {
        alert("Auto actualizado correctamente");
      })
      .catch(err => {
        console.error("Error al actualizar el auto:", err);
        alert("Ocurrió un error al actualizar");
      });
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Editar Auto</h2>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Seleccionar auto:
      </label>
      <select
        className="w-full p-2 mb-4 border rounded"
        onChange={(e) => setSelectedId(Number(e.target.value))}
        defaultValue=""
      >
        <option value="" disabled>-- Selecciona un auto --</option>
        {autos.map(auto => (
          <option key={auto.id} value={auto.id}>
            {auto.marca} {auto.modelo} ({auto.año})
          </option>
        ))}
      </select>

      {selectedId !== null && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block">Marca:</label>
            <input {...register("marca")} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block">Modelo:</label>
            <input {...register("modelo")} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block">Año:</label>
            <input type="number" {...register("año")} className="w-full p-2 border rounded" />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </form>
      )}
    </div>
  );
}
