# Putting the IGMS site live on the IONOS VPS

A step-by-step guide, written to be followed from a Windows PC. Work through
it in order — each step relies on the one before. Budget an afternoon the
first time.

| What | Value |
|---|---|
| Server | IONOS "My VPS" — Ubuntu 24.04, 2 vCPU, 4 GB RAM, UK |
| Server IP address | `217.154.57.237` |
| Domain | `igms-cic.org` |
| Where the website files go | `/var/www/igms` |
| Where the backend lives | `/srv/igms-api` |

> **How to read the boxes.** Grey boxes are commands. Type (or paste) them
> into the window named above the box, one at a time, and press Enter.
> Anything in `<angle brackets>` is a placeholder — replace it, brackets and
> all, with your own value.

---

## Before you start: what an SSH key is

To control the server you "log in" to it from your PC over a secure channel
called **SSH**. You can prove who you are in two ways:

1. **A password** — easy, but anyone on the internet can keep guessing it.
   Servers are hit by thousands of guesses a day.
2. **An SSH key** — far safer. This is what we will use.

An SSH key is **a pair of files** made on your PC:

| File | Name on your PC | Who may see it |
|---|---|---|
| **Private key** | `igms_vps` | **Nobody.** It never leaves your PC. Treat it like the key to your house. |
| **Public key** | `igms_vps.pub` | **Anyone.** It is safe to copy, paste and share. |

Think of the public key as a **padlock** and the private key as **the only
key that opens it**. You fit the padlock (public key) onto the server. From
then on, only the computer holding the matching private key can get in — and
no password ever crosses the internet, so there is nothing to guess.

If you lose the private key you can simply make a new pair; if someone else
gets it, they can get into the server, so never email it, put it in a chat,
or upload it anywhere.

---

## Step 2 — First login, and a safer day-to-day account

### 2.1 Make your SSH key (on your PC)

Open **PowerShell** (Start menu → type *PowerShell* → open it) and run:

```powershell
ssh-keygen -t ed25519 -C "igms-vps" -f "$HOME\.ssh\igms_vps"
```

- When it asks for a **passphrase**, type one you will remember (it protects
  the key if your laptop is ever stolen). Nothing appears as you type — that
  is normal. Press Enter, then type it again.
- This creates two files in `C:\Users\<you>\.ssh\`: `igms_vps` (private) and
  `igms_vps.pub` (public).

Show the **public** key so you can copy it later:

```powershell
Get-Content "$HOME\.ssh\igms_vps.pub"
```

It is one long line starting `ssh-ed25519 AAAA…` and ending `igms-vps`.
Leave this window open.

### 2.2 Get the server's first password

1. Log in to **my.ionos.co.uk** → **Servers & Cloud** → click **My VPS**.
2. Under **Login Data**, click **View password** and copy it.

This password is only for the very first login; we switch it off in Step 3.

### 2.3 Log in for the first time

In PowerShell:

```powershell
ssh root@217.154.57.237
```

- It will say *"The authenticity of host … can't be established"* and show a
  fingerprint. That is expected the first time — type `yes` and Enter.
- Paste the password (right-click pastes in PowerShell; nothing is shown) and
  press Enter.

You are now **on the server**. The prompt changes to something like
`root@…:~#`. Everything you type now runs on the server, not your PC.

### 2.4 Update the server

```bash
apt update && apt -y full-upgrade
reboot
```

The reboot disconnects you. Wait one minute, then log back in with
`ssh root@217.154.57.237` and the same password.

### 2.5 Change the root password

The Cloud Panel shows this password to anyone with access to the IONOS
account, so replace it:

```bash
passwd
```

Type a new long password twice. Store it in a password manager.

### 2.6 Create the `deploy` user

Working as `root` all the time is risky — one mistyped command can wreck the
server. We create an everyday user called `deploy` that can still do admin
work when it asks (`sudo`).

```bash
adduser --gecos "" deploy
```

Choose a password for `deploy` when asked (you need it whenever you use
`sudo`). Then give it admin rights:

```bash
usermod -aG sudo deploy
```

### 2.7 Put your public key (the padlock) on the server

```bash
mkdir -p /home/deploy/.ssh
nano /home/deploy/.ssh/authorized_keys
```

`nano` is a simple text editor. Go back to your **PowerShell window from
2.1**, copy the `ssh-ed25519 …` line, and paste it into nano with a
right-click. Then save and close: press **Ctrl+O**, **Enter**, then **Ctrl+X**.

Set the permissions SSH insists on:

