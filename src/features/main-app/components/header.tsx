import Logos from "@/components/logos";
import { useAuth } from "@/features/auth/context";
import { Button, Popover } from "antd";
import { ChevronDown, LogOutIcon } from "lucide-react";
import { useState } from "react";

export function HeaderComponent() {
  const { getUserQuery: { data: user } } = useAuth();

  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <header className="flex items-center justify-between h-[var(--header-height)] mx-4">
      <Logos.HeaderLogo />

      <Popover
        content={() => (
          <div className="flex flex-col space">
            <Button type="text" onClick={hide} className="text-left" icon={<LogOutIcon className="size-4" />} iconPosition="end">
              Logout
            </Button>
          </div>
        )}
        title="Account"
        trigger="click"
        placement="bottomRight"
        open={open}
        onOpenChange={handleOpenChange}
        className="cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <span className="text-sm font-medium">{user?.name || "User"}</span>
          <ChevronDown className="size-4" />
        </div>
      </Popover>

    </header>
  );
}
