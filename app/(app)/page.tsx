import { Carousel } from 'components/carousel';
import Grid from 'components/grid';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import Image from 'next/image';
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
      
      {/* Features Section - Hidden */}
      <div className="hidden">
        {/* Features Section */}
        <section className="relative mx-auto max-w-screen-2xl px-4 py-24 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[gradient_3s_linear_infinite]" />
          </div>
          
          <div className="relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-500/0 border border-cyan-500/20">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mr-3 animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-cyan-500 uppercase">
                  Features
                </span>
              </div>
              <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4">
                Bring Your Ideas to Life
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Advanced 3D printing solutions for every project
              </p>
            </div>

            <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <FaCube className="w-8 h-8" />,
                  title: "Ready-to-Print Models",
                  description: "Browse our curated collection of pre-designed models"
                },
                {
                  icon: <FaCloudUploadAlt className="w-8 h-8" />,
                  title: "Custom Uploads",
                  description: "Upload your designs for professional printing"
                },
                {
                  icon: <FaCogs className="w-8 h-8" />,
                  title: "Advanced Technology",
                  description: "State-of-the-art printers and materials"
                },
                {
                  icon: <FaPalette className="w-8 h-8" />,
                  title: "Custom Finishing",
                  description: "Professional painting and finishing services"
                }
              ].map((feature, index) => (
                <Grid.Item key={index}>
                  <div className="relative h-full group">
                    {/* Hexagonal background pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDFsMTAgMTBMMTAgMjEgMCAxMXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg0MCwgMTc1LCAyMTcsIDAuMSkiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[20px]" />
                    
                    {/* Card content */}
                    <div className="relative h-full flex flex-col items-center p-8 rounded-[20px] bg-gradient-to-b from-[#0A0A0B] to-[#141415] border border-[#2A2B2E] group-hover:border-cyan-500/20 transition-all duration-500">
                      {/* Icon container with animated border */}
                      <div className="relative mb-8">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-cyan-500/50 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />
                        <div className="relative flex items-center justify-center w-[72px] h-[72px] rounded-xl bg-[#0A0A0B] border border-[#2A2B2E] group-hover:border-cyan-500/20">
                          <div className="text-cyan-500 transform group-hover:scale-110 transition-transform duration-500">
                            {feature.icon}
                          </div>
                        </div>
                      </div>

                      {/* Text content with gradient on hover */}
                      <div className="relative z-10">
                        <h3 className="text-lg font-semibold text-white mb-3 text-center group-hover:text-cyan-500 transition-colors duration-500">
                          {feature.title}
                        </h3>
                        <p className="text-[15px] leading-relaxed text-[#8F9099] text-center group-hover:text-white/70 transition-colors duration-500">
                          {feature.description}
                        </p>
                      </div>

                      {/* Bottom gradient line */}
                      <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    </div>
                  </div>
                </Grid.Item>
              ))}
            </Grid>
          </div>
        </section>
      </div>

      {/* Process Section */}
      <section className="relative mx-auto max-w-screen-2xl px-4 py-24">
        <div className="relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1E1F22] border border-[#2A2B2E]">
              <span className="text-xs font-medium tracking-wide text-[#8F9099] uppercase">
                THE PROCESS
              </span>
            </div>
            <h2 className="mt-8 text-[56px] font-bold text-white leading-tight">
              From Concept to Creation
            </h2>
            <p className="mt-4 text-lg text-[#8F9099] max-w-2xl mx-auto">
              Your journey to bringing ideas into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Choose Your Path",
                description: "Start with your own design or work with our expert design team",
                image: "https://placehold.co/800x600/1E1F22/8F9099/png?text=Design+Choice:+Custom+or+Ready-made",
              },
              {
                step: "02",
                title: "Design Finalization",
                description: "Perfect your design with our team until it's exactly right",
                image: "https://placehold.co/800x600/1E1F22/8F9099/png?text=3D+Model+Refinement",
              },
              {
                step: "03",
                title: "Instant Quote",
                description: "Our advanced slicer generates your quote in seconds",
                image: "https://placehold.co/800x600/1E1F22/8F9099/png?text=AI+Slicer+Interface",
              },
              {
                step: "04",
                title: "Print & Deliver",
                description: "Receive your creation within a week",
                image: "https://placehold.co/800x600/1E1F22/8F9099/png?text=Professional+3D+Printing",
              }
            ].map((step, index) => (
              <div key={index} className="group relative bg-[#1E1F22] rounded-2xl border border-[#2A2B2E] overflow-hidden transition-all duration-500 hover:border-[#2A2B2E]/50">
                {/* Image with gradient overlay */}
                <div className="aspect-[4/3] relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1E1F22] z-10" />
                  <img
                    src={step.image}
                    alt={step.title}
                    className="object-cover w-full h-full opacity-50 group-hover:opacity-60 transition-opacity duration-500"
                  />
                  <div className="absolute top-4 left-4 text-[13px] font-medium text-[#8F9099] uppercase">
                    {step.title}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[#8F9099]">
                    {step.description}
                  </p>
                </div>

                {/* Connecting line */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-[45%] -right-3 w-6 h-[2px] bg-[#2A2B2E]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Services Section */}
      <section className="relative mx-auto max-w-screen-2xl px-4 py-24">
        <div className="relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1E1F22] border border-[#2A2B2E]">
              <span className="text-xs font-medium tracking-wide text-[#8F9099] uppercase">
                SPECIALIZED SERVICES
              </span>
            </div>
            <h2 className="mt-8 text-[56px] font-bold text-white leading-tight">
              Expert Solutions
            </h2>
            <p className="mt-4 text-lg text-[#8F9099] max-w-2xl mx-auto">
              Professional services for every 3D printing need
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: "Custom Design Service",
                subtitle: "From Concept to Model",
                description: "Have an idea but need help bringing it to life? Our design team works directly with you to transform your concepts into printable 3D models.",
                price: "Starting from $30",
                image: "https://placehold.co/1200x800/1E1F22/8F9099/png?text=Custom+Design+Service:+3D+Modeling+%26+Design"
              },
              {
                title: "Technical & Robotics",
                subtitle: "Precision Engineering",
                description: "Specialized in creating precise, functional parts for robotics and technical applications. Our team ensures exact specifications and proper scaling.",
                price: "Custom Quote",
                image: "https://placehold.co/1200x800/1E1F22/8F9099/png?text=Technical+%26+Robotics:+Precision+Parts"
              },
              {
                title: "Toys and Games Parts",
                subtitle: "Visualization & Planning",
                description: "Create detailed 3D printed models of buildings and interiors. Perfect for property showcases and architectural presentations.",
                price: "Project-based Pricing",
                image: "/dino_teal.png"
              },
              {
                title: "Interior Solutions",
                subtitle: "Custom Fixtures & Furniture",
                description: "Create custom furniture attachments, shelving solutions, and interior fixtures. Perfect for unique storage and organization needs.",
                price: "Custom Quote",
                image: "https://placehold.co/1200x800/1E1F22/8F9099/png?text=Interior+Solutions:+Custom+Fixtures"
              },
              {
                title: "Architectural Models",
                subtitle: "Visualization & Planning",
                description: "Create detailed 3D printed models of buildings and interiors. Perfect for property showcases and architectural presentations.",
                price: "Project-based Pricing",
                image: "https://placehold.co/1200x800/1E1F22/8F9099/png?text=Architectural+Models:+3D+Visualization"
              },
              {
                title: "Interior Solutions",
                subtitle: "Custom Fixtures & Furniture",
                description: "Create custom furniture attachments, shelving solutions, and interior fixtures. Perfect for unique storage and organization needs.",
                price: "Custom Quote",
                image: "https://placehold.co/1200x800/1E1F22/8F9099/png?text=Interior+Solutions:+Custom+Fixtures"
              }
            ].map((service, index) => (
              <div key={index} className="group relative bg-[#1E1F22] rounded-2xl border border-[#2A2B2E] overflow-hidden transition-all duration-500 hover:border-[#2A2B2E]/50">
                {/* Image with gradient overlay */}
                <div className="aspect-[3/2] relative bg-[#1E1F22]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1E1F22] z-10" />
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={1200}
                    height={800}
                    className="object-contain w-full h-full p-4 opacity-100 group-hover:scale-105 transition-all duration-500"
                    style={{ filter: 'brightness(1.2)' }}
                  />
                  <div className="absolute top-4 left-4 text-[13px] font-medium text-[#8F9099] uppercase">
                    {service.subtitle}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white">
                      {service.title}
                    </h3>
                    <span className="text-sm text-[#8F9099] mt-1">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-[#8F9099]">
                    {service.description}
                  </p>
                </div>

                {/* Bottom gradient line */}
                <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#2A2B2E] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
