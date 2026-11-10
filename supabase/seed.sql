-- Path Academy starter catalog (generated). Safe to re-run.
begin;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m1-packet-tracer', 'Getting Started with Cisco Packet Tracer', 'Cisco Networking Academy', 'Networking', 'Beginner', 'English', 6, true, 'Install Cisco''s free network simulator and build your very first virtual network.', 'Packet Tracer is the free simulator you will use for every networking lab on this path. This short course walks you through installing it, navigating the interface and building simple topologies you can test without buying any hardware.', array['Install and navigate Cisco Packet Tracer','Place and connect devices in a topology','Run simulations and inspect traffic']::text[], 'Getting Started with Cisco Packet Tracer', '/badges/m1-packet-tracer.png', 'https://www.netacad.com/courses/getting-started-cisco-packet-tracer', true, 0)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your Cisco Networking Academy account', null, null, 0, null
  from public.courses c where c.slug = 'm1-packet-tracer'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your Cisco Networking Academy account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm1-packet-tracer'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Install Cisco Packet Tracer', null, null, 20, 'm1-t-install-pt'
  from public.courses c where c.slug = 'm1-packet-tracer'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all course modules', null, null, 30, null
  from public.courses c where c.slug = 'm1-packet-tracer'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all course modules')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final quiz', null, null, 40, null
  from public.courses c where c.slug = 'm1-packet-tracer'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final quiz')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from Cisco Networking Academy, then share it under Licenses & Certifications.', null, 50, 'm1-packet-tracer'
  from public.courses c where c.slug = 'm1-packet-tracer'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m1-intro-cyber', 'Introduction to Cybersecurity', 'Cisco Networking Academy', 'Cybersecurity', 'Beginner', 'English', 6, true, 'Learn how attacks happen, how to protect your data and what a cybersecurity career looks like.', 'A gentle first look at cybersecurity: common threats, how organizations defend themselves and how you can protect your own devices and accounts. Ideal as your very first badge.', array['Recognise common cyber threats','Protect personal data and devices','Understand cybersecurity career paths']::text[], 'Introduction to Cybersecurity', '/badges/m1-intro-cyber.png', 'https://www.netacad.com/courses/introduction-to-cybersecurity', true, 10)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your Cisco Networking Academy account', null, null, 0, null
  from public.courses c where c.slug = 'm1-intro-cyber'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your Cisco Networking Academy account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm1-intro-cyber'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all course modules', null, null, 20, null
  from public.courses c where c.slug = 'm1-intro-cyber'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all course modules')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final quiz', null, null, 30, null
  from public.courses c where c.slug = 'm1-intro-cyber'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final quiz')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from Cisco Networking Academy, then share it under Licenses & Certifications.', null, 40, 'm1-intro-cyber'
  from public.courses c where c.slug = 'm1-intro-cyber'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m1-cyber-fundamentals', 'Cybersecurity Fundamentals', 'IBM SkillsBuild', 'Cybersecurity', 'Beginner', 'English', 8, true, 'Core security concepts — the CIA triad, attacker types, cryptography basics and incident response.', 'IBM''s foundational security course covers the vocabulary every IT professional is expected to know: the CIA triad, threat actors, cryptography basics, and how security teams respond to incidents.', array['Explain confidentiality, integrity and availability','Describe attacker motivations and methods','Outline the incident-response process']::text[], 'Cybersecurity Fundamentals', '/badges/m1-cyber-fundamentals.png', 'https://skillsbuild.org', false, 20)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your IBM SkillsBuild account', null, null, 0, null
  from public.courses c where c.slug = 'm1-cyber-fundamentals'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your IBM SkillsBuild account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm1-cyber-fundamentals'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all learning modules', null, null, 20, null
  from public.courses c where c.slug = 'm1-cyber-fundamentals'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all learning modules')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final assessment', null, null, 30, null
  from public.courses c where c.slug = 'm1-cyber-fundamentals'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final assessment')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from IBM SkillsBuild, then share it under Licenses & Certifications.', null, 40, 'm1-cyber-fundamentals'
  from public.courses c where c.slug = 'm1-cyber-fundamentals'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m1-digital-world', 'Working in a Digital World: Professional Skills', 'IBM SkillsBuild', 'Professional Skills', 'Beginner', 'English', 6, true, 'Communication, collaboration and problem-solving skills for modern tech teams.', 'Technical skills get you the interview; professional skills get you the job. This course covers communication, teamwork, problem solving and time management in digital workplaces.', array['Communicate clearly in remote teams','Apply structured problem solving','Manage your time and priorities']::text[], 'Working in a Digital World: Professional Skills', '/badges/m1-digital-world.png', 'https://skillsbuild.org', false, 30)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your IBM SkillsBuild account', null, null, 0, null
  from public.courses c where c.slug = 'm1-digital-world'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your IBM SkillsBuild account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm1-digital-world'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all learning modules', null, null, 20, null
  from public.courses c where c.slug = 'm1-digital-world'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all learning modules')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final assessment', null, null, 30, null
  from public.courses c where c.slug = 'm1-digital-world'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final assessment')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from IBM SkillsBuild, then share it under Licenses & Certifications.', null, 40, 'm1-digital-world'
  from public.courses c where c.slug = 'm1-digital-world'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m2-networking-basics', 'Networking Basics', 'Cisco Networking Academy', 'Networking', 'Beginner', 'English', 22, true, 'How networks really work — IP addressing, Ethernet, wireless, DNS and DHCP.', 'The core skill for any IT support role. You will learn how data moves across networks, how IP addressing works, and how services like DNS and DHCP keep everything running.', array['Explain how data travels across a network','Configure IPv4 addressing','Understand DNS, DHCP and common protocols']::text[], 'Networking Basics', '/badges/m2-networking-basics.png', 'https://www.netacad.com/courses/networking-basics', true, 40)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your Cisco Networking Academy account', null, null, 0, null
  from public.courses c where c.slug = 'm2-networking-basics'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your Cisco Networking Academy account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm2-networking-basics'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete modules 1–5', null, null, 20, null
  from public.courses c where c.slug = 'm2-networking-basics'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete modules 1–5')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete modules 6–10', null, null, 30, null
  from public.courses c where c.slug = 'm2-networking-basics'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete modules 6–10')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Use ipconfig, tracert and nslookup on your own machine', null, null, 40, 'm2-t-cli-tools'
  from public.courses c where c.slug = 'm2-networking-basics'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final exam', null, null, 50, null
  from public.courses c where c.slug = 'm2-networking-basics'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final exam')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from Cisco Networking Academy, then share it under Licenses & Certifications.', null, 60, 'm2-networking-basics'
  from public.courses c where c.slug = 'm2-networking-basics'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m2-networking-devices', 'Networking Devices and Initial Configuration', 'Cisco Networking Academy', 'Networking', 'Beginner', 'English', 22, true, 'Configure switches and routers from the command line and troubleshoot connectivity.', 'Move from theory to hands-on configuration. You will set up switches and routers, assign addresses and verify connectivity — all inside Packet Tracer.', array['Configure a Cisco switch and router','Assign static IPs and test with ping','Document a working network']::text[], 'Networking Devices and Initial Configuration', '/badges/m2-networking-devices.png', 'https://www.netacad.com/courses/networking-devices-and-initial-configuration', false, 50)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your Cisco Networking Academy account', null, null, 0, null
  from public.courses c where c.slug = 'm2-networking-devices'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your Cisco Networking Academy account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm2-networking-devices'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Build a small network in Packet Tracer (2 PCs, 1 switch, 1 router)', null, null, 20, 'm2-t-build-net'
  from public.courses c where c.slug = 'm2-networking-devices'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Assign static IPs and test connectivity with ping', null, null, 30, 'm2-t-static-ips'
  from public.courses c where c.slug = 'm2-networking-devices'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Document what you built in a GitHub repo (README)', null, null, 40, 'm2-t-document'
  from public.courses c where c.slug = 'm2-networking-devices'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final exam', null, null, 50, null
  from public.courses c where c.slug = 'm2-networking-devices'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final exam')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from Cisco Networking Academy, then share it under Licenses & Certifications.', null, 60, 'm2-networking-devices'
  from public.courses c where c.slug = 'm2-networking-devices'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m3-linux-lfs101', 'Introduction to Linux (LFS101)', 'Linux Foundation', 'Linux & OS', 'Beginner', 'English', 50, true, 'The Linux Foundation''s flagship free course — the terminal, files, users, permissions and scripting.', 'Most servers on the internet run Linux, and most IT roles expect you to be comfortable with it. LFS101 takes you from your first terminal command to managing users, permissions and writing simple bash scripts.', array['Navigate the Linux filesystem from the terminal','Manage users, groups and permissions','Write and run simple bash scripts']::text[], 'Introduction to Linux (LFS101)', '/badges/m3-linux-lfs101.png', 'https://training.linuxfoundation.org/training/introduction-to-linux/', true, 60)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your Linux Foundation account', null, null, 0, null
  from public.courses c where c.slug = 'm3-linux-lfs101'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your Linux Foundation account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm3-linux-lfs101'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Install Ubuntu (or any distro) on a VM in VirtualBox', null, null, 20, 'm3-t-install-ubuntu'
  from public.courses c where c.slug = 'm3-linux-lfs101'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Practice the terminal: ls, cd, mkdir, cp, mv, rm, cat, grep', null, null, 30, 'm3-t-terminal'
  from public.courses c where c.slug = 'm3-linux-lfs101'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Edit a file with nano or vim', null, null, 40, 'm3-t-editor'
  from public.courses c where c.slug = 'm3-linux-lfs101'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Manage users: useradd, passwd, chmod, chown', null, null, 50, 'm3-t-users'
  from public.courses c where c.slug = 'm3-linux-lfs101'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Write a simple bash script', null, null, 60, 'm3-t-bash'
  from public.courses c where c.slug = 'm3-linux-lfs101'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Add a linux-basics repo to GitHub with notes and scripts', null, null, 70, 'm3-t-repo'
  from public.courses c where c.slug = 'm3-linux-lfs101'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all chapters and the final quiz', null, null, 80, null
  from public.courses c where c.slug = 'm3-linux-lfs101'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all chapters and the final quiz')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from Linux Foundation, then share it under Licenses & Certifications.', null, 90, 'm3-linux-lfs101'
  from public.courses c where c.slug = 'm3-linux-lfs101'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m3-cloud-fundamentals', 'Cloud Computing Fundamentals', 'IBM SkillsBuild', 'Cloud', 'Beginner', 'English', 6, true, 'IaaS, PaaS, SaaS, public vs. private cloud and why every company is moving there.', 'Learn the vocabulary of cloud computing — service and deployment models, virtualization and the business case for the cloud — so you can follow any cloud conversation at work.', array['Compare IaaS, PaaS and SaaS','Explain public, private and hybrid cloud','Describe virtualization basics']::text[], 'Cloud Computing Fundamentals', '/badges/m3-cloud-fundamentals.png', 'https://skillsbuild.org/college-students/course-catalog/cloud-computing-fundamentals', false, 70)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your IBM SkillsBuild account', null, null, 0, null
  from public.courses c where c.slug = 'm3-cloud-fundamentals'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your IBM SkillsBuild account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm3-cloud-fundamentals'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all learning modules', null, null, 20, null
  from public.courses c where c.slug = 'm3-cloud-fundamentals'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all learning modules')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final assessment', null, null, 30, null
  from public.courses c where c.slug = 'm3-cloud-fundamentals'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final assessment')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from IBM SkillsBuild, then share it under Licenses & Certifications.', null, 40, 'm3-cloud-fundamentals'
  from public.courses c where c.slug = 'm3-cloud-fundamentals'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m3-ai-fundamentals', 'AI Fundamentals', 'IBM SkillsBuild', 'AI & Data', 'Beginner', 'English', 10, true, 'Machine learning, NLP, computer vision and AI ethics explained without the hype.', 'A practical introduction to artificial intelligence: what machine learning actually is, where AI is used today and the ethical questions every practitioner should ask.', array['Explain machine learning in plain language','Identify real-world AI use cases','Discuss AI ethics and bias']::text[], 'AI Fundamentals', '/badges/m3-ai-fundamentals.png', 'https://skillsbuild.org', false, 80)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your IBM SkillsBuild account', null, null, 0, null
  from public.courses c where c.slug = 'm3-ai-fundamentals'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your IBM SkillsBuild account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm3-ai-fundamentals'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all learning modules', null, null, 20, null
  from public.courses c where c.slug = 'm3-ai-fundamentals'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all learning modules')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final assessment', null, null, 30, null
  from public.courses c where c.slug = 'm3-ai-fundamentals'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final assessment')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from IBM SkillsBuild, then share it under Licenses & Certifications.', null, 40, 'm3-ai-fundamentals'
  from public.courses c where c.slug = 'm3-ai-fundamentals'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m4-endpoint-security', 'Endpoint Security', 'Cisco Networking Academy', 'Cybersecurity', 'Intermediate', 'English', 22, true, 'Harden Windows and Linux hosts, configure defenses and understand malware behaviour.', 'Protecting laptops, desktops and servers is a daily part of IT support. This course covers host hardening, antimalware, patching and the security features built into modern operating systems.', array['Harden Windows and Linux endpoints','Configure antimalware and host firewalls','Plan patch management']::text[], 'Endpoint Security', '/badges/m4-endpoint-security.png', 'https://www.netacad.com/courses/endpoint-security', false, 90)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your Cisco Networking Academy account', null, null, 0, null
  from public.courses c where c.slug = 'm4-endpoint-security'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your Cisco Networking Academy account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm4-endpoint-security'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Set up Windows Defender and explore its settings', null, null, 20, 'm4-t-defender'
  from public.courses c where c.slug = 'm4-endpoint-security'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all course modules', null, null, 30, null
  from public.courses c where c.slug = 'm4-endpoint-security'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all course modules')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final exam', null, null, 40, null
  from public.courses c where c.slug = 'm4-endpoint-security'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final exam')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from Cisco Networking Academy, then share it under Licenses & Certifications.', null, 50, 'm4-endpoint-security'
  from public.courses c where c.slug = 'm4-endpoint-security'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m4-cyber-essentials', 'Cybersecurity Essentials', 'Cisco Networking Academy', 'Cybersecurity', 'Intermediate', 'English', 30, true, 'Defend networks: firewalls, cryptography, access control and security operations.', 'Build on the introduction with deeper defensive skills — cryptography, access control, firewalls and the processes security operations teams follow every day.', array['Apply cryptography and access control concepts','Explain firewall and IDS roles','Spot phishing and social engineering']::text[], 'Cybersecurity Essentials', '/badges/m4-cyber-essentials.png', 'https://www.netacad.com/courses/cybersecurity-essentials', false, 100)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your Cisco Networking Academy account', null, null, 0, null
  from public.courses c where c.slug = 'm4-cyber-essentials'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your Cisco Networking Academy account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm4-cyber-essentials'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Practice identifying phishing emails (take a phishing quiz)', null, null, 20, 'm4-t-phishing'
  from public.courses c where c.slug = 'm4-cyber-essentials'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Explore basic firewall concepts in Packet Tracer', null, null, 30, 'm4-t-firewall'
  from public.courses c where c.slug = 'm4-cyber-essentials'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all course modules', null, null, 40, null
  from public.courses c where c.slug = 'm4-cyber-essentials'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all course modules')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final exam', null, null, 50, null
  from public.courses c where c.slug = 'm4-cyber-essentials'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final exam')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from Cisco Networking Academy, then share it under Licenses & Certifications.', null, 60, 'm4-cyber-essentials'
  from public.courses c where c.slug = 'm4-cyber-essentials'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m4-journey-cloud', 'Journey to Cloud: Envisioning Your Solution', 'IBM SkillsBuild', 'Cloud', 'Beginner', 'English', 6, true, 'Design thinking for cloud adoption — plan a migration from a business point of view.', 'Step into the shoes of a cloud consultant and plan how an organization moves to the cloud, from assessing workloads to choosing the right approach.', array['Assess workloads for cloud migration','Apply design thinking to cloud adoption','Present a cloud solution']::text[], 'Journey to Cloud: Envisioning Your Solution', '/badges/m4-journey-cloud.png', 'https://skillsbuild.org', false, 110)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your IBM SkillsBuild account', null, null, 0, null
  from public.courses c where c.slug = 'm4-journey-cloud'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your IBM SkillsBuild account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm4-journey-cloud'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all learning modules', null, null, 20, null
  from public.courses c where c.slug = 'm4-journey-cloud'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all learning modules')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final assessment', null, null, 30, null
  from public.courses c where c.slug = 'm4-journey-cloud'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final assessment')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from IBM SkillsBuild, then share it under Licenses & Certifications.', null, 40, 'm4-journey-cloud'
  from public.courses c where c.slug = 'm4-journey-cloud'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m4-aws-ccp', 'AWS Cloud Practitioner Essentials', 'AWS Skill Builder', 'Cloud', 'Beginner', 'English', 6, true, 'AWS''s own intro to cloud concepts, core services, security and pricing.', 'The official starting point for AWS. Learn the global infrastructure, core services like EC2 and S3, the shared-responsibility model and how AWS pricing works. A great step toward the Cloud Practitioner exam.', array['Describe AWS global infrastructure','Use core services such as EC2 and S3','Explain the shared-responsibility model']::text[], 'AWS Cloud Practitioner Essentials', '/badges/m4-aws-ccp.png', 'https://skillbuilder.aws', false, 120)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your AWS Skill Builder account', null, null, 0, null
  from public.courses c where c.slug = 'm4-aws-ccp'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your AWS Skill Builder account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm4-aws-ccp'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create an AWS free-tier account and launch a free EC2 instance', null, null, 20, 'm4-t-aws-ec2'
  from public.courses c where c.slug = 'm4-aws-ccp'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all course modules', null, null, 30, null
  from public.courses c where c.slug = 'm4-aws-ccp'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all course modules')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the knowledge check', null, null, 40, null
  from public.courses c where c.slug = 'm4-aws-ccp'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the knowledge check')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from AWS Skill Builder, then share it under Licenses & Certifications.', null, 50, 'm4-aws-ccp'
  from public.courses c where c.slug = 'm4-aws-ccp'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m5-exploring-networking', 'Exploring Networking with Cisco Packet Tracer', 'Cisco Networking Academy', 'Networking', 'Beginner', 'English', 8, true, 'Hands-on labs: build home, small-business and IoT networks end to end.', 'A lab-heavy course where you design and troubleshoot realistic networks in Packet Tracer — perfect material for your portfolio.', array['Design small-office networks','Troubleshoot connectivity step by step','Capture lab evidence for your portfolio']::text[], 'Exploring Networking with Cisco Packet Tracer', '/badges/m5-exploring-networking.png', 'https://www.netacad.com/courses/exploring-networking-cisco-packet-tracer', false, 130)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your Cisco Networking Academy account', null, null, 0, null
  from public.courses c where c.slug = 'm5-exploring-networking'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your Cisco Networking Academy account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm5-exploring-networking'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete every Packet Tracer activity', null, null, 20, null
  from public.courses c where c.slug = 'm5-exploring-networking'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete every Packet Tracer activity')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final quiz', null, null, 30, null
  from public.courses c where c.slug = 'm5-exploring-networking'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final quiz')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from Cisco Networking Academy, then share it under Licenses & Certifications.', null, 40, 'm5-exploring-networking'
  from public.courses c where c.slug = 'm5-exploring-networking'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m5-project-mgmt', 'Project Management Fundamentals', 'IBM SkillsBuild', 'Professional Skills', 'Beginner', 'English', 8, true, 'Plan, schedule and deliver projects — scope, stakeholders, risks and timelines.', 'IT work is project work. Learn how projects are scoped, planned and delivered, and how to keep stakeholders informed along the way.', array['Define scope and deliverables','Build a simple project plan','Manage risks and stakeholders']::text[], 'Project Management Fundamentals', '/badges/m5-project-mgmt.png', 'https://skillsbuild.org', false, 140)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your IBM SkillsBuild account', null, null, 0, null
  from public.courses c where c.slug = 'm5-project-mgmt'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your IBM SkillsBuild account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm5-project-mgmt'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all learning modules', null, null, 20, null
  from public.courses c where c.slug = 'm5-project-mgmt'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all learning modules')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final assessment', null, null, 30, null
  from public.courses c where c.slug = 'm5-project-mgmt'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final assessment')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from IBM SkillsBuild, then share it under Licenses & Certifications.', null, 40, 'm5-project-mgmt'
  from public.courses c where c.slug = 'm5-project-mgmt'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m5-agile', 'Agile Explorer', 'IBM SkillsBuild', 'Professional Skills', 'Beginner', 'English', 4, true, 'Scrum, Kanban and the agile mindset used by almost every tech team.', 'A quick, practical introduction to agile ways of working — sprints, stand-ups, Kanban boards and continuous improvement.', array['Explain the agile mindset','Describe Scrum roles and ceremonies','Run a simple Kanban board']::text[], 'Agile Explorer', '/badges/m5-agile.png', 'https://skillsbuild.org', false, 150)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your IBM SkillsBuild account', null, null, 0, null
  from public.courses c where c.slug = 'm5-agile'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your IBM SkillsBuild account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm5-agile'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all learning modules', null, null, 20, null
  from public.courses c where c.slug = 'm5-agile'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all learning modules')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final assessment', null, null, 30, null
  from public.courses c where c.slug = 'm5-agile'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final assessment')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from IBM SkillsBuild, then share it under Licenses & Certifications.', null, 40, 'm5-agile'
  from public.courses c where c.slug = 'm5-agile'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('m5-customer-engagement', 'Customer Engagement Specialist', 'IBM SkillsBuild', 'Professional Skills', 'Beginner', 'English', 4, true, 'Deliver great support experiences — empathy, active listening and de-escalation.', 'Help-desk work is customer work. Learn how to listen actively, de-escalate frustrated users and turn support tickets into great experiences.', array['Practice active listening','De-escalate difficult conversations','Write clear support responses']::text[], 'Customer Engagement Specialist', '/badges/m5-customer-engagement.png', 'https://skillsbuild.org', false, 160)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create or sign in to your IBM SkillsBuild account', null, null, 0, null
  from public.courses c where c.slug = 'm5-customer-engagement'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Create or sign in to your IBM SkillsBuild account')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enroll in the course on the provider''s site', null, null, 10, null
  from public.courses c where c.slug = 'm5-customer-engagement'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Enroll in the course on the provider''s site')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Complete all learning modules', null, null, 20, null
  from public.courses c where c.slug = 'm5-customer-engagement'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Complete all learning modules')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Pass the final assessment', null, null, 30, null
  from public.courses c where c.slug = 'm5-customer-engagement'
   and not exists (select 1 from public.course_tasks x where x.course_id = c.id and x.title = 'Pass the final assessment')
  ;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Claim your badge on Credly and add it to LinkedIn', 'Accept the badge email from IBM SkillsBuild, then share it under Licenses & Certifications.', null, 40, 'm5-customer-engagement'
  from public.courses c where c.slug = 'm5-customer-engagement'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('launch-your-profile', 'Launch Your Professional Profile', 'Path Academy', 'Career', 'Beginner', 'English', 3, true, 'Set up Credly, LinkedIn and GitHub so recruiters can find every badge you earn.', 'Before you earn your first badge, set up the three profiles that will showcase your work. This takes an afternoon and pays off for your whole career.', array['A Credly badge portfolio','An optimized LinkedIn profile','A GitHub account ready for projects']::text[], null, null, 'https://www.credly.com', false, 170)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create a Credly account (your badge portfolio)', null, 'https://www.credly.com', 0, 'm1-t-credly'
  from public.courses c where c.slug = 'launch-your-profile'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create / optimize your LinkedIn profile', null, 'https://www.linkedin.com', 10, 'm1-t-linkedin'
  from public.courses c where c.slug = 'launch-your-profile'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Create a GitHub account (even if empty for now)', null, 'https://github.com', 20, 'm1-t-github'
  from public.courses c where c.slug = 'launch-your-profile'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Add your first 4 Credly badges to LinkedIn', null, null, 30, 'm1-t-badges-linkedin'
  from public.courses c where c.slug = 'launch-your-profile'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('it-portfolio', 'Build Your IT Portfolio on GitHub', 'Path Academy', 'Career', 'Intermediate', 'English', 20, true, 'Turn everything you learned into five public repos that prove your skills.', 'Transition from learning to doing. Each repo is evidence a hiring manager can open and read — notes, labs, cheat-sheets and a home-lab write-up.', array['Five portfolio-ready repositories','Clear READMEs with diagrams and screenshots','A documented home lab']::text[], null, null, 'https://github.com', false, 180)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Repo: networking-notes (TCP/IP, DNS, DHCP, subnetting + diagrams)', null, null, 0, 'm5-t-networking-notes'
  from public.courses c where c.slug = 'it-portfolio'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Repo: linux-cheatsheet (commands by category)', null, null, 10, 'm5-t-linux-cheatsheet'
  from public.courses c where c.slug = 'it-portfolio'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Repo: packet-tracer-labs (screenshots + descriptions)', null, null, 20, 'm5-t-pt-labs'
  from public.courses c where c.slug = 'it-portfolio'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Repo: troubleshooting-playbook (step-by-step guides)', null, null, 30, 'm5-t-troubleshooting'
  from public.courses c where c.slug = 'it-portfolio'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Repo: homelab-setup (your VM / server setup)', null, null, 40, 'm5-t-homelab'
  from public.courses c where c.slug = 'it-portfolio'
  on conflict (legacy_key) do nothing;