```bash
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

### 2.8 Test the key — in a NEW window

**Do not close the root window.** Open a **second** PowerShell window and run:

```powershell
ssh -i "$HOME\.ssh\igms_vps" deploy@217.154.57.237
```

It should ask only for your **key passphrase** (from 2.1), not a server
password, and log you in as `deploy`. Check admin rights work:

```bash
sudo whoami
```

Enter the `deploy` password; it should print `root`.

✅ **Only continue once this works.** If it fails, the root window is still
open so you can fix `authorized_keys`.

**Shortcut (optional).** So you can type just `ssh igms`, create the file
`C:\Users\<you>\.ssh\config` (no extension) containing:

```
Host igms
    HostName 217.154.57.237
    User deploy
    IdentityFile ~/.ssh/igms_vps
```

---

## Step 3 — Lock the server down

Do this from the **`deploy`** window.

### 3.1 Turn off passwords and root logins

```bash
sudo nano /etc/ssh/sshd_config
```

Find these lines (use **Ctrl+W** to search), remove any `#` at the start, and
set them to:

```
PermitRootLogin no
PasswordAuthentication no
```

Ubuntu also keeps settings in a second folder that can override this file —
check it:

```bash
sudo grep -r PasswordAuthentication /etc/ssh/sshd_config.d/
```

If any file there says `PasswordAuthentication yes`, open it with
`sudo nano <that file>` and change it to `no`. Then apply:

```bash
sudo systemctl restart ssh
```

Test from a **third** PowerShell window that `ssh igms` still works. From now
on, only your key gets in.

### 3.2 Turn on the server's own firewall

A firewall decides which "doors" (ports) are open. We open only three:
22 (SSH), 80 (web), 443 (secure web).

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

Type `y` when asked. Check with `sudo ufw status`.

### 3.3 Automatic security updates, and blocking password guessers

```bash
sudo apt -y install unattended-upgrades fail2ban
sudo dpkg-reconfigure -plow unattended-upgrades
```

Choose **Yes** when asked. The server now installs security fixes on its own,
and `fail2ban` temporarily bans addresses that keep failing to log in.

### 3.4 Match the IONOS firewall

IONOS has a second firewall in front of the server.

1. Cloud Panel → **Network** → **Firewall Policies** → **Firewall Policy for
   My VPS**.
