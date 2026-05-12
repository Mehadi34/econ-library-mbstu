import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "econ-library-secret-key-2026";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Mock Database
const users = [
  {
    id: "1",
    name: "Econ Student",
    email: "student@mbstu.ac.bd",
    password: await bcrypt.hash("password123", 10),
    role: "student" as const
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@mbstu.ac.bd",
    password: await bcrypt.hash("admin123", 10),
    role: "admin" as const
  }
];

const books = [
  {
    id: "1",
    title: "কুফর তাকফির বিদআত-প্রান্তিকতা ও ভারসাম্যহীনতা",
    author: "মূল: শায়খ সালিহ আল ফাওযান",
    category: "Islam",
    isbn: "978-0133836790",
    description: "Islamic study on various aspects.",
    cover: "https://www.rokomari.com/static/200/products/n/357908_1701323385.jpg",
    totalCopies: 10,
    availableCopies: 8,
    location: "Shelf A1"
  },
  {
    id: "2",
    title: "নিদৃত শুভকামনা",
    author: "কামরুল আহসান",
    category: "General",
    isbn: "978-1305971493",
    description: "General literature.",
    cover: "https://www.rokomari.com/static/200/products/n/357909_1701323385.jpg",
    totalCopies: 15,
    availableCopies: 12,
    location: "Shelf A2"
  },
  {
    id: "3",
    title: "ফেরারি সময়",
    author: "সৈয়দ রানা",
    category: "Poetry",
    isbn: "978-1107146525",
    description: "A collection of poems.",
    cover: "https://www.rokomari.com/static/200/products/n/357910_1701323385.jpg",
    totalCopies: 5,
    availableCopies: 5,
    location: "Shelf A3"
  },
  {
    id: "4",
    title: "দাস হয়েও মহা মনীষী যারা",
    author: "মাওলানা সাঈদ আহমদ",
    category: "Islam",
    isbn: "978-0691235899",
    description: "Biographies of great personalities.",
    cover: "https://www.rokomari.com/static/200/products/n/357911_1701323385.jpg",
    totalCopies: 8,
    availableCopies: 3,
    location: "Shelf B1"
  },
  {
    id: "5",
    title: "বিশ্বায়নের যুগে ইসলাম উৎসাহ এবং সত্যতা",
    author: "প্রফেসর ড. সৈয়দ কামরুল",
    category: "Islam",
    isbn: "978-0070108134",
    description: "Islam in the era of globalization.",
    cover: "https://www.rokomari.com/static/200/products/n/357912_1701323385.jpg",
    totalCopies: 12,
    availableCopies: 10,
    location: "Shelf B2"
  },
  {
    id: "6",
    title: "তাফসীর ইবনে কাসীর (১০,১১) খন্ড",
    author: "হাফিজ ইমাদউদ্দীন ইবনে কাসীর (রঃ)",
    category: "Islam",
    isbn: "978-0070108135",
    description: "Famous Quranic exegesis.",
    cover: "https://www.rokomari.com/static/200/products/n/357913_1701323385.jpg",
    totalCopies: 20,
    availableCopies: 15,
    location: "Shelf B3"
  },
  {
    id: "7",
    title: "সায়েন্স ফিকশন সবুজ মানব",
    author: "হুমায়ূন আহমেদ",
    category: "Science Fiction",
    isbn: "978-0070108136",
    description: "Sci-fi by Humayun Ahmed.",
    cover: "https://www.rokomari.com/static/200/products/n/357914_1701323385.jpg",
    totalCopies: 10,
    availableCopies: 7,
    location: "Shelf C1"
  },
  {
    id: "8",
    title: "সাতকাহন (অখন্ড)",
    author: "সমরেশ মজুমদার",
    category: "General",
    isbn: "978-0070108137",
    description: "Classic Bengali novel.",
    cover: "https://www.rokomari.com/static/200/products/n/357915_1701323385.jpg",
    totalCopies: 5,
    availableCopies: 2,
    location: "Shelf C2"
  }
];

// Auth Routes
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict"
  });

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

app.get("/api/auth/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    res.json({
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role
    });
  } catch (err) {
    res.clearCookie("token");
    res.status(401).json({ error: "Invalid token" });
  }
});

// API Routes
app.get("/api/books", (req, res) => {
  const { query } = req.query;
  if (query) {
    const filtered = books.filter(b => 
      b.title.toLowerCase().includes(String(query).toLowerCase()) ||
      b.author.toLowerCase().includes(String(query).toLowerCase()) ||
      b.category.toLowerCase().includes(String(query).toLowerCase()) ||
      (b.isbn && b.isbn.includes(String(query))) ||
      (b.description && b.description.toLowerCase().includes(String(query).toLowerCase()))
    );
    return res.json(filtered);
  }
  res.json(books);
});

app.get("/api/books/:id", (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

app.get("/api/stats", (req, res) => {
  res.json({
    totalBooks: 4500,
    activeMembers: 1200,
    dailyVisitors: 85,
    newArrivals: 12
  });
});

// IMPORTANT: Do NOT call app.listen() directly if you want it to work as a Vercel Function
export default app;

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only listen if we are not in a serverless environment like Vercel
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

// In local development or environments like AI Studio, start the server
if (!process.env.VERCEL) {
    startServer();
}

