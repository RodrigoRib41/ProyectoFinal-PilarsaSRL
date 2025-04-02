"use client";


export default function VideoSection() {
  return (
    <div className="relative w-full h-[25vh] sm:h-[35vh] md:h-[40vh] lg:h-screen overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/x55PlusVideo.webm" type="video/webm" />
        Tu navegador no soporta videos.
      </video>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Texto encima del video */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Conocé nuestra tecnología</h2>
        <p className="mt-1 sm:mt-2 text-sm sm:text-lg md:text-xl">Innovación y diseño en cada modelo</p>
      </div>
    </div>
  );
}

