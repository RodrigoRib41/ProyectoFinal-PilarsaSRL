"use client";

import Image from "next/image";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 px-4 md:px-16">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo y texto */}
        <div className="flex flex-col items-center md:items-start">
          <Image src="/logoVarios/logoPilarsaagua.png" alt="Logo" width={150} height={50} />
          <p className="text-gray-400 mt-2 text-sm">Concesionario Oficial BAIC</p>
        </div>

        {/* Enlaces */}
        <div className="mt-6 md:mt-0 text-center md:text-left">
          <h3 className="font-semibold">Información</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link href="/contacto" className="text-gray-400 hover:text-white">Contáctenos</Link>
            </li>
            <li>
              <Link href="/sugerencias" className="text-gray-400 hover:text-white">Sugerencias y Reclamos</Link>
            </li>
          </ul>
        </div>

        {/* Redes Sociales */}
        <div className="flex flex-col items-center">
          <h3 className="font-semibold">Redes Sociales</h3>
          <div className="flex gap-4 mt-2">
            <Link href="#" target="_blank">
              <div className="p-2 bg-gray-700 rounded-full hover:bg-gray-500">
                <FacebookIcon size={20} className="text-white" />
              </div>
            </Link>
            <Link href="#" target="_blank">
              <div className="p-2 bg-gray-700 rounded-full hover:bg-gray-500">
                <InstagramIcon size={20} className="text-white" />
              </div>
            </Link>
            <Link href="#" target="_blank">
              <div className="p-2 bg-gray-700 rounded-full hover:bg-gray-500">
                <MessageCircle size={20} className="text-white" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

