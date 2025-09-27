const NavbarSkeleton = () => {
  return (
    <>
      <nav className="navbar-section flex justify-around items-center w-[1200px] animate-pulse">
        {/* Logo */}
        <div className="logo flex items-center">
            <div className="bg-gray-300 rounded-md w-[150px] h-[40px]"></div>
        </div>

        {/* Nav Links */}
        <ul className="options flex gap-8">
            <li className="bg-gray-300 rounded-md h-[18px] w-[60px]"></li>
            <li className="bg-gray-300 rounded-md h-[18px] w-[90px]"></li>
            <li className="bg-gray-300 rounded-md h-[18px] w-[70px]"></li>
            <li className="bg-gray-300 rounded-md h-[18px] w-[80px]"></li>
        </ul>

        {/* Search Bar */}
        <div className="bg-gray-300 rounded-lg w-[250px] h-[32px]"></div>

        {/* Icons (Profile + Cart + Menu) */}
        <div className="icons flex gap-[15px] items-center">
            {/* Profile */}
            <div className="w-[40px] h-[40px] bg-gray-300 rounded-full"></div>

            {/* Cart */}
            <div className="w-[28px] h-[28px] bg-gray-300 rounded-md"></div>

            {/* Menu */}
            <div className="w-[22px] h-[22px] bg-gray-300 rounded-md hidden"></div>
        </div>
        </nav>
    </>
  )
}

export default NavbarSkeleton
