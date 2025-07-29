'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const formatMiles = (value: string) => {
  const num = parseInt(value.replace(/\./g, ''), 10);
  if (isNaN(num)) return '';
  return num.toLocaleString('es-AR');
};

interface BalanceItem {
  id: number;
  tipo: 'INGRESO' | 'EGRESO';
  monto: number;
  fecha: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometros: number;
}

export default function RegistrarEgresoPage() {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [kilometros, setKilometros] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [compraAEliminar, setCompraAEliminar] = useState<{ id: number; fecha: string } | null>(null);

  const [compras, setCompras] = useState<BalanceItem[]>([]);
  const [loadingCompras, setLoadingCompras] = useState(false);

  const fetchCompras = async () => {
    setLoadingCompras(true);
    try {
      const res = await axios.get('/api/balance/listado', {
        params: { tipo: 'EGRESO' },
      });
      setCompras(res.data);
    } catch (error) {
      console.error('Error al cargar compras:', error);
    } finally {
      setLoadingCompras(false);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!marca.trim() || !modelo.trim() || !anio.trim() || !kilometros.trim() || !precioCompra.trim()) {
      setMensaje('Por favor, complete todos los campos.');
      setShowError(true);
      return;
    }

    const anioNum = parseInt(anio.replace(/\./g, ''), 10);
    const kmNum = parseInt(kilometros.replace(/\./g, ''), 10);
    const precioNum = parseFloat(precioCompra.replace(/\./g, '').replace(',', '.'));

    if (isNaN(anioNum) || anioNum < 1900 || anioNum > new Date().getFullYear()) {
      setMensaje('Ingrese un año válido.');
      setShowError(true);
      return;
    }

    if (isNaN(kmNum) || kmNum < 0) {
      setMensaje('Ingrese kilómetros válidos.');
      setShowError(true);
      return;
    }

    if (isNaN(precioNum) || precioNum <= 0) {
      setMensaje('Ingrese un precio de compra válido.');
      setShowError(true);
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/balance/registrar-compra', {
        marca: marca.trim(),
        modelo: modelo.trim(),
        año: anioNum,
        kilometros: kmNum,
        precioCompra: precioNum,
      });

      setMensaje('Egreso registrado correctamente.');
      setShowSuccess(true);

      setMarca('');
      setModelo('');
      setAnio('');
      setKilometros('');
      setPrecioCompra('');

      fetchCompras();
    } catch (error) {
      console.error('Error al registrar egreso:', error);
      setMensaje('Error al registrar el egreso.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminacion = (id: number, fecha: string) => {
    const fechaCompra = new Date(fecha);
    const unaSemanaAtras = new Date();
    unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);

    if (fechaCompra < unaSemanaAtras) {
      setMensaje('Solo se pueden eliminar registros de la última semana.');
      setShowError(true);
      return;
    }

    setCompraAEliminar({ id, fecha });
    setShowConfirm(true);
  };

  const eliminarCompra = async () => {
    if (!compraAEliminar) return;

    try {
      await axios.delete('/api/balance/registrar-compra', { params: { id: compraAEliminar.id } });
      setMensaje('Registro eliminado correctamente.');
      setShowSuccess(true);
      fetchCompras();
    } catch (error) {
      console.error('Error al eliminar registro:', error);
      setMensaje('Error al eliminar el registro.');
      setShowError(true);
    } finally {
      setShowConfirm(false);
      setCompraAEliminar(null);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Registrar Egreso (Compra de Auto)</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div>
          <label className="block mb-1 font-semibold">Marca</label>
          <input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="border p-2 w-full rounded"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Modelo</label>
          <input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="border p-2 w-full rounded"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Año</label>
          <input
            type="text"
            inputMode="numeric"
            value={anio}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '');
              setAnio(formatMiles(raw));
            }}
            className="border p-2 w-full rounded"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Kilómetros</label>
          <input
            type="text"
            inputMode="numeric"
            value={kilometros}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '');
              setKilometros(formatMiles(raw));
            }}
            className="border p-2 w-full rounded"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Precio de Compra</label>
          <input
            type="text"
            inputMode="decimal"
            value={precioCompra}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, '');
              setPrecioCompra(formatMiles(raw));
            }}
            className="border p-2 w-full rounded"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Registrando...' : 'Registrar Egreso'}
        </button>
      </form>

      <div className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Compras Registradas (últimos registros)</h2>
        {loadingCompras ? (
          <p className="text-center">Cargando compras...</p>
        ) : compras.length === 0 ? (
          <p className="text-center">No hay compras registradas.</p>
        ) : (
          <table className="w-full border border-gray-300 table-auto mx-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Marca</th>
                <th className="border p-2">Modelo</th>
                <th className="border p-2">Año</th>
                <th className="border p-2">Km</th>
                <th className="border p-2">Monto</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => {
                const fechaCompra = new Date(compra.fecha);
                const unaSemanaAtras = new Date();
                unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);

                const puedeEliminar = fechaCompra >= unaSemanaAtras;

                return (
                  <tr key={compra.id} className="even:bg-gray-50">
                    <td className="border p-2 text-center">{fechaCompra.toLocaleDateString()}</td>
                    <td className="border p-2 text-center">{compra.marca}</td>
                    <td className="border p-2 text-center">{compra.modelo}</td>
                    <td className="border p-2 text-center">{compra.anio}</td>
                    <td className="border p-2 text-right">{compra.kilometros.toLocaleString('es-AR')}</td>
                    <td className="border p-2 text-right">${compra.monto.toLocaleString('es-AR')}</td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => confirmarEliminacion(compra.id, compra.fecha)}
                        disabled={!puedeEliminar}
                        className={`px-3 py-1 rounded text-white ${
                          puedeEliminar ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de éxito */}
      {showSuccess && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">{mensaje}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowSuccess(false)}
                className="bg-green-500 text-white p-2 rounded"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {showError && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">{mensaje}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowError(false)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirm && compraAEliminar && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">
              ¿Estás seguro de que deseas eliminar este registro?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={eliminarCompra}
                className="bg-red-500 text-white p-2 rounded"
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
