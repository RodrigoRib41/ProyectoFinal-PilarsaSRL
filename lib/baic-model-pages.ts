export type BaicModelCard = {
  title: string;
  description: string;
};

export type BaicModelFeature = {
  title: string;
  description: string;
  bullets: string[];
  image: string;
};

export type BaicModelStat = {
  label: string;
  value: string;
};

export type BaicModelColor = {
  name: string;
  image: string;
};

export type BaicModelGalleryItem = {
  src: string;
  alt: string;
};

export type BaicModelPageContent = {
  slug: string;
  name: string;
  eyebrow: string;
  headline: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  heroBackground: string;
  heroAccent: string;
  officialUrl: string;
  officialLabel: string;
  sourceNote: string;
  stats: BaicModelStat[];
  highlightCards: BaicModelCard[];
  features: BaicModelFeature[];
  specs: BaicModelStat[];
  gallery: BaicModelGalleryItem[];
  colors: BaicModelColor[];
  videoSrc?: string;
  videoPoster?: string;
};

export const baicModelPages: Record<string, BaicModelPageContent> = {
  baicX35: {
    slug: "baicX35",
    name: "X35",
    eyebrow: "SUV compacta BAIC",
    headline:
      "Una puerta de entrada muy equilibrada al universo BAIC, con formato urbano, buena altura y una cabina simple de usar.",
    description:
      "La X35 mezcla tamano contenido, despeje generoso y una puesta a punto pensada para moverse facil en ciudad sin perder presencia visual ni practicidad para el uso diario.",
    heroImage: "/modelos/x35/x35azul.png",
    heroAlt: "BAIC X35 vista principal",
    heroBackground:
      "radial-gradient(circle at top left, rgba(34,211,238,0.28), transparent 30%), radial-gradient(circle at right center, rgba(251,191,36,0.18), transparent 24%), linear-gradient(135deg, #020617 0%, #0f172a 58%, #164e63 100%)",
    heroAccent: "#22d3ee",
    officialUrl: "https://www.baicglobal.com/es/models/21?id=73",
    officialLabel: "Ver ficha oficial BAIC",
    sourceNote:
      "Caracteristicas resumidas a partir de BAIC Global. El equipamiento puede variar segun mercado y version.",
    stats: [
      { label: "Potencia", value: "110 kW" },
      { label: "Torque", value: "210 Nm" },
      { label: "Distancia entre ejes", value: "2570 mm" },
      { label: "Baul", value: "390 L" },
    ],
    highlightCards: [
      {
        title: "Tamano justo para todos los dias",
        description:
          "Su formato compacto ayuda a estacionar, moverse en ciudad y mantener una imagen SUV clara.",
      },
      {
        title: "Cabina directa y funcional",
        description:
          "Volante multifuncion, conectividad movil y mandos faciles de ubicar para una experiencia sencilla.",
      },
      {
        title: "Base de seguridad solida",
        description:
          "ESP, TCS, TPMS, camara trasera segun version y multiples airbags completan el planteo.",
      },
    ],
    features: [
      {
        title: "Diseno con postura SUV",
        description:
          "La carroceria elevada, las barras de techo y las llantas de hasta 17 pulgadas le dan una imagen fresca y bien proporcionada.",
        bullets: [
          "4300 mm aprox. de largo con buen despeje visual",
          "Techo con barras y detalles que refuerzan su perfil urbano",
          "Faros LED y firma simple pero actual",
        ],
        image: "/modelos/x35/x35primera.JPG",
      },
      {
        title: "Uso diario sin vueltas",
        description:
          "La X35 apunta a quien prioriza comodidad, controles claros y un interior que no abruma.",
        bullets: [
          "Pantalla de 8 pulgadas con mobile connect",
          "Asientos traseros rebatibles 4/6",
          "Freno de estacionamiento EPB segun configuracion",
        ],
        image: "/modelos/x35/x35segunda.jpg",
      },
      {
        title: "Apoyo electronico para conducir tranquilo",
        description:
          "ABS, EBD, EBA, control de estabilidad y asistencia en pendiente forman un paquete competitivo para la categoria.",
        bullets: [
          "ESP y TCS de serie en la ficha global",
          "Camara trasera y radar segun version",
          "TPMS y anclajes ISOFIX incluidos",
        ],
        image: "/modelos/x35/x35tercera.jpg",
      },
    ],
    specs: [
      { label: "Motor", value: "1.5T" },
      { label: "Transmision", value: "6MT / CVT segun version" },
      { label: "Traccion", value: "Delantera" },
      { label: "Tanque", value: "46 L" },
      { label: "Despeje", value: "180 mm" },
      { label: "Pantalla central", value: '8"' },
    ],
    gallery: [
      { src: "/modelos/x35/x35primera.JPG", alt: "BAIC X35 exterior frontal" },
      { src: "/modelos/x35/x35segunda.jpg", alt: "BAIC X35 interior y lateral" },
      { src: "/modelos/x35/x35tercera.jpg", alt: "BAIC X35 detalle exterior" },
      { src: "/modelos/x35/x35cuarta.jpg", alt: "BAIC X35 vista trasera" },
    ],
    colors: [
      { name: "Azul", image: "/modelos/x35/x35azul.png" },
      { name: "Blanco", image: "/modelos/x35/x35blanca.png" },
      { name: "Bronce", image: "/modelos/x35/x35bronce.png" },
      { name: "Rojo", image: "/modelos/x35/x35roja.png" },
    ],
  },
  baicX55II: {
    slug: "baicX55II",
    name: "X55 II",
    eyebrow: "SUV mediana BAIC",
    headline:
      "Una SUV con planteo mas deportivo, tren motriz turbo y una plataforma que ya se siente en un escalon superior.",
    description:
      "La X55 II sube el nivel en presencia, torque y refinamiento. El formato es mas largo, la distancia entre ejes mejora el espacio y el conjunto 1.5T con 7DCT le da una respuesta mucho mas contundente.",
    heroImage: "/modelos/x55/x55Rojo.png",
    heroAlt: "BAIC X55 II vista principal",
    heroBackground:
      "radial-gradient(circle at top left, rgba(16,185,129,0.24), transparent 30%), radial-gradient(circle at right center, rgba(56,189,248,0.18), transparent 22%), linear-gradient(135deg, #020617 0%, #0f172a 56%, #0f766e 100%)",
    heroAccent: "#14b8a6",
    officialUrl: "https://www.baicglobal.com/es/models/26",
    officialLabel: "Ver ficha oficial BAIC",
    sourceNote:
      "Datos resumidos a partir de BAIC Global. Algunas asistencias y elementos de confort cambian segun la version.",
    stats: [
      { label: "Potencia", value: "138 kW" },
      { label: "Torque", value: "305 Nm" },
      { label: "Distancia entre ejes", value: "2735 mm" },
      { label: "Baul", value: "350 L" },
    ],
    highlightCards: [
      {
        title: "Motor turbo con mucha respuesta",
        description:
          "El 1.5T entrega 305 Nm desde bajas vueltas y se combina con caja 7DCT para una conduccion agil.",
      },
      {
        title: "Plataforma mas refinada",
        description:
          "Suspension trasera multilink, trocha visual mas ancha y mejor estabilidad para uso diario y ruta.",
      },
      {
        title: "Tecnologia disponible en serio",
        description:
          "Drive modes, techo panoramico, porton electrico y ADAS segun versiones altas del modelo.",
      },
    ],
    features: [
      {
        title: "Imagen dinamica y actual",
        description:
          "La silueta es mas limpia y atletica, con manijas ocultas, llantas grandes y una postura mas ancha.",
        bullets: [
          "Hasta 19 pulgadas segun configuracion",
          "Techo panoramico en versiones superiores",
          "Manijas integradas y perfil muy limpio",
        ],
        image: "/modelos/x55/x55primera.jpg",
      },
      {
        title: "Cabina digital con mejor equipamiento",
        description:
          "El tablero digital y la pantalla central de 10 pulgadas concentran la experiencia de manejo.",
        bullets: [
          'Panel digital de 10"',
          'Pantalla central de 10"',
          "Apple CarPlay y conectividad movil",
        ],
        image: "/modelos/x55/x55segunda.jpg",
      },
      {
        title: "Mas confianza en ruta",
        description:
          "El conjunto suma control de descenso, arranque en pendiente, control de estabilidad y ayudas ADAS segun version.",
        bullets: [
          "HDC, HAC, EPB y Auto Hold",
          "Camara 360 y sensores segun version",
          "ADAS disponibles en los niveles mas completos",
        ],
        image: "/modelos/x55/x55tercera.jpg",
      },
    ],
    specs: [
      { label: "Motor", value: "1.5T A156T2H" },
      { label: "Transmision", value: "7DCT" },
      { label: "Traccion", value: "Delantera" },
      { label: "Tanque", value: "53 L" },
      { label: "Neumaticos", value: "18 o 19 pulgadas" },
      { label: "Pantallas", value: '10" + 10"' },
    ],
    gallery: [
      { src: "/modelos/x55/x55primera.jpg", alt: "BAIC X55 II vista frontal" },
      { src: "/modelos/x55/x55segunda.jpg", alt: "BAIC X55 II interior" },
      { src: "/modelos/x55/x55tercera.jpg", alt: "BAIC X55 II vista lateral" },
      { src: "/modelos/x55/x55cuarta.jpg", alt: "BAIC X55 II vista trasera" },
    ],
    colors: [
      { name: "Blanco", image: "/modelos/x55/x55Blanco.png" },
      { name: "Gris", image: "/modelos/x55/x55Gris.png" },
      { name: "Gris oscuro", image: "/modelos/x55/x55GrisOscuro.png" },
      { name: "Rojo", image: "/modelos/x55/x55Rojo.png" },
      { name: "Amarillo", image: "/modelos/x55/x55Amarillo.png" },
    ],
  },
  baicX55PLUS: {
    slug: "baicX55PLUS",
    name: "X55 Plus",
    eyebrow: "SUV lifestyle BAIC",
    headline:
      "La lectura mas sofisticada del formato X55: mas presencia, mejor puesta visual y una atmosfera claramente premium.",
    description:
      "La X55 Plus empuja a BAIC hacia un lenguaje mas ambicioso. Mantiene la base 1.5T + 7DCT, pero se apoya en un look mas expresivo, mas asistencias y una cabina con mejor sensacion de categoria.",
    heroImage: "/modelos/x55Plus/x55PlusRoja.webp",
    heroAlt: "BAIC X55 Plus vista principal",
    heroBackground:
      "radial-gradient(circle at top left, rgba(244,114,182,0.24), transparent 30%), radial-gradient(circle at right center, rgba(249,115,22,0.18), transparent 22%), linear-gradient(135deg, #111827 0%, #1f2937 56%, #7c2d12 100%)",
    heroAccent: "#fb7185",
    officialUrl: "https://baic.pe/modelo/new-x55-plus/",
    officialLabel: "Ver ficha oficial BAIC",
    sourceNote:
      "Contenido resumido a partir de BAIC Peru y referencias oficiales de la familia X55. El equipamiento puede variar entre mercados.",
    stats: [
      { label: "Potencia", value: "185 hp" },
      { label: "Torque", value: "305 Nm" },
      { label: "Distancia entre ejes", value: "2735 mm" },
      { label: "Baul", value: "350 L" },
    ],
    highlightCards: [
      {
        title: "Presencia de SUV mas aspiracional",
        description:
          "Iluminacion LED, detalles mas afilados, llantas deportivas y un perfil mas logrado para quien valora imagen.",
      },
      {
        title: "Confort y manejo mejor resueltos",
        description:
          "Caja 7DCT, modos de conduccion, doble zona y una cabina con sensacion mucho mas moderna.",
      },
      {
        title: "ADAS y seguridad segun version",
        description:
          "Control crucero adaptativo, alertas de colision y asistencias de carril aparecen en los niveles mas completos.",
      },
    ],
    features: [
      {
        title: "Diseno que busca destacar",
        description:
          "La X55 Plus esta trabajada como un producto de imagen, con superficies limpias, postura fuerte y detalles deportivos.",
        bullets: [
          "Longitud de 4620 mm y postura bien plantada",
          "Faros LED, escape visual deportivo y llantas de aleacion",
          "Lectura visual mucho mas protagonista que en una SUV media tradicional",
        ],
        image: "/modelos/x55Plus/x55PlusDisenio.jpg",
      },
      {
        title: "Cabina digital y conectada",
        description:
          "La combinacion de tablero digital, pantalla tactil y climatizacion de doble zona mejora mucho la percepcion general.",
        bullets: [
          'Pantalla tactil de 10.1" y cluster digital de 10.25"',
          "Keyless entry, start/stop y volante multifuncion",
          "Modos Sport, Comfort, ECO y Smart",
        ],
        image: "/modelos/x55Plus/X55PlusPanel.webp",
      },
      {
        title: "Seguridad para subir de categoria",
        description:
          "La ficha regional suma TPMS, control de estabilidad, HDC/HHC y paquetes ADAS en configuraciones superiores.",
        bullets: [
          "ESP, EBD, EBA, BOS y freno electrico",
          "TPMS, ISOFIX y camaras segun configuracion",
          "ADAS segun version: ACC, AEB, BSD, FCW y asistentes de carril",
        ],
        image: "/modelos/x55Plus/X55PlusBSD.webp",
      },
    ],
    specs: [
      { label: "Motor", value: "1.5T" },
      { label: "Transmision", value: "7DCT" },
      { label: "Traccion", value: "Delantera" },
      { label: "Tanque", value: "53 L" },
      { label: "Neumaticos", value: "225/60 R18 a 225/55 R19" },
      { label: "Pantallas", value: '10.1" + 10.25"' },
    ],
    gallery: [
      { src: "/modelos/x55Plus/x55PlusDisenio.jpg", alt: "BAIC X55 Plus diseno frontal" },
      { src: "/modelos/x55Plus/X55PlusInterior.webp", alt: "BAIC X55 Plus interior" },
      { src: "/modelos/x55Plus/X55PlusSegunda.jpg", alt: "BAIC X55 Plus vista lateral" },
      { src: "/modelos/x55Plus/x55PlusTrasero.jpg", alt: "BAIC X55 Plus vista trasera" },
    ],
    colors: [
      { name: "Azul", image: "/modelos/x55Plus/x55PlusAzul.webp" },
      { name: "Blanco", image: "/modelos/x55Plus/x55PlusBlanca.webp" },
      { name: "Gris", image: "/modelos/x55Plus/x55PlusGris.webp" },
      { name: "Negro", image: "/modelos/x55Plus/x55PlusNegra.webp" },
      { name: "Plata", image: "/modelos/x55Plus/x55PlusPlata.webp" },
      { name: "Rojo", image: "/modelos/x55Plus/x55PlusRoja.webp" },
    ],
    videoSrc: "/x55PlusVideo.webm",
    videoPoster: "/modelos/x55Plus/x55PlusRoja.webp",
  },
  baicBJ30: {
    slug: "baicBJ30",
    name: "BJ30",
    eyebrow: "SUV adventure BAIC",
    headline:
      "Una propuesta con ADN adventure, mucha personalidad y una cabina que apuesta fuerte por la tecnologia.",
    description:
      "La BJ30 busca un perfil diferente dentro de la gama: estetica mas robusta, cockpit digital grande y recursos pensados para salir de la rutina sin resignar confort ni presencia.",
    heroImage: "/modelos/bj30/BJ30verde.webp",
    heroAlt: "BAIC BJ30 vista principal",
    heroBackground:
      "radial-gradient(circle at top left, rgba(163,230,53,0.20), transparent 28%), radial-gradient(circle at right center, rgba(251,191,36,0.18), transparent 22%), linear-gradient(135deg, #111827 0%, #1f2937 56%, #365314 100%)",
    heroAccent: "#84cc16",
    officialUrl: "https://www.baicglobal.com/models/43/",
    officialLabel: "Ver pagina oficial BAIC",
    sourceNote:
      "Descripcion y destacados trabajados sobre la pagina oficial de BAIC Global para BJ30. El detalle tecnico puede variar segun mercado.",
    stats: [
      { label: "Pantallas", value: '10.25" + 14.6"' },
      { label: "Ambientacion", value: "64 colores" },
      { label: "Traccion y control", value: "ATS todo terreno" },
      { label: "Enfoque", value: "Adventure SUV" },
    ],
    highlightCards: [
      {
        title: "Identidad distinta dentro de BAIC",
        description:
          "La BJ30 no intenta pasar desapercibida: firma luminica, postura robusta y detalles con tono off-road.",
      },
      {
        title: "Cockpit muy protagonista",
        description:
          "El tablero suma doble pantalla grande y un selector electronico con planteo mas tecnologico.",
      },
      {
        title: "Pensada para escapadas",
        description:
          "La pagina oficial pone el foco en control de terrenos, flexibilidad interior y una estructura muy reforzada.",
      },
    ],
    features: [
      {
        title: "Imagen robusta y muy marcada",
        description:
          "Desde la firma luminica hasta el parante trasero, la BJ30 esta construida para verse mas aventurera que una SUV convencional.",
        bullets: [
          "Estetica frontal con lenguaje mas tecnico",
          "Defensa y lineas rectas que refuerzan la idea adventure",
          "Techo con gran capacidad de carga y postura elevada",
        ],
        image: "/modelos/bj30/BJ30primera.JPG",
      },
      {
        title: "Cabina grande, luminosa y digital",
        description:
          "La propuesta interior mezcla doble pantalla, luz ambiente y soluciones de espacio con foco en confort.",
        bullets: [
          'Cluster de 10.25" con multimedia de 14.6"',
          "Iluminacion ambiente de 64 colores",
          "Configuracion interior flexible para equipaje o escapadas",
        ],
        image: "/modelos/bj30/BJ30segundaP.jpg",
      },
      {
        title: "Capacidad y seguridad estructural",
        description:
          "La informacion oficial destaca el sistema ATS todo terreno y un cuerpo con estructura optimizada para impactos.",
        bullets: [
          "ATS para adaptar controles a diferentes superficies",
          "Chasis solido para caminos complejos",
          "Estructura frontal de absorcion en tres etapas",
        ],
        image: "/modelos/bj30/BJ30tercera1.jpg",
      },
    ],
    specs: [
      { label: "Concepto", value: "SUV adventure" },
      { label: "Paneles", value: '10.25" + 14.6"' },
      { label: "Luz ambiente", value: "64 colores" },
      { label: "Selector", value: "Electronico tipo thruster" },
      { label: "Control", value: "ATS todo terreno" },
      { label: "Cabina", value: "Espacio flexible para uso mixto" },
    ],
    gallery: [
      { src: "/modelos/bj30/BJ30primera.JPG", alt: "BAIC BJ30 vista frontal" },
      { src: "/modelos/bj30/BJ30segundaP.jpg", alt: "BAIC BJ30 vista lateral" },
      { src: "/modelos/bj30/BJ30tercera1.jpg", alt: "BAIC BJ30 detalle exterior" },
      { src: "/modelos/bj30/BJ30cuartaP.jpg", alt: "BAIC BJ30 interior y tecnologia" },
    ],
    colors: [
      { name: "Blanco", image: "/modelos/bj30/BJ30blanca.webp" },
      { name: "Gris", image: "/modelos/bj30/BJ30gris.webp" },
      { name: "Negro", image: "/modelos/bj30/BJ30negra.webp" },
      { name: "Verde", image: "/modelos/bj30/BJ30verde.webp" },
    ],
  },
  baicU5PLUS: {
    slug: "baicU5PLUS",
    name: "U5 Plus",
    eyebrow: "Sedan BAIC",
    headline:
      "Un sedan pensado para quien prioriza espacio, silencio de marcha y una presentacion moderna sin salirse de un enfoque racional.",
    description:
      "La U5 Plus trabaja sobre confort, baul generoso y una cabina mas refinada que la de un sedan basico. Es una propuesta clara para uso familiar, remises premium o kilometraje diario.",
    heroImage: "/modelos/u5PLUS/U5PlusRojo.png",
    heroAlt: "BAIC U5 Plus vista principal",
    heroBackground:
      "radial-gradient(circle at top left, rgba(59,130,246,0.24), transparent 30%), radial-gradient(circle at right center, rgba(148,163,184,0.18), transparent 22%), linear-gradient(135deg, #0f172a 0%, #1e293b 56%, #1d4ed8 100%)",
    heroAccent: "#60a5fa",
    officialUrl: "https://www.baicglobal.com/es/models/17?id=74",
    officialLabel: "Ver ficha oficial BAIC",
    sourceNote:
      "Datos resumidos a partir de BAIC Global. Las asistencias y los elementos de confort pueden cambiar segun nivel de equipamiento.",
    stats: [
      { label: "Potencia", value: "83 kW" },
      { label: "Torque", value: "142 Nm" },
      { label: "Distancia entre ejes", value: "2670 mm" },
      { label: "Baul", value: "430 L" },
    ],
    highlightCards: [
      {
        title: "Sedan espacioso de verdad",
        description:
          "La distancia entre ejes y el baul de 430 litros lo vuelven una opcion muy amigable para uso familiar o laboral.",
      },
      {
        title: "Cabina silenciosa y agradable",
        description:
          "La propia comunicacion oficial habla de una experiencia de cabina muy tranquila, con foco en confort diario.",
      },
      {
        title: "Equipamiento bien enfocado",
        description:
          "Pantalla de 12.3 pulgadas, buena conectividad, radar trasero y recursos de seguridad disponibles en niveles altos.",
      },
    ],
    features: [
      {
        title: "Perfil elegante, sin exageraciones",
        description:
          "La U5 Plus evita el exceso visual y trabaja mejor las proporciones para verse mas madura que un sedan de entrada.",
        bullets: [
          "4660 mm de largo para ganar presencia",
          "Baul de 430 litros",
          "Firma trasera LED continua segun ficha oficial",
        ],
        image: "/modelos/u5PLUS/U5primera.jpg",
      },
      {
        title: "Habitaculo claro y moderno",
        description:
          "La pieza fuerte es el tablero digital y la pantalla central, que ayudan a modernizar la experiencia general.",
        bullets: [
          'Pantalla central de 12.3"',
          "Cluster digital y volante multifuncion",
          "Materiales PVC / microfibra segun version",
        ],
        image: "/modelos/u5PLUS/U5segunda.jpg",
      },
      {
        title: "Seguridad y ayudas disponibles",
        description:
          "ESP, TCS, EPB, Auto Hold y paquetes mas completos con 360, BSD y LDW elevan mucho su valor percibido.",
        bullets: [
          "ESP + TCS + HHC + EBA",
          "TPMS y entrada sin llave",
          "360, BSD y LDW en configuraciones superiores",
        ],
        image: "/modelos/u5PLUS/U5tercera.webp",
      },
    ],
    specs: [
      { label: "Motor", value: "1.5L" },
      { label: "Transmision", value: "5MT / CVT segun version" },
      { label: "Traccion", value: "Delantera" },
      { label: "Tanque", value: "48 L" },
      { label: "Neumaticos", value: "205/55 R16" },
      { label: "Pantalla central", value: '12.3"' },
    ],
    gallery: [
      { src: "/modelos/u5PLUS/U5primera.jpg", alt: "BAIC U5 Plus vista frontal" },
      { src: "/modelos/u5PLUS/U5segunda.jpg", alt: "BAIC U5 Plus interior" },
      { src: "/modelos/u5PLUS/U5tercera.webp", alt: "BAIC U5 Plus vista lateral" },
      { src: "/modelos/u5PLUS/U5cuarta.webp", alt: "BAIC U5 Plus detalle exterior" },
    ],
    colors: [
      { name: "Blanco", image: "/modelos/u5PLUS/U5PlusBlanco.png" },
      { name: "Gris", image: "/modelos/u5PLUS/U5PlusGris.png" },
      { name: "Negro", image: "/modelos/u5PLUS/U5PlusNegro.png" },
      { name: "Rojo", image: "/modelos/u5PLUS/U5PlusRojo.png" },
    ],
  },
  baicEU5: {
    slug: "baicEU5",
    name: "EU5",
    eyebrow: "Sedan electrico BAIC",
    headline:
      "Una propuesta electrica clara y usable, con buena autonomia, carga rapida y la suavidad inmediata que se espera de un EV.",
    description:
      "La EU5 esta construida para quien quiere pasar a un electrico sin resignar formato sedan, espacio ni una experiencia de manejo serena. La entrega instantanea y el bajo consumo son parte central de la experiencia.",
    heroImage: "/modelos/eu5/EU5rojo.png",
    heroAlt: "BAIC EU5 vista principal",
    heroBackground:
      "radial-gradient(circle at top left, rgba(34,197,94,0.24), transparent 30%), radial-gradient(circle at right center, rgba(6,182,212,0.18), transparent 22%), linear-gradient(135deg, #022c22 0%, #134e4a 56%, #0f172a 100%)",
    heroAccent: "#22c55e",
    officialUrl: "https://www.baicglobal.com/es/models/8?id=76",
    officialLabel: "Ver ficha oficial BAIC",
    sourceNote:
      "Caracteristicas resumidas a partir de BAIC Global. La autonomia y los tiempos de carga pueden variar segun uso, temperatura y mercado.",
    stats: [
      { label: "Autonomia", value: "416 km NEDC" },
      { label: "Bateria", value: "48.3 kWh" },
      { label: "Potencia", value: "120 kW" },
      { label: "Torque", value: "240 Nm" },
    ],
    highlightCards: [
      {
        title: "Transicion al electrico sin dramatismos",
        description:
          "Mantiene formato sedan, espacio util y un comportamiento civilizado para ciudad y trayectos interurbanos.",
      },
      {
        title: "Carga rapida pensada para el mundo real",
        description:
          "La ficha oficial declara 30 a 80 por ciento en 30 minutos y carga lenta completa en alrededor de 9 horas.",
      },
      {
        title: "Respuesta instantanea y silencio",
        description:
          "La experiencia cambia por completo frente a un sedan termico: menos ruido, entrega lineal y menor vibracion.",
      },
    ],
    features: [
      {
        title: "Plataforma electrica usable",
        description:
          "La bateria de 48.3 kWh y el sistema de refrigeracion liquida apuntan a una experiencia mas estable en uso diario.",
        bullets: [
          "Bateria ternaria de litio CATL",
          "Refrigeracion liquida para la bateria",
          "Consumo oficial de hasta 13.7 kWh/100 km",
        ],
        image: "/modelos/eu5/EU5primera.jpg",
      },
      {
        title: "Manejo limpio y muy suave",
        description:
          "El motor electrico entrega 240 Nm al instante y una aceleracion declarada de 0 a 100 km/h en menos de 10 segundos.",
        bullets: [
          "120 kW de potencia maxima",
          "Caja de una sola velocidad",
          "Modo Sport disponible",
        ],
        image: "/modelos/eu5/EU5segunda.jpg",
      },
      {
        title: "Sedan electrico con foco practico",
        description:
          "Baul de 430 litros, freno electrico, suspension trasera multilink y direccion asistida electrica completan la formula.",
        bullets: [
          "Baul de 430 litros",
          "EPB y direccion asistida electrica",
          "Suspension trasera multilink",
        ],
        image: "/modelos/eu5/EU5tercera.jpg",
      },
    ],
    specs: [
      { label: "Carga rapida", value: "30-80% en <= 30 min" },
      { label: "Carga lenta", value: "0-100% en <= 9 h" },
      { label: "Velocidad maxima", value: ">= 150 km/h" },
      { label: "Baul", value: "430 L" },
      { label: "Neumaticos", value: "215/50 R17" },
      { label: "Asientos", value: "5" },
    ],
    gallery: [
      { src: "/modelos/eu5/EU5primera.jpg", alt: "BAIC EU5 vista frontal" },
      { src: "/modelos/eu5/EU5segunda.jpg", alt: "BAIC EU5 interior" },
      { src: "/modelos/eu5/EU5tercera.jpg", alt: "BAIC EU5 vista lateral" },
      { src: "/modelos/eu5/EU5cuarta.jpg", alt: "BAIC EU5 detalle exterior" },
    ],
    colors: [
      { name: "Blanco", image: "/modelos/eu5/EU5blanca.png" },
      { name: "Gris", image: "/modelos/eu5/EU5gris.png" },
      { name: "Negro", image: "/modelos/eu5/EU5negro.png" },
      { name: "Plata", image: "/modelos/eu5/EU5plata.png" },
      { name: "Rojo", image: "/modelos/eu5/EU5rojo.png" },
    ],
  },
};
