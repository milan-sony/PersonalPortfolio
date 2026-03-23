// Navbar menus
export const navbarLinks = [
    { name: "Home", to: "/home" },
    { name: "Profile", to: "/profile" },
];

// Personal details
export const personalDetails = {
    name: "Milan Sony",
    title: "Software Developer",
    description: "A passionate software developer with experience in building web applications."
};

// Contact information
export const contact = {
    email: "milansonyofficial@gmail.com",
    phone: "+91 8075143465",
    location: "Changanacherry, Kottayam, Kerala, India",
    links: [
        {
            label: "Mail",
            url: "mailto:milanfrom2001@gmail.com",
            value: "milansonyofficial@gmail.com"
        },
        {
            label: "Phone",
            url: "tel:+918075143465",
            value: "+91 8075143465"
        },
        {
            label: "Location",
            value: "Changanacherry, Kottayam, Kerala, India"
        }
    ]
};

// Social media links
export const socialLinks = [
    {
        label: "GitHub",
        url: "https://github.com/milan-sony",
        icon: "github"
    },
    {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/milan-sony-94b977261",
        icon: "linkedin"
    },
    {
        label: "Instagram",
        url: "https://www.instagram.com/milansony_",
        icon: "instagram"
    }
];

// Education details
export const educations = [
    {
        degree: "Master of Computer Applications",
        years: "2022-2024",
        institution: "Kristu Jyoti College of Management & Technology, Chethipuzha",
        university: "Mahatma Gandhi University",
        emoji: "👨🏻"
    },
    {
        degree: "Bachelor of Computer Applications",
        years: "2019-2022",
        institution: "Kristu Jayoti College of Management & Technology, Chethipuzha",
        university: "Mahatma Gandhi University",
        emoji: "🧑🏻"
    },
    {
        degree: "Higher Secondary",
        years: "2017-2019",
        institution: "St Berchman's Higher Secondary School, Changanacherry",
        emoji: "👦🏻"
    },
    {
        degree: "High School",
        years: "2016-2017",
        institution: "Kristu Jyoti Higher Secondary School, Chethipuzha",
        emoji: "🧒🏻"
    }
];

// Skills
export const skills = [
    {
        category: "Programming Languages",
        emoji: "🛠️",
        items: ["C", "Python", "C++", "PHP"]
    },
    {
        category: "Frontend",
        emoji: "✨",
        items: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "Tailwind CSS", "React.Js", "Next.Js", "Vue.Js"]
    },
    {
        category: "Backend",
        emoji: "🚀",
        items: ["Node.Js", "Django", "Flask"]
    },
    {
        category: "Databases",
        emoji: "🗃️",
        items: ["MySQL", "SQLite", "MongoDB", "Firebase"]
    },
    {
        category: "Operating Systems",
        emoji: "💻",
        items: ["Windows", "Linux"]
    },
    {
        category: "Other's",
        emoji: "🔩",
        items: ["Git", "GitHub", "Docker", "Arduino", "IoT", "WSL 2", "Microsoft Office", "Notion", "Photoshop"]
    }
];

// Work Experience
export const experiences = [
    {
        title: "Software Developer",
        years: "2023-2024",
        company: "Manappuram Finance Limited",
        url: "https://www.manappuram.com",
        emoji: "👩🏻‍💻",
        achievements: [
            "Worked collaboratively with designers, developers and clients, ensuring seamless project execution and delivery of web applications.",
            "Identified and resolved complex technical issues in large codebases effectively, ensuring stability of production deployments.",
            "Optimized database queries, reduced page load time and enhancing overall application performance."
        ]
    },
    {
        title: "Community Lead",
        years: "2023-2024",
        company: "Inovus Labs IEDC",
        url: "https://inovuslabs.org",
        emoji: "🤝🏻",
        achievements: [
            "Coordinate strategies and initiatives, set and implement community objectives, and guide junior team members."
        ]
    },
    {
        title: "Mentor",
        years: "2024-Present",
        company: "Inovus Labs IEDC",
        url: "https://inovuslabs.org",
        emoji: "🙋🏻‍♂️",
        achievements: [
            "Led diverse projects and events, managing teams for successful outcomes while nurturing individual growth.",
            "Provided creative support for InoRa - The Inovus Radio Spotify Podcast."
        ]
    }
];

// Projects
export const projects = [
    {
        name: "Kanban Tasks",
        description: "A collaborative task management application that has the functionalities to schedule tasks among friends and ourselves using the efficient Kanban system, similar to Trello and Jira Boards, built with the MERN Stack.",
        stack: ["Node.js", "React.js", "TailwindCss", "Express.js", "Socket.io"],
        demoUrl: "https://milansony.vercel.app/",
        githubUrl: "https://github.com/milan-sony/mailer.git"
    },
    {
        name: "Mailer",
        description: "A simple yet flexible email automation platform using the MERN stack that can be customized based on the needs of the company.",
        stack: ["Node.js", "React.js", "TailwindCss", "Express.js", "Nodemailer"],
        demoUrl: "https://milansony.vercel.app/",
        githubUrl: "https://github.com/milan-sony/mailer.git"
    },
    {
        name: "ChatApp",
        description: "A chat application build on MERN Stack with minimalist design in which users can send messages in real-time with other's.",
        stack: ["Node.js", "React.js", "TailwindCss", "Express.js", "MongoDB", "Zustand", "socket.io"],
        demoUrl: "https://milansony.vercel.app/",
        githubUrl: "https://github.com/milan-sony/ChatApp.git"
    },
    {
        name: "Task Tracker",
        description: "A simple task tracking application build with React.js.",
        stack: ["React.js", "TailwindCSS"],
        demoUrl: "https://milansony.vercel.app/",
        githubUrl: "https://github.com/milan-sony/task-tracker.git"
    },
    {
        name: "Inovus Digital",
        description: "An attempt to showcase digitally, what's going on at Inovus Labs. Something similar to Discord Rich Presence or Tinkerspace Digital, but way cooler. Build with Node.js, Vue.js and MongoDB.",
        stack: ["Node.js", "Express.js", "Vue.js"],
        demoUrl: "https://milansony.vercel.app/",
        githubUrl: "https://github.com/milan-sony/inovus_digital.git"
    },
    {
        name: "E-commerce Application",
        description: "An E-Commerce Application build with Node.js, Express.js, Handlebars, AJAX and MongoDB.",
        stack: ["Node.JS", "Express.JS", "Handlebars", "MongoDB"],
        demoUrl: "https://milansony.vercel.app/",
        githubUrl: "https://github.com/milan-sony/e-commerce_application"
    }
];

