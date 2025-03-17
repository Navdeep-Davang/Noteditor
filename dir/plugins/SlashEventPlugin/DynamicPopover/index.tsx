import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface DynamicPopoverProps {
  open: boolean; // Control popover externally
  onOpenChange: (state: boolean) => void; // Callback for state changes
  children: React.ReactNode; // Trigger element
  content: React.ReactNode; // Popover content
}

const DynamicPopover = ({ open, onOpenChange, children, content }: DynamicPopoverProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  );
};

export default DynamicPopover;
