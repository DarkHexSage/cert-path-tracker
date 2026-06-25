// YouTube resources from the roadmap — channels, supplemental videos, and the
// suggested month-by-month playlists.

export interface Channel {
  name: string;
  focus: string;
  bestFor: string;
  url: string;
}

export const CHANNELS: Channel[] = [
  {
    name: "Professor Messer",
    focus: "CompTIA A+, Network+, Security+",
    bestFor: "Structured cert prep, clear explanations",
    url: "https://youtube.com/@professormesser",
  },
  {
    name: "NetworkChuck",
    focus: "Networking, Linux, Security, Career",
    bestFor: "Beginner motivation, fun energy",
    url: "https://youtube.com/@NetworkChuck",
  },
  {
    name: "David Bombal",
    focus: "CCNA, Networking, Python, Security",
    bestFor: "Deep dives, career interviews",
    url: "https://youtube.com/@davidbombal",
  },
  {
    name: "freeCodeCamp",
    focus: "Programming, Linux, IT, full courses",
    bestFor: "Long-form courses (3–12 hrs)",
    url: "https://youtube.com/@freecodecamp",
  },
  {
    name: "The Cyber Mentor",
    focus: "Cybersecurity, ethical hacking",
    bestFor: "Practical security skills",
    url: "https://youtube.com/@TCMSecurityAcademy",
  },
  {
    name: "Learn Linux TV",
    focus: "Linux server administration",
    bestFor: "Hands-on Linux tutorials",
    url: "https://youtube.com/@LearnLinuxTV",
  },
  {
    name: "Computerphile",
    focus: "CS concepts, encryption, networking",
    bestFor: "Understanding the “why”",
    url: "https://youtube.com/@Computerphile",
  },
  {
    name: "TechWorld with Nana",
    focus: "DevOps, Cloud, Docker, K8s",
    bestFor: "Cloud fundamentals",
    url: "https://youtube.com/@TechWorldwithNana",
  },
];

export interface VideoResource {
  title: string;
  url: string;
  month?: number; // which roadmap month it supports
}

export const VIDEOS: VideoResource[] = [
  { title: "Aprende Todo sobre Direcciones IP 👽", url: "https://youtu.be/QN_hlEUxvHg", month: 2 },
  {
    title: "NetworkChuck — Linux for Hackers (playlist)",
    url: "https://www.youtube.com/playlist?list=PLIhvC56v63IJIujb5cyE13oLuyORZpdkL",
    month: 3,
  },
  { title: "Create an AWS free-tier EC2 instance", url: "https://www.youtube.com/watch?v=NfnVflt1Jxw", month: 4 },
  { title: "Learn Notion (organize your whole path)", url: "https://youtu.be/FrhFvIsq86g" },
];

export interface SuggestedPlaylist {
  months: string;
  label: string;
}

export const SUGGESTED: SuggestedPlaylist[] = [
  { months: "1–2", label: "Professor Messer — Network+ (N10-009) full course" },
  { months: "3", label: "NetworkChuck — “Linux for Hackers” series" },
  { months: "4", label: "Professor Messer — Security+ (SY0-701) full course" },
  { months: "5–6", label: "David Bombal — career advice + mock interviews" },
];
