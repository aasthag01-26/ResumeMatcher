import React from "react";

const Footer = () => {
  return (
    <footer className="py-8 text-center bg-darkbg border-t border-gray-800 text-gray-500">
      <p className="text-sm">
        © 2025 ResumeRank. All rights reserved. <br />
        Built with ❤️ by{" "}
        <a
          href="https://github.com/aasthag01-26"
          target="_blank"
          className="text-accent hover:underline"
        >
          Shiksha
        </a>{" "}
        — Find me on{" "}
        <a
          href="https://www.linkedin.com/in/"
          target="_blank"
          className="text-accent hover:underline"
        >
          LinkedIn
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;
