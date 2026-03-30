// ── QUESTION BANK ─────────────────────────────────────────────────────────────
export const QUESTIONS = [
  // ── NETWORKING ──────────────────────────────────────────────────────────────
  {
    id: 1, category: "Networking", difficulty: "Easy",
    q: "What are the 7 layers of the OSI model?",
    a: `Physical → Data Link → Network → Transport → Session → Presentation → Application

Mnemonic: "Please Do Not Throw Sausage Pizza Away"

• Layer 1 – Physical: cables, NICs, electrical signals (Ethernet cable, fiber)
• Layer 2 – Data Link: MAC addresses, switches, frames (Ethernet, Wi-Fi 802.11)
• Layer 3 – Network: IP addresses, routing, packets (IP, ICMP, routers)
• Layer 4 – Transport: end-to-end delivery, ports, reliability (TCP, UDP)
• Layer 5 – Session: manages sessions/connections between apps
• Layer 6 – Presentation: data format, encryption/decryption (SSL/TLS, JPEG)
• Layer 7 – Application: what the user interacts with (HTTP, FTP, DNS, SMTP)

In troubleshooting, always start from Layer 1 upward.`,
  },
  {
    id: 2, category: "Networking", difficulty: "Easy",
    q: "What is the difference between TCP and UDP?",
    a: `TCP (Transmission Control Protocol):
• Connection-oriented — establishes a 3-way handshake (SYN, SYN-ACK, ACK)
• Reliable — guarantees delivery, retransmits lost packets
• Ordered — data arrives in the correct sequence
• Slower due to overhead
• Use cases: HTTP/HTTPS, SSH, FTP, email

UDP (User Datagram Protocol):
• Connectionless — no handshake, fire and forget
• Unreliable — no guarantee of delivery
• Faster with less overhead
• Use cases: DNS, VoIP, video streaming, online gaming, DHCP

Rule of thumb: TCP when accuracy matters, UDP when speed matters.`,
  },
  {
    id: 3, category: "Networking", difficulty: "Easy",
    q: "What is DHCP and how does it work?",
    a: `DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses to devices on a network so you don't have to configure each one manually.

Process — DORA:
1. Discover — client broadcasts "I need an IP" (UDP port 68 → 67)
2. Offer — DHCP server offers an IP lease
3. Request — client says "I'll take that IP"
4. Acknowledge — server confirms the lease

DHCP assigns: IP address, subnet mask, default gateway, DNS server, lease duration

Port: UDP 67 (server) / 68 (client)

In an enterprise, the DHCP server is usually the Domain Controller or a dedicated server/router.`,
  },
  {
    id: 4, category: "Networking", difficulty: "Easy",
    q: "What is DNS and how does it work?",
    a: `DNS (Domain Name System) translates human-readable domain names into IP addresses.
Example: google.com → 142.250.185.46

Resolution process:
1. You type google.com → browser checks local cache
2. Asks local DNS resolver (usually your router or ISP)
3. If not cached → queries Root nameserver → TLD nameserver (.com) → Authoritative nameserver
4. Returns the IP address → browser connects

Key record types:
• A — maps domain to IPv4
• AAAA — maps domain to IPv6
• CNAME — alias (www → root domain)
• MX — mail server
• PTR — reverse lookup (IP → domain)
• NS — nameserver records

Port: UDP/TCP 53

Troubleshooting: nslookup google.com or dig google.com`,
  },
  {
    id: 5, category: "Networking", difficulty: "Easy",
    q: "What is the difference between a hub, switch, and router?",
    a: `Hub (Layer 1 — Physical):
• Broadcasts all traffic to every port
• No intelligence — creates collisions
• Obsolete, rarely used today

Switch (Layer 2 — Data Link):
• Learns MAC addresses and builds a MAC table
• Sends traffic only to the correct port (unicast)
• Reduces collisions, much more efficient
• Connects devices within the same network/VLAN

Router (Layer 3 — Network):
• Routes traffic between different networks using IP addresses
• Connects your LAN to the internet or other networks
• Makes routing decisions based on a routing table
• Performs NAT (Network Address Translation)

Memory aid: Hub = shouts to everyone. Switch = knows who's who on the LAN. Router = knows how to reach other networks.`,
  },
  {
    id: 6, category: "Networking", difficulty: "Medium",
    q: "What is a VLAN and why would you use one?",
    a: `VLAN (Virtual LAN) logically segments a physical network into separate broadcast domains without needing separate physical hardware.

Why use VLANs:
• Security — isolate sensitive departments (finance, HR) from general staff
• Performance — reduce broadcast traffic by limiting broadcast domains
• Flexibility — group users by function, not physical location
• Easier management — apply policies per VLAN

Example: One physical switch but three VLANs:
• VLAN 10 — Management
• VLAN 20 — Staff
• VLAN 30 — Guest Wi-Fi (isolated from internal network)

Trunk ports carry multiple VLANs (tagged with 802.1Q headers).
Access ports connect end devices to a single VLAN.

Configured on managed switches (Cisco, HP/Aruba, etc.).`,
  },
  {
    id: 7, category: "Networking", difficulty: "Medium",
    q: "What is NAT and why is it used?",
    a: `NAT (Network Address Translation) translates private IP addresses to a public IP address (and back) so that many devices can share one public IP.

Why it's needed:
• IPv4 has ~4.3 billion addresses — not enough for every device
• Private IP ranges (192.168.x.x, 10.x.x.x, 172.16-31.x.x) are not routable on the internet
• NAT maps internal private IPs to the router's single public IP

How it works:
• Your PC (192.168.1.10) sends request to google.com
• Router replaces source IP with its public IP (e.g. 81.2.3.4)
• Google replies to 81.2.3.4 → router looks up NAT table → forwards to 192.168.1.10

Types:
• PAT (Port Address Translation / NAT Overload) — most common, uses port numbers to track connections
• Static NAT — one private IP mapped permanently to one public IP (used for servers)`,
  },
  {
    id: 8, category: "Networking", difficulty: "Medium",
    q: "What common ports should every IT person know?",
    a: `Essential port numbers:

Service          Port    Protocol
─────────────────────────────────
FTP (data)        20     TCP
FTP (control)     21     TCP
SSH               22     TCP
Telnet            23     TCP
SMTP (email out)  25     TCP
DNS               53     UDP/TCP
DHCP server       67     UDP
DHCP client       68     UDP
HTTP              80     TCP
Kerberos          88     TCP/UDP
POP3             110     TCP
IMAP             143     TCP
HTTPS            443     TCP
SMB/Windows      445     TCP
LDAP             389     TCP
LDAPS            636     TCP
RDP             3389     TCP
MySQL           3306     TCP
RDP is critical for sysadmins — 3389. SSH is 22. DNS is 53. HTTPS is 443.`,
  },
  {
    id: 9, category: "Networking", difficulty: "Medium",
    q: "Walk me through troubleshooting a user who has no internet access.",
    a: `Use a top-down or bottom-up OSI approach. In practice, bottom-up works well:

1. Physical (L1): Is the cable plugged in? Are link lights on? Try a different cable/port.

2. IP address (L3): Run ipconfig (Windows) / ip addr (Linux)
   • Got 169.254.x.x? → DHCP failure (APIPA address) — check DHCP server
   • Got 0.0.0.0? → No IP at all

3. Default gateway: ping [gateway IP] — can you reach the router?
   • No → problem is between PC and router (cable, switch, Wi-Fi, VLAN)

4. DNS: ping 8.8.8.8 — can you reach the internet by IP?
   • Yes → DNS issue. Check DNS settings, run nslookup google.com
   • No → routing problem or ISP issue

5. Browser: if ping works but browser doesn't → proxy/firewall/browser issue

6. Check if others are affected → isolate: single user vs whole network

Always document steps and resolution in the ticketing system.`,
  },
  {
    id: 10, category: "Networking", difficulty: "Hard",
    q: "What is subnetting? How do you calculate a subnet?",
    a: `Subnetting divides a large network into smaller logical sub-networks for better management, security, and efficiency.

Key concept: The subnet mask defines which part of an IP is the network vs. host.
• 255.255.255.0 = /24 → 254 usable hosts
• 255.255.255.128 = /25 → 126 usable hosts
• 255.255.255.192 = /26 → 62 usable hosts

CIDR notation: 192.168.1.0/24
• /24 means 24 bits for network, 8 bits for hosts
• 2^8 = 256 addresses, minus 2 (network + broadcast) = 254 usable

Example — /26:
• Bits for hosts: 32-26 = 6 → 2^6 = 64 addresses → 62 usable
• Block size: 64 → subnets: .0, .64, .128, .192
• .0/26 → hosts: .1 to .62, broadcast .63

Quick powers of 2: /30=4(2 hosts), /29=8(6), /28=16(14), /27=32(30), /26=64(62), /25=128(126), /24=256(254)

In practice: use ipcalc or Subnet calculator tools. Know the logic for interviews.`,
  },

  // ── WINDOWS / ACTIVE DIRECTORY ───────────────────────────────────────────────
  {
    id: 11, category: "Windows / AD", difficulty: "Easy",
    q: "What is Active Directory (AD)?",
    a: `Active Directory is Microsoft's directory service that centralizes authentication, authorization, and management of users, computers, and resources in a Windows domain network.

What it does:
• Single Sign-On (SSO) — users log in once and access network resources
• Centralized user/computer management
• Group Policy enforcement across all machines
• Authentication via Kerberos (primary) or NTLM (legacy)

Structure (hierarchical):
Forest → Domain(s) → Organizational Units (OUs) → Users / Computers / Groups

Key components:
• Domain Controller (DC) — server running AD DS, holds the directory database (NTDS.DIT)
• LDAP — protocol used to query AD
• Kerberos — authentication protocol (port 88)
• DNS — AD relies heavily on DNS (SRV records)

Common tools: Active Directory Users and Computers (ADUC), AD Administrative Center, PowerShell (Get-ADUser, etc.)`,
  },
  {
    id: 12, category: "Windows / AD", difficulty: "Easy",
    q: "What is a Domain Controller (DC)?",
    a: `A Domain Controller is a Windows Server that runs Active Directory Domain Services (AD DS). It is the heart of a Windows domain.

Responsibilities:
• Authenticates users and computers (validates credentials)
• Stores and replicates the AD database (NTDS.DIT)
• Enforces Group Policy
• Manages Kerberos tickets
• Runs DNS (usually) and DHCP (sometimes)

Key concepts:
• Primary DC (PDC Emulator) — one DC holds the PDC Emulator FSMO role, handles time sync and password changes
• Best practice: minimum 2 DCs per domain for redundancy
• Global Catalog (GC) — a DC that holds a partial replica of all objects in the forest for cross-domain searches

If the DC goes down: users can't log in to the domain (cached credentials may work temporarily), GPOs won't apply, DHCP/DNS may fail.`,
  },
  {
    id: 13, category: "Windows / AD", difficulty: "Easy",
    q: "What is Group Policy (GPO)?",
    a: `Group Policy Objects (GPOs) are a collection of settings applied to users and computers in an AD domain, enforced by the Domain Controller.

What you can control with GPO:
• Password policies (complexity, length, expiry)
• Software deployment and restriction
• Drive/printer mapping
• Desktop wallpaper, screensaver
• Security settings (firewall, UAC, BitLocker)
• Login/logoff scripts
• Browser homepage
• Disable USB drives

GPO is linked to: Sites → Domains → OUs (most specific wins)
Processing order: Local → Site → Domain → OU (LSDOU)

Key commands:
• gpupdate /force — immediately apply GPO changes
• gpresult /r — show which GPOs are applied to current user/computer
• rsop.msc — Resultant Set of Policy (GUI view)

GPOs make it possible to manage thousands of machines from one place.`,
  },
  {
    id: 14, category: "Windows / AD", difficulty: "Easy",
    q: "What is the difference between a workgroup and a domain?",
    a: `Workgroup:
• Peer-to-peer network — no central server
• Each PC manages its own users and resources locally
• Maximum ~10-20 computers (not scalable)
• Each user account exists only on that one machine
• No centralized policy, no single sign-on
• Used in home networks and very small offices

Domain:
• Client-server model — Domain Controller manages everything
• Centralized authentication — one set of credentials works everywhere
• Scales to thousands of users and computers
• Group Policy applied centrally
• Users, computers, and resources managed from one place
• Used in businesses and enterprises

Key sign: if a PC is "joined to the domain," its login screen says DOMAIN\\username instead of just username. You can check with: System Properties → Computer Name → Domain.`,
  },
  {
    id: 15, category: "Windows / AD", difficulty: "Medium",
    q: "A user is locked out of their account. Walk me through what you do.",
    a: `Step 1: Verify it's an account lockout (not a wrong password or expired password).
• Check Event Viewer on the DC → Windows Logs → Security → Event ID 4740 (account locked out)
• Or in ADUC: find the user → Account tab → "Account is locked out" checkbox
• Tool: Microsoft Account Lockout Tools (LockoutStatus.exe)

Step 2: Identify the source of lockouts.
• Event ID 4740 includes the "Caller Computer Name" — the machine causing the lockouts
• Common causes: saved credentials (old password), a service running as that user, a mapped drive, a mobile device with old password, or RDP sessions

Step 3: Unlock the account.
• ADUC: right-click user → Properties → Account tab → uncheck "Account is locked out"
• PowerShell: Unlock-ADAccount -Identity username

Step 4: Fix the root cause before the user logs in again, or they'll get locked out again.

Step 5: If password is expired too, reset it and force change at next login.

Always log the resolution in the ticket.`,
  },
  {
    id: 16, category: "Windows / AD", difficulty: "Medium",
    q: "What is the Windows Registry?",
    a: `The Windows Registry is a hierarchical database that stores configuration settings and options for the Windows OS and installed applications.

Structure — 5 root hives:
• HKEY_LOCAL_MACHINE (HKLM) — system-wide settings, hardware, software installed for all users
• HKEY_CURRENT_USER (HKCU) — settings for the currently logged-in user
• HKEY_USERS (HKU) — all loaded user profiles
• HKEY_CLASSES_ROOT (HKCR) — file associations, COM objects
• HKEY_CURRENT_CONFIG (HKCC) — current hardware profile

Access: regedit.exe

Sysadmin use cases:
• Fixing application issues that require registry edits
• Deploying settings via GPO (Registry policy)
• Removing malware persistence (startup entries in HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run)
• Troubleshooting OS behavior

⚠️ Always export/backup before editing: File → Export in regedit. A wrong edit can break Windows.`,
  },
  {
    id: 17, category: "Windows / AD", difficulty: "Easy",
    q: "What are NTFS permissions and how do they differ from Share permissions?",
    a: `NTFS Permissions (local file system level):
• Applied to files and folders on NTFS volumes
• Apply locally AND over the network
• Granular: Full Control, Modify, Read & Execute, List Folder, Read, Write
• Inherited from parent folder by default
• Set via: right-click → Properties → Security tab

Share Permissions (network access level):
• Only apply when accessing over the network (SMB share)
• Coarser: Full Control, Change, Read
• Set via: right-click → Properties → Sharing → Advanced Sharing → Permissions

When both apply (accessing a shared folder over the network):
The MORE restrictive permission wins.

Example: Share = Full Control, NTFS = Read → effective = Read

Best practice: Give Everyone "Full Control" on Share permissions, then control access finely with NTFS permissions. This simplifies management.`,
  },
  {
    id: 18, category: "Windows / AD", difficulty: "Medium",
    q: "What key Windows command-line tools should every sysadmin know?",
    a: `Networking:
• ipconfig /all — shows IP, MAC, DNS, gateway, DHCP server
• ipconfig /release && /renew — release and renew DHCP lease
• ipconfig /flushdns — clear DNS cache
• ping [host] — test connectivity (ICMP)
• tracert [host] — trace route to destination
• nslookup [domain] — DNS query tool
• netstat -an — show active connections and listening ports
• pathping — combines ping + tracert
• arp -a — show ARP table (IP-to-MAC mappings)

System:
• gpupdate /force — apply Group Policy immediately
• gpresult /r — show applied GPOs
• systeminfo — OS version, uptime, hotfixes
• tasklist / taskkill — list/kill processes
• net user [name] — show/manage user account
• net localgroup administrators — list local admins
• sfc /scannow — System File Checker (repairs corrupted Windows files)
• chkdsk — check disk for errors
• eventvwr — open Event Viewer
• msconfig — startup and boot options
• mstsc — Remote Desktop Client`,
  },

  // ── LINUX ────────────────────────────────────────────────────────────────────
  {
    id: 19, category: "Linux", difficulty: "Easy",
    q: "What are the most important Linux commands for a sysadmin?",
    a: `File & Navigation:
• ls -la — list all files with permissions
• cd, pwd, mkdir, rm -rf, cp, mv, touch
• cat, less, head, tail -f (follow log files in real-time)
• find /path -name "file" — search for files
• grep "pattern" file — search inside files

Permissions:
• chmod 755 file — set permissions
• chown user:group file — change owner
• id — show current user's UID/GID/groups

Processes:
• ps aux — list all running processes
• top / htop — interactive process monitor
• kill -9 [PID] — force kill process
• systemctl status/start/stop/restart [service]

Networking:
• ip addr / ifconfig — show network interfaces
• ping, traceroute, ss -tulnp (open ports), netstat -an
• curl / wget — fetch URLs

Disk & Storage:
• df -h — disk usage per filesystem
• du -sh /path — directory size
• lsblk — list block devices
• mount / umount

Logs:
• journalctl -u [service] -f — follow service logs
• tail -f /var/log/syslog`,
  },
  {
    id: 20, category: "Linux", difficulty: "Easy",
    q: "How do Linux file permissions work? (chmod, chown)",
    a: `Every file has permissions for 3 groups: Owner | Group | Others
Each group has 3 bits: Read (r=4), Write (w=2), Execute (x=1)

Example: -rwxr-xr--
• - = file type (- = file, d = directory, l = symlink)
• rwx = owner can read, write, execute
• r-x = group can read and execute
• r-- = others can only read

Numeric (octal) representation:
• 7 = rwx (4+2+1)
• 6 = rw- (4+2)
• 5 = r-x (4+1)
• 4 = r-- (4)

chmod examples:
• chmod 755 script.sh → owner:rwx, group:r-x, others:r-x (typical for executables)
• chmod 644 file.txt → owner:rw-, group:r--, others:r-- (typical for files)
• chmod 700 private/ → only owner has access
• chmod +x script.sh → add execute for all
• chmod -R 755 /dir → recursive

chown:
• chown john file.txt → change owner to john
• chown john:developers file.txt → change owner and group
• chown -R john:john /home/john → recursive`,
  },
  {
    id: 21, category: "Linux", difficulty: "Easy",
    q: "What is systemd and how do you manage services with it?",
    a: `systemd is the init system and service manager used in modern Linux distributions (Ubuntu 16+, CentOS 7+, RHEL 7+, Debian 8+).

It replaced older init systems (SysV init, Upstart) and provides:
• Parallel service startup (faster boot)
• Dependency management between services
• Logging via journald
• Socket and timer activation

Key commands:
systemctl status nginx         # check service status
systemctl start nginx          # start
systemctl stop nginx           # stop
systemctl restart nginx        # restart
systemctl reload nginx         # reload config without downtime
systemctl enable nginx         # start on boot
systemctl disable nginx        # don't start on boot
systemctl is-active nginx      # quick check: active/inactive
systemctl list-units --type=service   # list all services

View logs:
journalctl -u nginx            # all logs for nginx
journalctl -u nginx -f         # follow live
journalctl -u nginx --since "1 hour ago"
journalctl -b                  # logs since last boot`,
  },
  {
    id: 22, category: "Linux", difficulty: "Medium",
    q: "What is the difference between sudo and su?",
    a: `su (switch user):
• Switches to another user's full environment
• su - (with dash) = full login shell (loads that user's environment, PATH, etc.)
• su (without dash) = switches user but keeps current environment
• Requires the TARGET user's password
• su - root → become root (needs root password)
• Common in older RHEL/CentOS systems where root password is known

sudo (superuser do):
• Runs a single command with elevated privileges
• Requires YOUR OWN password (not root's)
• Access controlled by /etc/sudoers (edited with visudo)
• Logs every sudo command (audit trail) → /var/log/auth.log or journalctl
• sudo -i → get an interactive root shell
• sudo -u john command → run as user john

Why sudo is preferred in enterprises:
• Root password doesn't need to be shared
• Granular control (user X can only run specific commands)
• Full audit trail of who ran what
• Ubuntu and most modern distros disable root login by default and use sudo

Check who has sudo: cat /etc/sudoers or getent group sudo`,
  },
  {
    id: 23, category: "Linux", difficulty: "Medium",
    q: "How does SSH work and how do you set up key-based authentication?",
    a: `SSH (Secure Shell) is an encrypted protocol for secure remote access to systems. Port 22, TCP.

How it works:
1. Client initiates connection → server sends its public host key
2. Client verifies server identity (first time: "Are you sure? yes/no")
3. They negotiate encryption algorithms and establish encrypted tunnel
4. Client authenticates (password or key-based)
5. Secure session established

Key-based authentication (preferred over passwords):
1. Generate key pair on CLIENT:
   ssh-keygen -t ed25519 -C "your@email.com"
   → Creates ~/.ssh/id_ed25519 (private) and ~/.ssh/id_ed25519.pub (public)

2. Copy public key to SERVER:
   ssh-copy-id user@server
   → Adds to server's ~/.ssh/authorized_keys

3. Connect:
   ssh user@server (no password needed)

Why key-based is better:
• No password to brute-force
• Private key never leaves your machine
• Can disable password auth entirely in /etc/ssh/sshd_config:
  PasswordAuthentication no
  PermitRootLogin no

Common options:
ssh -p 2222 user@host   # non-standard port
ssh -i ~/.ssh/mykey user@host   # specific key
ssh -L 8080:localhost:80 user@host   # port forwarding`,
  },
  {
    id: 24, category: "Linux", difficulty: "Easy",
    q: "What are package managers in Linux and how do you use them?",
    a: `Package managers handle installation, update, and removal of software and their dependencies.

APT (Debian/Ubuntu):
apt update                    # refresh package list
apt upgrade                   # upgrade installed packages
apt install nginx             # install package
apt remove nginx              # remove (keep config)
apt purge nginx               # remove + delete config
apt search nginx              # search packages
apt show nginx                # package details
dpkg -l                       # list all installed packages

YUM / DNF (RHEL/CentOS/Fedora):
yum update / dnf update       # update all
yum install httpd             # install
yum remove httpd              # remove
yum search httpd              # search
rpm -qa                       # list all installed (RPM packages)

Zypper (SUSE/openSUSE):
zypper install package        # install
zypper update                 # update all

Snap & Flatpak (distro-agnostic):
snap install vlc              # universal packages in sandboxed containers

Always run apt update before apt install to get the latest package lists.
In production, test updates in staging before applying to prod.`,
  },

  // ── CLOUD ────────────────────────────────────────────────────────────────────
  {
    id: 25, category: "Cloud", difficulty: "Easy",
    q: "What is the difference between IaaS, PaaS, and SaaS?",
    a: `These are the 3 main cloud service models, defined by how much the provider manages vs. you.

IaaS (Infrastructure as a Service):
• Provider gives you: virtualized hardware (VMs, storage, networking)
• You manage: OS, runtime, apps, data
• Examples: AWS EC2, Google Compute Engine, Azure VMs
• Use case: you want full control, like running your own servers but in the cloud

PaaS (Platform as a Service):
• Provider gives you: infrastructure + OS + runtime + middleware
• You manage: your application code and data only
• Examples: Google App Engine, Heroku, Azure App Service
• Use case: developers who just want to deploy code without managing servers

SaaS (Software as a Service):
• Provider manages everything
• You just use the application via browser
• Examples: Gmail, Salesforce, Office 365, Slack
• Use case: end users — no infrastructure management at all

Memory aid: Pizza-as-a-Service analogy.
• IaaS = you bake the pizza (kitchen provided)
• PaaS = pizza is half-made (just add toppings)
• SaaS = pizza delivered, you just eat it`,
  },
  {
    id: 26, category: "Cloud", difficulty: "Medium",
    q: "What is IAM (Identity and Access Management) in cloud?",
    a: `IAM is the cloud system that controls WHO can do WHAT on WHICH resources.

Core concepts (consistent across GCP, AWS, Azure):
• Principal (Who): user, service account, group
• Role/Permission (What): what actions are allowed (read, write, delete, admin)
• Resource (Which): the specific resource (bucket, VM, database)

Principle of Least Privilege: Grant only the minimum permissions needed. Never use admin/owner roles unless absolutely necessary.

GCP IAM:
• Roles: Primitive (Owner/Editor/Viewer), Predefined, Custom
• Service Accounts: identities for applications/VMs to access GCP APIs
• gcloud projects add-iam-policy-binding PROJECT --member=user:email --role=roles/viewer

AWS IAM:
• Users, Groups, Roles, Policies (JSON documents)
• Roles can be assumed by EC2 instances, Lambda functions
• Never use root account for day-to-day work

Azure:
• Role-Based Access Control (RBAC)
• Managed Identities for services

Key principle: Audit IAM regularly. Remove unused accounts. Use groups/roles instead of individual permissions.`,
  },
  {
    id: 27, category: "Cloud", difficulty: "Medium",
    q: "What is a VPC (Virtual Private Cloud)?",
    a: `A VPC is a private, isolated section of the cloud where you define your own virtual network — IP ranges, subnets, routing, and security rules.

Think of it as: your own private data center inside the cloud provider.

Key components:
• Subnets — divide the VPC into smaller segments (public vs private)
  - Public subnet: has route to Internet Gateway (internet-facing)
  - Private subnet: no direct internet access (databases, internal servers)
• Internet Gateway — allows public subnet resources to reach the internet
• NAT Gateway — allows private subnet resources to initiate outbound internet connections
• Route Tables — control where traffic is directed
• Security Groups — stateful firewall at the instance level (allow rules only)
• Network ACLs — stateless firewall at the subnet level (allow + deny rules)

GCP equivalent: VPC with firewall rules, Cloud NAT, Cloud Router
Azure equivalent: Virtual Network (VNet)

Best practice:
• Place databases and app servers in private subnets
• Only load balancers and bastion hosts in public subnets
• Use security groups to restrict access between tiers`,
  },
  {
    id: 28, category: "Cloud", difficulty: "Easy",
    q: "What is the difference between a virtual machine and a container?",
    a: `Virtual Machine (VM):
• Full OS virtualized on top of a hypervisor
• Includes its own OS kernel, libraries, and app
• Heavier — GBs of disk, minutes to start
• Stronger isolation — complete OS boundary
• Examples: AWS EC2, GCP Compute Engine, VMware VM
• Good for: running full OS, legacy apps, anything needing OS-level customization

Container:
• Shares the host OS kernel
• Packages only the app and its dependencies
• Lightweight — MBs, starts in seconds
• Less isolated than VMs (shares kernel)
• Examples: Docker, Kubernetes pods
• Good for: microservices, fast deployment, consistent environments

Analogy:
• VM = house with its own foundation, plumbing, electricity
• Container = apartment in a building (shares infrastructure)

In practice, both are used together:
• VMs provide the infrastructure
• Containers run on VMs (e.g., Kubernetes cluster running on EC2/GCE VMs)`,
  },

  // ── VMWARE / VIRTUALIZATION ──────────────────────────────────────────────────
  {
    id: 29, category: "VMware", difficulty: "Easy",
    q: "What is a hypervisor? What is the difference between Type 1 and Type 2?",
    a: `A hypervisor (Virtual Machine Monitor) is software that creates and manages virtual machines, allowing multiple OS instances to run on one physical host.

Type 1 — Bare-Metal Hypervisor:
• Runs directly on physical hardware (no host OS)
• More efficient and performant — direct hardware access
• Used in enterprise/production environments
• Examples: VMware ESXi, Microsoft Hyper-V, Citrix XenServer, KVM (kernel-level)

Type 2 — Hosted Hypervisor:
• Runs on top of an existing host OS (Windows, macOS, Linux)
• Less efficient — one extra layer
• Used for desktop/development/testing
• Examples: VMware Workstation, Oracle VirtualBox, Parallels Desktop (Mac)

Memory aid: Type 1 = talks directly to hardware (no middleman). Type 2 = goes through a host OS.

In enterprise IT, you'll almost always deal with Type 1 (ESXi). When a colleague says "spin up a VM" in enterprise, they mean on the VMware ESXi/vSphere infrastructure.`,
  },
  {
    id: 30, category: "VMware", difficulty: "Medium",
    q: "What is VMware vSphere, ESXi, and vCenter — and how do they relate?",
    a: `VMware vSphere is the enterprise virtualization platform (the full product suite).

ESXi (Elastic Sky X Integrated):
• The hypervisor — bare-metal Type 1 hypervisor installed directly on physical servers
• Runs virtual machines (VMs)
• Each physical server runs one ESXi instance
• Can be managed via web UI (Host Client) or vCenter
• Free version exists (limited features)

vCenter Server:
• Centralized management platform for multiple ESXi hosts
• Allows you to manage dozens or hundreds of ESXi hosts from one interface
• Provides advanced features: vMotion, HA, DRS, snapshots at scale
• Web interface: vSphere Client (HTML5)
• Without vCenter: you manage each ESXi host individually

Relationship: ESXi = the worker (runs VMs). vCenter = the manager (controls all workers).

Key vSphere concepts:
• Datacenter → Cluster → ESXi Hosts → VMs
• Datastore: where VM files (.vmdk) are stored (local disk, SAN, NFS)
• Port Group: virtual networking (like a VLAN for VMs)
• vSwitch (vDS): virtual switch connecting VMs to physical network`,
  },
  {
    id: 31, category: "VMware", difficulty: "Medium",
    q: "What is vMotion and when would you use it?",
    a: `vMotion is a VMware technology that migrates a running virtual machine from one ESXi host to another with zero downtime — while the VM stays fully operational.

How it works:
1. VM's memory is mirrored to the destination host
2. Once in sync, a brief (sub-second) switchover happens
3. VM continues running on the new host
4. The whole process is transparent to the end user

Use cases:
• Host maintenance: evacuate VMs before taking a server down for patching/hardware work
• Load balancing: move VMs to less-loaded hosts (DRS does this automatically)
• Avoid hardware failure: proactively move VMs off a failing host

Requirements:
• Shared storage (both hosts must see the same datastore) — unless using Storage vMotion
• Compatible CPUs between hosts (or EVC mode enabled)
• Network connectivity between hosts (dedicated vMotion VMkernel interface)

Storage vMotion: migrates a running VM's disk files from one datastore to another (no shared storage required).

DRS (Distributed Resource Scheduler): uses vMotion automatically to balance load across a cluster.`,
  },
  {
    id: 32, category: "VMware", difficulty: "Easy",
    q: "What is a VM snapshot and what are the risks of leaving them too long?",
    a: `A VM snapshot captures the exact state of a VM at a point in time — memory, disk, and settings.

Used for:
• Before patching/updates: take snapshot → apply patch → if it fails, revert instantly
• Before risky changes to an application or config
• Quick rollback option

How it works:
• Original disk becomes read-only
• All new writes go to a "delta" file (child disk)
• Reverting: discard the delta file → back to original state
• Deleting snapshot: merges delta into base disk (this takes time and I/O)

Risks of leaving snapshots too long:
• Delta files grow with every write → can fill the datastore
• Performance degrades as the snapshot chain gets longer
• If the datastore fills up → the VM may crash
• Large delta files take a long time to commit (and use heavy I/O)

Best practices:
• Keep snapshots for no more than 24-72 hours
• Monitor snapshot size in vCenter
• Never use snapshots as a backup strategy (they are not backups)
• Real backups: Veeam, Commvault, VMware Data Recovery`,
  },

  // ── MACOS / DESKTOP ──────────────────────────────────────────────────────────
  {
    id: 33, category: "macOS", difficulty: "Easy",
    q: "What should an IT person know about supporting macOS in an enterprise?",
    a: `macOS in enterprise is common in creative, tech, and startup environments.

Key management tools:
• MDM (Mobile Device Management): Jamf Pro (most common), Mosyle, Kandji, Apple Business Manager (ABM)
• ABM: Apple's portal for purchasing devices, deploying apps via VPP, and zero-touch enrollment

Common admin tasks:
• Enrollment: devices auto-enroll into MDM via ABM when first set up
• Pushing apps: via MDM (App Store apps via VPP, or custom .pkg files)
• Remote lock/wipe: via MDM (critical for lost devices)
• FileVault: built-in full-disk encryption — enable via MDM, escrow key centrally

macOS Terminal essentials:
• Most Linux commands work (ls, cd, grep, ssh, ping, etc.)
• Homebrew: package manager (brew install htop)
• networksetup -listallhardwareports — list network interfaces
• system_profiler SPHardwareDataType — hardware info
• sudo dscl . -passwd /Users/username — reset local password
• ditto, rsync — file copying tools

Key differences from Windows:
• No Group Policy (MDM policies instead)
• No Active Directory native join (use Jamf Connect or NoMAD for AD integration)
• Keychain instead of Windows Credential Manager
• .dmg, .pkg installers instead of .exe/.msi`,
  },

  // ── HELP DESK / TROUBLESHOOTING ──────────────────────────────────────────────
  {
    id: 34, category: "Help Desk", difficulty: "Easy",
    q: "A user says their computer is very slow. How do you troubleshoot it?",
    a: `Don't jump to conclusions — gather info first.

Step 1: Ask the user:
• When did this start? After an update, install, or change?
• Is it slow for everything or just specific apps?
• Any error messages?

Step 2: Check resources (Task Manager / Activity Monitor):
• CPU: high sustained usage? What process?
• RAM: high usage? Running out of memory?
• Disk: 100% disk usage is a common Windows 10/11 issue (SSD health, Windows Search, Superfetch/SysMain)
• Temp: check GPU-Z/HWMonitor for thermal throttling

Step 3: Common fixes:
• Too many startup programs → msconfig or Task Manager Startup tab
• Malware scan → Windows Defender, Malwarebytes
• Full disk → clean up, remove old files, Disk Cleanup, empty recycle bin
• Fragmented HDD → Defragment (don't defrag SSDs)
• Old or failing hardware → check SMART status (CrystalDiskInfo for disk health)
• Outdated drivers → especially GPU drivers
• RAM issue → run MemTest86

Step 4: If software-side is clean → consider hardware upgrade (RAM, SSD) or OS reinstall.

Always document in the ticket what you found and fixed.`,
  },
  {
    id: 35, category: "Help Desk", difficulty: "Easy",
    q: "What is ITIL and why does it matter in IT support?",
    a: `ITIL (Information Technology Infrastructure Library) is a framework of best practices for delivering IT services.

Core concepts relevant to help desk:
• Incident: unexpected interruption to a service (printer not working, app crash)
• Problem: the underlying root cause of one or more incidents
• Change: planned modification to IT infrastructure (requires approval process)
• Service Request: standard request from a user (password reset, new software)
• SLA (Service Level Agreement): defines response and resolution time targets

ITIL processes you'll use daily:
• Incident Management: log, categorize, prioritize, resolve incidents quickly
• Change Management: CAB (Change Advisory Board) approves risky changes
• Knowledge Management: document solutions in a knowledge base

Priority levels (typical):
• P1 — Critical: whole company affected, immediate response
• P2 — High: significant impact, response < 1 hour
• P3 — Medium: single user affected, response < 4 hours
• P4 — Low: minor issue, response < 1 business day

Why it matters in interviews: Saying you follow ITIL processes shows professionalism and that you understand structured IT operations — it differentiates you from self-taught candidates.`,
  },
  {
    id: 36, category: "Help Desk", difficulty: "Medium",
    q: "A user can't print. Walk me through your troubleshooting steps.",
    a: `Step 1: Reproduce and scope the issue.
• Is it just this user or everyone? → if everyone: printer or print server issue
• Is it all printers or just this one?
• Has it worked before on this machine?

Step 2: Check the basics.
• Is the printer on and showing "Ready"? (not jammed, not low toner)
• Is it connected? (Network printer: ping the printer IP. USB: device showing in Device Manager?)
• Is the user's PC connected to the network?

Step 3: Check the print queue.
• Settings → Printers → Select printer → Open print queue
• Are jobs stuck in the queue? Clear them.
• Restart the Print Spooler service:
  services.msc → Print Spooler → Restart
  Or: net stop spooler && del /Q /F /S "C:\Windows\System32\spool\PRINTERS\*" && net start spooler

Step 4: Check the driver.
• Device Manager → any warnings on the printer?
• Reinstall/update the driver

Step 5: Re-add the printer.
• Remove and re-add via Settings → Printers → Add a printer
• For network printers: connect via IP (\\PrinterIP) or print server (\\PrintServer\PrinterName)

Step 6: If still failing → check printer logs, try from a different PC to isolate user vs. printer.`,
  },

  // ── BEHAVIORAL ───────────────────────────────────────────────────────────────
  {
    id: 37, category: "Behavioral", difficulty: "Easy",
    q: "Tell me about yourself.",
    a: `Use the Present → Past → Future formula. Keep it to 2 minutes.

Structure:
1. Present: Who you are professionally right now
2. Past: Relevant background and what led you here
3. Future: Why you're interested in this specific role/company

Example framework:
"I'm an IT professional with a background in [X]. I have hands-on experience with [relevant skills like Windows, networking, cloud].

In my previous role/studies, I [specific achievement or experience relevant to the job].

I'm now looking to grow in [area], and I'm particularly interested in this role because [specific reason about the company or position]."

Tips:
• Tailor it to the job description — mention their tech stack
• Be specific, not generic ("I'm a hard worker" → bad)
• Practice so it sounds natural, not memorized
• Don't recite your resume — tell a story
• End by connecting your background to why you want THIS job

For IT support/sysadmin:
• Mention certifications (CompTIA A+, Network+, MCSA, GCP, etc.)
• Mention hands-on experience (even home labs, personal projects count)
• Show enthusiasm for technology`,
  },
  {
    id: 38, category: "Behavioral", difficulty: "Medium",
    q: "Describe a time you dealt with a difficult user or stakeholder. (STAR method)",
    a: `Use the STAR method: Situation → Task → Action → Result

STAR structure:
• Situation: Set the scene briefly
• Task: What was your responsibility?
• Action: What did YOU specifically do? (use "I", not "we")
• Result: What was the outcome? Quantify if possible.

Example (adapted for IT support):
"Situation: A senior manager was very frustrated — his laptop crashed right before a board presentation and he was calling the help desk angry and panicked.

Task: I was the on-call technician and needed to resolve it fast while managing his stress.

Action: I first acknowledged his frustration and told him I understood the urgency. I asked him to stay calm while I worked. I quickly assessed it was a display driver crash — I booted into safe mode, rolled back the driver, and while it rebooted, I helped him access his presentation from OneDrive on a colleague's machine as a backup.

Result: His laptop was back up in 10 minutes. He made his presentation on time and actually sent a thank-you email to my manager."

Tips:
• Show empathy first, then technical skill
• Choose a real story — authenticity shows
• End with what you learned or would do differently`,
  },
  {
    id: 39, category: "Behavioral", difficulty: "Easy",
    q: "How do you prioritize when multiple urgent tickets come in at the same time?",
    a: `Good answer structure: show you have a system, not chaos.

1. Assess business impact first:
   • How many users are affected? (1 person vs. whole company)
   • Is a revenue-generating system down?
   • Is there a hard deadline (presentation in 20 min)?
   • What is the SLA priority level (P1/P2/P3)?

2. Triage by impact + urgency:
   • P1 (critical, many users affected) → handle first
   • Time-sensitive single user (exec before meeting) → bump up
   • Low-impact, can wait → stay in queue

3. Communicate:
   • Acknowledge all tickets quickly (even if you can't fix immediately)
   • Update affected users: "I'm working on your issue, ETA 30 min"
   • If overwhelmed, escalate or ask a colleague for help — no shame

4. Use the ticketing system:
   • Log everything, update priorities, don't keep it in your head

Key phrase to use in the interview:
"I use a combination of business impact and SLA priority to triage. I always communicate with users proactively so they know they haven't been forgotten, and I escalate when needed rather than letting things pile up."`,
  },
  {
    id: 40, category: "Behavioral", difficulty: "Easy",
    q: "Where do you see yourself in 3-5 years?",
    a: `Be honest but strategic. Show ambition without implying you'll leave in a year.

Formula: Show you want to grow within this field → connect it to what this company offers.

Good answer framework:
"In the next few years, I want to deepen my expertise in [relevant area — cloud, security, network engineering]. I'm currently working toward [certification: GCP, AWS, CCNA, etc.] and I want to take on more responsibility over time.

I see this role as a great foundation because [company/role specific reason]. Long-term, I'd like to [grow into senior sysadmin / cloud engineer / team lead] — but I know that's built through hands-on experience and delivering results first."

Tips:
• Don't say: "I want to be a developer" (if applying for IT ops) — raises red flags
• Don't say: "I have no idea" — shows no drive
• Do mention certifications you're working toward — shows initiative
• It's okay to say "I want to grow within IT infrastructure" — specific enough

For entry-level roles:
• "I want to become a strong sysadmin and eventually move into cloud or security as I gain experience."
• This is realistic, honest, and shows direction.`,
  },
];

