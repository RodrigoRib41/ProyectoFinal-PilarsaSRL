'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Auto = {
  id: number;
  marca: string;
  modelo: string;
  año: number;
  kilometros: number;
  precio: number;
};

export default function VentasPage() {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [precioVentaEditable, setPrecioVentaEditable] = useState<{ [autoId: number]: string }>({});

  // Estados para filtros
  const [filtroMarca, setFiltroMarca] = useState('');
  const [filtroModelo, setFiltroModelo] = useState('');
  const [filtroAño, setFiltroAño] = useState('');

  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async () => {
    try {
      const res = await axios.get('/api/autos/listado');
      setAutos(res.data);
      const preciosIniciales: { [key: number]: string } = {};
      res.data.forEach((auto: Auto) => {
        preciosIniciales[auto.id] = auto.precio.toString();
      });
      setPrecioVentaEditable(preciosIniciales);
    } catch (error) {
      console.error('Error al cargar autos:', error);
      setMensaje('Error al cargar autos.');
      setModalVisible(true);
    }
  };

  const formatoMiles = (num: number | string) => {
    const n = typeof num === 'number' ? num : parseInt(num.replace(/\./g, ''), 10) || 0;
    return n.toLocaleString('es-AR');
  };

  const handlePrecioChange = (autoId: number, valor: string) => {
    const limpio = valor.replace(/[^0-9]/g, '');
    setPrecioVentaEditable((prev) => ({
      ...prev,
      [autoId]: limpio,
    }));
  };

  const registrarVenta = async (auto: Auto) => {
    setLoading(true);
    setMensaje('');

    try {
      const precioStr = precioVentaEditable[auto.id] || auto.precio.toString();
      const precioNum = parseFloat(precioStr.replace(/\./g, '').replace(',', '.'));
      if (isNaN(precioNum) || precioNum <= 0) {
        setMensaje('Precio de venta inválido.');
        setModalVisible(true);
        setLoading(false);
        return;
      }

      await axios.post('/api/balance/registrar-venta', {
        autoId: auto.id,
        precioVenta: precioNum,
      });

      await axios.delete(`/api/autos/${auto.id}`);

      setMensaje(`Venta registrada para ${auto.marca} ${auto.modelo} por $${formatoMiles(precioNum)}`);
      setModalVisible(true);
      fetchAutos();
    } catch (error) {
      console.error('Error al registrar venta:', error);
      setMensaje('Error al registrar la venta.');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar autos según los filtros (ignorando mayúsculas/minúsculas)
  const autosFiltrados = autos.filter((auto) => {
    const marcaMatch = auto.marca.toLowerCase().includes(filtroMarca.toLowerCase());
    const modeloMatch = auto.modelo.toLowerCase().includes(filtroModelo.toLowerCase());
    const añoMatch = filtroAño === '' || auto.año === Number(filtroAño);

    return marcaMatch && modeloMatch && añoMatch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registrar Venta de Autos</h1>

      {/* Filtros */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Filtrar por Marca"
          value={filtroMarca}
          onChange={(e) => setFiltroMarca(e.target.value)}
          className="border p-2 rounded w-1/3"
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Filtrar por Modelo"
          value={filtroModelo}
          onChange={(e) => setFiltroModelo(e.target.value)}
          className="border p-2 rounded w-1/3"
          disabled={loading}
        />
        <input
          type="number"
          placeholder="Filtrar por Año"
          value={filtroAño}
          onChange={(e) => setFiltroAño(e.target.value)}
          className="border p-2 rounded w-1/3"
          disabled={loading}
          min={1900}
          max={new Date().getFullYear()}
        />
      </div>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Marca</th>
            <th className="p-2 border">Modelo</th>
            <th className="p-2 border">Año</th>
            <th className="p-2 border">Km</th>
            <th className="p-2 border">Precio Sugerido</th>
            <th className="p-2 border">Precio Venta</th>
            <th className="p-2 border">Acción</th>
          </tr>
        </thead>
        <tbody>
          {autosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4">
                No hay autos disponibles.
              </td>
            </tr>
          ) : (
            autosFiltrados.map((auto) => (
              <tr key={auto.id}>
                <td className="p-2 border">{auto.marca}</td>
                <td className="p-2 border">{auto.modelo}</td>
                <td className="p-2 border">{auto.año}</td>
                <td className="p-2 border">{formatoMiles(auto.kilometros)}</td>
                <td className="p-2 border">${formatoMiles(auto.precio)}</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={precioVentaEditable[auto.id] ? formatoMiles(precioVentaEditable[auto.id]) : ''}
                    onChange={(e) => handlePrecioChange(auto.id, e.target.value)}
                    className="border p-1 w-full"
                    disabled={loading}
                  />
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => registrarVenta(auto)}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : 'Registrar Venta'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full text-center shadow-lg">
            <p className="mb-4">{mensaje}</p>
            <button
              onClick={() => setModalVisible(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
