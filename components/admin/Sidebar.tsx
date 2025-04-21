import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      {/* Logo */}
      <div className="text-2xl font-bold mb-6 flex items-center space-x-2">
        <Image src="/logoVarios/logoPilarsa.png" alt="Logo" width={52} height={35} />
        <span>Pilarsa Admin</span>
      </div>

      {/* Navegación */}
      <nav className="space-y-2">
        <Link href="/admin/agregarAutoUsado" className="block hover:bg-gray-700 p-2 rounded">
          Agregar Auto Usado
        </Link>
        <Link href="/admin/eliminarAutoUsado" className="block hover:bg-gray-700 p-2 rounded">
          Eliminar Auto Usado
        </Link>
        <Link href="/admin/modificarAutoUsado" className="block hover:bg-gray-700 p-2 rounded">
          Modificar Auto Usado
        </Link>
        <Link href="/admin/servicios" className="block hover:bg-gray-700 p-2 rounded">
          Services
        </Link>
      </nav>
    </aside>
  );
}
