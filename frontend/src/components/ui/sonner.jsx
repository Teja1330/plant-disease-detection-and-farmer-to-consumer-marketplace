import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme} // removed TypeScript type assertion
      className="toaster group"
      toastOptions={{
        classNames,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
