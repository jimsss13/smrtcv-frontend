import Image from "next/image";
import { Template } from "@/types/templates";

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
}

export default function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  return (
    <button
      key={template.id}
      onClick={() => onSelect(template.id)}
      className={`
        group relative flex flex-col items-center rounded-lg border-2 transition-all overflow-hidden
        ${isSelected 
          ? 'border-blue-600 ring-2 ring-blue-100 ring-offset-2' 
          : 'border-transparent hover:border-gray-200 hover:shadow-lg'
        }
      `}
    >
      {/* Thumbnail Image */}
      <div className="relative w-full aspect-210/297 bg-gray-100">
        {template.thumbnail_sas_url ? (
          <Image
            src={template.thumbnail_sas_url}
            alt={template.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={`object-cover object-top transition-transform duration-500 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 text-xs uppercase tracking-widest font-medium">
            No Preview
          </div>
        )}

        {/* Selected Overlay/Checkmark */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-600/10 z-10 flex items-center justify-center">
            <div className="bg-blue-600 text-white rounded-full p-1.5 shadow-sm transform scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Template Name Footer */}
      <div className="w-full bg-white p-3 text-center border-t border-gray-100">
        <span className={`text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
          {template.name}
        </span>
      </div>
    </button>
  );
}