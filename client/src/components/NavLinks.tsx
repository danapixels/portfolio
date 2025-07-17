import { Link } from "react-router-dom";

const NavLinks = () => (
  <nav className="flex items-center space-x-6">
    <Link
      to="/about"
      className="text-white hover:text-white/80 transition-colors font-digi"
      style={{ fontSize: '16px' }}
    >
      About
    </Link>
    <a
      href="https://github.com/danapixels"
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:opacity-80 transition-opacity"
    >
      <img 
        src="/github.png" 
        alt="GitHub" 
        className="h-8 w-auto"
      />
    </a>
  </nav>
);

export default NavLinks; 