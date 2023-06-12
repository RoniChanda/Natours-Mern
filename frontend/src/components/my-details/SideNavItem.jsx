import { Link } from "react-router-dom";

export default function SideNavItem({ link, text, icon, active }) {
  return (
    <li className={active && "side-nav--active"}>
      <Link to={link}>
        <svg>
          <use xlinkHref={`/img/icons.svg#icon-${icon}`}></use>
        </svg>
        {text}
      </Link>
    </li>
  );
}
