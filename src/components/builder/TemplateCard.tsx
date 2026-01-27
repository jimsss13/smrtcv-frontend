import Image from "next/image";
import { Template } from "@/types/template";

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
        group relative flex flex-col w-full rounded-xl transition-all duration-300
        ${isSelected 
          ? 'ring-2 ring-blue-600 ring-offset-4' 
          : 'hover:translate-y-[-4px]'
        }
      `}
    >
      {/* Document Container */}
      <div className={`
        relative w-full aspect-[1/1.414] bg-white rounded-xl overflow-hidden border transition-all duration-300
        ${isSelected 
          ? 'border-blue-200 shadow-xl shadow-blue-100' 
          : 'border-gray-200 shadow-sm group-hover:shadow-xl group-hover:border-blue-200'
        }
      `}>
        {/* Thumbnail Image */}
        {(template.thumbnail_sas_url || template.thumbnail) ? (
          <Image
            src={template.thumbnail_sas_url || template.thumbnail || ''}
            alt={template.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover object-top transition-transform duration-700 ${isSelected ? 'scale-105' : 'group-hover:scale-110'}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
            No Preview
          </div>
        )}

        {/* Selected Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-600/5 z-10 flex items-center justify-center">
            <div className="bg-blue-600 text-white rounded-full p-2 shadow-lg transform scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Template Name Footer */}
      <div className="mt-4 px-1 text-left">
        <h3 className={`text-sm font-black tracking-tight transition-colors ${isSelected ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'}`}>
          {template.name}
        </h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
          Professional Design
        </p>
      </div>
    </button>
  );
}
