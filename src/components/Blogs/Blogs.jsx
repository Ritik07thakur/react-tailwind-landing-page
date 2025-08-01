import React from 'react';

const posts = [
 
  {
    id: 1,
    category: 'AI Integration',
    title: 'How AI Is Transforming Business Operations',
    description:
      'Explore how AI Portal empowers enterprises to automate workflows, optimize decisions, and improve customer experiences through intelligent systems.',
    href: '#',
    imgSrc: 'https://s44783.pcdn.co/wp-content/uploads/2023/10/2-1024x536.png',
    alt: 'AI team collaboration dashboard',
    metadata: {
      author: 'Anvi Thakur',
      authorImg: 'https://dummyimage.com/100x100/d4d4d4/171717',
      datetime: '2024-10-15',
      date: 'Oct 15, 2024',
    },
  },
  {
    id: 2,
    category: 'Machine Learning',
    title: 'Scaling AI Models with Confidence',
    description:
      'Learn how AI Portal helps developers deploy and monitor ML models at scale — without infrastructure headaches.',
    href: '#',
    imgSrc: 'https://imageio.forbes.com/specials-images/imageserve/6736f3d0b4198928f9696fc0/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds',
    alt: 'Developer using AI dashboard',
    metadata: {
      author: 'Amit Sinha',
      authorImg: 'https://dummyimage.com/100x100/d4d4d4/171717',
      datetime: '2024-11-02',
      date: 'Nov 2, 2024',
    },
  },
  {
    id: 3,
    category: 'Automation',
    title: 'The Future of No-Code AI Solutions',
    description:
      'Discover how AI Portal is democratizing access to artificial intelligence with its intuitive no-code automation tools.',
    href: '#',
    imgSrc: 'https://www.shutterstock.com/image-photo/ai-technology-artificial-intelligence-man-600nw-2263545623.jpg',
    alt: 'AI technology visual concept',
    metadata: {
      author: 'Neha Verma',
      authorImg: 'https://dummyimage.com/100x100/d4d4d4/171717',
      datetime: '2024-12-10',
      date: 'Dec 10, 2024',
    },
  },
];


const Blogs = () => {
  return (
    <div className="mx-auto mt-24 max-w-7xl px-4 sm:mt-32 sm:px-6 lg:mt-40 lg:px-8">
      <div className="block items-end justify-between lg:flex">
       <div className="flex max-w-4xl flex-col space-y-7">
  <h3 className="text-lg font-medium uppercase tracking-wide text-neutral-900 dark:text-neutral-300">
    Blog
  </h3>

  <h2 className="text-4xl font-semibold leading-tight tracking-wide text-neutral-900 dark:text-neutral-50 xl:text-5xl">
    Insights & Updates from AI Portal
  </h2>

  <p className="max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
    Stay up to date with the latest trends in AI, product updates, best practices, and in-depth guides from our team. 
    Learn how AI Portal is helping innovators build smarter solutions every day.
  </p>
</div>


        <div className="mt-6 flex justify-center">
          <a
            href="#"
            className="rounded-md bg-white px-10 py-3 text-base font-medium text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-white dark:ring-neutral-800 dark:hover:bg-neutral-800"
          >
            View all
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-md sm:mt-14 md:max-w-2xl lg:mt-20 lg:max-w-none">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col rounded-md border border-neutral-400 shadow-sm dark:border-neutral-700"
            >
              <img
                src={post.imgSrc}
                alt={post.alt}
                width={400}
                height={240}
                className="w-full rounded-t-md"
              />

              <div className="px-3 py-8 lg:px-4 lg:py-10">
                <div className="flex items-center space-x-4">
                  <span className="rounded-sm bg-neutral-200 p-2 text-xs font-medium uppercase text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    {post.category}
                  </span>
                  <time
                    dateTime={post.metadata.datetime}
                    className="text-sm text-neutral-600 dark:text-neutral-300"
                  >
                    {post.metadata.date}
                  </time>
                </div>

                <dt className="mt-6">
                  <h3 className="text-2xl font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
                    {post.title}
                  </h3>
                </dt>

                <dd className="mt-4 flex flex-auto flex-col text-base leading-7">
                  <p className="flex-auto text-base text-neutral-500 dark:text-neutral-500">
                    {post.description}
                  </p>

                  <div className="mt-6 flex items-center">
                    <a
                      href="#"
                      className="flex items-center gap-x-2 text-base text-neutral-600 dark:text-neutral-200"
                    >
                      Read more
                      <ChevronIcon aria-hidden="true" className="h-4 w-4" />
                    </a>
                  </div>
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function ChevronIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}

export default Blogs;