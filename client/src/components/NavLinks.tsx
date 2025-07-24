import { Link } from "react-router-dom";

const NavLinks = () => (
  <nav className="flex items-center space-x-6">
    <Link
      to="/about"
      className="text-white hover:text-white/80 transition-colors font-digi cursor-pointer"
      style={{ fontSize: '16px' }}
    >
      About
    </Link>
    <div className="flex items-center space-x-3">
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
      <a
                        href="https://www.linkedin.com/in/dananyc/"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-80 transition-opacity"
      >
        <img 
          src="/linkedin.png" 
          alt="LinkedIn" 
          className="h-8 w-auto"
        />
      </a>
      <a
        href="mailto:hi@dana.nyc"
        className="block hover:opacity-80 transition-opacity"
      >
        <img 
          src="/email.png" 
          alt="Email" 
          className="h-8 w-auto"
        />
      </a>
    </div>
  </nav>
);

export default NavLinks; 