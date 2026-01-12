import { Resume, Interest } from "@/types/resume-builder";

interface InterestsProps {
  interests: Interest[] | undefined;
}

function isInterestEmpty(interest: Interest) {
  if (!interest) return true;
  return !interest.name?.trim() && 
         (!interest.keywords || interest.keywords.filter(k => k.trim()).length === 0);
}

export function Interests({ interests }: InterestsProps) {
  const filteredInterests = interests?.filter(i => !isInterestEmpty(i));

  if (!filteredInterests || filteredInterests.length === 0) return null;
  
  return (
    <section className="mb-8 break-inside-avoid">
      <h2 className="uppercase font-semibold tracking-wide border-b border-gray-400 pb-1 text-sm mb-3">
        Interests
      </h2>
      <ul className="text-sm">
        {filteredInterests.map((interest, i) => (
          <li key={i}>
            <span className="font-semibold">{interest.name}:</span>{" "}
            {interest.keywords?.join(", ")}
          </li>
        ))}
      </ul>
    </section>
  );
}