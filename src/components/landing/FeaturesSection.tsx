import { Bot, Layers, PencilRuler } from 'lucide-react';

const features = [
  {
    icon: <Bot className="h-10 w-10 text-blue-400" />,
    name: 'AI-Powered Suggestions',
    description: 'Get intelligent recommendations for skills, keywords, and phrasing to beat the applicant tracking systems.',
  },
  {
    icon: <Layers className="h-10 w-10 text-purple-400" />,
    name: 'Professional Templates',
    description: 'Choose from a variety of modern, industry-approved templates that are proven to get you noticed.',
  },
  {
    icon: <PencilRuler className="h-10 w-10 text-green-400" />,
    name: 'Real-Time Customization',
    description: 'Easily edit layouts, fonts, and colors to create a unique resume that reflects your personal brand.',
  },
];

export const FeaturesSection = () => {
  return (
    <section className="bg-gray-800/40 py-20 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Smart CV provides the tools to build a resume that opens doors.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-900">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{feature.name}</h3>
              <p className="mt-2 text-base text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};