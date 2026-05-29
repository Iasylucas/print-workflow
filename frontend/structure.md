frontend/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts (ou webpack)
├── .env
├── src/
│ ├── main.tsx
│ ├── App.tsx
│ ├── routes.tsx
│ │
│ ├── components/
│ │ ├── ui/ # Composants Shadcn (générés)
│ │ │ ├── button.tsx
│ │ │ ├── card.tsx
│ │ │ ├── input.tsx
│ │ │ ├── form.tsx
│ │ │ ├── avatar.tsx
│ │ │ └── ...
│ │ ├── layout/
│ │ │ ├── RootLayout.tsx
│ │ │ ├── Header.tsx
│ │ │ ├── Sidebar.tsx
│ │ │ └── ProtectedRoute.tsx
│ │ └── shared/
│ │ ├── LoadingSpinner.tsx
│ │ ├── ErrorBoundary.tsx
│ │ └── ConfirmDialog.tsx
│ │
│ ├── features/
│ │ ├── auth/
│ │ │ ├── components/
│ │ │ │ ├── LoginForm.tsx
│ │ │ │ ├── RegisterForm.tsx # finalize registration
│ │ │ │ ├── ForgotPasswordForm.tsx
│ │ │ │ └── ResetPasswordForm.tsx
│ │ │ ├── hooks/
│ │ │ │ └── useAuth.ts
│ │ │ ├── services/
│ │ │ │ └── authApi.ts
│ │ │ ├── types/
│ │ │ │ └── auth.types.ts
│ │ │ └── pages/
│ │ │ ├── LoginPage.tsx
│ │ │ ├── RegisterPage.tsx # finalize
│ │ │ ├── ForgotPasswordPage.tsx
│ │ │ └── ResetPasswordPage.tsx
│ │ │
│ │ ├── user/
│ │ │ ├── components/
│ │ │ │ ├── UserList.tsx
│ │ │ │ ├── UserForm.tsx
│ │ │ │ └── ProfileForm.tsx
│ │ │ ├── services/
│ │ │ │ └── userApi.ts
│ │ │ ├── types/
│ │ │ │ └── user.types.ts
│ │ │ └── pages/
│ │ │ ├── UsersPage.tsx
│ │ │ └── ProfilePage.tsx
│ │ │
│ │ ├── client/
│ │ │ ├── components/
│ │ │ │ ├── ClientList.tsx
│ │ │ │ └── ClientForm.tsx
│ │ │ ├── services/
│ │ │ │ └── clientApi.ts
│ │ │ ├── types/
│ │ │ └── pages/
│ │ │ └── ClientsPage.tsx
│ │ │
│ │ ├── company-info/
│ │ │ ├── components/
│ │ │ │ └── CompanyInfoForm.tsx
│ │ │ ├── services/
│ │ │ │ └── companyInfoApi.ts
│ │ │ ├── types/
│ │ │ └── pages/
│ │ │ └── CompanySettingsPage.tsx
│ │ │
│ │ └── dashboard/
│ │ ├── components/
│ │ │ └── StatsCards.tsx
│ │ └── pages/
│ │ └── DashboardPage.tsx
│ │
│ ├── lib/
│ │ ├── axios.ts # instance axios avec intercepteurs (token)
│ │ ├── utils.ts
│ │ └── constants.ts
│ │
│ ├── hooks/
│ │ ├── useLocalStorage.ts
│ │ └── useDebounce.ts
│ │
│ ├── stores/ # (optionnel) Zustand
│ │ └── authStore.ts
│ │
│ ├── styles/
│ │ └── globals.css # Tailwind + Shadcn
│ │
│ └── types/
│ └── global.d.ts
│
├── public/
│ └── logo.png
└── ...