insert into public.courses (slug, title, provider, category, level, language, duration_hours, is_free, short_description, description, outcomes, badge_name, badge_image_url, course_url, is_featured, sort_order) values ('job-prep', 'Job Prep: Land Your First IT Role', 'Path Academy', 'Career', 'Beginner', 'English', 15, true, 'Package your badges and portfolio, then apply and interview with confidence.', 'You''re ready. Polish your LinkedIn, write a skills-first resume, and practice the questions junior IT support interviews always ask.', array['A keyword-rich LinkedIn profile','A one-page skills-first resume','Confident answers to common interview questions']::text[], null, null, 'https://www.linkedin.com/jobs', false, 190)
  on conflict (slug) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Set a keyword-rich LinkedIn headline', null, null, 0, 'm6-t-linkedin-headline'
  from public.courses c where c.slug = 'job-prep'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Add EVERY Credly badge under Licenses & Certifications', null, null, 10, 'm6-t-certs-section'
  from public.courses c where c.slug = 'job-prep'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Add 15+ relevant skills to LinkedIn', null, null, 20, 'm6-t-skills'
  from public.courses c where c.slug = 'job-prep'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Enable "Open to Work" (recruiter-only visibility)', null, null, 30, 'm6-t-open-to-work'
  from public.courses c where c.slug = 'job-prep'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Write a 1-page resume led by Skills + Certifications', null, null, 40, 'm6-t-resume'
  from public.courses c where c.slug = 'job-prep'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Set job alerts and start applying', null, null, 50, 'm6-t-apply'
  from public.courses c where c.slug = 'job-prep'
  on conflict (legacy_key) do nothing;
