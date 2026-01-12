import { Resume, Reference } from "@/types/resume-builder";

interface ReferencesProps {
  references: Reference[] | undefined;
}

function isReferenceEmpty(ref: Reference) {
  if (!ref) return true;
  return !ref.name?.trim() && !ref.reference?.trim();
}

export function References({ references }: ReferencesProps) {
  const filteredReferences = references?.filter(r => !isReferenceEmpty(r));
  
  if (!filteredReferences || filteredReferences.length === 0) return null;
  
  return (
    <section className="break-inside-avoid">
      <h2 className="uppercase font-semibold tracking-wide border-b border-gray-400 pb-1 text-sm mb-3">
        References
      </h2>
      {filteredReferences.map((ref, index) => (
        <div key={index} className="text-sm mb-2">
          <p className="font-semibold">{ref.name}</p>
          <p>{ref.reference}</p>
        </div>
      ))}
    </section>
  );
}