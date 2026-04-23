# TEXTOM PROJECT - TCS PRIME INTERVIEW Q&A GUIDE

---

## TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [Architecture & Design (How/Why)](#architecture--design)
3. [Technical Implementation (How/Why)](#technical-implementation)
4. [API Design & Database](#api-design--database)
5. [Frontend & State Management](#frontend--state-management)
6. [Performance & Optimization](#performance--optimization)
7. [Security & Best Practices](#security--best-practices)
8. [Problem-Solving & Edge Cases](#problem-solving--edge-cases)
9. [Behavioral & Leadership Questions](#behavioral--leadership-questions)
10. [Real-World Scenarios](#real-world-scenarios)
11. [Design Patterns](#design-patterns)
12. [Database Optimization](#database-optimization)
13. [Advanced React Patterns](#advanced-react-patterns)

---

## PROJECT OVERVIEW

### Q1: Tell us about your Textom project.
**Answer:**
Textom is a full-stack web application that enables users to securely share text and files with others using unique 4-digit codes. Here are the key features:
- **Text Sharing**: Users can paste text, which gets auto-saved to a shareable code
- **File Sharing**: Users can upload files which are compressed and stored
- **Auto-Expiry**: All content automatically expires after 15 minutes for security
- **Real-time UI**: Smooth animations and responsive design using Framer Motion
- **Tech Stack**: Next.js 15, TypeScript, MongoDB, React Hooks, Tailwind CSS

### Q2: Why did you choose Next.js over other frameworks?
**Answer:**
- **Full-stack capability**: Server-side rendering (SSR) + API routes in one framework
- **Performance**: Built-in optimization (code splitting, image optimization)
- **Developer Experience**: File-based routing, TypeScript support out of the box
- **Scalability**: Suitable for both small and large projects
- **SEO friendly**: SSR helps with search engine indexing
- **For this project**: Since we have both frontend and backend logic, Next.js reduced complexity

### Q3: Why use MongoDB instead of SQL databases?
**Answer:**
- **Flexible Schema**: Easy to store varied data structures (SharedText and SharedFile models)
- **Scalability**: Horizontal scaling capability
- **Document-based**: Naturally fits our use case (storing content objects with metadata)
- **JSON-like Queries**: Easy integration with JavaScript/Node.js
- **For this project**: Simple data structure didn't require complex relationships, so document DB was ideal

---

## ARCHITECTURE & DESIGN

### Q4: **HOW** is your application architecture organized?
**Answer:**
The project follows a **modular, component-based architecture**:

```
textom/
├── /app
│   ├── /api          (Backend logic - API routes)
│   │   ├── /share    (Text sharing endpoints)
│   │   ├── /retrieve (Text retrieval endpoints)
│   │   ├── /sharefile (File upload endpoints)
│   │   └── /retrieve-file (File download endpoints)
│   ├── /sharetext    (Page for text sharing)
│   ├── /sharefile    (Page for file sharing)
│   └── layout.tsx    (Root layout)
├── /components       (Reusable UI components)
├── /hooks            (Custom React hooks for business logic)
├── /lib              (Utilities - database connection)
├── /model            (MongoDB schemas)
└── /public           (Static assets)
```

**Why this structure?**
- **Separation of Concerns**: API logic separate from UI logic
- **Reusability**: Hooks can be tested independently and reused
- **Scalability**: Easy to add new features without affecting existing code
- **Maintainability**: Clear folder organization helps team navigation

### Q5: **WHY** did you create custom hooks instead of keeping logic in components?
**Answer:**
**Three main reasons:**

1. **DRY Principle** - Don't Repeat Yourself
   - Previously, ShareTextPage had duplicate logic
   - Created `useShareText` hook to centralize it
   - Now reusable across multiple components

2. **Separation of Concerns**
   ```typescript
   // Before: Logic mixed with UI
   export const ShareTextPage = () => {
     const [code, setCode] = useState("");
     // 100+ lines of logic...
     return <div>...</div>;
   };

   // After: Logic in hook, UI in component
   export const useShareText = () => {
     // Business logic here
   };
   
   export const ShareTextPage = () => {
     const { code, handleShare } = useShareText();
     return <div>...</div>; // Only UI
   };
   ```

3. **Testability** - Hooks can be unit tested independently without rendering UI

4. **Reusability** - CodeInput and ShareTextPage can both use `useRetrieveContent`

### Q6: **HOW** does your data flow from UI to database and back?
**Answer:**
**Data Flow Diagram:**

```
USER (UI)
    ↓ (User types text)
Component (ShareTextPage)
    ↓ (onChange event)
useShareText Hook
    ↓ (setTimeout debounce 1s)
API Route (/api/share)
    ↓ (POST request with content)
Backend Handler
    ↓ (Connected to MongoDB via lib/mongoose)
Database (SharedText collection)
    ↓ (Returns { code } to frontend)
Hook Updates State
    ↓ (code state updated)
Component Re-renders
    ↓ (Shows shareable code to user)
Display Code & Animations

// FOR RETRIEVAL:
User enters code
    ↓
CodeInput Component
    ↓
useRetrieveContent Hook
    ↓
/api/retrieve (POST)
    ↓
Database Query (find by code)
    ↓
Response with content
    ↓
Hook updates content state
    ↓
GetText Component displays it
```

### Q7: **WHY** did you implement a 15-minute expiry? **HOW** does it work?
**Answer:**
**Why 15 minutes?**
- **Security**: Reduces exposure time for sensitive data
- **Temporary Sharing**: Intended use case - quickly share content, not long-term storage
- **Database Cleanup**: Automatic expiry prevents storage bloat
- **User Expectation**: Users know data won't persist indefinitely

**How it's implemented:**
- **Frontend** (`useShareText.ts`):
  ```typescript
  const EXPIRY_MS = 15 * 60 * 1000;
  const [codeCreatedAt, setCodeCreatedAt] = useState<number | null>(null);
  
  const isExpired = () => 
    codeCreatedAt && Date.now() - codeCreatedAt > EXPIRY_MS;
  
  // If expired, generate new code instead of updating
  if (code && !isExpired()) {
    // Update existing code
  } else {
    // Generate new code
  }
  ```
- **Backend**: Database records can have TTL index to auto-delete after 15 min
- **User sees**: "Auto-expires: Text snippets are automatically deleted after 15 minutes"

---

## TECHNICAL IMPLEMENTATION

### Q8: **HOW** do you prevent duplicate codes in file uploads?
**Answer:**
```typescript
// In /api/sharefile/route.ts
let code;
do {
  code = Math.floor(1000 + Math.random() * 9000).toString();
} while (await SharedFile.findOne({ code }));
```

**Explanation:**
- Generates random 4-digit code (1000-9999)
- Checks if code already exists in database
- If exists, generates another code
- Repeats until unique code is found

**Why this approach?**
- **Simple & Reliable**: Guaranteed uniqueness
- **Space-efficient**: No need for UUID
- **User-friendly**: Easy to remember and share 4-digit codes
- **Trade-off**: Limited to ~9000 unique codes max

**Potential Issue:**
- As database grows closer to 9000 entries, performance degrades
- **Solution**: Implement 5-digit codes, use hash-based codes, or implement database cleanup

### Q9: **HOW** does file compression work? **WHY** compress?
**Answer:**
**Why Compress?**
- Reduces storage space by 60-80% on average
- Faster uploads and downloads
- Reduces bandwidth costs
- Protects user privacy (encrypted in transit)

**How Compression Works:**

**Upload Flow:**
```typescript
import zlib from "zlib";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  
  // Convert file to Buffer
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Compress using gzip
  const compressed = zlib.gzipSync(buffer);
  
  // Store compressed data in DB
  await SharedFile.create({
    code,
    fileName: file.name,
    fileData: compressed,  // Compressed binary
    mimeType: file.type
  });
}
```

**Download Flow:**
```typescript
const file = await SharedFile.findOne({ code });

// Decompress
const decompressed = zlib.gunzipSync(file.fileData);

// Send to user with proper headers
return new Response(new Uint8Array(decompressed), {
  headers: {
    "Content-Type": file.mimeType,
    "Content-Disposition": `attachment; filename="${file.fileName}"`
  }
});
```

**Why zlib?**
- Built-in Node.js library (no extra dependencies)
- Industry standard compression (gzip)
- Fast compression/decompression
- Widely compatible across browsers

### Q10: **HOW** does debouncing work in text sharing? **WHY** use it?
**Answer:**
**Why Debouncing?**
- Without debouncing: Every keystroke triggers API call = 100+ API calls per minute
- With debouncing: Wait until user stops typing for 1 second, then call API once
- Reduces server load by 95%+
- Improves user experience (no flickering)

**How it's implemented:**
```typescript
// In useShareText hook
const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const newText = e.target.value;
  setText(newText);
  
  // Step 1: Clear previous timeout if exists
  if (debounceTimeout.current) {
    clearTimeout(debounceTimeout.current);
  }
  
  // Step 2: Set new timeout
  debounceTimeout.current = setTimeout(() => {
    handleShare(newText);  // Only call API after 1s of inactivity
  }, 1000);
};

// Cleanup on component unmount
useEffect(() => {
  return () => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
  };
}, []);
```

**Timeline Example:**
```
User types:  "H"  "e"  "l"  "l"  "o"
             |    |    |    |    |
Timeout:     1s   1s   1s   1s   1s (resets each time)
API Call:                          ✓ (only after 1s of no typing)

Result: 1 API call instead of 5
```

---

## API DESIGN & DATABASE

### Q11: **HOW** is your API designed? **WHY** follow REST principles?
**Answer:**

**REST API Design:**
| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| POST | /api/share | Create text | `{content}` | `{code}` |
| POST | /api/retrieve | Get text | `{code}` | `{content}` |
| PUT/PATCH | /api/share/[code] | Update text | `{content}` | `{code}` |
| POST | /api/sharefile | Upload file | FormData | `{code}` |
| GET | /api/retrieve-file/[code] | Download file | URL param | Binary data |

**Why REST?**
- **Standard**: Industry-standard, easy to understand
- **Stateless**: Each request is independent, scalable
- **HTTP Methods**: Semantic meaning (POST=create, GET=read, PUT=update)
- **Caching**: GET requests can be cached
- **Simplicity**: No learning curve for other developers

### Q12: **HOW** do you handle errors in API routes?
**Answer:**
```typescript
export async function POST(req: Request) {
  try {
    // Step 1: Validate input
    const { code } = await req.json();
    if (!code?.trim()) {
      return NextResponse.json(
        { error: "Content required" },
        { status: 400 }
      );
    }

    // Step 2: Connect to database
    await connectToDatabase();

    // Step 3: Perform operation
    const result = await SharedText.findOne({ code });
    if (!result) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    // Step 4: Return success
    return NextResponse.json({ content: result.content });

  } catch (err) {
    // Step 5: Handle unexpected errors
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
```

**Error Handling Strategy:**
- **Validation**: Check inputs first (400 Bad Request)
- **Not Found**: Return 404 for missing resources
- **Server Errors**: Catch all with try-catch (500 Internal Server Error)
- **User-friendly**: Meaningful error messages in response

### Q13: **HOW** do MongoDB schemas work? **WHY** define them?
**Answer:**

**SharedText Model:**
```typescript
// model/SharedText.ts
import mongoose from "mongoose";

const sharedTextSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900  // TTL index: auto-delete after 900 seconds (15 min)
  }
});

export default mongoose.models.SharedText || 
  mongoose.model("SharedText", sharedTextSchema);
```

**Why Define Schemas?**
- **Validation**: Ensures data consistency
- **Type Safety**: Know what fields exist and their types
- **Indexing**: Speed up queries on `code` field
- **TTL**: Auto-deletion after 15 minutes
- **Auto-timestamps**: Track when text was created

**Database Flow:**
```
1. User shares text
   ↓
2. API POST /api/share
   ↓
3. Validate with schema
   ↓
4. Insert into MongoDB
   ↓
5. Return code
   ↓
6. After 900s: MongoDB auto-deletes document
```

---

## FRONTEND & STATE MANAGEMENT

### Q14: **HOW** do hooks manage state? **WHY** use hooks instead of class components?
**Answer:**

**State Management with Hooks:**
```typescript
// useShareText Hook
export const useShareText = () => {
  const [text, setText] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleShare = async (newText: string) => {
    setIsLoading(true);
    setError("");
    // ... API logic
  };

  return { text, setText, code, handleShare, isLoading, error };
};

// Usage in Component
export const ShareTextPage = () => {
  const { text, code, handleShare, isLoading, error } = useShareText();
  // Component only uses what it needs
};
```

**Why Hooks Over Class Components?**

| Feature | Hooks | Class |
|---------|-------|-------|
| Code Size | 20 lines | 50+ lines |
| Reusability | Share logic via hooks | Inheritance only |
| Learning Curve | Easier | Harder (this binding) |
| Performance | Optimizable | More overhead |
| Testing | Simpler | Requires enzyme/testing-library |
| State Logic | Grouped by feature | Spread across methods |

**Example - Class vs Hook:**

**Class Component:**
```typescript
class ShareTextPage extends React.Component {
  constructor(props) {
    this.state = { text: "", code: "", isLoading: false };
  }
  
  componentDidMount() { /* setup */ }
  componentWillUnmount() { /* cleanup */ }
  
  handleShare = () => { /* API call */ }
  
  render() {
    return <div>{this.state.code}</div>;
  }
}
```

**Hook Version (Much cleaner):**
```typescript
const ShareTextPage = () => {
  const { text, code, handleShare } = useShareText();
  return <div>{code}</div>;
};
```

### Q15: **HOW** do animations work with Framer Motion? **WHY** use animations?
**Answer:**

**Why Animations?**
- **User Feedback**: Users know something is happening
- **Polish**: Makes app feel modern and professional
- **UX**: Smooth transitions reduce cognitive load
- **Engagement**: Users spend more time on smooth apps

**How Animations Work:**

**1. Tab Switching Animation:**
```typescript
<AnimatePresence mode="wait">
  {view === "code" ? (
    <motion.div
      key="code-view"
      initial={{ opacity: 0, y: 10 }}      // Start state
      animate={{ opacity: 1, y: 0 }}       // End state
      exit={{ opacity: 0, y: -10 }}        // When leaving
      transition={{ duration: 0.3 }}       // 300ms animation
    >
      {/* Content */}
    </motion.div>
  ) : (
    <motion.div key="file-view" {...}>
      {/* Different content */}
    </motion.div>
  )}
</AnimatePresence>
```

**Why `AnimatePresence`?**
- Allows exit animations when component unmounts
- Acts as gatekeeper for mounting/unmounting
- Prevents abrupt disappearance

**2. Button Interactions:**
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}    // Scale on hover
  whileTap={{ scale: 0.95 }}       // Scale on click
  onClick={handleShare}
>
  Share
</motion.button>
```

**3. Input Focus Animation:**
```typescript
<motion.input
  whileFocus={{ scale: 1.02 }}     // Slightly enlarge on focus
  placeholder="Enter code"
/>
```

**Animation Performance:**
- Uses GPU acceleration (transform/opacity only)
- Smooth 60fps animations
- No layout thrashing

---

## PERFORMANCE & OPTIMIZATION

### Q16: **HOW** do you optimize performance? **WHY** is performance important?
**Answer:**

**Why Performance Matters?**
- **User Experience**: Faster = better retention
- **SEO**: Google ranks faster sites higher
- **Conversion**: Every 100ms delay = 1% conversion loss
- **Mobile**: Mobile users on slow networks
- **Server Cost**: Better performance = lower infrastructure costs

**Performance Optimizations Implemented:**

**1. Code Splitting (Next.js automatic)**
```
Without splitting: 500KB bundle
With splitting: 50KB initial + dynamic chunks
Result: 90% faster first load
```

**2. Debouncing (reduces API calls by 95%)**
```typescript
// Prevents flooding server with requests
debounceTimeout.current = setTimeout(() => {
  handleShare(newText);
}, 1000);
```

**3. File Compression (zlib)**
```
Before: 10MB file
After: 2-3MB compressed
Savings: 70-80%
```

**4. Lazy Loading Components**
```typescript
const FileGet = lazy(() => import('./FileGet'));

// Only loads when needed
<Suspense fallback={<Loading />}>
  <FileGet />
</Suspense>
```

**5. Image Optimization**
```typescript
// Next.js Image component auto-optimizes
<Image 
  src="/logo.png" 
  width={40} 
  height={40}
  priority  // Load above fold
/>
```

**6. Database Indexing**
```typescript
const sharedTextSchema = new mongoose.Schema({
  code: {
    type: String,
    index: true  // Fast lookups on code field
  }
});
```

**Query Performance:**
- Without index: O(n) - scan entire collection
- With index: O(log n) - binary search

### Q17: **HOW** do you measure and monitor performance?
**Answer:**

**Frontend Metrics:**
- **Lighthouse Score**: Run `npm audit`
- **Core Web Vitals**: LCP (2.5s), FID (100ms), CLS (0.1)
- **Bundle Size**: Check with Next.js analyzer

**Backend Metrics:**
- **API Response Time**: < 200ms for 95th percentile
- **Database Query Time**: < 50ms
- **Error Rate**: < 0.1%

**Monitoring Tools:**
```typescript
// Simple performance logging
const startTime = Date.now();
const result = await fetch('/api/retrieve');
const duration = Date.now() - startTime;
console.log(`API took ${duration}ms`);
```

---

## SECURITY & BEST PRACTICES

### Q18: **HOW** do you handle security? **WHY** is security important?
**Answer:**

**Why Security?**
- **Data Protection**: Users trust us with their data
- **Compliance**: GDPR, data protection laws
- **Reputation**: Security breach destroys credibility
- **Legal**: Liable for data breaches

**Security Measures Implemented:**

**1. Input Validation**
```typescript
if (!content?.trim()) {
  return NextResponse.json({ error: "Content required" }, { status: 400 });
}
```

**2. Code Uniqueness (prevents unauthorized access)**
```typescript
// Each code is unique, hard to brute force
while (await SharedFile.findOne({ code })) {
  code = generateRandomCode();
}
```

**3. Auto-Expiry (reduces exposure)**
```typescript
createdAt: {
  type: Date,
  expires: 900  // Auto-delete after 15 min
}
```

**4. No Authentication = Anonymous Sharing**
- No user tracking
- No stored credentials
- No registration required

**5. HTTPS Enforcement**
```
// Production deployment must use HTTPS
process.env.NODE_ENV === 'production' ? 'https' : 'http'
```

**6. Error Messages (Don't leak info)**
```typescript
// Bad:
return NextResponse.json(
  { error: `User ${userId} not found in database` }
);

// Good:
return NextResponse.json(
  { error: "Resource not found" },
  { status: 404 }
);
```

### Q19: **HOW** do you prevent XSS attacks? **WHY** are they dangerous?
**Answer:**

**What is XSS?**
- Attacker injects malicious JavaScript into user input
- Executed in victim's browser
- Can steal cookies, session tokens, sensitive data

**Why Dangerous?**
- Session hijacking
- Credential theft
- Malware distribution
- User data theft

**Prevention in Textom:**

**1. React Auto-escapes by Default**
```typescript
// React automatically escapes JSX content
const userInput = "<script>alert('hack')</script>";
<div>{userInput}</div>  // Renders as text, not executed

// Rendered as:
// &lt;script&gt;alert('hack')&lt;/script&gt;
```

**2. Validate on Backend**
```typescript
const { content } = await req.json();

// Check for malicious patterns
if (content.includes('<script>') || content.includes('javascript:')) {
  return NextResponse.json({ error: "Invalid content" }, { status: 400 });
}
```

**3. Sanitize File Names**
```typescript
const filename = contentDisposition
  .split("filename=")[1]
  .replace(/"/g, "")
  .replace(/[^a-zA-Z0-9.-]/g, "");  // Remove special chars
```

### Q20: **HOW** do you prevent brute force attacks on codes?
**Answer:**

**Current Issues:**
- 4-digit code = only 9999 possibilities
- Could brute force all codes in seconds

**Solutions:**

**Option 1: Rate Limiting**
```typescript
// Limit to 10 requests per minute per IP
const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  windowMs: 60 * 1000,  // 1 minute
  max: 10  // 10 requests
});

app.use('/api/retrieve', limiter);
```

**Option 2: Longer Codes**
```typescript
// Change from 4-digit to 6-digit or alpha-numeric
const code = Math.random().toString(36).substring(2, 8);  // 6-char alphanumeric
// Increases combinations from 9,999 to 2.1 million
```

**Option 3: CAPTCHA**
```typescript
// Add reCAPTCHA v3 to retrieve endpoints
// Blocks bot-like behavior
```

**Option 4: Exponential Backoff**
```typescript
// Each failed attempt increases wait time
// 1st attempt: immediate
// 2nd attempt: wait 1s
// 3rd attempt: wait 2s
// 4th attempt: wait 4s
```

---

## PROBLEM-SOLVING & EDGE CASES

### Q21: **HOW** would you handle if a user tries to update an expired code?
**Answer:**

**Problem:** User's code expired (15 min passed), tries to update it

**Solution in `useShareText`:**
```typescript
const EXPIRY_MS = 15 * 60 * 1000;
const isExpired = () => codeCreatedAt && Date.now() - codeCreatedAt > EXPIRY_MS;

const handleShare = async (newText: string) => {
  if (code && !isExpired()) {
    // Code still valid, update it
    await fetch(`/api/share/${code}`, { method: "PATCH" });
  } else {
    // Code expired or doesn't exist, create new one
    await fetch(`/api/share`, { method: "POST" });
  }
};
```

### Q22: **HOW** would you scale this to millions of users?
**Answer:**

**Current Bottlenecks:**
- Single MongoDB instance
- 4-digit code limit (9999 files max)
- No caching

**Scaling Strategy:**

**1. Database Scaling**
```
Single MongoDB → MongoDB Cluster (Sharding)
Shard by code: codes 1000-2999 → Server 1
              codes 3000-5999 → Server 2
              codes 6000-9999 → Server 3
```

**2. Code System**
```
// Increase from 4-digit to 8-character alphanumeric
code = Math.random().toString(36).substring(2, 10);
// Supports 2.8 trillion unique codes
```

**3. Caching Layer**
```
Request → Redis Cache
          ↓ (Cache miss)
        MongoDB
         ↓
        Redis (Cache 1 hour)
         ↓
       Response
```

**4. CDN for Files**
```
File Upload → AWS S3 / CloudFront
             (Distributed globally)
```

**5. Load Balancing**
```
Multiple Next.js instances behind load balancer (Nginx)
User → Load Balancer → Server 1, 2, 3... (round-robin)
```

**6. Database Cleanup Service**
```
// Remove expired entries periodically
setInterval(async () => {
  await SharedText.deleteMany({
    createdAt: { $lt: Date.now() - 15 * 60 * 1000 }
  });
}, 5 * 60 * 1000);  // Every 5 minutes
```

### Q23: **HOW** would you add authentication/user accounts?
**Answer:**

**Current System:** Anonymous, no accounts

**To Add Accounts:**

**Step 1: Create User Schema**
```typescript
const userSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String },  // hashed
  sharedTexts: [{ type: Schema.Types.ObjectId, ref: 'SharedText' }],
  sharedFiles: [{ type: Schema.Types.ObjectId, ref: 'SharedFile' }],
  createdAt: { type: Date, default: Date.now }
});
```

**Step 2: Add Auth Routes**
```typescript
POST /api/auth/signup    // Create account
POST /api/auth/login     // Authenticate
POST /api/auth/logout    // Clear session
GET  /api/auth/me        // Get current user

// Add JWT or Session-based auth
```

**Step 3: Link to Shared Content**
```typescript
// Change from anonymous to user-linked
const sharedTextSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  code: String,
  content: String,
  createdAt: Date
});
```

**Step 4: Update API Routes**
```typescript
export async function POST(req: Request) {
  // Get user from JWT token
  const user = await verifyToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  
  // Create with userId
  await SharedText.create({
    userId: user.id,
    content,
    code: generateCode()
  });
}
```

**Benefits:**
- User can view history
- User can delete own content
- Analytics per user
- Premium features possible

### Q24: **HOW** would you add persistence (keep data longer than 15 min)?
**Answer:**

**Current:** Auto-delete after 15 minutes

**To Add Persistence Option:**

**Step 1: Update Schema**
```typescript
const sharedTextSchema = new Schema({
  code: String,
  content: String,
  isTemporary: { type: Boolean, default: true },  // NEW
  expiresAt: { type: Date },                      // NEW
  createdAt: { type: Date, default: Date.now }
});

// Index for automatic deletion only on temporary content
sharedTextSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { isTemporary: true } }
);
```

**Step 2: Add UI Option**
```typescript
<label>
  <input 
    type="checkbox" 
    onChange={(e) => setIsPersistent(e.target.checked)}
  />
  Keep this text permanently?
</label>
```

**Step 3: Update API**
```typescript
export async function POST(req: Request) {
  const { content, isPersistent } = await req.json();
  
  await SharedText.create({
    code: generateCode(),
    content,
    isTemporary: !isPersistent,
    expiresAt: isPersistent ? null : new Date(Date.now() + 15*60*1000)
  });
}
```

---

## BEHAVIORAL & LEADERSHIP QUESTIONS

### Q25: **Tell us about a challenge you faced while building Textom and how you solved it.**
**Answer:**

**Challenge: Component Parsing Error in CodeInput**

**The Problem:**
When I refactored CodeInput to add animations, the JSX got malformed:
```typescript
// Problem code - missing closing tag
<motion.div key="file-view" ...>
</AnimatePresence>  // This closes the wrong element!
```

**The Solution:**
1. **Identified**: Used error message to locate line 97
2. **Understood**: Realized motion.div wasn't properly closed
3. **Fixed**: Properly structured the JSX with complete motion.div:
```typescript
<motion.div key="file-view" ...>
  <FileGet />
</motion.div>  // Correct closure
```

**What I Learned:**
- ESLint helps catch these early
- Always match JSX tags carefully
- Test incrementally (add animations in smaller chunks)

**Key Takeaway:** Methodical debugging and understanding error messages helps resolve issues quickly.

### Q26: **How would you handle feedback/criticism on your code?**
**Answer:**

**My Approach:**
1. **Listen actively** - Understand the feedback fully
2. **Ask questions** - Why is this a concern? What's the better approach?
3. **Implement changes** - Modify code based on feedback
4. **Test thoroughly** - Ensure changes don't break existing functionality
5. **Follow up** - Did the change address the concern?

**Example:**
If someone said: "Why are you calling the API on every keystroke?"

**My response:**
- "Good point! That causes unnecessary server load."
- "I implemented debouncing to solve this - waits 1 second after user stops typing."
- "This reduced API calls by 95%."

### Q27: **Describe your development process for a new feature.**
**Answer:**

**My Process:**

**1. Understand Requirements**
- What problem does it solve?
- Who are the users?
- What's the success metric?

**2. Design**
- Sketch UI/information flow
- Plan database schema
- Identify edge cases

**3. Implement Backend**
- Create API route
- Write database logic
- Add error handling
- Test with Postman

**4. Implement Frontend**
- Create component
- Add form validation
- Connect to API
- Add loading/error states

**5. Testing**
- Manual testing (happy path)
- Edge cases (empty input, null values)
- Error scenarios
- Performance (no unnecessary renders)

**6. Polish**
- Add animations
- Improve UX
- Optimize performance
- Code review

**7. Deploy**
- Test in staging
- Monitor errors
- Get feedback

### Q28: **How do you stay updated with new technologies?**
**Answer:**

**My Learning Strategy:**

1. **Official Documentation** - Next.js, React docs (source of truth)
2. **Blogs & Tutorials** - Web Dev Simplified, Traversy Media
3. **Practice Projects** - Textom is my project-based learning
4. **Code Review** - Learn from others' code
5. **Conferences & Talks** - YouTube tech talks
6. **Community** - Stack Overflow, GitHub discussions

**Application:**
- Learned Framer Motion by implementing animations in all components
- Discovered MongoDB indexing's performance benefits
- Started using TypeScript for type safety

### Q29: **What would you improve in Textom if you had more time?**
**Answer:**

**Priority Improvements:**

**Short-term (1-2 weeks):**
1. **Authentication** - Add user accounts, view history
2. **No-code solution** - Right-click share text from browser
3. **Analytics** - Track how many times content was accessed
4. **Dark mode** - Toggle between light/dark theme

**Medium-term (1-2 months):**
1. **Social sharing** - Share via WhatsApp, Email, Link
2. **Custom expiry** - Let users choose expiry time (5min, 1hr, 1day)
3. **Collections** - Organize multiple shares into folders
4. **Mobile app** - React Native version

**Long-term (3-6 months):**
1. **End-to-end encryption** - Only sharer and recipient can see content
2. **Collaborative editing** - Multiple users edit same document
3. **Version history** - Track changes over time
4. **API for developers** - Let other apps integrate

**Technical Improvements:**
1. Upgrade to 6-digit alphanumeric codes (9999 limit)
2. Add rate limiting to prevent abuse
3. Implement Redis caching
4. Add comprehensive error logging
5. Write unit tests for hooks
6. Set up CI/CD pipeline

### Q30: **Where do you see yourself in 5 years?**
**Answer:**

**My Vision:**

**Short-term (1-2 years):**
- Become full-stack developer expert
- Master system design and scalability
- Lead small team projects
- Build production-ready applications

**Medium-term (3-5 years):**
- Lead technical architecture decisions
- Mentor junior developers
- Tech lead or senior engineer role
- Build impact products

**Learning Goals:**
- Advanced system design
- Microservices architecture
- Cloud deployment (AWS, Azure, GCP)
- DevOps practices
- Creating valuable open-source projects

**Textom Example:**
"Starting from Textom, I learned full-stack development. Next, I want to scale it to handle millions of users, adding features like E2E encryption, mobile app. Eventually, build my own product that solves real problems at scale."

---

## CODING CHALLENGES / LIVE CODING

### Q31: **Optimize this API route**
```typescript
// BEFORE: Inefficient
export async function GET(req: Request) {
  const code = new URL(req.url).pathname.split("/").pop();
  
  await connectToDatabase();
  const file = await SharedFile.findOne({ code });
  
  return new Response(file.fileData);
}

// YOUR TASK: Identify problems and fix
```

**Answer:**
```typescript
// AFTER: Optimized
export async function GET(req: Request) {
  // 1. Validate input early
  const code = new URL(req.url).pathname.split("/").pop();
  if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });

  try {
    // 2. Reuse single connection
    await connectToDatabase();
    
    // 3. Only fetch needed fields
    const file = await SharedFile.findOne({ code }).select('fileData mimeType fileName');
    
    // 4. Handle not found
    if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // 5. Decompress properly
    const decompressed = zlib.gunzipSync(file.fileData);

    // 6. Add proper headers
    return new Response(new Uint8Array(decompressed), {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
        "Cache-Control": "max-age=3600"  // Cache for 1 hour
      }
    });
  } catch (err) {
    // 7. Proper error handling
    console.error("Download error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
```

### Q32: **Fix this memory leak**
```typescript
// PROBLEM: Memory leak in component
export const ShareTextPage = () => {
  const [data, setData] = useState(null);

  // This runs on every render - creates new interval
  setInterval(() => {
    fetchData();
  }, 5000);

  return <div>{data}</div>;
};

// FIX IT
```

**Answer:**
```typescript
export const ShareTextPage = () => {
  const [data, setData] = useState(null);

  // Use useEffect for side effects
  useEffect(() => {
    // Interval runs only once after mount
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    // Cleanup: clear interval on unmount
    return () => clearInterval(interval);
  }, []);  // Empty deps = runs once

  return <div>{data}</div>;
};
```

---

## REAL-WORLD SCENARIOS

### Q21: **A user uploaded a 500MB file and the server crashed. How would you fix it?**
**Answer:**

**Root Cause:** No file size validation and entire file loaded to memory

**Solution:**

**Step 1: Add size limit validation**
```typescript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  // Validate size on client and server
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
      { status: 413 }
    );
  }

  // ... rest of logic
}
```

**Step 2: Stream large files instead of loading to memory**
```typescript
// ✗ Bad: Loads entire file to memory
const buffer = await file.arrayBuffer();

