import styles from './Logos.module.css'
const logos = [
  {
    id: 1,
    name: 'Logo Name',
    height: 35,
    width: 130,
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1200px-Logo_of_Twitter.svg.png',
  },
  {
    id: 2,
    name: 'Logo Name',
    height: 35,
    width: 130,
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/2560px-Infosys_logo.svg.png',
  },
  {
    id: 3,
    name: 'Logo Name',
    height: 35,
    width: 130,
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Tata_Consultancy_Services_old_logo.svg/2560px-Tata_Consultancy_Services_old_logo.svg.png',
  },
  {
    id: 4,
    name: 'Logo Name',
    height: 35,
    width: 130,
    src: 'https://companieslogo.com/img/orig/WIT-1453b096.png?t=1739861069',
  },
  {
    id: 5,
    name: 'Logo Name',
    height: 35,
    width: 130,
    src: 'https://static.vecteezy.com/system/resources/previews/022/227/364/non_2x/openai-chatgpt-logo-icon-free-png.png',
  },
  {
    id: 6,
    name: 'Logo Name',
    height: 35,
    width: 130,
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/1200px-Google_Gemini_logo.svg.png',
  },
  {
    id: 7,
    name: 'Logo Name',
    height: 35,
    width: 130,
    src: 'https://logoeps.com/wp-content/uploads/2025/02/DeepSeek_logo_icon.png',
  },
  {
    id: 8,
    name: 'Logo Name',
    height: 35,
    width: 130,
    src: 'https://www.pngplay.com/wp-content/uploads/3/White-Amazon-Logo-PNG-HD-Quality.png',
  },
  {
    id: 9,
    name: 'Logo Name',
    height: 35,
    width: 130,
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png',
  },
  {
    id: 10,
    name: 'Logo Name',
    height: 35,
    width: 130,
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/640px-Google_2015_logo.svg.png',
  },
  {
    id: 11,
    name: 'Logo Name',
    height: 35,
    width: 130,
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/1200px-Tesla_logo.png',
  },
];

const Logos = () => {
    // Duplicate the logos to create a seamless loop
    const duplicatedLogos = [...logos, ...logos];
  
    return (
      <div className="px-4 mx-auto mt-24 max-w-7xl sm:mt-32 sm:px-6 lg:mt-36 lg:px-8">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <h2 className="text-lg font-semibold leading-tight tracking-wide text-center text-neutral-900 dark:text-neutral-50">
            Trusted by the world’s most unknown companies
          </h2>
  
          <div className={`mx-auto mt-10 overflow-hidde ${styles['animated-scroll']}`}>
            <div className="flex space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10 xl:space-x-12 logos-container">
              {duplicatedLogos.map((logo) => (
                <img
                  key={logo.id}
                  className="object-contain w-auto max-h-10"
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

export default Logos