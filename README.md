# [BinCode](jsbin.asadk.dev) - A Complete Self-Hostable JSFiddle Alternative

## Overview
BinCode is a minimalist platform for managing and sharing code snippets, built with Vue.js and SQLite. Unlike similar tools that depend on external services, BinCode runs entirely on your own infrastructure, giving you complete control over your data and workflow.

## Key Features
- **Fully Self-Contained:** No external dependencies or services required
- **Modern Stack:** Built with Vue.js frontend and SQLite database
- **Secure Authentication:** Simple JWT-based user management
- **Instant Sharing:** Generate unique URLs for any code snippet
- **Minimal Setup:** Just create users manually and start sharing code
- **Performance Focused:** Lightweight design ensures fast operation

## Architecture
- Frontend: Vue.js
- Database: SQLite
- Authentication: JWT
- Deployment: Single server, self-contained

There is no signups its by design just create users manullay and they can start commits snippets to share

## Why BinCode?

During my search for open-source code sharing solutions, I found that most platforms required external services or had complex deployment requirements. I needed a straightforward, self-hostable tool that focused solely on creating and sharing code snippets.

BinCode was built with simplicity in mind. While it may not have all the features of larger platforms, its lightweight nature makes it perfect for teams and individuals who need a reliable, easy-to-maintain solution for code sharing.


## Design Choices
- **No Signups:** User accounts are created manually by administrators to keep the system simple and secure
- **Self-Contained:** Everything runs on your infrastructure, ensuring data privacy and control

## Contributing
While BinCode is intentionally minimal, contributions are always welcome! Feel free to add features that enhance its functionality while maintaining its lightweight nature.

## Getting Started

### 1. Clone and Install Dependencies

```bash
git clone https://git.sheetjs.com/asadbek064/BinCode.git
cd BinCode
pnpm install
```

### 2. Set Up Environment Variables
Create a .env file in the project root and define the following variables:
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secure-secret-here
JWT_EXPIRES_IN=7d
```

### 3. Adding user 

```bash
node addUser.js "user@email.com" "password"
```

### 4. Development server
Before starting the development server, ensure you change the Vue.js library import from `_prod` to `_dev` in [`index.html`](https://git.sheetjs.com/asadbek064/BinCode/src/commit/3e35da0118e8e6b44863b3fee12c1e2dff96b02e/public/index.html#L129).

```bash
pnpm dev
```

### 5. Production
Copy .env.example to .env and generate unique secret and cahnge NODE_ENV=production
1. Copy .env.example to .env:
```bash
cp .env.example .env
```

2. Generate a unique secret and set NODE_ENV=production in the .env file.

3. Start the production server
```
pnpm start
````


### 5. Production
- For development, using the `_dev` version of Vue.js (vue.global.js) is recommended as it includes debugging tools and warnings.

- For production, switch to the `_prod` version (vue.global.prod.js) to optimize performance.

