import { UserData } from "@/types/user";

interface GreetingSectionProps {
  data: UserData | undefined;
}

export const GreetingSection = ({ data }: GreetingSectionProps) => {
  const userEmail = data?.data?.[0]?.account?.email;
  const userName = data?.data?.[0]?.account?.name?.fullName;
  return (
    <section className="text-center mb-12 sm:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 tracking-tight text-foreground">
        Hello, {userName || userEmail || "User"}!
      </h1>
      <p className="text-lg sm:text-xl text-foreground font-medium opacity-90">
        How should we get started?
      </p>
    </section>
  );
};
