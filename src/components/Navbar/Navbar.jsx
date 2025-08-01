import { useState } from 'react';
import { Dialog } from '@headlessui/react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-neutral-300 p-6 dark:border-neutral-700">
      <nav className="mx-auto flex max-w-7xl items-center justify-between lg:px-8" aria-label="Global">
        <div className="flex items-center lg:flex-1">
          <span className="text-xl font-bold text-neutral-900 dark:text-white">AI Portal</span>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-neutral-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <HamburgerIcon className="h-6 w-6 stroke-neutral-800 dark:stroke-white" />
          </button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:space-x-4">
          <a
            href="/login"
            className="rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            Login
          </a>
          <a
            href="/signup"
            className="rounded-md bg-transparent px-4 py-2.5 text-sm font-semibold text-neutral-900 ring-1 ring-inset ring-neutral-500 hover:bg-neutral-100 dark:text-neutral-100 dark:ring-neutral-600 dark:hover:bg-neutral-800"
          >
            Signup
          </a>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 dark:bg-neutral-950 sm:max-w-sm sm:ring-1 sm:ring-neutral-900/10">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-neutral-900 dark:text-white">AI Portal</span>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-neutral-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6 stroke-neutral-800 dark:stroke-white" />
            </button>
          </div>

          <div className="mt-6 flex flex-col space-y-4">
            <button
              href="/login"
              className="rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-300"
            >
              Login
            </button>
            <button
              href="/signup"
              className="rounded-md bg-transparent px-4 py-2.5 text-sm font-semibold text-neutral-900 ring-1 ring-inset ring-neutral-500 hover:bg-neutral-100 dark:text-neutral-100 dark:ring-neutral-600 dark:hover:bg-neutral-800"
            >
              Signup
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

// Icons
function HamburgerIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function XMarkIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default Navbar;
