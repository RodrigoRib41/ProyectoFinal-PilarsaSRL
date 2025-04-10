import HeroSlider from "@/components/cliente/paginaHome/heroSliderUno";
import VideoSection from "@/components/cliente/paginaHome/videoSection";
import ModelosSection from "@/components/cliente/paginaHome/modelosSection";
import PilarsaOfrece from "@/components/cliente/paginaHome/pilarsaOfrece";


export default function Home() {
  return (
    <div>
      <HeroSlider />
      <VideoSection />
      <ModelosSection />
      <PilarsaOfrece />
    </div>
  );
}
