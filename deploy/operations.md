# Running the IGMS site — commands and instructions

The day-to-day companion to [vps-setup.md](vps-setup.md). That guide builds
the server once; this one covers everything after: releasing changes,
checking the server, editing settings, backups and fixing problems.

| What | Where |
|---|---|
| Live site | https://igms-cic.org |
| Staging site | Vercel (the `staging` branch) |
| Server | `217.154.57.237`, user `deploy` |
| Backend code on the server | `/srv/igms-api` |
| Website files on the server | `/var/www/igms` (releases in `/var/www/igms-releases`) |
| Backend settings | `/srv/igms-api/.env` — on the server only, never in GitHub |
| Database backups | `~/backups` on the server |

> Grey boxes are commands. The heading above each says **where** to run it:
> **PC** = PowerShell on your computer, **Server** = after `ssh igms`.
> `<angle brackets>` are placeholders — replace them, brackets and all.

---

## 1. Logging in to the server

**PC**
```powershell
ssh igms
```

This works because of the shortcut in `C:\Users\<you>\.ssh\config` (set up in
Step 2.8 of the setup guide). Without it:

```powershell
ssh -i "$HOME\.ssh\igms_vps" deploy@217.154.57.237
```

It asks for your **key passphrase**, not a server password. Type `exit` to
leave the server.

---

## 2. How changes go live

Both projects deploy themselves from GitHub. You never copy files to the
server by hand.

| You push to… | In repository… | It goes to… |
|---|---|---|
| `staging` | frontend | Vercel staging, for review |
| `main` | frontend | **igms-cic.org** (live) |
| `main` | backend (`LaunchPad-Backend`) | the API on the server (live) |

### 2.1 Release a website change

**PC** — in the frontend folder:
```powershell
git checkout staging
git add -A
git commit -m "<what you changed>"
git push
```

Check it on the Vercel staging link. When it is approved:

```powershell
git checkout main
git merge staging
git push
```

GitHub → frontend repository → **Actions** → **Deploy production** shows the
progress. A green tick means it is live. If the live check fails, it puts the
previous version back by itself and the run shows red.

### 2.2 Release a backend change

**PC** — in the `launchpad_backend` folder:
```powershell
git add -A
git commit -m "<what you changed>"
git push
```

GitHub → backend repository → **Actions** → **Deploy backend**. It:

1. typechecks and runs a security audit (stops here if either fails);
2. on the server: pulls the code, **backs up the database**, installs,
   builds, runs migrations, restarts, and checks health;
3. if the build or health check fails, **puts the previous version back**.

Then confirm on the **Server**:
```bash
igms status
```

### 2.3 Run a deploy again without changing code

GitHub → **Actions** → pick the workflow → **Run workflow** → **Run workflow**.

---

## 3. The `igms` command (everyday tasks)

Run on the **Server**. Type `igms` alone to see this list.

| Command | What it does | How often |
|---|---|---|
| `igms status` | Backend health, version, website, database, last backup, disk and memory | **Daily** |
| `igms logs` | Live backend log (Ctrl+C to stop) | When investigating |
| `igms errors` | Last 100 backend error lines | When something is wrong |
| `igms restart` | Restart the backend and confirm it came back | When needed |
| `igms update` | Deploy the latest backend by hand (normally automatic) | Rarely |
| `igms env` | Safely edit the backend settings | When settings change |
| `igms env-restore` | Put back the previous settings | If an edit was wrong |
| `igms backup` | Back up the database right now | Before risky work |
| `igms backups` | List database backups | Weekly |
| `igms ssl` | When the HTTPS certificate renews | Monthly |
| `igms security` | Pending updates, firewall, blocked login attempts | **Weekly** |

### First-time install of `igms`

Once, after the backend workflow has deployed at least once.

**Server**
```bash
sudo ln -sf /srv/igms-api/deploy/igms /usr/local/bin/igms
igms
```

It is a link to the file in the backend code, so it updates itself with every
backend release.

---

## 4. Editing the backend settings (`.env`)

**Server**
```bash
igms env
```

1. A copy of the current settings is saved first.
2. The file opens in **nano**. Use the arrow keys to move, edit the value.
3. Save and close: **Ctrl+O**, **Enter**, **Ctrl+X**.
4. The backend restarts with the new settings and is health-checked.
   - **Works** → the new settings are live.
   - **Fails to start** → the old settings are put back automatically and
     the error is shown.

If a change was accepted but turns out wrong later (for example emails stop
because of a bad key):

```bash
igms env-restore
```

The last 5 versions are kept.

### Rules for `.env`

- One setting per line: `NAME=value` — no spaces around `=`, no quotes
  needed, no `<angle brackets>` left in.
- Never paste `.env` into chat, email, GitHub or a ticket. It holds every
  secret the backend has.
- After replacing a key (Brevo, OpenAI, …), delete the old key in that
  provider's dashboard.
- Need a new random secret? `openssl rand -hex 48` — a different value for
  each setting.