insert into public.course_tasks (course_id, title, details, resource_url, sort_order, legacy_key)
  select c.id, 'Practice common junior IT support interview questions out loud', null, null, 60, 'm6-t-interview'
  from public.courses c where c.slug = 'job-prep'
  on conflict (legacy_key) do nothing;

insert into public.paths (slug, title, subtitle, description, sort_order) values ('zero-to-junior-it', 'Zero to Junior IT Support', '6 months · no degree · no money', 'A no-excuses roadmap that turns 2–3 focused hours a day into verifiable badges recruiters can actually find. Follow the courses in order, tick off every task, and finish with a portfolio and a job-ready profile.', 0)
  on conflict (slug) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 1 · Digital foundations', 0 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'launch-your-profile'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 1 · Digital foundations', 10 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm1-packet-tracer'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 1 · Digital foundations', 20 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm1-intro-cyber'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 1 · Digital foundations', 30 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm1-cyber-fundamentals'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 1 · Digital foundations', 40 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm1-digital-world'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 2 · Networking', 50 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm2-networking-basics'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 2 · Networking', 60 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm2-networking-devices'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 3 · Linux & OS', 70 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm3-linux-lfs101'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 3 · Linux & OS', 80 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm3-cloud-fundamentals'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 3 · Linux & OS', 90 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm3-ai-fundamentals'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 4 · Security & cloud', 100 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm4-endpoint-security'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 4 · Security & cloud', 110 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm4-cyber-essentials'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 4 · Security & cloud', 120 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm4-journey-cloud'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 4 · Security & cloud', 130 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm4-aws-ccp'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 5 · Labs & portfolio', 140 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm5-exploring-networking'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 5 · Labs & portfolio', 150 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm5-project-mgmt'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 5 · Labs & portfolio', 160 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm5-agile'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 5 · Labs & portfolio', 170 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'm5-customer-engagement'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 5 · Labs & portfolio', 180 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'it-portfolio'
  on conflict (path_id, course_id) do nothing;
insert into public.path_courses (path_id, course_id, stage, sort_order)
  select p.id, c.id, 'Month 6 · Job prep', 190 from public.paths p, public.courses c
  where p.slug = 'zero-to-junior-it' and c.slug = 'job-prep'
  on conflict (path_id, course_id) do nothing;

commit;
