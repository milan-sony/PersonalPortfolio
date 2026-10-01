// Navbar menus
export const navbarLinks = [
    { name: "About", to: "#about" },
    { name: "Education", to: "#education" },
    { name: "Skills", to: "#skills" },
    { name: "Experience", to: "#experience" },
    { name: "Projects", to: "#projects" },
    { name: "Contact", to: "#contact" },
];

// Search engines and link previews. vite.config.js reads this at build time
// to fill in the page head, robots.txt and sitemap.xml.
export const seo = {
    siteUrl: "https://personal-portfolio-plum-sigma-60.vercel.app",
    title: "Milan Sony",
    description: "Portfolio of Milan Sony, a software developer and IoT enthusiast from Kerala, India. Experience, projects, skills and contact details.",
    keywords: ["Milan Sony", "Software Developer", "Web Developer", "IoT", "React", "Node.js", "MERN", "Kerala", "India", "Portfolio"],
    image: "/og-image.png"
};

// Personal details
export const personalDetails = {
    name: "Milan Sony",
    title: "Software Developer and IoT Enthusiast",
    description: "A passionate software developer with experience in building web applications.",
    // the first part of the tagline is shown struck through
    tagline: {
        struck: "Everything",
        rest: "you need to know about me is here."
    },
    basedIn: "Kerala, India",
    timeZone: "Asia/Kolkata",
    timeZoneLabel: "IST",
    resume: {
        file: "/Resume-Milan_Sony.pdf",
        downloadName: "Resume_MilanSony"
    }
};

// About section. The closing line with the mail and phone links is added from `contact`.
export const about = {
    heading: "Who am I?",
    lead: "I'm a simple human being, a self-taught, passionate, and dedicated developer from India who is trying to become good at everything I do while maintaining a healthy work-life balance.",
    paragraphs: [
        "I have a strong academic background in computer applications and a love for web design, web development, and IoT. I'm always excited to connect with like-minded individuals who share my interests.",
        "I like to listen to music, hit the gym, watch movies, go for walks, or catch up on sleep. Yeah, these are the things I do."
    ]
};

// Contact information
// links with the label Mail, Phone, Location or Website get their own icon, others a generic one
export const contact = {
    email: "milansonyofficial@gmail.com",
    phone: "+91 8075143465",
    location: "Changanacherry, Kottayam, Kerala, India",
    links: [
    {
            label: "Mail",
            url: "mailto:milansonyofficial@gmail.com",
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
    ],
    // the form under the links. Messages go to `email` unless CONTACT_TO_EMAIL is set
    form: {
        heading: "Or send a message",
        intro: "Drop a note here and it lands straight in my inbox. I usually reply within a day or two.",
        button: "Send message"
    }
};

// Social media links
// icon: github, linkedin, instagram, twitter, youtube, facebook (anything else gets a globe)
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
        institution: "Kristu Jyoti College of Management & Technology, Chethipuzha",
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
        category: "Others",
        emoji: "🔩",
        items: ["Git", "GitHub", "Docker", "Arduino", "IoT", "WSL 2", "Microsoft Office", "Notion", "Photoshop"]
    }
];