// ── CHEAT SHEETS ──────────────────────────────────────────────────────────────
export const CHEAT_SHEETS = [
  {
    id: "networking",
    title: "Networking",
    emoji: "🌐",
    sections: [
      {
        title: "OSI Model Layers",
        content: `7 - Application    HTTP, FTP, DNS, SMTP, SSH
6 - Presentation   SSL/TLS, encryption, JPEG/MP4
5 - Session        Session setup/teardown
4 - Transport      TCP (reliable), UDP (fast) — PORTS live here
3 - Network        IP addressing, routing — routers
2 - Data Link      MAC addresses, switches, Ethernet frames
1 - Physical       Cables, NICs, hubs, signals

Mnemonic (top→down): All People Seem To Need Data Processing`
      },
      {
        title: "Critical Port Numbers",
        content: `20/21  FTP (data/control)      TCP
22     SSH                      TCP
23     Telnet (insecure)        TCP
25     SMTP (email send)        TCP
53     DNS                      UDP/TCP
67/68  DHCP (server/client)     UDP
80     HTTP                     TCP
88     Kerberos (AD auth)       TCP/UDP
110    POP3                     TCP
143    IMAP                     TCP
389    LDAP (Active Directory)  TCP
443    HTTPS                    TCP
445    SMB (Windows shares)     TCP
636    LDAPS (LDAP secure)      TCP
3389   RDP (Remote Desktop)     TCP`
      },
      {
        title: "TCP vs UDP",
        content: `TCP                          UDP
────────────────────────     ────────────────────────
Connection-oriented          Connectionless
3-way handshake (SYN→       No handshake
 SYN-ACK→ACK)
Reliable, retransmits        Best-effort, no retry
Ordered delivery             Order not guaranteed
Slower (overhead)            Faster
HTTP/HTTPS, SSH, FTP,        DNS, DHCP, VoIP,
email, RDP                   video stream, gaming`
      },
      {
        title: "IP Subnetting Quick Reference",
        content: `CIDR   Subnet Mask       Hosts   Block
/30    255.255.255.252   2       4
/29    255.255.255.248   6       8
/28    255.255.255.240   14      16
/27    255.255.255.224   30      32
/26    255.255.255.192   62      64
/25    255.255.255.128   126     128
/24    255.255.255.0     254     256
/23    255.255.254.0     510     512
/22    255.255.252.0     1022    1024
/16    255.255.0.0       65534   65536

Private ranges (not routable on internet):
10.0.0.0/8         (Class A — large enterprise)
172.16.0.0/12      (Class B — medium)
192.168.0.0/16     (Class C — home/small office)`
      },
      {
        title: "DHCP Process (DORA)",
        content: `D - Discover   Client broadcasts "I need an IP" (UDP 68→67)
O - Offer      Server offers an IP + lease info
R - Request    Client says "I'll take that one"
A - Acknowledge Server confirms the lease

DHCP provides: IP, Subnet Mask, Default Gateway, DNS, Lease time

Troubleshooting:
• 169.254.x.x (APIPA) = DHCP server unreachable
• ipconfig /release && ipconfig /renew = renew lease
• ipconfig /flushdns = clear DNS cache`
      },
      {
        title: "DNS Record Types",
        content: `A       Domain → IPv4 address      (google.com → 142.x.x.x)
AAAA    Domain → IPv6 address
CNAME   Alias → another domain     (www → root domain)
MX      Mail server for domain
PTR     IP → Domain (reverse DNS)
NS      Nameserver for domain
TXT     Text records (SPF, DKIM verification)
SOA     Start of Authority (zone info)

Tools: nslookup google.com | dig google.com | host google.com`
      },
    ]
  },
  {
    id: "windows",
    title: "Windows / AD",
    emoji: "🪟",
    sections: [
      {
        title: "Active Directory Structure",
        content: `Forest (top level — trust boundary)
  └── Domain (e.g. company.local)
        └── Organizational Units (OUs) — like folders
              ├── Users
              ├── Computers
              ├── Groups
              └── Sub-OUs (by department/location)

Key components:
• Domain Controller (DC) — holds NTDS.DIT database
• Global Catalog — cross-domain search
• FSMO Roles — 5 special DC roles (PDC Emulator, RID Master, etc.)
• Kerberos (port 88) — primary authentication
• LDAP (port 389) — directory queries`
      },
      {
        title: "Essential CMD/PowerShell Commands",
        content: `NETWORKING:
ipconfig /all              Show IP, MAC, DNS, gateway
ipconfig /flushdns         Clear DNS cache
ping [host]                Test connectivity
tracert [host]             Trace route
nslookup [domain]          DNS query
netstat -an                Active connections + ports
arp -a                     ARP table (IP→MAC)
pathping [host]            Detailed route + packet loss

SYSTEM:
systeminfo                 OS info, uptime, hotfixes
tasklist                   Running processes
taskkill /PID 1234 /F      Force kill process
gpupdate /force            Apply Group Policy now
gpresult /r                Show applied GPOs
sfc /scannow               Repair corrupted system files
chkdsk C: /f               Check+fix disk errors (reboot needed)
net user [user]            User account info
net user [user] * /domain  Reset domain password (prompts)
net localgroup admins      List local administrators`
      },
      {
        title: "NTFS vs Share Permissions",
        content: `NTFS (local + network):      SHARE (network only):
Full Control                 Full Control
Modify                       Change
Read & Execute               Read
List Folder Contents
Read
Write

Rule: When BOTH apply → MORE RESTRICTIVE wins

Best practice:
• Share: Everyone → Full Control
• NTFS: set granular permissions here
• This way you manage access in one place

Set NTFS: Right-click folder → Properties → Security
Set Share: Right-click → Properties → Sharing → Advanced Sharing`
      },
      {
        title: "Group Policy (GPO) Quick Ref",
        content: `Processing order (LSDOU — last wins):
Local → Site → Domain → OU

Key commands:
gpupdate /force            Apply immediately
gpresult /r                Show effective policies
rsop.msc                   Resultant Set of Policy (GUI)
gpresult /H report.html    Generate HTML report

Common GPO uses:
• Password policy (length, complexity, expiry)
• Software deployment / restriction
• Map network drives at login
• Set screensaver + lock after X minutes
• Disable USB storage
• Windows Firewall settings
• Deploy printer connections`
      },
      {
        title: "Event Viewer — Key Event IDs",
        content: `Security Log:
4624   Successful logon
4625   Failed logon attempt
4634   Logoff
4648   Explicit credential logon (runas)
4720   User account created
4722   User account enabled
4725   User account disabled
4740   Account locked out ← CRITICAL for lockout troubleshooting
4767   Account unlocked
4776   Credential validation (NTLM)

System Log:
6005   Event Log service started (system boot)
6006   Event Log service stopped (clean shutdown)
6008   Unexpected shutdown
41     Kernel-Power (unexpected reboot/crash)
7045   New service installed ← watch for malware

Application Log:
1000   Application error/crash`
      },
    ]
  },
  {
    id: "linux",
    title: "Linux",
    emoji: "🐧",
    sections: [
      {
        title: "File System Hierarchy",
        content: `/           Root — top of everything
/bin        Essential binaries (ls, cp, mv, ping)
/sbin       System binaries (for root: fdisk, ifconfig)
/etc        Configuration files (hosts, passwd, ssh/sshd_config)
/home       User home directories (/home/garry)
/root       Root user's home
/var        Variable data — logs (/var/log), spool, tmp
/var/log    System logs (syslog, auth.log, messages)
/tmp        Temporary files (cleared on reboot)
/usr        User programs, libraries, documentation
/opt        Optional/third-party software
/dev        Device files (disks: /dev/sda, /dev/nvme0n1)
/proc       Virtual FS — running processes, kernel info
/sys        Virtual FS — hardware/kernel parameters
/mnt /media Mount points for filesystems`
      },
      {
        title: "File Permissions (chmod)",
        content: `Format: [type][owner][group][others]
Example: -rwxr-xr--

Types: - (file)  d (dir)  l (symlink)

Permission bits:  r=4  w=2  x=1
rwx = 7,  rw- = 6,  r-x = 5,  r-- = 4

Common permission sets:
755  rwxr-xr-x  Executables, public dirs
644  rw-r--r--  Regular files, config files
600  rw-------  Private keys, sensitive files
700  rwx------  Private directories
777  rwxrwxrwx  ⚠️ Avoid — everyone can write

Commands:
chmod 755 script.sh          Numeric
chmod +x script.sh           Add execute for all
chmod -R 755 /var/www        Recursive
chown user:group file        Change owner + group
chown -R john:john /home/john Recursive`
      },
      {
        title: "Process Management",
        content: `VIEWING:
ps aux                    All running processes
ps aux | grep nginx       Find specific process
top                       Live process monitor
htop                      Better interactive monitor (install separately)
pgrep nginx               Get PID by name

KILLING:
kill [PID]                Send SIGTERM (graceful)
kill -9 [PID]             Send SIGKILL (force, no cleanup)
killall nginx             Kill by name
pkill -f "python script"  Kill by pattern

BACKGROUND:
command &                 Run in background
jobs                      List background jobs
fg %1                     Bring job 1 to foreground
bg %1                     Resume job 1 in background
nohup command &           Run after logout (immune to hangup)
screen / tmux             Terminal multiplexers (persistent sessions)`
      },
      {
        title: "systemd Service Management",
        content: `systemctl status nginx         Is it running?
systemctl start nginx          Start
systemctl stop nginx           Stop
systemctl restart nginx        Restart (downtime)
systemctl reload nginx         Reload config (no downtime)
systemctl enable nginx         Auto-start on boot
systemctl disable nginx        Don't auto-start
systemctl is-active nginx      Quick status check
systemctl list-units --type=service   All services

LOGS:
journalctl -u nginx            All logs for nginx
journalctl -u nginx -f         Follow live (like tail -f)
journalctl -u nginx -n 50      Last 50 lines
journalctl --since "2h ago"    Logs from last 2 hours
journalctl -p err              Error-level and above
journalctl -b                  Since last boot`
      },
      {
        title: "Networking Commands",
        content: `ip addr show                   Show all interfaces + IPs
ip addr show eth0              Specific interface
ip route show                  Routing table
ip link set eth0 up/down       Enable/disable interface

ss -tulnp                      Open ports + listening services
  -t TCP  -u UDP  -l listening  -n numeric  -p process

ping -c 4 google.com           4 pings
traceroute google.com          Trace route
mtr google.com                 Live traceroute
curl -I https://google.com     HTTP headers only
wget URL                       Download file

DNS:
nslookup domain                Basic DNS query
dig domain                     Detailed DNS query
dig domain MX                  MX records
host domain                    Quick lookup
cat /etc/resolv.conf           DNS server config
cat /etc/hosts                 Local hostname overrides`
      },
      {
        title: "Package Managers",
        content: `DEBIAN / UBUNTU (APT):
apt update                     Refresh package lists
apt upgrade                    Upgrade installed packages
apt install nginx              Install
apt remove nginx               Remove (keep config)
apt purge nginx                Remove + delete config
apt search nginx               Search
apt show nginx                 Package info
dpkg -l                        List all installed
dpkg -l | grep nginx           Check if installed

RHEL / CENTOS / FEDORA (YUM/DNF):
dnf update                     Update all
dnf install httpd              Install
dnf remove httpd               Remove
dnf search httpd               Search
rpm -qa                        List all installed RPMs
rpm -qa | grep httpd           Check specific

BOTH: never run apt/yum as regular user, always use sudo`
      },
    ]
  },
  {
    id: "cloud",
    title: "Cloud (GCP/AWS)",
    emoji: "☁️",
    sections: [
      {
        title: "Service Models",
        content: `You manage ↑ more = more control, more work

         On-Prem  IaaS    PaaS    SaaS
Apps         ✅      ✅      ✅      ❌
Data         ✅      ✅      ✅      ❌
Runtime      ✅      ✅      ❌      ❌
Middleware   ✅      ✅      ❌      ❌
OS           ✅      ✅      ❌      ❌
Virtualiztn  ✅      ❌      ❌      ❌
Servers      ✅      ❌      ❌      ❌
Storage      ✅      ❌      ❌      ❌
Networking   ✅      ❌      ❌      ❌

✅ = YOU manage   ❌ = Provider manages

IaaS: GCP Compute Engine, AWS EC2, Azure VMs
PaaS: GCP App Engine, Heroku, Azure App Service
SaaS: Gmail, Office 365, Salesforce, Slack`
      },
      {
        title: "GCP Core Services",
        content: `COMPUTE:
Compute Engine (GCE)   VMs (IaaS)
GKE                    Kubernetes (containers)
Cloud Run              Serverless containers
App Engine             PaaS — just deploy code
Cloud Functions        Serverless event-driven

STORAGE:
Cloud Storage (GCS)    Object storage (like S3) — buckets
Persistent Disk        Block storage for VMs
Filestore              Managed NFS (file shares)

DATABASES:
Cloud SQL              Managed MySQL/PostgreSQL/SQL Server
Firestore              NoSQL document DB
Bigtable               Wide-column NoSQL (analytics)
Spanner                Global distributed relational DB

NETWORKING:
VPC                    Virtual Private Cloud
Cloud Load Balancing   HTTP(S), TCP, UDP load balancing
Cloud DNS              Managed DNS
Cloud NAT              Outbound NAT for private VMs
Cloud CDN              Content Delivery Network

SECURITY & IDENTITY:
Cloud IAM              Access control
Cloud KMS              Key Management
Secret Manager         Store API keys/passwords securely`
      },
      {
        title: "IAM — Identity & Access Management",
        content: `Core concept: WHO can do WHAT on WHICH resource

Principals (who):
• Google Account (user@gmail.com)
• Service Account (app-sa@project.iam.gserviceaccount.com)
• Google Group
• Cloud Identity domain

Roles (what):
• Primitive: Owner > Editor > Viewer (too broad — avoid)
• Predefined: roles/compute.viewer, roles/storage.objectAdmin
• Custom: define exactly what's allowed

Binding: Principal + Role + Resource = Policy

GCloud commands:
gcloud projects add-iam-policy-binding PROJECT \
  --member="user:email@example.com" \
  --role="roles/viewer"

gcloud projects get-iam-policy PROJECT   # view current policies

Principle of Least Privilege:
Grant only the minimum permissions needed.
Use service accounts for applications, not user accounts.
Rotate service account keys regularly.`
      },
      {
        title: "AWS Core Services (comparison)",
        content: `GCP → AWS equivalents:
GCE (Compute Engine) → EC2
GCS (Cloud Storage)  → S3
GKE                  → EKS
Cloud SQL            → RDS
Cloud Functions      → Lambda
Cloud Run            → Fargate / ECS
VPC                  → VPC (same concept)
Cloud IAM            → IAM (same concept)
Cloud DNS            → Route 53
Cloud Load Balancing → ELB (ALB/NLB/CLB)
Cloud CDN            → CloudFront
Secret Manager       → Secrets Manager
Cloud KMS            → AWS KMS

AWS pricing model: pay-as-you-go (same as GCP)
AWS regions > Availability Zones (AZs) — multiple datacenters per region
Design for multi-AZ = high availability`
      },
    ]
  },
  {
    id: "vmware",
    title: "VMware",
    emoji: "🖥️",
    sections: [
      {
        title: "VMware vSphere Stack",
        content: `vSphere = the full product suite (not a single product)

ESXi (hypervisor):
• Bare-metal Type 1 hypervisor — installs on physical server
• Runs VMs — each VM gets virtual CPU, RAM, disk, NIC
• Web UI: vSphere Host Client (browser)
• Free version available (limited features)

vCenter Server:
• Centralized management for multiple ESXi hosts
• Unlocks enterprise features (HA, DRS, vMotion)
• Web UI: vSphere Client (HTML5)
• Database backend: embedded PostgreSQL or external

vSphere Hierarchy:
vCenter
 └── Datacenter
      └── Cluster
           └── ESXi Host(s)
                └── VMs
                     └── VM files on Datastore`
      },
      {
        title: "Hypervisor Types",
        content: `TYPE 1 — Bare Metal (Enterprise):
• Runs directly on hardware
• No host OS layer
• More efficient, better performance
• Examples: VMware ESXi, Microsoft Hyper-V,
  Citrix XenServer, KVM (Linux kernel)

TYPE 2 — Hosted (Desktop/Dev):
• Runs on top of an existing OS
• Extra abstraction layer = less efficient
• Easier to install, good for dev/testing
• Examples: VMware Workstation, VMware Fusion (Mac),
  Oracle VirtualBox, Parallels Desktop

In enterprise IT: almost always Type 1 (ESXi)
On developer laptops: Type 2 (VirtualBox, Workstation)`
      },
      {
        title: "vMotion & Migration Types",
        content: `vMotion (live migration):
• Moves a RUNNING VM between ESXi hosts
• Zero downtime — user doesn't notice
• Requires: shared storage + compatible CPUs + vMotion network
• Use case: host maintenance, load balancing

Storage vMotion:
• Moves a running VM's disk between datastores
• No shared storage needed
• Use case: moving from old SAN to new storage

Cold Migration:
• VM is powered off → move to different host/datastore
• Can move to different cluster/datacenter
• Simpler, no vMotion license required

DRS (Distributed Resource Scheduler):
• Uses vMotion automatically to balance CPU/RAM across cluster
• Policies: Manual / Partially Automated / Fully Automated

HA (High Availability):
• Monitors ESXi hosts
• If a host fails → VMs restart on surviving hosts automatically
• Recovery time: ~2-5 minutes (not instant)`
      },
      {
        title: "VM Snapshots",
        content: `What a snapshot captures:
• VM disk state (all data at that moment)
• VM memory state (optional — if "Snapshot the VM's memory")
• VM settings/config

How snapshots work:
1. Original VMDK becomes read-only
2. New delta file created — all writes go here
3. Revert: discard delta → back to original state instantly
4. Delete/commit: merge delta into base (slow, I/O intensive)

Snapshot chain risks:
• Each level adds performance overhead
• Delta files grow continuously
• Filled datastore = VM crash (writes fail)
• Large delta files take hours to commit

Best practices:
• Use only for: pre-patch, pre-risky-change
• Delete within 24-72 hours
• Max 2-3 levels in chain
• Monitor snapshot size in vCenter
• ⚠️ NOT a backup — use Veeam/Commvault for real backups

Taking a snapshot via PowerCLI:
Get-VM "VMName" | New-Snapshot -Name "Pre-Patch-$(Get-Date -Format yyyyMMdd)"`
      },
    ]
  },
  {
    id: "macos",
    title: "macOS",
    emoji: "🍎",
    sections: [
      {
        title: "macOS Enterprise Management",
        content: `MDM (Mobile Device Management):
• Jamf Pro — most common enterprise macOS MDM
• Mosyle, Kandji, Microsoft Intune (also supports macOS)
• Apple Business Manager (ABM) — Apple's portal for:
  - Zero-touch enrollment (device ships → enrolls automatically)
  - Volume Purchase Program (VPP) for app licensing
  - Managed Apple IDs

What MDM can do:
• Push configuration profiles (Wi-Fi, VPN, email, certs)
• Deploy apps silently
• Enforce FileVault encryption + escrow recovery key
• Remote lock and wipe
• Set passcode policies
• Restrict features (disable AirDrop, app install, etc.)
• Run scripts remotely`
      },
      {
        title: "macOS Terminal Essentials",
        content: `Most Linux commands work! Key differences:

SYSTEM INFO:
system_profiler SPHardwareDataType    Hardware info
sw_vers                               macOS version
sysctl -n hw.memsize | awk '{print $1/1024/1024/1024" GB"}'  RAM

NETWORKING:
networksetup -listallhardwareports    List all interfaces
networksetup -getinfo "Wi-Fi"         Get Wi-Fi IP info
ifconfig en0                          Interface details
scutil --dns                          DNS config
scutil --proxy                        Proxy settings
networksetup -setdnsservers Wi-Fi 8.8.8.8    Set DNS

USERS:
dscl . -list /Users                   List all users
sudo dscl . -passwd /Users/john       Reset local password
id john                               User UID/GID/groups

DISK:
diskutil list                         List all disks
diskutil info disk0                   Disk details
df -h                                 Disk usage

PACKAGE MANAGER:
brew install htop                     Install via Homebrew
brew update && brew upgrade           Update all`
      },
      {
        title: "macOS vs Windows — Key Differences",
        content: `Feature          macOS                    Windows
─────────────────────────────────────────────────
Policy mgmt      MDM profiles             Group Policy (GPO)
AD integration   Jamf Connect / NoMAD     Native
Encryption       FileVault (full disk)    BitLocker
Package mgr      Homebrew / MAS           Chocolatey / winget
Credential store Keychain                 Credential Manager
Remote access    SSH, ARD (Apple RD)      RDP (port 3389)
Installer types  .dmg, .pkg, .app         .exe, .msi
File system      APFS (modern), HFS+      NTFS, exFAT, FAT32
Shell            zsh (default), bash      PowerShell, cmd
Task manager     Activity Monitor         Task Manager
Firewall config  System Settings          Windows Defender
Log viewer       Console.app, log show    Event Viewer
System repair    Recovery mode (Cmd+R)    Windows RE, sfc /scannow`
      },
    ]
  },
];
