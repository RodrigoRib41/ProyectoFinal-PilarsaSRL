"use client"
import { Card,  } from "@/components/ui/card";
import { MapPin, Mail, MessageCircle } from "lucide-react";

const contacts = [
  {
    icon: <MapPin size={40} />,
    title: "Diamante, Entre Ríos",
    description: "3 de Febrero Nº 670"
  },
  {
    icon: <MapPin size={40} />,
    title: "Diamante, Entre Ríos",
    description: "Av Peron y Bv. Quintas y Chacras"
  },
  {
    icon: <MessageCircle size={40} />,
    title: "WhatsApp",
    description: "Wsp: 3434-694300"
  },
  {
    icon: <Mail size={40} />,
    title: "Email",
    description: "pilarsasrl@gmail.com"
  }
];

export default function ContactSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {contacts.map((contact, index) => (
        <Card key={index} className="flex flex-col items-center p-6 text-center hover:shadow-lg transition">
          <div className="text-4xl mb-4 text-primary">{contact.icon}</div>
          <h3 className="text-lg font-semibold text-gray-800">{contact.title}</h3>
          <p className="text-gray-600">{contact.description}</p>
        </Card>
      ))}
    </div>
  );
}