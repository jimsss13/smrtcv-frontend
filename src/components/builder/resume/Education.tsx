import { Resume, Education as EducationType } from "@/types/resume-builder";

interface EducationProps {
  education: EducationType[];
}

// Helper function to check if an education entry is actually empty (trims strings)
function isEducationEmpty(edu: EducationType) {
  if (!edu) return true;
  return !edu.institution?.trim() && 
         !edu.area?.trim() && 
         !edu.studyType?.trim() && 
         !edu.location?.trim();
}

export function Education({ education }: EducationProps) {
  // 1. Filter out any education entries that are "empty"
  const filteredEducation = education.filter(edu => !isEducationEmpty(edu));

  // 2. If the filtered array is empty, render nothing at all.
  if (filteredEducation.length === 0) return null;

  return (
    <section className="mb-8 break-inside-avoid">
      <h2 className="uppercase font-semibold tracking-wide border-b border-gray-400 pb-1 text-sm mb-3">
        Education
      </h2>
      {filteredEducation.map((edu, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-baseline">
            <div>
              <h3 className="font-semibold">{edu.institution}</h3>
              <p className="italic text-sm">
                {edu.studyType} in {edu.area}
              </p>
            </div>
            <div className="text-sm text-gray-700 text-right">
              <p>{edu.endDate}</p>
              <p>{edu.location}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}