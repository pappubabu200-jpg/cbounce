# Deployment Notes

## 2026-06-08

### Fixed Issues

- Wrong Vercel Root Directory
  - app/web ❌
  - apps/web ✅

- next package missing
- clsx package missing
- tailwind-merge package missing
- zustand package missing

### Commands Used

npm cache clean --force

npm install next@14.2.0 react@18 react-dom@18

npm install clsx tailwind-merge

npm install zustand

npm install

npm run build

### Environment Variables Required

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

NEXT_PUBLIC_API_URL

### Result

- Build successful
- Homepage working
- Login working
- Signup working
- Vercel deployment successful
