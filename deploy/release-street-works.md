# Release guide — Newham street works, staff downloads and UK corrections

How to put this release live. It changes **both** projects, and the order
matters: the website calls API routes that only the new backend has, so the
**backend goes first**.

> **PC** = PowerShell on your computer. **Server** = after `ssh igms`.

## What is in this release

**Backend (`launchpad_backend`)**
- Migration `011_street_works_reports.sql` — a new table for anonymous reports.
- `POST /api/street-works/reports` and `GET /api/street-works/board`.
- `POST /api/exports/waitlist` and `POST /api/exports/street-works` — the
  staff spreadsheet downloads, behind one password.
- New setting `EXPORT_PASSWORD_HASH` in `.env`.

**Website (`IGMS/frontend`)**
- New pages: `/street-works` (project page and hotspot board),
  `/report-street-works` (the form), `/admin` (staff downloads, not linked).
- Five focus areas (MenoSPACES added), the MenoSPACES "Have a space to donate
  or rent?" banner, "Everyday Access Tech" and "MenoSPACES" in the menu, the
  new SPACES wording, a bigger licence badge in the footer, and the Nigeria
  website under Company.

## Before you start

- Both projects build, typecheck and pass `npm audit` with 0 vulnerabilities.
- Everything was tested end to end on a local copy of the database — never on
  the server.
- Choose the staff download password now: long (four or more random words is
  good), and stored in a password manager. You will need it in Step 2.

---

## Step 1 — Release the backend

**PC** — in `C:\Users\Jalalgorithm\Projects\launchpad_backend`:

```powershell
git add -A
git status
git commit -m "Add Newham street works reports and staff data exports"
git push
```

Check `git status` lists only the expected files before committing.

GitHub → **LaunchPad-Backend** → **Actions** → **Deploy backend**. Wait for the
green tick. On the server, the workflow automatically:

1. backs up the database to `~/backups/pre-deploy-<time>.sql.gz`;
2. installs and builds;
3. runs migration **011** (creates `street_works_reports`);
4. restarts the API and checks it is healthy — and puts the previous version
   back if it is not.

Confirm on the **Server**:

```bash
igms status
curl -s "http://127.0.0.1:4000/api/street-works/board?period=all" | head -c 200; echo
```

The second command should start with `{"success":true`.

## Step 2 — Set the staff download password

The server never stores the password itself, only a scrambled version of it
(a bcrypt hash). Make the hash **on the server**, so the password never leaves
it.

**Server**
```bash
cd /srv/igms-api
read -rs P && P="$P" node -e "console.log(require('bcrypt').hashSync(process.env.P, 12))"; unset P
```

Type the password (nothing shows on screen) and press Enter. (`P="$P"` hands
the password to that one command only; `unset P` clears it afterwards.) It prints one
line starting `$2b$12$`. Copy that line.

Then add it to the settings:

```bash
igms env
```

Add this line at the bottom, pasting the hash after the `=` (no quotes, no
spaces):

```
EXPORT_PASSWORD_HASH=$2b$12$....
```

Save (**Ctrl+O**, **Enter**, **Ctrl+X**). `igms env` restarts the API and puts
the old settings back by itself if anything is wrong.

To change the password later, repeat this step. To switch downloads off,
leave `EXPORT_PASSWORD_HASH=` empty.

## Step 3 — Check it on staging (optional but recommended)

**PC** — in `C:\Users\Jalalgorithm\Projects\IGMS\frontend`:

```powershell
git checkout staging
git add -A
git commit -m "Street works pages, staff downloads, MenoSPACES and footer updates"
git push
```

Vercel builds the staging site. Staging runs in demo mode, so:
- `/street-works` shows example reports with a "Demo mode" notice;
- `/report-street-works` works but saves nothing;
- `/admin` says downloads are switched off.

Check the pages, the five focus cards and the menu look right.

## Step 4 — Release the website

**PC**
```powershell
git checkout main
git merge staging
git push
```

GitHub → frontend repository → **Actions** → **Deploy production**. It builds
with the live API, uploads, checks the site is serving the new version, and
rolls back automatically if that check fails.

(If you skipped Step 3, commit on `main` directly and push.)

## Step 5 — Check the live site

Open each in a browser:

- [ ] `https://igms-cic.org` — five focus cards; the MenoSPACES banner under
      them; **Focus Areas** menu shows *Everyday Access Tech* and *MenoSPACES*;
      the new SPACES sentence in About; the bigger badge in the footer; the
      Nigeria website under Company.
- [ ] Disability section → **Report street works** opens the form.
- [ ] `https://igms-cic.org/report-street-works` — send **one** test report
      (area *Other*, street left blank). The thank-you screen appears.
- [ ] `https://igms-cic.org/street-works` — no "Demo mode" notice, and the
      totals include your test report. A street name only appears on the board
      once three separate reports name it — this is deliberate, for privacy.
- [ ] `https://igms-cic.org/admin` — a wrong password is refused; the right
      one downloads both spreadsheets, and they open in Excel.
- [ ] Refresh each new page directly — it must load, not show Not Found.

Then delete the test report on the **Server**:

```bash
sudo mysql igms -e "SELECT id, reported_on, area, street, ticks FROM street_works_reports ORDER BY id DESC LIMIT 5;"
sudo mysql igms -e "DELETE FROM street_works_reports WHERE id = <the test row's id>;"
```

## If something goes wrong

| Problem | What to do |
|---|---|
| **Deploy backend** is red | Read the red step in GitHub Actions. If it says it rolled back, the old API is still running — nothing is broken. On the server: `igms errors`. |
| Board says "couldn't load" | Backend not updated yet (do Step 1 first), or `igms errors`. |
| Report form says it didn't send | `igms errors`. A 429 means the 30-reports-per-hour limit per connection was reached. |
| `/admin` says "not switched on" | `EXPORT_PASSWORD_HASH` is empty — Step 2. |
| `/admin` says "Too many attempts" | 5 wrong passwords in 15 minutes from that connection. Wait 15 minutes. |
| New page shows Not Found on refresh | The website is the old version — check **Deploy production** finished. |
| Need the old website back | Server: see "Rolling back → Website" in `operations.md`. |
| Need the old backend back | PC: `git revert HEAD` and `git push` in `launchpad_backend`. Migration 011 only *adds* a table, so the old backend runs fine with it in place. |

## Privacy notes for this release

- Reports store only the day, area, optional street, ticks and who filled it
  in — no name, contact details, IP address or time. Nothing about the
  reporter is logged.
- The public board shows totals only. A street is named only once three
  separate reports name it; otherwise it appears as "Other streets in <area>".
- The spreadsheets contain personal data (the waitlist) and the raw street
  text. Keep downloaded files on a secure device and delete them when done.
- Update the Privacy Policy (Termageddon) to cover the street works reports:
  what is collected, why, and how long it is kept.
