export default function Search() {
  return (
    <form className="nav__search">
      <button className="nav__search-btn">
        <svg>
          <use xlinkHref="/img/icons.svg#icon-search"></use>
        </svg>
      </button>
      <input
        type="text"
        placeholder="Search tours"
        className="nav__search-input"
      />
    </form>
  );
}