// Work Experience
export const experiences = [
    {
        title: "AI Automation Engineer | Full-time (On-site)",
        years: "September 2026 - Present",
        company: "Pentagon Solutions",
        url: "https://www.pentagon-x.com",
        emoji: "👩🏻‍💻",
        achievements: [
            "Working as an AI Automation Engineer at Pentagon X, developing AI-powered features, agents, and agentic workflows using OpenAI and Anthropic Claude, including prompt engineering, tool calling, orchestration, guardrails, and evaluation.",
            "Building AI automations and integrations using n8n, REST APIs, webhooks, third-party SaaS platforms, and MCP, with emphasis on reliable workflows, error handling, logging, and observability.",
            "Developing RAG pipelines and AI-enabled software solutions involving document ingestion, chunking, embeddings, vector storage, retrieval evaluation, and integration with custom SaaS and internal AI platforms."
        ]
    },
    {
        title: "Software Developer | Full-time (Remote)",
        years: "July 2025 - August 2026",
        company: "Johnson & Johnson",
        url: "https://www.jnj.com",
        emoji: "👩🏻‍💻",
        achievements: [
            "Worked at Johnson & Johnson on behalf of Sisincorp, collaborating with cross-functional teams to meet project requirements.",
            "Contributed to a high-impact project, epi.jnj, a JNJ platform configured with GS1 resolver and standards, enabling users to scan a GTIN to access product traceability information. Also worked on the eLabel Admin platform, which helps configure GTINs owned by JNJ to the resolver.",
            "Utilised Agile methodologies, participating in daily stand-ups, sprints, and review sessions, alongside version controltools like Git and project management tools like Jira, ensuring timely delivery and maintaining high-quality standards."
        ]
    },
    {
        title: "Software Developer | Full-time (On-site)",
        years: "May 2024 - June 2025",
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
        title: "Mentor",
        years: "March 2024 - Present",
        company: "Inovus Labs IEDC",
        url: "https://inovuslabs.org",
        emoji: "🙋🏻‍♂️",
        achievements: [
            "Led diverse projects and events, managing teams for successful outcomes while nurturing individual growth.",
            "Provided creative support for InoRa - The Inovus Radio Spotify Podcast."
        ]
    },
    {
        title: "Community Lead",
        years: "May 2023 - March 2024",
        company: "Inovus Labs IEDC",
        url: "https://inovuslabs.org",
        emoji: "🤝🏻",
        achievements: [
            "Coordinate strategies and initiatives, set and implement community objectives, and guide junior team members."
        ]
    }
];

// Projects
export const projects = [
    {
        name: "Kanban Tasks",
        description: "A collaborative task management application that has the functionalities to schedule tasks among friends and ourselves using the efficient Kanban system, similar to Trello and Jira Boards, built with the MERN Stack.",
        stack: ["Node.js", "React.js", "TailwindCss", "Express.js", "Socket.io", "MongoDB"],
        demoUrl: "",
        githubUrl: "https://github.com/milan-sony/KanbanTasks.git"
    },
    {
        name: "StatusCast",
        description: "StatusCast is a fun and easy-to-use app for everyone whether you're part of a remote team, working in a co-working space, or just keeping in touch with friends and family! This cross-platform app lets you share your current status, mood, or availability.",
        stack: ["Node.js", "React.js", "TailwindCss", "Express.js", "MongoDB", "zustand"],
        demoUrl: "https://statuscast.onrender.com",
        githubUrl: "https://github.com/milan-sony/StatusCast"
    },
    {
        name: "Mailer",
        description: "A simple yet flexible email automation platform using the MERN stack that can be customized based on the needs of the company.",
        stack: ["Node.js", "React.js", "TailwindCss", "Express.js", "Nodemailer"],
        demoUrl: "",
        githubUrl: "https://github.com/milan-sony/mailer"
    },
    {
        name: "ChatApp",
        description: "A chat application build on MERN Stack with minimalist design in which users can send messages in real-time with other's.",
        stack: ["Node.js", "React.js", "TailwindCss", "Express.js", "MongoDB", "Zustand", "socket.io"],
        demoUrl: "",
        githubUrl: "https://github.com/milan-sony/ChatApp"
    },
    {
        name: "Task Tracker",
        description: "A simple task tracking application build with React.js.",
        stack: ["React.js", "TailwindCSS"],
        demoUrl: "",
        githubUrl: "https://github.com/milan-sony/task-tracker"
    },
    {
        name: "Inovus Digital",
        description: "An attempt to showcase digitally, what's going on at Inovus Labs. Something similar to Discord Rich Presence or Tinkerspace Digital, but way cooler. Build with Node.js, Vue.js and MongoDB.",
        stack: ["Node.js", "Express.js", "Vue.js"],
        demoUrl: "",
        githubUrl: "https://github.com/milan-sony/inovus_digital"
    },
    {
        name: "E-commerce Application",
        description: "An E-Commerce Application build with Node.js, Express.js, Handlebars, AJAX and MongoDB.",
        stack: ["Node.JS", "Express.JS", "Handlebars", "MongoDB"],
        demoUrl: "",
        githubUrl: "https://github.com/milan-sony/e-commerce_application"
    }
];

