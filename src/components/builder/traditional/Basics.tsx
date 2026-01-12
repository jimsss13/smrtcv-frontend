import { Basics } from '@/types/resume-builder'; // <-- Use the new MASTER type

interface Props {
  basics: Basics;
}

export function BasicsSection({ basics }: Props) {
  // Build location string, filtering out empty parts
  const locationParts = [
    basics.location?.address,
    basics.location?.city,
    basics.location?.region,
    basics.location?.postalCode,
    basics.location?.countryCode,
  ].filter(part => part?.trim());

  const locationString = locationParts.join(" ");

  return (
    <header className="flex flex-col md:flex-row">
      {/* Photo */}
      <div className="md:w-1/4 bg-gray-200 flex items-center justify-center p-6">
        {basics.image ? (
          <img
            src={basics.image}
            alt={basics.name}
            className="w-40 h-40 object-cover rounded-full"
          />
        ) : (
          <div className="w-40 h-40 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-500">Photo</span>
          </div>
        )}
      </div>
      {/* Contact Info */}
      <div className="md:w-3/4 bg-[var(--trad-primary-color)] text-[var(--trad-text-light)] p-6 md:p-8">
        <h1 className="text-4xl font-bold">{basics.name}</h1>
        <h2 className="text-2xl font-light">{basics.label}</h2>
        <div className="mt-4 space-y-1 text-sm">
          {/* Only show location if it has content */}
          {locationString && <p>{locationString}</p>}
          
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {basics.phone?.trim() && <p>{basics.phone}</p>}
            {basics.email?.trim() && <p>{basics.email}</p>}
          </div>
          {basics.url?.trim() && <p>{basics.url}</p>}
        </div>
      </div>
    </header>
  );
}