2. Keep rules allowing **TCP 22, 80 and 443** only.
3. Delete anything else (commonly 8443 and 8447 for Plesk, which we don't use).

---

## Step 4 — Install the software

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt -y install nodejs nginx mysql-server certbot python3-certbot-nginx git
sudo npm install -g pm2
```

What each one is:

| Software | Job |
|---|---|
| **Node.js 22** | Runs the backend (the waitlist and EasyAsk API) |
| **nginx** | The web server: hands out the website and passes `/api/` requests to the backend |
| **MySQL** | The database the waitlist is stored in |
| **certbot** | Gets and renews the free HTTPS certificate |
| **pm2** | Keeps the backend running, and restarts it after a crash or reboot |

Secure MySQL:

```bash
sudo mysql_secure_installation
```

Answer **Yes** to everything (remove anonymous users, disallow remote root,
remove test database, reload). If it offers the "validate password"
component, choose it and level **2 (STRONG)**.

Check versions: `node -v` (should start `v22`), `nginx -v`, `mysql --version`.

---

## Step 5 — Create the database

Open MySQL:

```bash
sudo mysql
```

The prompt becomes `mysql>`. Paste these four lines, replacing the password
with a long random one (letters and numbers — avoid quotes):

```sql
CREATE DATABASE igms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'igms'@'localhost' IDENTIFIED BY '<long-random-password>';
GRANT ALL PRIVILEGES ON igms.* TO 'igms'@'localhost';
EXIT;
```

Save that password in your password manager — the backend needs it in Step 6.
The `'localhost'` part means this database user can only connect from the
server itself, never from the internet.

---

## Step 6 — Install and start the backend

### 6.1 Get the code

```bash
sudo mkdir -p /srv/igms-api
sudo chown deploy:deploy /srv/igms-api
git clone <your launchpad_backend repository URL> /srv/igms-api
cd /srv/igms-api
```

If the repository is private, GitHub will ask you to sign in. The easiest
route is a **deploy key**: run `ssh-keygen -t ed25519 -f ~/.ssh/github_backend`
on the server, add the contents of `~/.ssh/github_backend.pub` in GitHub →
backend repository → **Settings → Deploy keys** (read-only), and clone with
the `git@github.com:…` address instead.

### 6.2 Create the settings file

```bash
nano .env
```

Paste this, then fill every `<…>`:

```
NODE_ENV=production
PORT=4000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=igms
DB_USER=igms
DB_PASSWORD=<the password from Step 5>

FRONTEND_URL=https://igms-cic.org
CORS_EXTRA_ORIGINS=https://www.igms-cic.org
IGMS_SITE_URL=https://igms-cic.org
SWAGGER_ENABLED=false

JWT_ACCESS_SECRET=<random>
JWT_REFRESH_SECRET=<random>
JWT_STEP_SECRET=<random>
OTP_PEPPER=<random>

BREVO_API_KEY=<from your Brevo account>
IGMS_ADMIN_EMAIL=<inbox that receives new sign-ups>
```

Copy any other values (email sender names, AI keys, `SEED_ADMIN_*`) from your
existing backend settings. For each `<random>`, run this and paste the output
— use a **different** value for each line:

```bash
openssl rand -hex 48
```

Save and close (**Ctrl+O**, **Enter**, **Ctrl+X**), then make the file
readable only by you — it holds every secret the backend has:

```bash
chmod 600 .env
```

### 6.3 Build, create the tables, start

```bash
npm ci --include=dev
npm run build
npm run db:migrate
pm2 start dist/server.js --name igms-api
pm2 save
pm2 startup
```

`pm2 startup` prints one more command starting `sudo env PATH=…` — copy and
run it. That makes the backend start again by itself after a reboot.

Check it is running:

```bash
pm2 status
curl http://127.0.0.1:4000/health
```

`pm2 status` should say **online**, and the `curl` should reply with
`"success":true`. If not, `pm2 logs igms-api` shows why (most often a typo in
`.env`).

---

## Step 7 — Point the domain at the server

In **my.ionos.co.uk** → **Domains & SSL** → click **igms-cic.org** → **DNS**:

| Type | Host name | Points to |
|---|---|---|
| A | `@` | `217.154.57.237` |
| A | `www` | `217.154.57.237` |

Delete any other **A** or **AAAA** records for `@` or `www` that IONOS
created. Leave MX (email) records alone.

It usually takes effect within minutes (up to a few hours). Check from
PowerShell on your PC:

```powershell
nslookup igms-cic.org
```

Continue when it shows `217.154.57.237`.

---

## Step 8 — Set up the web server and HTTPS

### 8.1 nginx configuration

```bash
sudo mkdir -p /var/www/igms /var/www/igms-releases
sudo chown deploy:deploy /var/www/igms /var/www/igms-releases
sudo nano /etc/nginx/sites-available/igms
```

Paste:

```nginx
server {
  listen 80;
  server_name igms-cic.org www.igms-cic.org;
  root /var/www/igms;
  index index.html;
  client_max_body_size 1m;
  server_tokens off;

  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(self), geolocation=()" always;

  # Hidden files (.htaccess, .env …) and source maps are never served.
  location ~ /\.(?!well-known) { deny all; }
  location ~ \.map$ { deny all; }

  # The backend.
  location /api/ {
    proxy_pass http://127.0.0.1:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Built files have unique names, so browsers may keep them for a year.
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header X-Content-Type-Options "nosniff" always;
  }

  # Everything else is the React app; unknown paths get index.html so links
  # like /privacy-policy work on refresh.
  location / {
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "no-cache";
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  }
}
```

Save and close. Switch it on and remove the default page:

```bash
sudo ln -s /etc/nginx/sites-available/igms /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

`nginx -t` must say **syntax is ok** and **test is successful**.

### 8.2 HTTPS certificate

Only once Step 7 shows the right IP:

```bash
sudo certbot --nginx -d igms-cic.org -d www.igms-cic.org --redirect -m <your email> --agree-tos
```

This gets a free certificate, switches the site to `https://`, redirects
`http://` to it, and renews itself automatically every few months. Check the
renewal works:

```bash
sudo certbot renew --dry-run
```

---

## Step 9 — Publish the website automatically from GitHub

The repository already contains `.github/workflows/deploy-production.yml`.
Every push to `main` builds the site, uploads it to the server, checks it is
live, and rolls back if anything fails.

### 9.1 A separate key for GitHub

GitHub needs its own key — **never** give it your personal one. On your PC:

```powershell
ssh-keygen -t ed25519 -C "github-deploy" -f "$HOME\.ssh\igms_github_deploy" -N '""'
```

(No passphrase: GitHub can't type one.) Add its **public** half to the server,
as the `deploy` user:

```bash
nano ~/.ssh/authorized_keys
```

Paste the contents of `igms_github_deploy.pub` on a **new line** under your
own key, then save.

Get the server's fingerprint line for GitHub (on your PC):

```powershell
ssh-keyscan 217.154.57.237
```

### 9.2 GitHub secrets

In GitHub → frontend repository → **Settings → Secrets and variables →
Actions → New repository secret**, add:

| Name | Value |
|---|---|
| `SSH_HOST` | `217.154.57.237` |
| `SSH_USER` | `deploy` |
| `SSH_KEY` | the **whole** contents of `igms_github_deploy` (the private file, including the `-----BEGIN` / `-----END` lines) |
| `KNOWN_HOSTS` | the `ssh-ed25519` line from `ssh-keyscan` |
| `SITE_URL` | `https://igms-cic.org` |
| `DEPLOY_PATH` | `/var/www/igms` |
| `RELEASES_PATH` | `/var/www/igms-releases` |
| `VITE_API_URL` | `https://igms-cic.org/api` |
| `VITE_USERCENTRICS_SETTINGS_ID` | your Usercentrics settings ID |
| `VITE_DONATE_URL` | the Stripe donate link (optional) |
| `VITE_CONTACT_EMAIL` | `hello@igms-cic.org` (optional) |

This private key is safe in GitHub secrets — they are encrypted and never
shown again, even to you.

### 9.3 Publish

Push to `main`, or go to **Actions → Deploy production → Run workflow**.
Watch it run; a green tick means the site is live.

Also in Usercentrics, add `igms-cic.org` to the allowed domains, or the
cookie banner will not appear.

---

## Step 10 — Backups

The waitlist is personal data, and nothing backs it up unless you set it up.
As `deploy`:

```bash
mkdir -p ~/backups
nano ~/.my.cnf
```

Paste (so the backup can log in without a password on the command line):

```
[mysqldump]
user=igms
password=<the password from Step 5>
```

Then `chmod 600 ~/.my.cnf`, and schedule a nightly backup:

```bash
crontab -e
```

Choose `nano` if asked, and add this line at the bottom:

```
30 2 * * * mysqldump --single-transaction --no-tablespaces igms | gzip > ~/backups/igms-$(date +\%F).sql.gz && find ~/backups -name '*.sql.gz' -mtime +14 -delete
```

This keeps 14 days of backups **on the server**. A backup on the same machine
does not survive the machine dying, so also copy them off regularly — for
example to IONOS Object Storage, or download them weekly.

---

## Step 11 — Check everything before announcing it

- [ ] `https://igms-cic.org` loads with a padlock; `http://` and `www.`
      redirect to it.
- [ ] `https://igms-cic.org/privacy-policy` loads directly and after a
      refresh; `/nonsense` shows the Not Found page.
- [ ] On the server, `curl http://127.0.0.1:4000/health` replies
      `"success":true` (the health check is internal only — it is not under
      `/api/`, so it is not reachable from outside, which is fine).
- [ ] Join the waitlist once with **your own** email: the confirmation and the
      admin email both arrive. Then delete that test entry.
- [ ] The cookie banner appears; the Thrive Forward video plays with captions;
      the PDFs download.
- [ ] `pm2 status` shows `igms-api` **online**.
- [ ] The next morning, `ls ~/backups` shows a backup file.

---

## Everyday tasks

| Task | Command (on the server, as `deploy`) |
|---|---|
| Log in | `ssh igms` (from PowerShell) |
| See if the backend is up | `pm2 status` |
| Read backend errors | `pm2 logs igms-api` |
| Update the backend | `cd /srv/igms-api && git pull && npm ci --include=dev && npm run build && npm run db:migrate && pm2 restart igms-api` |
| Update the website | push to `main` on GitHub |
| Undo the last website release | `bash /var/www/igms-releases/.bin/activate.sh /var/www/igms /var/www/igms-releases "$(cat /var/www/igms-releases/.previous)"` |
| Restart everything | `sudo reboot` |

## If something goes wrong

| Symptom | Likely cause |
|---|---|
| `Permission denied (publickey)` | Wrong key, or a typo in `authorized_keys`. Log in through the Cloud Panel's **Remote Console** to fix it. |
| Site shows "502 Bad Gateway" | Backend is down — `pm2 logs igms-api`. |
| certbot fails | The domain doesn't point at the server yet (Step 7), or port 80 is closed in a firewall. |
| Waitlist says "Something went wrong" | `pm2 logs igms-api`; usually a database password or Brevo key in `.env`. |
| Cookie banner missing | Domain not added in Usercentrics. |
