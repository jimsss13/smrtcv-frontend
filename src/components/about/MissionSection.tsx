import { Target, Eye, Gem } from 'lucide-react';

const missionData = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'Our mission is to empower individuals to achieve their career goals by providing tools that make resume creation simple, professional, and effective. We believe everyone deserves a chance to present their best self.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description:
      'Our vision is to be a trusted leader in career technology, known for innovation, simplicity, and a genuine commitment to fostering connections. We aim to help people navigate their career paths with ease, confidence, and impact.',
  },
  {
    icon: Gem,
    title: 'Our Values',
    description:
      'We value innovation, integrity, and user-centricity. We are committed to simplicity, quality, and accessibility in all our solutions, empowering people to create lasting impact.',
  },
];

export const MissionSection = () => {
  return (
    <section className="bg-background-light py-20 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What we stand for
          </h2>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
          {missionData.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background-card border border-border">
                <item.icon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-base text-foreground-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};