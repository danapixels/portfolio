# Stampfolio

My portfolio to connect with others through stamps. 

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)



![demo of stampfolio](/stampfoliodemo.gif)


## Features

- **Interactive Stamping System**: Visitors anonymously place stamps on my portfolio
- **Role-Based Identity**: Users can select their role (PM, Engineer, Leadership, etc.) when placing stamps
- **Real-time Updates**: See stamps from others in real-time
- **Time-based Icons**: Sun/moon icons shown on stamps depending when the time it was placed
- **Responsive Design**: Works on desktop and mobile devices
- **Authentication**: Password-protected 

## Pre-reqs

Before you begin, install the following:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) (optional, for containerized development)
- [Docker Compose](https://docs.docker.com/compose/) (optional, for containerized development)

## Installation

### Option 1: Docker Development (Recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/danapixels/portfolio.git
   cd portfolio
   ```

2. **Start the dev environment**:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Environment Configuration

### Development Environment

The project includes a `env.dev` file with development settings:

```env
NODE_ENV=development
VITE_API_URL=http://localhost:3001
ADMIN_KEY=dev-secret-key #unset by default
PORT=3001
VITE_DEV_SERVER_PORT=3000
```

### Production Environment

For production deployment, create a `.env` file with:

```env
NODE_ENV=production
VITE_API_URL=https://your-domain.com/api
ADMIN_KEY=your-secure-admin-key #unset by default
PORT=3001
JWT_SECRET=your-jwt-secret
PASSWORD_HASH=your-bcrypt-password-hash
```

## Project Structure

```
portfolio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Dock.tsx    # Stamp dock
│   │   │   ├── StampingArea.tsx  # Where stamps are placed
│   │   │   ├── ToggleSwitch.tsx  # Toggle
│   │   │   └── types.ts    # TypeScript type definitions
│   │   ├── App.tsx         # Main app component
│   │   ├── About.tsx       # About page
│   │   ├── Password.tsx    # Authentication page
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend
│   ├── server.js           # Express server
│   ├── stamps.json         # Stamp data storage
│   └── package.json        # Backend dependencies
├── docker-compose.dev.yml  # Docker development setup
├── Dockerfile.dev          # Development Docker configuration
└── README.md               # This file
```

## Usage

### Enter Password

1. Navigate to the portfolio website
2. You'll be redirected to the password page
3. Enter the correct password to access the main portfolio
4. Optionally select your role identity before logging in

### Stamping System

1. **Select a Role**: Click the role selector in the dock to choose your role if you haven't already
2. **Choose a Stamp**: Select from the stamps
3. **Place Stamps**: Click anywhere on the page to place a stamp
4. **View Others**: See stamps from other visitors with their role and timestamp
5. **Clear Stamps**: Use the trash icon to clear your own stamps

### Navigation

- **About Page**: Short snippet about me
- **Toggle Switch**: Switch between work and personal projects
- **Social Links**: GitHub, LinkedIn, and email links

## API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify authentication status

### Stamps
- `GET /api/stamps` - Get all stamps
- `POST /api/stamps` - Create a new stamp
- `POST /api/stamps/clear` - Clear user's stamps
- `DELETE /api/stamps` - Admin: clear all stamps

## Customization

### Adding New Roles

1. Update the `UserIdentity` type in `client/src/components/types.ts`
2. Add the role icon in `client/src/components/StampingArea.tsx` in the `getIconForIdentity` function
3. Add the role option in `client/src/components/IdentityChips.tsx`

### Adding New Stamp Types

1. Update the `StampType` type in `client/src/components/types.ts`
2. Add the stamp icon in `client/src/components/stampIcons.tsx`
3. Update the dock items in `client/src/components/StampingArea.tsx`

### Styling

The project uses Tailwind CSS for styling. Key files:
- `client/src/index.css` - Global styles and custom cursors
- `client/src/components/Dock.css` - Dock-specific styles
- Component files contain Tailwind classes for styling

## Set Password

The default password is `password` unless you change it.

1. **Generate a new password hash**:
   ```bash
   # Using Node.js crypto
   node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('your-new-password').digest('hex'));"
   ```

2. **Set the environment variable**:
   ```bash
   # Development (create or update env.dev)
   echo "PASSWORD_HASH=$(node -e \"const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('your-new-password').digest('hex'));\")" >> env.dev
   ```

   Or for production:
   ```bash
   # Production environment
   export PASSWORD_HASH=$(node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('your-new-password').digest('hex'));")
   ```

## Troubleshooting

### Common Issues

3. **Authentication issues**:
   - Check that the password hash in environment variables matches your password
   - Verify JWT secret is set correctly

4. **Stamps not loading**:
   - Check that `server/stamps.json` exists and is writable
   - Verify API endpoints are accessible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5.  Submit a pull request

## Like the font?
Download the Digi font [here!](https://github.com/danapixels/digi-ttf)


## License

This project is licensed under [GPL 3.0 License](https://www.gnu.org/licenses/gpl-3.0.en.html).
