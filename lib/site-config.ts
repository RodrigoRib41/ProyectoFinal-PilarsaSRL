export type AdminNavigationItem = {
  href: string;
  label: string;
  superAdminOnly?: boolean;
};

export type AdminNavigationSection = {
  title: string;
  items: AdminNavigationItem[];
};

export type SocialLinkItem = {
  key: "facebook" | "instagram" | "whatsapp";
  label: string;
  href?: string;
  unavailableMessage: string;
  openInNewTab?: boolean;
};

export const publicNavItems = [
  { href: "/", label: "Inicio" },
  { href: "/0km", label: "0 km" },
  { href: "/usados", label: "Usados" },
  { href: "/promociones", label: "Promociones" },
  { href: "/service", label: "Postventa" },
  { href: "/contacto", label: "Contacto" },
];

export const modelLinks = [
  { href: "/modelo/baicX35", label: "X35", image: "/modelosAgua/aguax35.png" },
  { href: "/modelo/baicX55II", label: "X55 II", image: "/modelosAgua/aguax55II.png" },
  { href: "/modelo/baicX55PLUS", label: "X55 Plus", image: "/modelosAgua/ax55plus.webp" },
  { href: "/modelo/baicBJ30", label: "BJ30", image: "/modelosAgua/abj30.png" },
  { href: "/modelo/baicU5PLUS", label: "U5 Plus", image: "/modelosAgua/aguau5plus.png" },
  { href: "/modelo/baicEU5", label: "EU5", image: "/modelosAgua/aguaeu5.png" },
];

export const adminNavigation: AdminNavigationSection[] = [
  {
    title: "Stock",
    items: [
      { href: "/admin/agregarAuto0km", label: "Publicar 0 km" },
      { href: "/admin/modificarAuto0km", label: "Editar 0 km" },
      { href: "/admin/eliminarAuto0km", label: "Retirar 0 km" },
      { href: "/admin/agregarAutoUsado", label: "Publicar usados" },
      { href: "/admin/modificarAutoUsado", label: "Editar usados" },
      { href: "/admin/eliminarAutoUsado", label: "Retirar usados" },
    ],
  },
  {
    title: "Service",
    items: [
      { href: "/admin/agregarServicios", label: "Programar service" },
      { href: "/admin/listarYmodificarServicies", label: "Gestionar services" },
      { href: "/admin/modificarVehiculo", label: "Parque vehicular" },
      { href: "/admin/repuestosGestion", label: "Repuestos" },
    ],
  },
  {
    title: "Finanzas",
    items: [
      { href: "/admin/ventas", label: "Registrar ventas" },
      { href: "/admin/compras", label: "Registrar compras" },
      { href: "/admin/balance", label: "Balance" },
    ],
  },
  {
    title: "Accesos",
    items: [
      { href: "/admin/usuarios", label: "Gestionar usuarios", superAdminOnly: true },
    ],
  },
];

export const socialLinks: SocialLinkItem[] = [
  {
    key: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/p/Pilarsa-SRL-Automotores-100063692341121/?locale=es_LA",
    unavailableMessage: "Facebook no disponible.",
    openInNewTab: true,
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/pilarsasrlok/?hl=es",
    unavailableMessage: "Instagram no disponible.",
    openInNewTab: true,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/3434694300",
    unavailableMessage: "WhatsApp no disponible.",
    openInNewTab: false,
  },
];
