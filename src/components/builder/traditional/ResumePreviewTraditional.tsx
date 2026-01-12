import { Resume } from '@/types/resume-builder'; 
import { BasicsSection } from './Basics';
import { Sidebar } from './Sidebar';
import { Work, Education, Advisory } from '@/types/resume-builder'; // imports needed for props if strictly typed

// Reusable Section Components for Traditional
// (You might need to extract the JSX from MainContent into smaller components 
//  if you want true modularity, but for now we can render them conditionally inside MainContent)

interface Props {
  data: Resume;
  sectionOrder?: (keyof Resume)[]; // Added prop
}

export function ResumePreviewTraditional({ data, sectionOrder = [] }: Props) {
  if (!data.basics.name?.trim()) {
    return (
      <article className="trad-theme font-sans text-gray-900 h-full min-h-[297mm] flex items-center justify-center">
        <p className="text-gray-400">Enter data in the form to see a preview.</p>
      </article>
    )
  }

  return (
    <article className="trad-theme font-sans text-gray-900 h-full min-h-[297mm] flex flex-col">
      <BasicsSection basics={data.basics} />
      <div className="flex flex-col md:flex-row flex-grow">
        <Sidebar
          nationality={data.basics.nationality}
          skills={data.skills}
          languages={data.languages}
          interests={data.interests}
        />
        {/* We pass the full resume and order to MainContent */}
        <MainContent resume={data} order={sectionOrder} />
      </div>
    </article>
  );
}

// Updated MainContent to support ordering
function MainContent({ resume, order }: { resume: Resume, order: (keyof Resume)[] }) {
  // Helper to check empty
  const isJobEmpty = (job: any) => !job.name?.trim() && !job.position?.trim();
  const isEduEmpty = (edu: any) => !edu.institution?.trim() && !edu.area?.trim();
  const isAdvEmpty = (adv: any) => !adv.organization?.trim() && !adv.position?.trim();

  // Filter data
  const work = resume.work.filter(w => !isJobEmpty(w));
  const education = resume.education.filter(e => !isEduEmpty(e));
  const advisory = resume.advisory?.filter(a => !isAdvEmpty(a)) || [];

  // Define renderers for supported main sections
  const renderers: Record<string, () => React.ReactNode> = {
    work: () => work.length > 0 && (
      <section className="mb-6" key="work">
        <h3 className="text-2xl font-bold text-[var(--trad-primary-color)] mb-3">Employment History</h3>
        <div className="space-y-4">
          {work.map((job, i) => (
            <div key={i}>
              <h4 className="text-lg font-bold">{job.position}</h4>
              <p className="text-sm font-semibold">{job.name}</p>
              <p className="text-xs text-[var(--trad-text-subtle)] mb-1">{job.startDate} - {job.endDate || 'Present'}</p>
              <p className="text-sm mb-2">{job.summary}</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {(job.highlights || []).map((hl, j) => <li key={j}>{hl}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    ),
    education: () => education.length > 0 && (
      <section className="mb-6" key="education">
        <h3 className="text-2xl font-bold text-[var(--trad-primary-color)] mb-3">Education</h3>
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div key={i}>
              <h4 className="text-lg font-bold">{edu.studyType}</h4>
              <p className="text-sm font-semibold">{edu.institution} {edu.location && `, ${edu.location}`}</p>
              <p className="text-xs text-[var(--trad-text-subtle)]">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    advisory: () => advisory.length > 0 && (
      <section key="advisory">
        <h3 className="text-2xl font-bold text-[var(--trad-primary-color)] mb-3">Advisory Roles</h3>
        <div className="space-y-2">
          {advisory.map((role, i) => (
            <div key={i}>
              <h4 className="text-lg font-bold">{role.organization}</h4>
              <p className="text-sm font-semibold">{role.position}</p>
            </div>
          ))}
        </div>
      </section>
    )
  };

  return (
    <main className="w-full md:w-2/3 p-6">
      {/* Summary is usually fixed at top, but you could reorder it too if you add it to the store order */}
      {resume.basics.summary?.trim() && (
        <section className="mb-6">
          <h3 className="text-2xl font-bold text-[var(--trad-primary-color)] mb-3">Profile Summary</h3>
          <p className="text-sm leading-relaxed">{resume.basics.summary}</p>
        </section>
      )}

      {/* Render sections in order */}
      {order.map(key => renderers[key] ? renderers[key]() : null)}
    </main>
  );
}