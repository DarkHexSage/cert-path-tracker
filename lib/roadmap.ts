// The certification roadmap, structured for progress tracking.
// Each item has a stable `id` (never change these once users have progress),
// and a `type`: "badge" (a credential to earn) or "task" (a hands-on action).

export type ItemType = "badge" | "task";

export interface RoadmapItem {
  id: string;
  type: ItemType;
  label: string;
  meta?: string; // provider / time / extra
  link?: string;
  optional?: boolean;
}

export interface Month {
  n: number;
  title: string;
  goal: string;
  badges: RoadmapItem[];
  tasks: RoadmapItem[];
}

const url = (u: string) => (u.startsWith("http") ? u : `https://${u}`);

export const ROADMAP: Month[] = [
  {
    n: 1,
    title: "Digital Foundations & First Badges",
    goal:
      "Get comfortable with tech concepts, earn your first 3–4 badges, set up your professional profiles.",
    badges: [
      {
        id: "m1-packet-tracer",
        type: "badge",
        label: "Getting Started with Cisco Packet Tracer",
        meta: "Cisco NetAcad · ~6 hrs",
        link: url("netacad.com/courses/getting-started-cisco-packet-tracer"),
      },
      {
        id: "m1-intro-cyber",
        type: "badge",
        label: "Introduction to Cybersecurity",
        meta: "Cisco NetAcad · ~6 hrs",
        link: url("netacad.com/courses/introduction-to-cybersecurity"),
      },
      {
        id: "m1-cyber-fundamentals",
        type: "badge",
        label: "Cybersecurity Fundamentals",
        meta: "IBM SkillsBuild · ~8 hrs",
        link: url("skillsbuild.org"),
      },
      {
        id: "m1-digital-world",
        type: "badge",
        label: "Working in a Digital World: Professional Skills",
        meta: "IBM SkillsBuild · ~6 hrs",
        link: url("skillsbuild.org"),
      },
    ],
    tasks: [
      { id: "m1-t-credly", type: "task", label: "Create a Credly account (your badge portfolio)" },
      { id: "m1-t-linkedin", type: "task", label: "Create / optimize your LinkedIn profile" },
      { id: "m1-t-github", type: "task", label: "Create a GitHub account (even if empty for now)" },
      { id: "m1-t-install-pt", type: "task", label: "Install Cisco Packet Tracer" },
      { id: "m1-t-badges-linkedin", type: "task", label: "Add your first 4 Credly badges to LinkedIn" },
    ],
  },
  {
    n: 2,
    title: "Networking Fundamentals",
    goal: "Understand how networks work — the core skill for any IT support role.",
    badges: [
      {
        id: "m2-networking-basics",
        type: "badge",
        label: "Networking Basics",
        meta: "Cisco NetAcad · ~22 hrs",
        link: url("netacad.com/courses/networking-basics"),
      },
      {
        id: "m2-networking-devices",
        type: "badge",
        label: "Networking Devices and Initial Configuration",
        meta: "Cisco NetAcad · ~22 hrs",
        link: url("netacad.com/courses/networking-devices-and-initial-configuration"),
      },
    ],
    tasks: [
      { id: "m2-t-build-net", type: "task", label: "Build a small network in Packet Tracer (2 PCs, 1 switch, 1 router)" },
      { id: "m2-t-static-ips", type: "task", label: "Assign static IPs and test connectivity with ping" },
      { id: "m2-t-cli-tools", type: "task", label: "Use ipconfig, tracert, nslookup on your own machine" },
      { id: "m2-t-document", type: "task", label: "Document what you built in a GitHub repo (README)" },
    ],
  },
  {
    n: 3,
    title: "Operating Systems & Linux",
    goal: "Become comfortable with both Windows and Linux. Most IT support roles require both.",
    badges: [
      {
        id: "m3-linux-lfs101",
        type: "badge",
        label: "Introduction to Linux (LFS101)",
        meta: "Linux Foundation · ~40–60 hrs · Certificate",
        link: url("training.linuxfoundation.org/training/introduction-to-linux/"),
      },
      {
        id: "m3-cloud-fundamentals",
        type: "badge",
        label: "Cloud Computing Fundamentals",
        meta: "IBM SkillsBuild · ~6 hrs",
        link: url("skillsbuild.org/college-students/course-catalog/cloud-computing-fundamentals"),
      },
      {
        id: "m3-ai-fundamentals",
        type: "badge",
        label: "AI Fundamentals",
        meta: "IBM SkillsBuild · ~10 hrs",
        link: url("skillsbuild.org"),
      },
    ],
    tasks: [
      { id: "m3-t-install-ubuntu", type: "task", label: "Install Ubuntu (or any Linux distro) on a VM in VirtualBox" },
      { id: "m3-t-terminal", type: "task", label: "Practice the terminal: ls, cd, mkdir, cp, mv, rm, cat, grep" },
      { id: "m3-t-editor", type: "task", label: "Edit a file with nano or vim" },
      { id: "m3-t-users", type: "task", label: "Manage users: useradd, passwd, chmod, chown" },
      { id: "m3-t-bash", type: "task", label: "Write a simple bash script" },
      { id: "m3-t-repo", type: "task", label: "Add a linux-basics repo to GitHub with notes and scripts" },
    ],
  },
  {
    n: 4,
    title: "Security Foundations & Cloud Basics",
    goal: "Build security awareness and cloud vocabulary — both expected in modern support roles.",
    badges: [
      {
        id: "m4-endpoint-security",
        type: "badge",
        label: "Endpoint Security",
        meta: "Cisco NetAcad · ~22 hrs",
        link: url("netacad.com/courses/endpoint-security"),
      },
      {
        id: "m4-cyber-essentials",
        type: "badge",
        label: "Cybersecurity Essentials",
        meta: "Cisco NetAcad · ~30 hrs",
        link: url("netacad.com/courses/cybersecurity-essentials"),
      },
      {
        id: "m4-journey-cloud",
        type: "badge",
        label: "Journey to Cloud: Envisioning Your Solution",
        meta: "IBM SkillsBuild · ~6 hrs",
        link: url("skillsbuild.org"),
      },
      {
        id: "m4-aws-ccp",
        type: "badge",
        label: "AWS Cloud Practitioner Essentials",
        meta: "AWS Skill Builder · ~6 hrs · optional",
        link: url("skillbuilder.aws"),
        optional: true,
      },
    ],
    tasks: [
      { id: "m4-t-defender", type: "task", label: "Set up Windows Defender and explore its settings" },
      { id: "m4-t-phishing", type: "task", label: "Practice identifying phishing emails (take a phishing quiz)" },
      { id: "m4-t-firewall", type: "task", label: "Explore basic firewall concepts in Packet Tracer" },
      { id: "m4-t-aws-ec2", type: "task", label: "Create an AWS free-tier account and launch a free EC2 instance" },
    ],
  },
  {
    n: 5,
    title: "Hands-On Labs & Portfolio Building",
    goal: "Transition from learning to doing. Build things. Document everything.",
    badges: [
      {
        id: "m5-exploring-networking",
        type: "badge",
        label: "Exploring Networking with Cisco Packet Tracer",
        meta: "Cisco NetAcad · ~8 hrs",
        link: url("netacad.com/courses/exploring-networking-cisco-packet-tracer"),
      },
      {
        id: "m5-project-mgmt",
        type: "badge",
        label: "Project Management Fundamentals",
        meta: "IBM SkillsBuild · ~8 hrs",
        link: url("skillsbuild.org"),
      },
      {
        id: "m5-agile",
        type: "badge",
        label: "Agile Explorer",
        meta: "IBM SkillsBuild · ~4 hrs",
        link: url("skillsbuild.org"),
      },
      {
        id: "m5-customer-engagement",
        type: "badge",
        label: "Customer Engagement Specialist",
        meta: "IBM SkillsBuild · ~4 hrs",
        link: url("skillsbuild.org"),
      },
    ],
    tasks: [
      { id: "m5-t-networking-notes", type: "task", label: "Repo: networking-notes (TCP/IP, DNS, DHCP, subnetting + diagrams)" },
      { id: "m5-t-linux-cheatsheet", type: "task", label: "Repo: linux-cheatsheet (commands by category)" },
      { id: "m5-t-pt-labs", type: "task", label: "Repo: packet-tracer-labs (screenshots + descriptions)" },
      { id: "m5-t-troubleshooting", type: "task", label: "Repo: troubleshooting-playbook (step-by-step guides)" },
      { id: "m5-t-homelab", type: "task", label: "Repo: homelab-setup (your VM / server setup)" },
    ],
  },
  {
    n: 6,
    title: "Job Prep, LinkedIn & Landing Interviews",
    goal: "Package everything you've built and start applying. You're ready.",
    badges: [],
    tasks: [
      { id: "m6-t-linkedin-headline", type: "task", label: "Set a keyword-rich LinkedIn headline" },
      { id: "m6-t-certs-section", type: "task", label: "Add EVERY Credly badge under Licenses & Certifications" },
      { id: "m6-t-skills", type: "task", label: "Add 15+ relevant skills to LinkedIn" },
      { id: "m6-t-open-to-work", type: "task", label: "Enable “Open to Work” (recruiter-only visibility)" },
      { id: "m6-t-resume", type: "task", label: "Write a 1-page resume led by Skills + Certifications" },
      { id: "m6-t-apply", type: "task", label: "Set job alerts and start applying (LinkedIn, Glassdoor, career pages)" },
      { id: "m6-t-interview", type: "task", label: "Practice common junior IT support interview questions out loud" },
    ],
  },
];

export const ALL_ITEMS: RoadmapItem[] = ROADMAP.flatMap((m) => [...m.badges, ...m.tasks]);
export const ALL_BADGES: RoadmapItem[] = ROADMAP.flatMap((m) => m.badges);
export const TOTAL_BADGES = ALL_BADGES.length;
export const TOTAL_ITEMS = ALL_ITEMS.length;
