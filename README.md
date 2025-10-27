# W.D. Gann Trading Platform

A professional web-based trading application implementing W.D. Gann's legendary trading methodologies. Built with modern technologies including React, TypeScript, tRPC, and Express.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

### Core Trading Tools

- **📊 Real-time Market Data**: Live stock and cryptocurrency prices from Yahoo Finance API
- **📐 Gann Angles Calculator**: Calculate support and resistance levels using Gann's angle methodology
- **🔢 Square of Nine**: Interactive spiral grid calculator for identifying key price levels
- **⏰ Time Cycles Analysis**: Predict market turning points using Gann's time cycle principles
- **📈 Advanced Charts**: Professional candlestick charts with technical indicators (SMA20, SMA50)

### Technical Highlights

- **Modern Stack**: React 18, TypeScript, Vite, tRPC, Express
- **Type-Safe API**: End-to-end type safety with tRPC
- **Responsive Design**: Beautiful dark-themed UI optimized for all devices
- **Real-time Data**: Integration with Yahoo Finance API for live market data
- **Production Ready**: Configured for deployment on Railway, Vercel, or any Node.js host

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- pnpm 8 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd gann-trading-app
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Start development server**:
   ```bash
   pnpm dev
   ```

5. **Open in browser**:
   ```
   http://localhost:5000
   ```

## 📁 Project Structure

```
gann-trading-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── lib/           # Utilities and TRPC client
│   │   └── styles/        # Global styles
│   └── index.html         # HTML entry point
│
├── server/                 # Express backend
│   ├── routers/           # TRPC routers
│   │   ├── gann.ts       # Gann calculations
│   │   ├── market.ts     # Market data API
│   │   └── auth.ts       # Authentication (placeholder)
│   ├── lib/              # Server utilities
│   ├── context.ts        # TRPC context
│   ├── trpc.ts           # TRPC setup
│   └── index.ts          # Server entry point
│
├── shared/                # Shared code between client and server
│   ├── types/            # TypeScript types
│   └── utils/            # Shared utilities
│
└── public/               # Static assets

```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server with hot reload

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Type Checking
pnpm typecheck        # Run TypeScript type checking

# Linting
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
HOST=0.0.0.0
NODE_ENV=development

# CORS Configuration (optional)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5000

# Add other environment variables as needed
```

## 🚢 Deployment

### Deploy to Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize and deploy**:
   ```bash
   railway init
   railway up
   ```

4. **Set environment variables** in Railway dashboard:
   - `NODE_ENV=production`
   - `PORT` (automatically set by Railway)

Your app will be live at `https://your-app.up.railway.app`

### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts** to configure your deployment.

### Deploy to Custom VPS

1. **Build the application**:
   ```bash
   pnpm build
   ```

2. **Copy files to server**:
   ```bash
   scp -r dist package.json pnpm-lock.yaml user@server:/app/
   ```

3. **On the server**:
   ```bash
   cd /app
   pnpm install --production
   pnpm start
   ```

4. **Use PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start "pnpm start" --name gann-app
   pm2 save
   pm2 startup
   ```

## 📚 API Documentation

### TRPC Routers

#### Gann Router (`/api/trpc/gann.*`)

- `calculateGannAngles`: Calculate Gann angles from a pivot point
- `calculateSquareOfNine`: Generate Square of Nine grid
- `calculateTimeCycles`: Calculate time cycles from a start date

#### Market Router (`/api/trpc/market.*`)

- `getMarketData`: Get real-time market data for a symbol
- `getHistoricalData`: Get historical price data
- `searchSymbols`: Search for stock/crypto symbols

#### Auth Router (`/api/trpc/auth.*`)

- `me`: Get current user (placeholder)
- `logout`: Logout user (placeholder)

## 🎨 Features in Detail

### 1. Market Data

Real-time and historical market data powered by Yahoo Finance API:
- Current price, change, volume, and market cap
- 90-day historical price charts
- Support for stocks and cryptocurrencies

### 2. Gann Angles

Calculate W.D. Gann's legendary price angles:
- Upward angles (support levels): 1x1, 1x2, 1x4, 2x1, 4x1, 8x1
- Downward angles (resistance levels)
- Configurable pivot points and target dates

### 3. Square of Nine

Interactive implementation of Gann's Square of Nine:
- Spiral grid calculator (7x7, 9x9, 11x11, 13x13)
- Cardinal angles (0°, 90°, 180°, 270°)
- Diagonal angles (45°, 135°, 225°, 315°)
- Automatic calculation of support/resistance levels

### 4. Time Cycles

Analyze Gann's time cycles:
- Major cycles: 7, 14, 21, 30, 45, 60, 90, 120, 144, 180, 360 days
- Natural cycles: Lunar, Mercury, Venus, Mars
- Calculate future turning points from any pivot date

### 5. Advanced Charts

Professional candlestick charts:
- OHLC (Open, High, Low, Close) visualization
- Technical indicators: SMA 20, SMA 50
- Interactive tooltips with detailed price information

## 🔧 Configuration

### TypeScript

The project uses strict TypeScript configuration. See `tsconfig.json` for details.

### Vite

Build tool configuration is in `vite.config.ts`. Customize as needed for your deployment.

### Tailwind CSS

Styling is done with Tailwind CSS. Configuration is in `tailwind.config.js`.

## 🐛 Troubleshooting

### Port Already in Use

If port 5000 is already in use:
```bash
PORT=5001 pnpm dev
```

### Build Errors

Clear cache and rebuild:
```bash
rm -rf node_modules dist .vite
pnpm install
pnpm build
```

### Type Errors

Run type checking to see all errors:
```bash
pnpm typecheck
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- W.D. Gann for his pioneering trading methodologies
- Yahoo Finance for market data API
- The open-source community for the amazing tools and libraries

## 📧 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Note**: This application is for educational purposes only. Always do your own research before making trading decisions.
