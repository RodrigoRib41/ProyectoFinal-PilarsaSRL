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
  // Guardamos el valor "limpio" (solo números) en precioVentaEditable
  const [precioVentaEditable, setPrecioVentaEditable] = useState<{ [autoId: number]: string }>({});

  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async () => {
    try {
      const res = await axios.get('/api/autos/listado');
      setAutos(res.data);
      const preciosIniciales: { [key: number]: string } = {};
      res.data.forEach((auto: Auto) => {
        // Guardamos el precio como string limpio (solo números)
        preciosIniciales[auto.id] = auto.precio.toString();
      });
      setPrecioVentaEditable(preciosIniciales);
    } catch (error) {
      console.error('Error al cargar autos:', error);
      setMensaje('Error al cargar autos.');
      setModalVisible(true);
    }
  };

  // Formatear número con puntos cada 3 dígitos, sin decimales
  const formatoMiles = (num: number | string) => {
    const n = typeof num === 'number' ? num : parseInt(num.replace(/\./g, ''), 10) || 0;
    return n.toLocaleString('es-AR');
  };

  const handlePrecioChange = (autoId: number, valor: string) => {
    // Guardar solo números, quitar puntos y cualquier otro carácter
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registrar Venta de Autos</h1>

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
          {autos.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4">
                No hay autos disponibles.
              </td>
            </tr>
          ) : (
            autos.map((auto) => (
              <tr key={auto.id}>
                <td className="p-2 border">{auto.marca}</td>
                <td className="p-2 border">{auto.modelo}</td>
                <td className="p-2 border">{auto.año}</td>
                <td className="p-2 border">{formatoMiles(auto.kilometros)}</td>
                <td className="p-2 border">${formatoMiles(auto.precio)}</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    // Mostrar formateado con puntos, pero guardar limpio
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

      {/* Modal de mensaje */}
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
