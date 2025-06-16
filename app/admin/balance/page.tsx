'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

export default function BalancePage() {
  const [balance, setBalance] = useState<BalanceItem[]>([]);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (fechaDesde) params.desde = fechaDesde;
      if (fechaHasta) params.hasta = fechaHasta;

      const res = await axios.get('/api/balance/listado', { params });
      setBalance(res.data);
    } catch (error) {
      console.error('Error al cargar balance:', error);
    } finally {
      setLoading(false);
    }
  }, [fechaDesde, fechaHasta]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const formatoMiles = (num: number) => num.toLocaleString('es-AR');

  const totalIngresos = balance
    .filter((item) => item.tipo === 'INGRESO')
    .reduce((acc, curr) => acc + curr.monto, 0);

  const totalEgresos = balance
    .filter((item) => item.tipo === 'EGRESO')
    .reduce((acc, curr) => acc + curr.monto, 0);

  const aggregateByDate = (data: BalanceItem[]) => {
    const agrupado: Record<string, { ingreso: number; egreso: number }> = {};

    data.forEach((item) => {
      const fecha = new Date(item.fecha).toLocaleDateString('es-AR');
      if (!agrupado[fecha]) {
        agrupado[fecha] = { ingreso: 0, egreso: 0 };
      }
      if (item.tipo === 'INGRESO') {
        agrupado[fecha].ingreso += item.monto;
      } else {
        agrupado[fecha].egreso += item.monto;
      }
    });

    return Object.entries(agrupado)
      .map(([fecha, valores]) => ({ fecha, ...valores }))
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Balance de Compras y Ventas</h1>

      <div className="mb-4 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Desde</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Hasta</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={fetchBalance}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filtrar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Marca</th>
              <th className="p-2 border">Modelo</th>
              <th className="p-2 border">Año</th>
              <th className="p-2 border">Km</th>
              <th className="p-2 border">Monto</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-4">Cargando...</td>
              </tr>
            ) : balance.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">Sin registros</td>
              </tr>
            ) : (
              balance.map((item) => (
                <tr key={item.id} className={item.tipo === 'EGRESO' ? 'bg-red-50' : 'bg-green-50'}>
                  <td className="p-2 border">{new Date(item.fecha).toLocaleDateString()}</td>
                  <td className="p-2 border font-semibold text-center">{item.tipo}</td>
                  <td className="p-2 border">{item.marca}</td>
                  <td className="p-2 border">{item.modelo}</td>
                  <td className="p-2 border text-center">{item.anio}</td>
                  <td className="p-2 border text-right">{formatoMiles(item.kilometros)}</td>
                  <td className="p-2 border text-right">${formatoMiles(item.monto)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-right space-y-1">
        <p><span className="font-semibold">Total Ingresos:</span> ${formatoMiles(totalIngresos)}</p>
        <p><span className="font-semibold">Total Egresos:</span> ${formatoMiles(totalEgresos)}</p>
        <p className="text-lg font-bold">
          Balance Neto: ${formatoMiles(totalIngresos - totalEgresos)}
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Evolución de Ingresos y Egresos</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={aggregateByDate(balance)}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ingreso" stroke="#22c55e" name="Ingresos" />
            <Line type="monotone" dataKey="egreso" stroke="#ef4444" name="Egresos" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
