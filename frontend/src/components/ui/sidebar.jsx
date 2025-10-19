import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
}

const SidebarProvider = React.forwardRef(({ defaultOpen = true, children, className, style }, ref) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [open, setOpen] = React.useState(defaultOpen);

  const toggleSidebar = React.useCallback(() => {
    isMobile ? setOpenMobile((o) => !o) : setOpen((o) => !o);
  }, [isMobile]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }}>
      <TooltipProvider delayDuration={0}>
        <div ref={ref} style={style} className={cn("flex min-h-screen w-full", className)}>
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
  const { isMobile, openMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile}>
        <SheetContent side={side} className="w-72 p-0 bg-sidebar text-sidebar-foreground">
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div ref={ref} className={cn("flex flex-col h-screen bg-sidebar text-sidebar-foreground", className)} {...props}>
      {children}
    </div>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button ref={ref} variant="ghost" size="icon" className={cn("h-7 w-7", className)} onClick={toggleSidebar} {...props}>
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col flex-1 overflow-auto gap-2", className)} {...props} />
));
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-2 p-2", className)} {...props} />
));
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={cn("text-xs font-medium text-sidebar-foreground/70", className)} {...props} />;
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("relative group", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef(({ className, tooltip, children, ...props }, ref) => {
  const button = (
    <button ref={ref} className={cn("flex w-full items-center gap-2 p-2 rounded-md text-left", className)} {...props}>
      {children}
    </button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
};