// ✓ Good: Use streams
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';

const readable = file.stream();
const compressStream = zlib.createGzip();
const writeStream = createWriteStream(`/uploads/${code}.gz`);

await pipeline(readable, compressStream, writeStream);
```

**Step 3: Add upload progress tracking**
```typescript
<div className="upload-container">
  <input 
    type="file" 
    onChange={handleFileChange}
    disabled={isUploading}
  />
  {isUploading && (
    <ProgressBar value={uploadProgress} max={100} />
  )}
</div>
```

**Step 4: Implement chunked uploads for very large files**
```typescript
export async function handleChunkedUpload(file: File) {
  const chunkSize = 5 * 1024 * 1024; // 5MB chunks
  const chunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', i.toString());
    formData.append('totalChunks', chunks.toString());
    formData.append('code', code);

    await fetch('/api/upload-chunk', {
      method: 'POST',
      body: formData
    });

    updateProgress((i + 1) / chunks * 100);
  }
}
```

### Q22: **How would you handle if the database goes down during uploads?**
**Answer:**

**Problem:** User's upload fails mid-way, data inconsistency

**Solution:**

**1. Implement Transaction-like behavior**
```typescript
export async function POST(req: Request) {
  let session;
  
  try {
    // Start a database session for transaction-like operations
    session = await mongoose.startSession();
    session.startTransaction();

    // Step 1: Store file data
    const file = await SharedFile.create(
      [{ code, fileData, mimeType }],
      { session }
    );

    // Step 2: Update metadata
    await FileMetadata.create(
      [{ code, uploadedAt: Date.now() }],
      { session }
    );

    // Step 3: Confirm transaction
    await session.commitTransaction();
    return NextResponse.json({ code });

  } catch (err) {
    // Rollback on error
    await session?.abortTransaction();
    console.error('Upload failed:', err);
    return NextResponse.json(
      { error: 'Upload failed, please retry' },
      { status: 500 }
    );
  } finally {
    await session?.endSession();
  }
}
```

**2. Implement retry logic with exponential backoff**
```typescript
async function retryUpload(uploadFn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await uploadFn();
    } catch (err) {
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      
      if (i < maxRetries - 1) {
        console.log(`Retry ${i + 1}/${maxRetries - 1} after ${delay}ms`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

// Usage
await retryUpload(() => handleChunkedUpload(file));
```

**3. Graceful degradation for users**
```typescript
const [uploadStatus, setUploadStatus] = useState('idle');

// Show status to user
{uploadStatus === 'failed' && (
  <div className="alert alert-error">
    <p>Upload failed. {attemptCount >= 3 ? 'Please try again later' : 'Retrying...'}</p>
    <button onClick={() => retryUpload()}>Retry Now</button>
  </div>
)}
```

**4. Health checks and monitoring**
```typescript
export async function GET(req: Request) {
  try {
    const health = await SharedFile.findOne({});
    return NextResponse.json({ status: 'healthy' });
  } catch (err) {
    // Alert operations team
    sendAlertToSlack(`Database down: ${err.message}`);
    
    return NextResponse.json(
      { status: 'unhealthy', message: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}
```

---

## DESIGN PATTERNS

### Q23: **Explain the Observer Pattern and how to implement it in Textom.**
**Answer:**

**Observable Pattern Concept:** One-to-many relationship where object changes notify all observers

**Real Implementation:**

```typescript
// Step 1: Define observer interface
interface Observer {
  update(data: SharedText): void;
}

// Step 2: Subject - maintains list of observers
class TextShareObservable {
  private observers: Observer[] = [];

  subscribe(observer: Observer): void {
    this.observers.push(observer);
    console.log(`Observer subscribed. Total: ${this.observers.length}`);
  }

  unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter(o => o !== observer);
    console.log(`Observer unsubscribed. Total: ${this.observers.length}`);
  }

  notifyObservers(data: SharedText): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Step 3: Concrete observers
class EmailNotifier implements Observer {
  update(data: SharedText): void {
    console.log(`📧 Email: Text shared with code ${data.code}`);
    // sendEmail(`Someone shared: ${data.code}`);
  }
}

class AnalyticsLogger implements Observer {
  update(data: SharedText): void {
    console.log(`📊 Analytics: Tracked share event for code ${data.code}`);
    // trackEvent('text_shared', { code: data.code });
  }
}

class WebSocketNotifier implements Observer {
  constructor(private io: SocketIO.Server) {}
  
  update(data: SharedText): void {
    this.io.emit('text_shared', { code: data.code });
  }
}

// Step 4: Usage
const observable = new TextShareObservable();
observable.subscribe(new EmailNotifier());
observable.subscribe(new AnalyticsLogger());

// When text is shared
export async function POST(req: Request) {
  const { content } = await req.json();
  const newShare = await SharedText.create({
    code: generateCode(),
    content
  });

  // Notify all observers
  observable.notifyObservers(newShare);

  return NextResponse.json({ code: newShare.code });
}
```

**Why this pattern for Textom?**
- Loosely couples sharing logic from notifications
- Easy to add new observers (SMS, Slack, etc.)
- Each observer independently handles its logic

### Q24: **Explain Factory Pattern with an example from Textom.**
**Answer:**

**Factory Pattern:** Create objects without specifying exact classes

**Implementation:**

```typescript
// Step 1: Define interface
interface Share {
  share(data: any): Promise<{ code: string }>;
  retrieve(code: string): Promise<any>;
  compress(): Promise<Buffer>;
}

// Step 2: Concrete implementations
class TextShare implements Share {
  async share(text: string) {
    const code = this.generateCode();
    await SharedText.create({ 
      code, 
      content: text 
    });
    return { code };
  }

  async retrieve(code: string) {
    return await SharedText.findOne({ code });
  }

  async compress(): Promise<Buffer> {
    return Buffer.from('text');  // Text usually not compressed
  }
}

class FileShare implements Share {
  async share(file: File) {
    const code = this.generateCode();
    const compressed = zlib.gzipSync(
      Buffer.from(await file.arrayBuffer())
    );
    
    await SharedFile.create({ 
      code, 
      fileData: compressed,
      mimeType: file.type
    });
    return { code };
  }

  async retrieve(code: string) {
    const file = await SharedFile.findOne({ code });
    return zlib.gunzipSync(file.fileData);
  }

  async compress(): Promise<Buffer> {
    return this.fileData;  // Already compressed
  }

  private generateCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}

// Step 3: Factory class
class ShareFactory {
  static createShare(type: 'text' | 'file'): Share {
    switch(type) {
      case 'text':
        return new TextShare();
      case 'file':
        return new FileShare();
      default:
        throw new Error(`Unknown share type: ${type}`);
    }
  }
}

// Step 4: Usage
const textShare = ShareFactory.createShare('text');
const fileShare = ShareFactory.createShare('file');

// Both implement same interface
await textShare.share('Hello World');
await fileShare.share(fileObject);
```

**Benefits:**
- Add new share types without changing existing code
- Centralized object creation
- Easy to switch implementations

---

## DATABASE OPTIMIZATION

### Q25: **How would you optimize MongoDB queries in Textom?**
**Answer:**

**Optimization Techniques:**

**1. Use Indexes on frequently searched fields**
```typescript
const sharedTextSchema = new Schema({
  code: { 
    type: String, 
    index: true,  // Single field index
    unique: true
  },
  userId: { type: String, index: true },
  createdAt: { type: Date, index: true }
});

// Compound index for multi-field queries
sharedTextSchema.index({ userId: 1, createdAt: -1 });
```

**Query performance with/without index:**
```
Without index: O(n) - scans entire collection (1000ms for 1M docs)
With index: O(log n) - binary search (5ms for 1M docs)
Result: 200x faster! ⚡
```

**2. Projection - Only fetch needed fields**
```typescript
// ✗ Bad: Fetches entire document (lots of unnecessary data)
const results = await SharedText.find({ code });

// ✓ Good: Only fetch specific fields
const results = await SharedText
  .find({ code })
  .select('code content createdAt -_id');  // Exclude _id
```

**3. Pagination - Don't load all records**
```typescript
// ✗ Bad: Loads ALL documents (memory crash for 1M+ docs)
const all = await SharedText.find({});

// ✓ Good: Paginate results
export async function GET(req: Request) {
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  const results = await SharedText
    .find()
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  return NextResponse.json(results);
}
```

**4. Aggregation Pipeline - Complex queries**
```typescript
// Get statistics without loading all data
const stats = await SharedText.aggregate([
  {
    $match: {
      createdAt: { $gte: new Date('2024-01-01') }
    }
  },
  {
    $group: {
      _id: null,
      totalShares: { $sum: 1 },
      avgContentLength: { $avg: { $strLenCP: '$content' } },
      uniqueUsers: { $addToSet: '$userId' }
    }
  },
  {
    $project: {
      _id: 0,
      totalShares: 1,
      avgContentLength: { $round: ['$avgContentLength', 2] },
      uniqueUserCount: { $size: '$uniqueUsers' }
    }
  }
]);
```

**5. Connection Pooling**
```typescript
// Mongoose automatically handles connection pooling
const options = {
  maxPoolSize: 50,    // Max connections
  minPoolSize: 10,    // Min idle connections
  socketTimeoutMS: 45000
};

await mongoose.connect(MONGODB_URI, options);
```

### Q26: **How would you handle database schema migrations?**
**Answer:**

**Scenario:** Add new field `viewCount` to SharedText

**Migration Script:**
```typescript
// scripts/migrate-add-views.ts
import mongoose from 'mongoose';
import { SharedText } from '../model/SharedText';

async function runMigration() {
  try {
    // Step 1: Connect
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📍 Connected to MongoDB');

    // Step 2: Check current state
    const totalDocs = await SharedText.countDocuments();
    console.log(`📊 Processing ${totalDocs} documents...`);

    // Step 3: Update all documents
    const result = await SharedText.updateMany(
      {},  // Match all
      { 
        $set: { 
          viewCount: 0,  // Add field with default
          lastViewed: null
        } 
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} documents`);

    // Step 4: Verify migration
    const sample = await SharedText.findOne({});
    console.log('📋 Sample document:', sample);

    // Step 5: Add index on new field
    await SharedText.collection.createIndex({ viewCount: -1 });
    console.log('📑 Index created on viewCount');

    await mongoose.disconnect();
    console.log('✋ Migration complete!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
```

**Run migration:**
```bash
npx ts-node scripts/migrate-add-views.ts
```

**Backward compatibility pattern:**
```typescript
// Old documents might not have viewCount
const getViewCount = (doc: any): number => {
  return doc.viewCount ?? 0;  // Default to 0 if not exists
};

// Or use schema defaults
const sharedTextSchema = new Schema({
  viewCount: { 
    type: Number, 
    default: 0  // MongoDB sets this for new docs
  }
});
```

---

## ADVANCED REACT PATTERNS

### Q27: **Explain React Context vs Props vs Custom Hooks - when to use each?**
**Answer:**

**1. Props (Top-down data flow)**
✓ Use when: Simple hierarchy, data changes frequently, clear ownership
✗ Problems: Prop drilling (passing through many levels)

```typescript
// ✗ Prop drilling - ugly and hard to maintain
<Parent data={data}>
  <Child data={data}>
    <GrandChild data={data}>
      <GreatGrandChild data={data} />
    </GrandChild>
  </Child>
</Parent>
```

**2. Context (Global state)**
✓ Use when: Data shared across MANY components (theme, auth, language)
✗ Problems: Causes re-renders of all consumers, harder to debug

```typescript
// ✓ Better: Use Context
const ThemeContext = createContext('light');

<ThemeProvider value="dark">
  <App />
</ThemeProvider>

// Any component can access
const Theme = () => {
  const theme = useContext(ThemeContext);
  return <div className={theme}>...</div>;
};
```

**3. Custom Hooks (Reusable logic)**
✓ Use when: Share business logic across components
✗ Problems: Only for logic, not rendering

```typescript
// Share logic without props
const useShareText = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleShare = async (text: string) => {
    // Logic here
  };

  return { code, isLoading, handleShare };
};

// Use in multiple components
const ShareTextPage = () => {
  const { code, handleShare } = useShareText();
  // ...
};

const ShareModal = () => {
  const { code, handleShare } = useShareText();
  // ...
};
```

**Best Practice - Combine all three:**
```typescript
// 1. Global state with Context
const AppContext = createContext<AppContextType | null>(null);

// 2. Custom hook to access context
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('Must be used within AppProvider');
  }
  return context;
};

// 3. Use hook in components
const MyComponent = () => {
  const { theme, toggleTheme } = useAppContext();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
};
```

**Decision Tree:**
```
Data shared across 2-3 components?
  → Props ✓

Data shared across 5+ components (theme, auth, user)?
  → Context ✓

Business logic (API calls, state management)?
  → Custom Hook ✓

How to avoid re-renders?
  → useMemo + useCallback
```

### Q28: **How would you prevent unnecessary re-renders in Textom?**
**Answer:**

**Problem:** CodeInput re-renders entire component hierarchy when user types

**Solutions:**

**1. useMemo - Memoize expensive computations**
```typescript
const CodeInput = ({ codes }: { codes: string[] }) => {
  // Without useMemo: recalculates on every render
  // const sortedCodes = codes.sort().reverse();

  // With useMemo: only recalculates when 'codes' changes
  const sortedCodes = useMemo(() => {
    console.log('Computing sorted codes...');
    return codes.sort().reverse();
  }, [codes]);

  return (
    <div>
      {sortedCodes.map(code => (
        <div key={code}>{code}</div>
      ))}
    </div>
  );
};
```

**2. useCallback - Memoize functions**
```typescript
const Parent = () => {
  // Without useCallback: new function on every render
  // const handleShare = () => setSharedCodes([...sharedCodes, code]);

  // With useCallback: reused function
  const handleShare = useCallback(() => {
    setSharedCodes(prev => [...prev, code]);
  }, [code]);

  // Child only re-renders if handleShare changes
  return <Child onShare={handleShare} />;
};

const Child = React.memo(({ onShare }) => (
  <button onClick={onShare}>Share</button>
));
```

**3. React.memo - Prevent component re-renders**
```typescript
// Without memo: always re-renders even if props same
const CodeDisplay = ({ code }) => (
  <div>{code}</div>
);

// With memo: only re-renders if props change
export default React.memo(CodeDisplay);

// Custom comparison
export default React.memo(CodeDisplay, (prev, next) => {
  return prev.code === next.code;  // true = skip re-render
});
```

**4. Separate state - Keep state close to where it's used**
```typescript
// ✗ Bad: Parent re-renders, all children re-render
const Parent = () => {
  const [filter, setFilter] = useState('');
  
  return (
    <>
      <SearchBar value={filter} onChange={setFilter} />
      <HugeList />      {/* Unnecessary re-render */}
      <Sidebar />       {/* Unnecessary re-render */}
    </>
  );
};

// ✓ Good: Separate components with own state
const SearchBar = () => {
  const [filter, setFilter] = useState('');
  return <input value={filter} onChange={e => setFilter(e.target.value)} />;
};

// Now HugeList and Sidebar don't re-render
```

**Real Example from Textom:**
```typescript
export const CodeInput = () => {
  // Keep input state here, not in parent
  const [view, setView] = useState<'code' | 'file'>('code');
  
  const handleViewChange = useCallback((newView: 'code' | 'file') => {
    setView(newView);
    // Only this component re-renders
  }, []);

  return (
    <div>
      <motion.button onClick={() => handleViewChange('code')}>
        Get Text
      </motion.button>
      {view === 'code' && <GetText />}
      {view === 'file' && <FileGet />}
    </div>
  );
};
```

---

## FINAL TIPS FOR INTERVIEW

1. **Explain Why, Not Just How** - Interviewers want to see your reasoning
2. **Use Examples** - Reference specific code from Textom
3. **Think Out Loud** - Share your thought process
4. **Ask Questions** - Show curiosity and clarify requirements
5. **Admit Limitations** - Be honest about what you don't know
6. **Suggest Improvements** - Show you think beyond requirements
7. **Practice Coding** - Be ready to write code under pressure
8. **Discuss Trade-offs** - Everything has pros and cons
9. **Focus on Learning** - Interviews test growth mindset too
10. **Be Confident** - You built a working full-stack app!

---

**Good luck with your TCS Prime interview! 🚀**

Remember: Be yourself, show your thought process, and demonstrate your passion for learning and building great software.
