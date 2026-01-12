import { Resume, Certificate } from "@/types/resume-builder";

interface CertificatesProps {
  certificates: Certificate[] | undefined;
}

function isCertificateEmpty(cert: Certificate) {
  if (!cert) return true;
  return !cert.name?.trim() && 
         !cert.issuer?.trim() && 
         !cert.date?.trim();
}

export function Certificates({ certificates }: CertificatesProps) {
  const filteredCertificates = certificates?.filter(cert => !isCertificateEmpty(cert));
  
  if (!filteredCertificates || filteredCertificates.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="uppercase font-semibold tracking-wide border-b border-gray-400 pb-1 text-sm mb-3">
        Certificates
      </h2>
      {filteredCertificates.map((cert, index) => (
        <div key={index} className="mb-2">
          <h3 className="font-semibold">{cert.name}</h3>
          <p className="text-sm">
            {cert.issuer} – {cert.date}
          </p>
        </div>
      ))}
    </section>
  );
}