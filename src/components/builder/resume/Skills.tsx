import { Resume, Skill } from "@/types/resume-builder";

interface SkillsProps {
  skills: Skill[] | undefined;
}

function isSkillEmpty(skill: Skill) {
  if (!skill) return true;
  return !skill.name?.trim() && 
         !skill.level?.trim() && 
         (!skill.keywords || skill.keywords.filter(k => k.trim()).length === 0);
}

export function Skills({ skills }: SkillsProps) {
  const filteredSkills = skills?.filter(s => !isSkillEmpty(s));

  if (!filteredSkills || filteredSkills.length === 0) return null;
  
  return (
    <section className="mb-8 break-inside-avoid">
      <h2 className="uppercase font-semibold tracking-wide border-b border-gray-400 pb-1 text-sm mb-3">
        Skills
      </h2>
      <ul className="text-sm space-y-1">
        {filteredSkills.map((skill, index) => (
          <li key={index}>
            <span className="font-semibold">{skill.name}:</span>{" "}
            {skill.keywords?.join(", ")}
          </li>
        ))}
      </ul>
    </section>
  );
}