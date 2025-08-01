import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1 */}
          <div>
            <h4 className="text-lg font-semibold text-white">AI Portal</h4>
            <p className="mt-4 text-sm">
              Unlock the power of AI for your business. Scalable tools, intelligent automation, and seamless integration — all in one place.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h5>
            <ul className="space-y-2 text-sm">
              <li><button className="hover:text-white">Dashboard</button></li>
              <li><button className="hover:text-white">Model Builder</button></li>
              <li><button className="hover:text-white">Automation</button></li>
              <li><button className="hover:text-white">Integrations</button></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-2 text-sm">
              <li><button className="hover:text-white">About Us</button></li>
              <li><button className="hover:text-white">Blog</button></li>
              <li><button className="hover:text-white">Careers</button></li>
              <li><button className="hover:text-white">Contact</button></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h5>
            <ul className="space-y-2 text-sm">
              <li><button className="hover:text-white">Help Center</button></li>
              <li><button className="hover:text-white">API Docs</button></li>
              <li><button className="hover:text-white">Community</button></li>
              <li><button className="hover:text-white">Terms & Privacy</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 border-t border-neutral-700 pt-6 text-sm text-center text-neutral-400">
          © {new Date().getFullYear()} AI Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
