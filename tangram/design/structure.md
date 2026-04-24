# Folder Structure

**Source of Truth:** Internal Next.js Patterns + "Two Gears" Component Strategy.

## Directory Tree
```text
src/
├── app/
│   ├── (customer)/       # H5 Ordering (Editorial Showcase)
│   ├── (admin)/          # Dashboard (Transactional Retail)
│   └── api/
├── components/
│   ├── showcase/         # Editorial, high-whitespace components
│   ├── transactional/    # Data-dense, utility-first components
│   ├── ui/               # Atomic Apple-spec atoms (Buttons, Inputs)
│   └── layout/           # Section wrappers for Black/Light chaptering
├── db/
├── lib/
└── i18n/
```

## Strategy
Components are categorized by their "Gear":
- **Showcase Components** live in `components/showcase` and prioritize SF-style display typography.
- **Transactional Components** live in `components/transactional` and prioritize information density.