### Settings you are most likely to change

| Setting | What it controls |
|---|---|
| `IGMS_ADMIN_EMAIL` | Inbox that receives each new waitlist sign-up and the CSV |
| `BREVO_API_KEY` | Sending emails |
| `OPENAI_API_KEY` / `GEMINI_API_KEY` | EasyAsk notes |
| `FRONTEND_URL`, `CORS_EXTRA_ORIGINS` | Which website addresses may call the API |

### Website settings are different

Values starting `VITE_` (API address, Usercentrics ID, donate link,
Termageddon IDs) belong to the **website**, not the server. They are baked in
when the site is built:

- **Live site:** GitHub → frontend repository → **Settings → Secrets and
  variables → Actions** → edit the secret → re-run **Deploy production**
  (section 2.3).
- **Staging:** Vercel → project → **Settings → Environment Variables** →
  edit → redeploy.

`VITE_` values are visible to anyone who views the site, so never put a
secret in one.

---

## 5. Backups

### What runs automatically

| Backup | When | Kept |
|---|---|---|
| `~/backups/igms-<date>.sql.gz` | Every night at 02:30 | 14 days |
| `~/backups/pre-deploy-<time>.sql.gz` | Before every backend release | Last 10 |
| `~/backups/manual-<time>.sql.gz` | When you run `igms backup` | Until you delete them |

These live **on the same server**. Copy them off regularly.

**PC** — download all backups to your computer:
```powershell
New-Item -ItemType Directory -Force "$HOME\Documents\igms-backups" | Out-Null
scp "igms:backups/*.sql.gz" "$HOME\Documents\igms-backups\"
```

Keep that folder private — the backups contain everyone's waitlist details.

### Restore a backup

This **replaces the whole database**. Take a fresh backup first.

**Server**
```bash
igms backup
igms backups
gunzip -c ~/backups/<file name>.sql.gz | mysql igms
igms restart
```

---

## 6. Rolling back

### Website

**Server**
```bash
cat /var/www/igms-releases/.previous
bash /var/www/igms-releases/.bin/activate.sh /var/www/igms /var/www/igms-releases "$(cat /var/www/igms-releases/.previous)"
```

Then fix the problem and push again — the next deploy replaces the rollback.

### Backend

The cleanest way is to undo the commit on GitHub, which redeploys the old
code automatically:

**PC** — in `launchpad_backend`:
```powershell
git revert HEAD
git push
```

If a **migration** caused the problem, also restore the matching
`pre-deploy-…` backup (section 5).

---

## 7. Server housekeeping

### Weekly

**Server**
```bash
igms security
igms backups
```

Security updates install themselves overnight. If `igms security` lists many
pending updates, or a message says a restart is required:

```bash
sudo apt update && sudo apt -y full-upgrade
sudo reboot
```

Everything starts again by itself after a reboot. Wait a minute, `ssh igms`,
then `igms status`.

### Monthly

- `igms ssl` — the certificate renews itself; this just confirms it.
- Download the backups to your PC (section 5).
- Check disk and memory in `igms status`. If RAM is regularly above ~85 %,
  consider upgrading the VPS to the next size in the IONOS Cloud Panel.

---

## 8. Troubleshooting

| Symptom | Check / fix |
|---|---|
| Site shows **502 Bad Gateway** | Backend is down: `igms errors`, then `igms restart`. |
| Waitlist says **"Something went wrong"** | `igms errors` — usually a database password or Brevo key in `.env` (`igms env`). |
| Sign-up works but **no emails** | Brevo key or sender in `.env`; check the Brevo dashboard for blocked sends. |
| Site down entirely | `igms status`; if nginx is stopped: `sudo systemctl start nginx`. |
| **Deploy production** fails at *Configure SSH* | `KNOWN_HOSTS` secret: run `ssh-keyscan -t ed25519 217.154.57.237` on your PC and paste the whole line. |
| **Deploy** fails at *npm audit* | A new security advisory. On your PC run `npm audit fix` in that project, test, commit, push. |
| **Deploy backend** says it rolled back | Read the red step in GitHub Actions; on the server `igms errors`. |
| Cookie banner missing | The domain is not allowed in Usercentrics settings. |
| `Permission denied (publickey)` when logging in | Wrong key or passphrase. Use the IONOS Cloud Panel's **Remote Console** to reach the server and check `~/.ssh/authorized_keys`. |
| Disk nearly full | `igms backups` and delete old manual backups: `rm ~/backups/manual-<date>.sql.gz`. |

---

## 9. Quick reference

```text
PC      ssh igms                         log in to the server
Server  igms status                      is everything OK?
Server  igms errors                      what went wrong?
Server  igms restart                     restart the backend
Server  igms env                         edit backend settings safely
Server  igms env-restore                 undo the last settings change
Server  igms backup                      back up the database now
Server  igms security                    weekly security check
PC      git push   (staging)             update the staging site
PC      git push   (main, frontend)      release the website
PC      git push   (main, backend)       release the backend
```
