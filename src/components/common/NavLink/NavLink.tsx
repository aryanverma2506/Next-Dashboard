"use client";
import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { usePathname } from "next/navigation";

interface NavLinkProps extends React.PropsWithChildren {
  href: string;
  exact?: boolean;
  className?: string;
  activeClassName?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  exact,
  children,
  className,
  activeClassName,
  onClick,
  ...props
}) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  if (isActive) {
    className = `${className || ""} ${activeClassName || "active"}`;
  }

  return (
    <Link href={href} className={className} onClick={onClick} {...props}>
      {children}
    </Link>
  );
};

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  exact: PropTypes.bool,
};

export default NavLink;
