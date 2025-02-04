import { Carousel } from 'components/carousel';
import Grid from 'components/grid';
import { ThreeItemGrid } from 'components/grid/three-items';
import { GridTileImage } from 'components/grid/tile';
import Footer from 'components/layout/footer';
import { FaCloudUploadAlt, FaCogs, FaCube, FaPalette } from 'react-icons/fa';

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
      
      {/* Features Section */}
      <section className="mx-auto max-w-screen-2xl gap-4 px-4 py-8">
        <h2 className="mb-8 text-2xl font-bold">Why Choose Mandarin3D</h2>
        <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Feature 1 */}
          <Grid.Item>
            <div className="relative aspect-square h-full w-full">
              <div className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-[var(--m3d-primary)] dark:bg-black dark:border-neutral-800">
                <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
                  <FaCube className="h-12 w-12 mb-4 text-[var(--m3d-primary)]" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-sm font-semibold">{`Ready-to-Print Models`}</div>
                    <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Browse our curated collection of pre-designed models
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid.Item>
          
          {/* Feature 2 */}
          <Grid.Item>
            <div className="relative aspect-square h-full w-full">
              <div className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-[var(--m3d-primary)] dark:bg-black dark:border-neutral-800">
                <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
                  <FaCloudUploadAlt className="h-12 w-12 mb-4 text-[var(--m3d-primary)]" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-sm font-semibold">{`Custom Uploads`}</div>
                    <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Upload your designs for professional printing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid.Item>
          
          {/* Feature 3 */}
          <Grid.Item>
            <div className="relative aspect-square h-full w-full">
              <div className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-[var(--m3d-primary)] dark:bg-black dark:border-neutral-800">
                <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
                  <FaCogs className="h-12 w-12 mb-4 text-[var(--m3d-primary)]" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-sm font-semibold">{`Advanced Technology`}</div>
                    <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      State-of-the-art printers and materials
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid.Item>
          
          {/* Feature 4 */}
          <Grid.Item>
            <div className="relative aspect-square h-full w-full">
              <div className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-[var(--m3d-primary)] dark:bg-black dark:border-neutral-800">
                <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
                  <FaPalette className="h-12 w-12 mb-4 text-[var(--m3d-primary)]" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-sm font-semibold">{`Custom Finishing`}</div>
                    <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Professional painting and finishing services
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid.Item>
        </Grid>
      </section>

      {/* Process Section */}
      <section className="mx-auto max-w-screen-2xl gap-4 px-4 py-8">
        <h2 className="mb-8 text-2xl font-bold">How It Works</h2>
        <Grid className="grid-cols-1 md:grid-cols-3">
          {[
            { step: '01', title: 'Choose or Upload', desc: 'Select from our collection or upload your design' },
            { step: '02', title: 'Customize', desc: 'Pick materials, size, and finishing options' },
            { step: '03', title: 'Receive', desc: 'Get your creation delivered to you' }
          ].map((item) => (
            <Grid.Item key={item.step}>
              <div className="relative aspect-square h-full w-full">
                <div className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-[var(--m3d-primary)] dark:bg-black dark:border-neutral-800">
                  <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
                    <div className="text-4xl font-bold text-[var(--m3d-primary)] mb-4">{item.step}</div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </section>

      {/* Specialized Services Section */}
      <section className="mx-auto max-w-screen-2xl px-4 py-8">
        <h2 className="mb-12 text-2xl font-bold">Specialized Services</h2>
        
        {/* Custom Design Service */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-white dark:bg-black dark:border-neutral-800">
            <GridTileImage
              src="https://placehold.co/800x800/252525/FAFAFA/png?text=Custom+Design"
              alt="Custom Design Service"
              width={800}
              height={800}
              showPrice={false}
              label={{
                title: "Custom Design Service",
                position: "bottom",
                amount: "From $30",
                currencyCode: "USD"
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="mb-4 text-xl font-bold">Custom Design Service</h3>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">
              Have an idea but need help bringing it to life? Our design team works directly with you to transform your concepts into printable 3D models. Perfect for unique projects, prototypes, or custom merchandise.
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Starting from $30, pricing varies based on design complexity
            </p>
          </div>
        </div>

        {/* Technical & Robotics */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-white dark:bg-black dark:border-neutral-800">
            <GridTileImage
              src="https://placehold.co/800x800/252525/FAFAFA/png?text=Technical+%26+Robotics"
              alt="Technical & Robotics"
              width={800}
              height={800}
              showPrice={false}
              label={{
                title: "Technical & Robotics",
                position: "bottom",
                amount: "Precision Scaling",
                currencyCode: "USD"
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="mb-4 text-xl font-bold">Technical & Robotics</h3>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">
              Specialized in creating precise, functional parts for robotics and technical applications. Our team ensures exact specifications and proper scaling for all mechanical and technical prints.
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Expert consultation available for technical specifications
            </p>
          </div>
        </div>

        {/* Interior Solutions */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-white dark:bg-black dark:border-neutral-800">
            <GridTileImage
              src="https://0o4pg1fpby.ufs.sh/f/RSbfEU0J8DcddZKmCbeQnPwkd8avsX0M79BxA2IRlWrOz3jF"
              alt="Interior Solutions"
              width={800}
              height={800}
              showPrice={false}
              blurDataURL='https://0o4pg1fpby.ufs.sh/f/RSbfEU0J8DcddZKmCbeQnPwkd8avsX0M79BxA2IRlWrOz3jF'
              placeholder="blur"
              label={{
                title: "Interior Solutions",
                position: "bottom",
                amount: "Custom Furniture & Fixtures",
                currencyCode: "USD"
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="mb-4 text-xl font-bold">Interior Solutions</h3>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">
              Create custom furniture attachments, shelving solutions, and interior fixtures. Perfect for unique storage solutions, desk organizations, or custom furniture modifications.
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Consultation available for custom interior projects
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
