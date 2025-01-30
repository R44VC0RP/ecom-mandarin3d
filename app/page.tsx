import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
export const metadata = {
  title: 'Mandarin 3D | Custom 3D Prints & Models',
  description: 'Mandarin 3D is a custom 3D printing and modeling service that specializes in creating high-quality 3D models for a wide range of applications.',
  
  openGraph: {
    type: 'website'
  }
  

};

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
