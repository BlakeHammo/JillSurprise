import Hero from '../components/Hero';
import Gallery from '../components/Gallery';
import MapSection from '../components/MapSection';
import AboutSection from '../components/AboutSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Gallery />
      <MapSection />
      <AboutSection />
    </main>
  );
}
