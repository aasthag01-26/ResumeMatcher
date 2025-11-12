const Footer = () => {
  return (
    <footer className="py-8 text-center bg-darkbg border-t border-gray-800 text-gray-400">
      <p className="text-sm leading-relaxed">
        © {new Date().getFullYear()} <strong className="text-white">ResumeRank</strong>.  
        Built with ❤️ by{" "}
        <a
          href="https://github.com/aasthag01-26"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Shiksha
        </a>{" "}
        |{" "}
        <a
          href="https://www.linkedin.com/in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
};

export default Footer;
