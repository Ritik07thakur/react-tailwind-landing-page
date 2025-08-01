import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mt-24 grid grid-cols-1 items-center gap-14 sm:mt-32 lg:mt-40 lg:grid-cols-2">
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <span className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
            Empowering Innovation
          </span>

          <h2 className="text-4xl font-bold leading-tight tracking-wide text-neutral-900 dark:text-neutral-50 xl:text-5xl">
            Welcome to AI Portal
          </h2>

          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Unlock the full potential of artificial intelligence with our
            all-in-one platform. AI Portal helps developers and businesses
            explore, build, and manage AI-powered applications with ease.
          </p>

          <div className="flex space-x-8">
            <button
              onClick={() => navigate("/signup")}
              type="button"
              className="rounded-xl bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:bg-indigo-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-white dark:text-indigo-700 dark:hover:bg-neutral-200"
            >
              Start Free Trial
            </button>
          </div>
        </div>

        <div className="order-last mx-auto max-w-lg lg:order-first">
          <img
            src="https://i.insider.com/63cec211b9a04b0019edb006?width=700"
            alt="Image"
            width={1000}
            height={1000}
            className="rounded-xl object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
