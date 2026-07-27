import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/layout/Navbar";
import { PortfolioData } from "@/types";

async function getPortfolioData(): Promise<PortfolioData | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  try {
    const res = await fetch(`${API_URL}/portfolio`, { cache: 'no-store' });
    if (!res.ok) return null;
    const result = await res.json();
    return result.data;
  } catch (err) {
    console.error("Fetch failed", err);
    return null;
  }
}

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Dynamic Sections */}
      <div className="max-w-7xl mx-auto px-6 space-y-32 py-32">
        {/* About Section */}
        <section id="about" className="scroll-mt-32">
           <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <span className="text-brand-500 mr-4 font-mono">01.</span>
                About Me
              </h2>
              <div className="text-gray-400 space-y-4 text-lg">
                <p>
                  Hello! My name is Antigravity and I enjoy creating things that live on the internet. 
                  My interest in web development started back in 2018 when I decided to try editing 
                  custom Tumblr themes — turns out hacking together a custom reblog button taught 
                  me a lot about HTML & CSS!
                </p>
                <p>
                  Fast-forward to today, and I’ve had the privilege of working at an advertising agency, 
                  a start-up, a huge corporation, and a student-led design studio. My main focus 
                  these days is building accessible, inclusive products and digital experiences 
                  at Upstatement for a variety of clients.
                </p>
                <p>
                  I also recently started a <span className="text-white">YouTube channel</span> where I 
                  talk about all things software engineering and career development.
                </p>
              </div>
           </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="scroll-mt-32">
           <h2 className="text-3xl font-bold mb-12 flex items-center">
              <span className="text-brand-500 mr-4 font-mono">02.</span>
              Work Experience
           </h2>
           <div className="space-y-12">
              {data?.experiences.map((exp, i) => (
                <div key={exp._id} className="relative pl-8 border-l border-white/10 group">
                  <div className="absolute top-0 left-0 w-3 h-3 bg-brand-500 rounded-full -translate-x-1/2 group-hover:scale-150 transition-transform duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  <div className="mb-1 text-sm font-mono text-brand-400">
                    {new Date(exp.startDate).getFullYear()} — {exp.isCurrent ? 'Present' : new Date(exp.endDate!).getFullYear()}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                  <div className="text-gray-400 mb-4">{exp.company} • {exp.employmentType}</div>
                  <ul className="space-y-2 max-w-2xl">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="text-gray-500 flex items-start">
                        <span className="text-brand-500 mr-2">▹</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
           </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-32">
           <h2 className="text-3xl font-bold mb-12 flex items-center">
              <span className="text-brand-500 mr-4 font-mono">03.</span>
              Featured Projects
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data?.projects.map((project) => (
                <div key={project._id} className="glass-card glass-card-hover group">
                  <div className="aspect-video bg-dark-300 relative overflow-hidden">
                    {project.coverImage ? (
                      <img 
                        src={project.coverImage} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700 font-bold text-4xl italic uppercase">
                        {project.title.split(' ')[0]}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-gray-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-brand-400 transition-colors">{project.title}</h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                      {project.shortDescription}
                    </p>
                    <div className="flex items-center space-x-4">
                      <a href={project.liveUrl} className="text-white hover:text-brand-400 transition-colors">Demo</a>
                      <a href={project.githubUrl} className="text-gray-500 hover:text-white transition-colors">Code</a>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="scroll-mt-32">
           <h2 className="text-3xl font-bold mb-12 flex items-center">
              <span className="text-brand-500 mr-4 font-mono">04.</span>
              Technical Arsenal
           </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {data && Object.entries(data.skillsByCategory).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="text-sm font-mono text-brand-400 mb-6 uppercase tracking-widest">{category}</h3>
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div key={skill._id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{skill.name}</span>
                          <span className="text-gray-500">{skill.proficiency}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-500 rounded-full" 
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-32 py-20 text-center">
           <div className="max-w-2xl mx-auto">
              <span className="text-brand-400 font-mono mb-4 block">05. What's Next?</span>
              <h2 className="text-5xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-400 mb-10 text-lg">
                Although I’m not currently looking for any new opportunities, my inbox is always open. 
                Whether you have a question or just want to say hi, I’ll try my best to get back to you!
              </p>
              <a href="mailto:hello@antigravity.dev" className="btn-primary py-4 px-10 text-lg">
                Say Hello
              </a>
           </div>
        </section>
      </div>

      <footer className="py-10 text-center border-t border-white/5 bg-dark-200/50">
        <p className="text-gray-500 text-sm font-mono">
          Designed & Built by Antigravity <br />
          <span className="mt-2 block">© 2026 • Production Ready CMS</span>
        </p>
      </footer>
    </main>
  );
}
