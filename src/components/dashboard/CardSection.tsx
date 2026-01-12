import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const CardSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 max-w-6xl mx-auto px-4 mb-12">
      {/* Start from scratch Card */}
      <article className="group bg-white border border-gray-300 rounded-4xl sm:rounded-[50px] p-8 sm:p-16 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 sm:mb-8 ring-4 ring-gray-50 transition-colors group-hover:bg-primary/5">
          <Plus
            className="w-10 h-10 sm:w-12 sm:h-12 text-primary"
            strokeWidth={3}
          />
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 sm:mb-4 text-foreground">
          Start from scratch!
        </h2>
        <p className="text-gray-500 text-base sm:text-lg mb-8 sm:mb-10 max-w-xs leading-relaxed">
          Build your resume step-by-step with our guided form.
        </p>
        <Button className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-foreground font-bold py-6 sm:py-7 px-8 sm:px-12 rounded-2xl text-lg sm:text-xl border-none shadow-none transition-all active:scale-95">
          Create New Resume
        </Button>
      </article>

      {/* Improve Existing File Card */}
      <article className="group bg-white border border-gray-300 rounded-4xl sm:rounded-[50px] p-8 sm:p-16 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 sm:mb-8 ring-4 ring-gray-50 transition-colors group-hover:bg-primary/5">
          <Upload
            className="w-8 h-8 sm:w-10 sm:h-10 text-primary"
            strokeWidth={3}
          />
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-foreground">
          Improve Existing File
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mb-8 sm:mb-10 max-w-xs leading-relaxed">
          Upload your current resume (PDF/DOCX) to improve it.
        </p>
        <Button className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-foreground font-bold py-6 sm:py-7 px-8 sm:px-12 rounded-2xl text-base sm:text-lg border-none shadow-none transition-all active:scale-95">
          Upload Existing Resume
        </Button>
      </article>
    </div>
  );
};
