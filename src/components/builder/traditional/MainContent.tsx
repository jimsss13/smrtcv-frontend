import { Work, Education, Advisory } from '@/types/resume-builder';

interface Props {
  summary: string;
  work: Work[];
  education: Education[];
  advisory?: Advisory[];
}

// --- Helper Functions to check for empty data ---
function isJobEmpty(job: Work) {
  if (!job) return true;
  return !job.name?.trim() && 
         !job.position?.trim() && 
         !job.summary?.trim() && 
         (!job.highlights || job.highlights.filter(h => h.trim()).length === 0);
}

function isEducationEmpty(edu: Education) {
  if (!edu) return true;
  return !edu.institution?.trim() && 
         !edu.area?.trim() && 
         !edu.studyType?.trim() && 
         !edu.location?.trim();
}

function isAdvisoryEmpty(adv: Advisory) {
  if (!adv) return true;
  return !adv.organization?.trim() && !adv.position?.trim();
}

// Reusable Section Title
function MainTitle({ title }: { title: string }) {
  return (
    <h3 className="text-2xl font-bold text-[var(--trad-primary-color)] mb-3">
      {title}
    </h3>
  );
}

export function MainContent({ summary, work, education, advisory }: Props) {
  // --- Filtered arrays ---
  const filteredWork = work.filter(w => !isJobEmpty(w));
  const filteredEducation = education.filter(e => !isEducationEmpty(e));
  const filteredAdvisory = advisory?.filter(a => !isAdvisoryEmpty(a));

  return (
    <main className="w-full md:w-2/3 p-6">
      
      {/* Only show Profile Summary if it exists */}
      {summary?.trim() && (
        <section className="mb-6">
          <MainTitle title="Profile Summary" />
          <p className="text-sm leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Only show Employment History if the array has items */}
      {filteredWork.length > 0 && (
        <section className="mb-6">
          <MainTitle title="Employment History" />
          <div className="space-y-4">
            {filteredWork.map((job, i) => (
              <div key={i}>
                <h4 className="text-lg font-bold">{job.position}</h4>
                <p className="text-sm font-semibold">{job.name}</p>
                <p className="text-xs text-[var(--trad-text-subtle)] mb-1">
                  {job.startDate} - {job.endDate || 'Present'}
                </p>
                <p className="text-sm mb-2">{job.summary}</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {(job.highlights || []).map((hl, j) => (
                    <li key={j}>{hl}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Only show Education if the array has items */}
      {filteredEducation.length > 0 && (
        <section className="mb-6">
          <MainTitle title="Education" />
          <div className="space-y-4">
            {filteredEducation.map((edu, i) => (
              <div key={i}>
                <h4 className="text-lg font-bold">{edu.studyType}</h4>
                <p className="text-sm font-semibold">{edu.institution} {edu.location && `, ${edu.location}`}</p>
                <p className="text-xs text-[var(--trad-text-subtle)]">
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Only show Advisory Roles if the array has items */}
      {filteredAdvisory && filteredAdvisory.length > 0 && (
        <section>
          <MainTitle title="Advisory Roles" />
          <div className="space-y-2">
            {filteredAdvisory.map((role, i) => (
              <div key={i}>
                <h4 className="text-lg font-bold">{role.organization}</h4>
                <p className="text-sm font-semibold">{role.position}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}