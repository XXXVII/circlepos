# Circle Bookshop Frontend

A modern Vue 3 bookshop application with TypeScript, featuring book browsing and purchasing functionality.

## 🚀 Features

- **Book Catalog**: Browse a comprehensive list of available books
- **Book Details**: View detailed information including price, stock, and ISBN
- **Book Covers**: Automatically fetched from Open Library Covers API
- **Purchase System**: One-click book purchasing with stock updates
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Stock counts update after purchases
- **Success Notifications**: Visual feedback for successful purchases

## 🛠 Technology Stack

- **Frontend**: Vue 3 with Composition API
- **Language**: TypeScript
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Styling**: Scoped CSS with modern design
- **Build Tool**: Vite
- **Code Quality**: ESLint + Prettier

## 📁 Project Structure

```
src/
├── components/
│   ├── BookCard.vue          # Individual book card component
│   └── LoadingSpinner.vue    # Loading spinner component
├── views/
│   ├── HomeView.vue          # Book listing page
│   └── BookDetailView.vue    # Book details and purchase page
├── services/
│   └── api.ts                # API service layer
├── types/
│   └── book.ts               # TypeScript interfaces
└── router/
    └── index.ts              # Vue Router configuration
```

## 🔧 Development Setup

### Prerequisites

- Node.js (v20.13.0 or higher)
- npm (v10.5.2 or higher)
- Running API server at `localhost:8000`

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   # Development - uses localhost:8000
   cp .env.development .env.local
   
   # For production deployment, update .env.production with your API URL
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

### Development Commands

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Recommended Deployment Strategy

**Frontend**: Deploy to Vercel/Netlify (static hosting)
**Backend**: Deploy to Railway/Render (Node.js with database)

### Frontend Deployment (Vercel)

1. **Connect your repository** to Vercel
2. **Set environment variables**:
   ```
   VITE_API_URL=https://your-api-domain.com
   ```
3. **Deploy**: Vercel will automatically build and deploy

### Frontend Deployment (Netlify)

1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Deploy the `dist` folder** to Netlify
3. **Set environment variables** in Netlify dashboard:
   ```
   VITE_API_URL=https://your-api-domain.com
   ```

### Environment Variables

- `VITE_API_URL`: Backend API base URL
  - Development: `http://localhost:8000`
  - Production: Your deployed API URL

## 📱 API Integration

The frontend consumes these API endpoints:

- `GET /books` - Fetch all books
- `GET /books/{id}` - Fetch single book by ID
- `POST /books/{id}/purchase` - Purchase a book

### API Response Formats

```typescript
// Books list response
{
  books: Book[]
}

// Single book response
{
  book: Book
}

// Book interface
interface Book {
  id: number
  title: string
  author: string
  isbn: string
  price: number
  availableStock: number
}
```

## 🎨 Design Features

- **Clean, modern interface** inspired by contemporary bookshops
- **Book cover integration** using Open Library Covers API
- **Responsive grid layout** adapts to different screen sizes
- **Loading states** with animated spinners
- **Stock indicators** show low inventory warnings
- **Purchase feedback** with success notifications

## 🔍 Key Components

### BookCard Component
- Displays book thumbnail, title, author, and price
- Links to detailed book view
- Shows stock warnings for low inventory

### BookDetailView
- Large book cover display
- Complete book information
- Purchase button with loading states
- Success notifications
- Stock count updates

### API Service Layer
- Centralized HTTP client configuration
- Type-safe API calls
- Error handling
- Environment-based URL configuration

## 🚦 Production Considerations

### Performance
- Images lazy-load from Open Library API
- Component-level code splitting
- Optimized build with Vite

### Error Handling
- Graceful fallbacks for missing book covers
- Console error logging (not user-facing per requirements)
- Network failure tolerance

### Security
- Environment variable configuration
- CORS handling between domains
- Input validation through TypeScript

## 🔧 Customization

### Styling
- Modify component styles in individual `.vue` files
- Update global styles in `App.vue`
- Responsive breakpoints at 768px

### API Configuration
- Update endpoint URLs in `services/api.ts`
- Modify response type interfaces in `types/book.ts`

### Features
- Add search/filtering in `HomeView.vue`
- Implement user authentication
- Add shopping cart functionality

---

**Built with ❤️ using Vue 3, TypeScript, and modern web standards**
