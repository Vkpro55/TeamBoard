import { NavLink } from 'react-router-dom'

const SidebarItem = ({ to, icon: Icon, label }) => {
  return (
     <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center gap-3
        rounded-sm rounded-r-none px-4 py-3
        text-sm font-medium
        transition-all duration-200

        ${
          isActive
            ? "bg-[var(--color-primary-100)] text-[var(--color-primary)]"
            : "text-[var(--color-text-muted)] hover:bg-blue-100 hover:text-[var(--color-text)] hover:border-r-black hover:border-r-2"
        }
      `
      }
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  )
}

export default SidebarItem
