
const HeroSection = () => {
  return (
    <section id="hero" className="text-center py-24 bg-darkbg">
      <h1 className="text-5xl font-bold mb-4">
        Match the Right Talent,{" "}
        <span className="text-accent">Instantly</span>
      </h1>
      <p className="text-gray-400 text-lg mb-6">
        AI that understands skills, not just keywords. Fast. Fair. Smart.
      </p>
      <div className="mt-8">
        <a
          href="#input"
          className="bg-accent text-white px-6 py-3 rounded-xl font-medium hover:shadow-[0_0_20px_#00bcd4] transition-all duration-300"
        >
          Start Matching
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
