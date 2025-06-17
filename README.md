# 📘 ContentShare Frontend

ContentShare is a Vue 3 frontend application that allows users to register, log in (via email/password or OAuth), and access content based on their subscription tier: Free, Basic, or Premium.
Apps Demo: [Click here](https://sharesphere-owent.vercel.app/)

## 🛠 Tech Stack

- **Vue 3** + Composition API
- **PrimeVue** – UI Components
- **vee-validate** + **Yup** – Form validation
- **Pinia** – State management
- **vue-router** – Routing
- **Tailwind CSS** – Utility-first styling

---

## 📂 Project Structure

```
src/
├── assets/               # Static assets (e.g. logo, images)
├── components/           # Reusable Vue components (Navbar, Cards, etc.)
├── pages/                # Page views (Login, Register, Home)
├── router/               # Vue Router setup
│   └── index.ts
├── services/             # API service files (authService.ts, etc.)
├── stores/               # Pinia stores (authStore.ts)
├── utils/                # Utility types/functions
├── App.vue
└── main.ts
```

---

## 🔐 Authentication

### JWT Login

- User logs in or registers and receives a JWT.
- `authStore.setToken(token)` decodes and stores user info from the token.

### OAuth Login

- OAuth redirects to `/oauth-success?token=...`
- The token is set using `authStore.setToken()`.
- Optionally fetches `/profile` to enrich user data.

---

## 🔧 State Management (Pinia)

### `authStore.ts`

```ts
state: {
  token: string,
  user: JwtPayload | OAuthPayload | null,
},
getters: {
  isLoggedIn: (state) => !!state.user,
  userTier: (state) => state.user?.tier ?? 'free',
},
actions: {
  setToken(token: string),
  setLoginResponse({ token, user }),
  logout(),
},
```

---

## ✅ Form Validation

Uses `vee-validate` and `yup` schemas.

```vue
<Form :validation-schema="schema" v-slot="{ handleSubmit }">
  <form @submit.prevent="handleSubmit(onSubmit)">
```

---

## 🧭 Routing

Defined in `src/router/index.ts`:

```ts
const routes = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/oauth-success", component: OAuthSuccess },
];
```

Handles token extraction from query params in OAuth flow.

---

## 🎨 UI Components

### PrimeVue

- `InputText`, `Password`, `Checkbox`, `RadioButton`, `Button`
- Combined with Tailwind CSS for custom styling

### Navbar

- Dynamic based on `authStore.isLoggedIn`
- Displays login/register or profile/avatar

---

## 🌐 Favicon Setup

Put your favicon inside the `public/` folder. Example:

```html
<!-- public/index.html -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

---

## 🚀 Deployment

You can deploy the app using services like **Vercel**, **Netlify**, or **GitHub Pages**.

### Example: Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your project
4. It will auto-detect as a Vite + Vue app
5. Set `vite.config.ts` properly if base path is needed

---

## 🧪 Future Enhancements

- Protect routes based on login state
- Profile page with avatar editing
- Upgrade subscription tier
- Auto-refresh token / session expiration handling

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
