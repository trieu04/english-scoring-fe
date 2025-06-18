import Icons from "@/components/icons";
import Logos from "@/components/logos";
import { Link, LinkComponentProps, Outlet } from "@tanstack/react-router";
import clsx from "clsx"; // Import clsx
import {
  BarChart2Icon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FileTextIcon,
  HistoryIcon,
  InfoIcon,
  SettingsIcon,
  SidebarIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";

export function MainAppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scoringOpen, setScoringOpen] = useState(true);

  return (
    <div className="flex h-screen bg-dscl-line">
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-screen bg-white shadow-md p-4 flex flex-col justify-between transition-all duration-300",
          {
            "w-20": isCollapsed,
            "w-64": !isCollapsed,
          },
        )}
      >
        <div>
          {/* Collapse Button */}
          <div className="flex w-full justify-end mb-6">
            <button
              type="button"
              title="Collapse"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="px-3 py-2 hover:bg-gray-100 rounded"
            >
              <SidebarIcon />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {/* Scoring Parent */}
            <div>
              <Link
                to="/scoring"
                search={{ exam: undefined }}
                onClick={() => setScoringOpen(!scoringOpen)}
                className={clsx(
                  "flex items-center w-full space-x-3 p-3 rounded-full hover:bg-gray-100 text-gray-800 no-underline",
                )}
                activeProps={{ className: "bg-blue-100 text-blue-700" }}
              >
                <Icons.PenWorkspaceIcon className="fill-black" />
                {!isCollapsed && (
                  <>
                    <span>Scoring</span>
                    <span className="ml-auto">
                      {scoringOpen
                        ? (
                            <ChevronDownIcon size={16} />
                          )
                        : (
                            <ChevronUpIcon size={16} />
                          )}
                    </span>
                  </>
                )}
              </Link>
            </div>
            {/* Sub-menu */}
            {scoringOpen && !isCollapsed && (
              <div className="ml-8 mt-1 space-y-1">
                <MenuButton
                  icon={<BookOpenIcon size={18} />}
                  isCollapsed={isCollapsed}
                  label="VSTEP"
                  to="/scoring"
                  search={{ exam: "vstep" }}
                  nested
                />
                <MenuButton
                  icon={<Icons.IeltsIcon className="size-5" />}
                  isCollapsed={isCollapsed}
                  to="/scoring"
                  search={{ exam: "ielts" }}
                  label="IELTS"
                  nested
                />
                <MenuButton
                  icon={<FileTextIcon size={18} />}
                  isCollapsed={isCollapsed}
                  to="/scoring"
                  search={{ exam: "custom-1 " }}
                  label="Custom 1"
                  nested
                />
              </div>
            )}
            <MenuButton
              icon={<HistoryIcon size={22} />}
              label="History"
              isCollapsed={isCollapsed}
              to="/history"
              activeProps={{ className: "bg-blue-100 text-blue-700" }}
            />
            <MenuButton
              icon={<BarChart2Icon size={22} />}
              to="/dashboard"
              label="dashboard"
              isCollapsed={isCollapsed}
              activeProps={{ className: "bg-blue-100 text-blue-700" }}
            />
          </nav>
        </div>

        {/* Bottom Menu */}
        <div className="space-y-2">
          <MenuButton
            icon={<SettingsIcon size={20} />}
            label="Scoring System Setting"
            isCollapsed={isCollapsed}
            to="/settings"
            small
          />
          <MenuButton
            icon={<UserIcon size={20} />}
            label="User Setting"
            isCollapsed={isCollapsed}
            to="/profile"
            small
          />
          <MenuButton
            icon={<InfoIcon size={20} />}
            label="App Information"
            isCollapsed={isCollapsed}
            to="/information"
            small
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className={clsx(
          "fixed top-[var(--header-height)] bottom-0 right-0 overflow-hidden transition-all duration-300",
          {
            "left-20": isCollapsed,
            "left-64": !isCollapsed,
          }
        )}>
        <header   className={clsx(
            "fixed top-0 right-0 z-40 h-[var(--header-height)] px-4 bg-white shadow flex items-center justify-between transition-all duration-300",
            {
              "left-20": isCollapsed,
              "left-64": !isCollapsed,
            }
          )}>
          <div className="">
            <Logos.HeaderLogo />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-300" />
            <span className="text-sm font-medium">Admin</span>
          </div>
        </header>

        <div className="h-full overflow-auto px-4 py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

interface MenuButtonProps extends LinkComponentProps {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  active?: boolean;
  small?: boolean;
  nested?: boolean;
}

function MenuButton({
  icon,
  label,
  isCollapsed = false,
  small = false,
  activeProps,
  ...props
}: MenuButtonProps) {
  if (
    activeProps
    && typeof activeProps === "object"
    && "className" in activeProps
    && activeProps.className
  ) {
    activeProps.className = clsx(
      "bg-blue-100 text-blue-700",
      activeProps.className,
    );
  }
  return (
    <Link
      className={clsx(
        "flex items-center w-full space-x-3 p-3 rounded-full hover:bg-gray-100 no-underline text-gray-800",
        small && "text-sm text-gray-600",
      )}
      activeProps={activeProps}
      {...props}
    >
      <span className="flex justify-center">{icon}</span>
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
}
