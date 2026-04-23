## Surgical Repair: Upgrade to Tailwind CSS v4.0

**Issue:** The user requested an upgrade to Tailwind CSS 4.0 as per the official upgrade guide (https://tailwindcss.com/docs/upgrade-guide). The v4.0 update replaces the `tailwind.config.js` and `postcss.config.js` setup with a simpler, CSS-first `@theme` based configuration and updates dependencies.

- [x] task 1 - Run the Tailwind Upgrade Tool
  > **Summary:** Run `npx @tailwindcss/upgrade` to automatically migrate the project dependencies, configuration files, and `src/app/globals.css` to Tailwind v4.0. We will then verify the changes and ensure the Next.js build is successful.