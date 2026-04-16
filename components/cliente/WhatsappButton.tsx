"use client";

import Image from "next/image";
import { socialLinks } from "@/lib/site-config";

export default function WhatsappButton() {
  const whatsappLink = socialLinks.find((item) => item.key === "whatsapp")?.href;

  if (!whatsappLink) {
    return null;
  }

  return (
    <a
      href={whatsappLink}
      className="fixed bottom-3 right-3 z-50 rounded-full sm:bottom-4 sm:right-4"
      aria-label="Abrir chat directo de WhatsApp"
    >
      <Image
        src="/logoVarios/logoWhatsappChat.png"
        alt="WhatsApp"
        width={84}
        height={84}
        priority
        className="h-14 w-14 drop-shadow-xl sm:h-20 sm:w-20"
      />
    </a>
  );
}
