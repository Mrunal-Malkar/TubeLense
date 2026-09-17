import Logo from "/trans_logo.png"

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#020202] relative z-10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 text-blue-500" >
              <img src={Logo} alt="tubelense logog" className="w-6 h-6 text-blue-500" />
              </span>
              <span className="font-bold text-xl text-white tracking-tight">
                TubeLense
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Take control of your viewing experience. Filter out distractions and focus on the content that actually matters to you.
            </p>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-slate-100 font-semibold text-sm tracking-wider uppercase">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/privacy-policy" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-services" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/refund-policy" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="https://www.flaticon.com/free-icons/youtube" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200" title="youtube icons">Yt logo credit</a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-slate-100 font-semibold text-sm tracking-wider uppercase">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/contact" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} TubeLense. All rights reserved.
          </div>
          <div className="text-slate-600 text-xs font-medium">
            Designed for focus.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;