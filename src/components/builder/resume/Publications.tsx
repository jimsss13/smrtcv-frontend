import { Resume, Publication } from "@/types/resume-builder";

interface PublicationsProps {
  publications: Publication[] | undefined;
}

function isPublicationEmpty(pub: Publication) {
  if (!pub) return true;
  return !pub.name?.trim() && 
         !pub.publisher?.trim() && 
         !pub.releaseDate?.trim();
}

export function Publications({ publications }: PublicationsProps) {
  const filteredPublications = publications?.filter(p => !isPublicationEmpty(p));

  if (!filteredPublications || filteredPublications.length === 0) return null;
  
  return (
    <section className="mb-8 break-inside-avoid">
      <h2 className="uppercase font-semibold tracking-wide border-b border-gray-400 pb-1 text-sm mb-3">
        Publications
      </h2>
      {filteredPublications.map((pub, index) => (
        <div key={index} className="mb-3">
          <h3 className="font-semibold">{pub.name}</h3>
          <p className="text-sm">
            <span className="italic">{pub.publisher}</span>, {pub.releaseDate}
          </p>
          {pub.url && (
            <a
              href={pub.url}
              target="_blank"
              className="text-blue-600 text-sm underline"
            >
              {pub.url}
            </a>
          )}
        </div>
      ))}
    </section>
  );
}