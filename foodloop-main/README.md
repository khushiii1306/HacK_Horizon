# FoodLoop AI - Food Rescue Platform

A modern, AI-powered web application that transforms surplus food into timely local opportunity by connecting food providers, recipients, and volunteers in real time.

## Features

### 🍽️ Provider Dashboard
- Upload surplus food listings with AI-powered freshness scoring
- Automatic recipient matching based on location and demand
- Real-time listing management and analytics
- ESG impact tracking and CSR certificates

### 🤲 Recipient Dashboard
- Discover nearby food listings in real time
- AI-powered freshness and safety scoring
- One-click booking with QR code verification
- Live tracking of food pickups

### 🚴 Volunteer Dashboard
- View optimized delivery routes
- Accept tasks with priority-based urgency
- Real-time GPS tracking
- Leaderboard rankings

### 📊 Impact Dashboard
- Real-time metrics (meals rescued, CO₂ saved, people served)
- Provider and volunteer leaderboards
- Environmental impact tracking

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd foodloop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The application will open automatically at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
foodloop/
├── src/
│   ├── App.jsx          # Main application component
│   └── main.jsx         # React entry point
├── public/              # Static assets
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── package.json         # Project dependencies
└── README.md           # This file
```

## Tech Stack

- **Frontend Framework:** React 18.2
- **Build Tool:** Vite 4.4
- **Styling:** CSS with inline styles (customizable)
- **State Management:** React Hooks (useState, useEffect)

## Features by Role

### As a Food Provider
- 📤 Upload surplus food with photos
- 🧠 AI freshness scoring based on storage type and temperature
- 🗺️ Automatic location-based recipient matching
- 📊 Real-time analytics dashboard
- 🏆 ESG scoring and CSR certificate generation
- 📋 Manage active listings and claims

### As a Recipient (NGO/Individual)
- 🔍 Discover food listings within 5 km radius
- 🎯 Smart filters (vegetarian, free, for sale)
- ✅ One-click booking with verification
- 📍 Live pickup tracking
- 💬 Real-time alerts and notifications
- 📋 Booking history and status

### As a Volunteer
- 🎯 Accept pickup and delivery tasks
- 🗺️ Optimized route planning
- 📊 Real-time route visualization
- 🏆 Leaderboard rankings
- ⭐ Rating system based on performance

## Usage

### Landing Page
- Introduction to FoodLoop AI
- Feature highlights
- Testimonials from partner organizations
- Call-to-action for different user types

### Navigation
- **Home** - Landing page with feature overview
- **Provider** - Food provider dashboard
- **Find Food** - Recipient discovery dashboard
- **Volunteer** - Delivery volunteer dashboard
- **Impact** - Real-time impact metrics dashboard
- **+ List Surplus** - Quick access to provider upload form

## Data

The application includes sample data for:
- 5 active food listings from various providers
- 3 registered volunteers
- 4 top-performing food providers
- Real-time counters for impact metrics

## Responsive Design

The application is fully responsive and optimizes the layout for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

On mobile devices, the sidebar in dashboards is hidden and navigation is streamlined.

## Customization

### Colors
All colors follow a green (#16a34a) theme for the food rescue focus. Modify the `styles` constant in `src/App.jsx` to change the color scheme.

### Data
Sample data can be modified in the `LISTINGS`, `VOLUNTEERS`, and `PROVIDERS` arrays in `src/App.jsx`.

### Styling
Both inline styles and CSS classes can be customized for a unique look.

## Performance

- Optimized rendering with React hooks
- Minimal re-renders through proper state management
- Lazy freshness timer calculations
- CSS animations for smooth transitions

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Real-time map integration (Google Maps API)
- [ ] Backend API integration
- [ ] User authentication system
- [ ] Payment gateway for discounted sales
- [ ] Notifications and email alerts
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support

## Contributing

This is a demonstration project. For modifications:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Contact & Support

For questions or support, please contact the FoodLoop AI team.

---

**Making a difference, one meal at a time** 🌿
