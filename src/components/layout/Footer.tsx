export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background"> 
      <div className="container mx-auto flex max-w-7xl items-center justify-center p-4">
        <p className="text-sm text-foreground-muted"> 
          &copy; {currentYear} Smart CV. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};