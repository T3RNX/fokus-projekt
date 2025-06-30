# BDogs - Pet Management System 🐕

A comprehensive pet management system built with ASP.NET Core and React, designed for veterinary clinics and pet care professionals.

## Quick Start

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or LocalDB

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fokus-projekt.git
   cd fokus-projekt/src
   ```

2. **Setup Backend**
   ```bash
   cd backend
   dotnet restore
   dotnet ef database update
   dotnet run
   ```
   Backend will run on `https://localhost:7202`

3. **Setup Frontend** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **Open your browser** and navigate to `http://localhost:5173`


## 🏗️ Project Structure

```
src/
├── backend/          # ASP.NET Core 8.0 API
│   ├── Controllers/  # REST API endpoints
│   ├── Models/       # Data models (Dog, Owner, Treatment)
│   ├── Data/         # Entity Framework DbContext
│   └── Migrations/   # Database migrations
└── frontend/         # React + TypeScript SPA
    ├── components/   # Reusable UI components
    ├── pages/        # Page components
    ├── API/          # API service layer
    └── lib/          # Utilities and helpers
```

## ✨ Features

- 🐕 **Dog Management**: Complete dog profiles with photos
- 👥 **Owner Management**: Contact and relationship tracking
- 🏥 **Treatment Records**: Appointment scheduling and medical history
- 📊 **Dashboard**: Real-time statistics and insights
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔍 **Search & Filter**: Find information quickly

## 🛠️ Technology Stack

- **Backend**: ASP.NET Core 8.0, Entity Framework Core, SQL Server
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **UI Components**: Radix UI, Lucide React
- **Database**: SQL Server with Entity Framework migrations

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.
