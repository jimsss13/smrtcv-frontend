import { Resume, Work } from "@/types/resume-builder";

interface ExperienceProps {
  work: Work[];
}

// Helper function to check if a job entry is actually empty (trims strings)
function isJobEmpty(job: Work) {
  if (!job) return true;
  return !job.name?.trim() && 
         !job.position?.trim() && 
         !job.summary?.trim() && 
         (!job.highlights || job.highlights.filter(h => h.trim()).length === 0);
}

export function Experience({ work }: ExperienceProps) {
  // 1. Filter out any jobs that are "empty"
  const filteredWork = work.filter(job => !isJobEmpty(job));

  // 2. If the filtered array is empty, render nothing at all.
  if (filteredWork.length === 0) return null;

  return (
    <section className="mb-8 break-inside-avoid">
      <h2 className="uppercase font-semibold tracking-wide border-b border-gray-400 pb-1 text-sm mb-3">
        Experience
      </h2>
      {filteredWork.map((job, index) => (
        <div key={index} className="mb-5 break-inside-avoid">
          <div className="flex justify-between items-baseline">
            <div>
              <h3 className="font-semibold">{job.name}</h3>
              <p className="italic text-sm">{job.position}</p>
            </div>
            <div className="text-sm text-gray-700 text-right">
              <p>
                {job.startDate} – {job.endDate || "Present"}
              </p>
            </div>
          </div>
          <ul className="list-disc ml-6 mt-2 text-sm space-y-1">
            {job.summary && <li>{job.summary}</li>}
            {job.highlights?.map((highlight, hIndex) => (
              <li key={hIndex}>{highlight}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}