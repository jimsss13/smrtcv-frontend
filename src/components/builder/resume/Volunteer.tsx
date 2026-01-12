import { Resume, Volunteer as VolunteerType } from "@/types/resume-builder";

interface VolunteerProps {
  volunteer: VolunteerType[] | undefined;
}

function isVolunteerEmpty(vol: VolunteerType) {
  if (!vol) return true;
  return !vol.organization?.trim() && 
         !vol.position?.trim() && 
         !vol.startDate?.trim();
}

export function Volunteer({ volunteer }: VolunteerProps) {
  const filteredVolunteer = volunteer?.filter(v => !isVolunteerEmpty(v));

  if (!filteredVolunteer || filteredVolunteer.length === 0) return null;

  return (
    <section className="mb-8 break-inside-avoid">
      <h2 className="uppercase font-semibold tracking-wide border-b border-gray-400 pb-1 text-sm mb-3">
        Volunteer
      </h2>
      {filteredVolunteer.map((vol, index) => (
        <div key={index} className="mb-3">
          <h3 className="font-semibold">{vol.organization}</h3>
          <p className="text-sm italic">{vol.position}</p>
          <p className="text-sm">
            {vol.startDate} – {vol.endDate}
          </p>
        </div>
      ))}
    </section>
  );
}