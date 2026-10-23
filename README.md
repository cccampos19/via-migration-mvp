# VIA — Migration Made Simple

A Mexico-centered migration roadmap tool. Built with **HTML, CSS and vanilla JavaScript**, with no build step.

## Preview locally
Open `index.html` in your web browser.

## Deploy to Vercel via GitHub
1. Create a new GitHub repository, e.g. `via-migration-mvp`.
2. Upload `index.html`, `styles.css`, and `app.js` to the repository root (not inside a nested folder).
3. Visit https://vercel.com/new, sign in with GitHub and import the repository.
4. Set Framework Preset to **Other**, Root Directory to `./`, Build Command to empty, and Output Directory to `.` if prompted. Deploy.
5. Your website receives a `.vercel.app` URL. New commits to `main` trigger fresh deployments.

## What works
- Choosing whether to leave Mexico or move to Mexico
- Six outbound destinations (Canada, Spain, USA, Germany, UK, Australia) and five inbound origins (Colombia, Argentina, USA, Canada, France)
- Study/work purpose, estimated stay duration
- Generated roadmap with official links, progress checkboxes and copy-to-clipboard
- Progress is saved in your browser, so a reload restores your roadmap and checked steps
- Moving to Mexico: the application step links to the Mexican embassy in the chosen origin country
- Responsive mobile layout

## Limitations
The routes are general templates, not verified personalized legal requirements, and VIA is not an eligibility engine. Check the linked authorities, because institutions may require additional or different steps. VIA does not submit applications.
