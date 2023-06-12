import SideNavItem from "./SideNavItem";

export default function SideNav({ role }) {
  return (
    <nav className="user-view__menu">
      <ul className="side-nav">
        <SideNavItem text="Settings" icon="settings" active={true} />
        <SideNavItem text="My bookings" icon="briefcase" />
        <SideNavItem text="My reviews" icon="star" />
        <SideNavItem text="Billing" icon="credit-card" />
      </ul>
      {role === "admin" && (
        <div className="admin-nav">
          <h5 className="admin-nav__heading">Admin</h5>
          <ul className="side-nav">
            <SideNavItem text="Manage tours" icon="map" />
            <SideNavItem text="Manage users" icon="users" />
            <SideNavItem text="Manage reviews" icon="star" />
            <SideNavItem text="Manage bookings" icon="briefcase" />
          </ul>
        </div>
      )}
    </nav>
  );
}
