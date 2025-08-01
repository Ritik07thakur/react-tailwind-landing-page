import React from 'react';

const About = () => {
  return (
    <div className="mx-auto mt-28 max-w-7xl px-4 sm:mt-36 sm:px-6 lg:mt-44 lg:px-8">
      <div className="flex max-w-5xl flex-col space-y-10">
        <h3 className="text-2xl font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Your Gateway to AI Solutions
        </h3>

        <h2 className="text-6xl font-extrabold leading-tight tracking-tight text-neutral-900 dark:text-white xl:text-7xl">
          About AI Portal
        </h2>

        <p className="text-2xl leading-relaxed text-neutral-700 dark:text-neutral-300">
          AI Portal is a powerful and user-friendly platform designed to help developers, startups, and businesses build and deploy AI-driven solutions with speed and ease.
          From machine learning model deployment and real-time analytics to automation workflows — everything you need is in one place.
          <br /><br />
          Built for scale, performance, and simplicity, AI Portal is your partner in turning data into intelligence.
        </p>
      </div>
    </div>
  );
};

export default About;
