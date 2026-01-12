import { Resume, Award } from "@/types/resume-builder";

interface AwardsProps {
  awards: Award[] | undefined;
}

function isAwardEmpty(award: Award) {
  if (!award) return true;
  return !award.title?.trim() && 
         !award.awarder?.trim() && 
         !award.date?.trim() && 
         !award.summary?.trim();
}

export function Awards({ awards }: AwardsProps) {
  const filteredAwards = awards?.filter(award => !isAwardEmpty(award));

  if (!filteredAwards || filteredAwards.length === 0) return null;
  
  return (
    <section className="mb-8">
      <h2 className="uppercase font-semibold tracking-wide border-b border-gray-400 pb-1 text-sm mb-3">
        Awards
      </h2>
      {filteredAwards.map((award, index) => (
        <div key={index} className="mb-2">
          <h3 className="font-semibold">{award.title}</h3>
          <p className="text-sm">
            {award.awarder} – {award.date}
          </p>
          {award.summary && <p className="text-sm mt-1">{award.summary}</p>}
        </div>
      ))}
    </section>
  );
}