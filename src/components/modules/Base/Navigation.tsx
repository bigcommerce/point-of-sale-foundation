import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { RoleType } from "@/shared/enums/RoleType";
import { destroyCookie } from "nookies";
import MenuIcon from "@/frontend/components/icons/Menu";
import {
  XIcon,
  CogIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  IdentificationIcon
} from "@heroicons/react/outline";

const navigationLinksPerRole = {
  [RoleType.Admin]: [
    {
      href: "/register",
      label: "Register",
      icon: <ShoppingBagIcon className="h-8 w-8 mx-4 my-3 inline-block" />
    },
    {
      href: "/orders",
      label: "Orders",
      icon: <CreditCardIcon className="h-8 w-8 mx-4 my-3 inline-block" />
    },
    {
      href: "/employees",
      label: "Employees",
      icon: <IdentificationIcon className="h-8 w-8 mx-4 my-3 inline-block" />
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <CogIcon className="h-8 w-8 mx-4 my-3 inline-block" />
    }
  ],
  [RoleType.Manager]: [
    {
      href: "/register",
      label: "Register",
      icon: <ShoppingBagIcon className="h-8 w-8 mx-4 my-3 inline-block" />
    },
    {
      href: "/customers",
      label: "Customers",
      icon: <UserGroupIcon className="h-8 w-8 mx-4 my-3 inline-block" />
    },
    {
      href: "/orders",
      label: "Orders",
      icon: <CreditCardIcon className="h-8 w-8 mx-4 my-3 inline-block" />
    },
    {
      href: "/employees",
      label: "Employees",
      icon: <IdentificationIcon className="h-8 w-8 mx-4 my-3 inline-block" />
    }
  ],
  [RoleType.Cashier]: [
    {
      href: "/register",
      label: "Register",
      icon: <ShoppingBagIcon className="h-8 w-8 mx-4 my-3 inline-block" />
    },
    {
      href: "/customers",
      label: "Customers",
      icon: <UserGroupIcon className="h-8 w-8 mx-4 my-3 inline-block" />
    },
    {
      href: "/orders",
      label: "Orders",
      icon: <CreditCardIcon className="h-8 w-8 mx-4 my-3 inline-block" />
    }
  ]
};

const navLinkElement = ({ href, label, icon, active }) => (
  <Link key={href} href={href}>
    <a className="flex flex-nowrap items-center min-w-fit w-full">
      {icon}
      <span className="text-xl inline-block">{label}</span>
    </a>
  </Link>
);

const Navigation = ({ employee }) => {
  const router = useRouter();
  const [toggle, setToggle] = useState(false);
  const roleName = Object.keys(RoleType).find(
    key => RoleType[key] === employee.roleId
  );
  const navLinks = navigationLinksPerRole[employee.roleId];

  useEffect(() => {
    setToggle(false);
  }, [router.pathname]);

  const signOut = () => {
    destroyCookie(null, "access_token");
    destroyCookie(null, "first_time");
    destroyCookie(null, "employee");
    router.reload();
  };

  return (
    <>
      <a
        className="fixed z-20 top-0 left-0 py-4 px-5"
        onClick={() => setToggle(true)}
      >
        <MenuIcon className="h-6 w-6" />
      </a>
      <div
        className={`fixed z-30 h-full w-48 top-0 ${
          toggle ? "left-0" : "-left-48"
        } bg-gray-50 shadow transition-all`}
      >
        <nav className="relative w-full h-full">
          <a
            className="flex flex-nowrap items-center min-w-fit w-full"
            onClick={() => setToggle(false)}
          >
            <XIcon className="h-8 w-8 mx-4 my-3 inline-block" />
          </a>
          {navLinks.map(navLink =>
            navLinkElement({
              ...navLink,
              active: navLink.href === router.pathname
            })
          )}
          <button className="py-4 px-5" onClick={signOut}>
            Sign Out
          </button>
        </nav>
      </div>
    </>
  );
};
export default Navigation;
