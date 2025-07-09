import Icons from "@/components/icons";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { Link, LinkComponentProps, Outlet } from "@tanstack/react-router";
import { Spin } from "antd";
import clsx from "clsx";
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
import { createContext, use, useMemo, useState } from "react";
import { HeaderComponent } from "./components/header";

/**
 * Sidebar context -----------------------------------------------------------
 */
const SidebarContext = createContext<{ collapsed: boolean }>({ collapsed: false });
const useSidebar = () => use(SidebarContext);

/**
 * Type helpers --------------------------------------------------------------
 */
interface NavItemBase extends Omit<LinkComponentProps, "children"> {
  label: string;
  icon: React.ReactNode;
  small?: boolean;
  nested?: boolean;
  /**
   * Additional element rendered to the *right* of the label (e.g. chevrons).
   */
  after?: React.ReactNode;
  /**
   * Children are rendered as nested links underneath this item.
   */
  children?: NavItem[];
  isChildrenLoading?: boolean;
  isChildrenOpen?: boolean;
}

type NavItem = NavItemBase & Required<Pick<NavItemBase, "icon" | "label">>;

/**
 * Main layout ---------------------------------------------------------------
 */
export function MainAppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [scoringOpen, setScoringOpen] = useState(true);
  const getScoringSystemsQuery = useQuery({
    queryKey: ["/scoring-system"],
    queryFn: () => {
      return apiService.get<any[]>("/scoring-system");
    },
  });

  const toggleCollapse = () => setCollapsed(p => !p);

  /**
   * Top navigation items ----------------------------------------------------
   */
  const navItems: NavItem[] = [
    {
      label: "Scoring",
      icon: <Icons.PenWorkspaceIcon />,
      to: "/upload",
      onClick: (e: any) => {
        setScoringOpen(o => !o);
        if (collapsed) {
          setCollapsed(false); // Expand sidebar when opening scoring
        }
        e.preventDefault(); // Prevent default link behavior
      },
      children: getScoringSystemsQuery.data?.map(scoringSystem => ({
        label: scoringSystem.name,
        icon: (() => {
          switch (scoringSystem.name.toLowerCase()) {
            case "ielts":
              return <Icons.IeltsIcon />;
            case "vstep":
              return <BookOpenIcon size={20} />;
            default:
              return <FileTextIcon size={20} />;
          }
        })(),
        to: `/upload`,
        search: {
          scoringSystem: scoringSystem.id,
        },
        nested: true,
      }) as NavItem),
      isChildrenOpen: scoringOpen,
      isChildrenLoading: getScoringSystemsQuery.isLoading,
      after: (
        <span className="ml-auto">
          {scoringOpen ? <ChevronDownIcon size={16} /> : <ChevronUpIcon size={16} />}
        </span>
      ),
    },
    {
      label: "History",
      icon: <HistoryIcon size={22} />,
      to: "/history",
    },
    {
      label: "Dashboard",
      icon: <BarChart2Icon size={22} />,
      to: "/dashboard",
    },
  ];

  /**
   * Bottom navigation items -------------------------------------------------
   */
  const bottomItems: NavItem[] = [
    {
      label: "Scoring System Setting",
      icon: <SettingsIcon size={20} />,
      to: "/settings",
      small: true,
    },
    {
      label: "User Setting",
      icon: <UserIcon size={20} />,
      to: "/profile",
      small: true,
    },
    {
      label: "App Information",
      icon: <InfoIcon size={20} />,
      to: "/information",
      small: true,
    },
  ];

  const sidebarContextValue = useMemo(() => ({ collapsed }), [collapsed]);

  return (
    <SidebarContext value={sidebarContextValue}>
      <div className="flex h-screen bg-line">
        <Sidebar
          items={navItems}
          bottomItems={bottomItems}
          collapsed={collapsed}
          onCollapseToggle={toggleCollapse}
        />

        <main className="flex-1">
          <HeaderComponent />

          <div className="h-[calc(100vh-var(--header-height))]">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarContext>
  );
}

/**
 * Sidebar component ---------------------------------------------------------
 */
interface SidebarProps {
  items: NavItem[];
  bottomItems: NavItem[];
  collapsed: boolean;
  onCollapseToggle: () => void;
}

function Sidebar({ items, bottomItems, collapsed, onCollapseToggle }: SidebarProps) {
  return (
    <aside
      className={clsx(
        "bg-white shadow-md p-4 flex flex-col justify-between transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div>
        {/* Collapse button */}
        <button
          type="button"
          title="Collapse"
          onClick={onCollapseToggle}
          className="flex w-full justify-end mb-6 px-3 py-2 hover:bg-gray-100 rounded"
        >
          <SidebarIcon />
        </button>

        {/* Top navigation */}
        <nav>
          {items.map(item => (
            <NavigationItem key={item.label} {...item} />
          ))}
        </nav>
      </div>

      {/* Bottom navigation */}
      <nav className="mt-4">
        {bottomItems.map(item => (
          <NavigationItem key={item.label} {...item} />
        ))}
      </nav>
    </aside>
  );
}

/**
 * NavigationItem (recursive) -----------------------------------------------
 */
function NavigationItem(item: NavItem) {
  const { collapsed } = useSidebar();
  const {
    icon,
    label,
    small,
    children,
    after,
    nested,
    isChildrenOpen,
    isChildrenLoading,
    ...linkProps
  } = item;

  const linkClass = clsx(
    "flex items-center w-full space-x-3 p-3 my-1 rounded-full no-underline text-gray-800 h-12 hover:bg-grey10",
    small && "text-sm text-gray-600",
  );

  const activeProps = {
    className: clsx(!nested ? "bg-main hover:bg-main text-white" : "bg-second"),
  };

  return (
    <>
      <Link {...linkProps} className={linkClass} activeProps={activeProps}>
        <span className="flex justify-center">{icon}</span>
        {!collapsed && <span>{label}</span>}
        {!collapsed && after}
      </Link>

      {!collapsed && isChildrenOpen && (
        <>
          {isChildrenLoading && (
            <div className="w-full flex justify-center mt-2">
              <Spin />
            </div>
          )}

          {!!children?.length
            && (
              <div className="ml-8 mt-1 space-y-1">
                {children.map(child => <NavigationItem key={child.label} {...child} />)}
              </div>
            )}
        </>
      )}
    </>
  );
}
