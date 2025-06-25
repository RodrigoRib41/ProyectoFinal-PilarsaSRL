"use client"
import Image from "next/image";

export default function WhatsappButton() {
  return (
    <a
      href="https://wa.me/3434694300"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50"
    >
      <Image
        src="/logoVarios/logoWhatsappChat.png" // asegurate de que esté en /public
        alt="WhatsApp"
        width={100}
        height={100}
        priority
      />
    </a>
  );
}
