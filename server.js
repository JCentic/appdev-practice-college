import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Security and CORS middleware
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Campus Equipment Borrowing System API is running',
    timestamp: new Date().toISOString()
  });
});

// In-memory equipment inventory dataset
const initialEquipment = [
  {
    id: 1,
    name: 'Dell Latitude 5420 Laptop',
    category: 'Laptops & Computing',
    code: 'EQ-LAP-001',
    description: 'Intel Core i5-1145G7, 16GB DDR4 RAM, 512GB NVMe SSD, 14" FHD display. Pre-installed with programming tools.',
    status: 'Available'
  },
  {
    id: 2,
    name: 'MacBook Pro 14" (M2 Pro)',
    category: 'Laptops & Computing',
    code: 'EQ-LAP-002',
    description: 'Apple M2 Pro chip, 16GB Unified Memory, 512GB SSD. Reserved for iOS development and multimedia coursework.',
    status: 'Reserved'
  },
  {
    id: 3,
    name: 'Lenovo ThinkPad E14 Gen 4',
    category: 'Laptops & Computing',
    code: 'EQ-LAP-003',
    description: 'AMD Ryzen 5 5625U, 16GB RAM, 512GB SSD. Assigned to student capstone team for software testing.',
    status: 'Borrowed'
  },
  {
    id: 4,
    name: 'Epson PowerLite FH52 Full HD Projector',
    category: 'Audio & Visual',
    code: 'EQ-PRJ-001',
    description: '4,000 lumens color/white brightness, 1080p Full HD projection with HDMI and wireless streaming capability.',
    status: 'Available'
  },
  {
    id: 5,
    name: 'Sony Alpha a7 IV Mirrorless Camera',
    category: 'Audio & Visual',
    code: 'EQ-CAM-001',
    description: '33MP full-frame Exmor R sensor, 4K 60p recording, 28-70mm f/3.5-5.6 OSS kit lens for documentary and campus media.',
    status: 'Borrowed'
  },
  {
    id: 6,
    name: 'Shure BLX288/PG58 Dual Wireless Mic System',
    category: 'Audio & Visual',
    code: 'EQ-MIC-001',
    description: 'Dual channel wireless receiver with two handheld PG58 vocal microphones for symposiums and department seminars.',
    status: 'Available'
  },
  {
    id: 7,
    name: 'Canon EOS Rebel T7 DSLR Camera',
    category: 'Audio & Visual',
    code: 'EQ-CAM-002',
    description: '24.1MP APS-C sensor with 18-55mm IS II lens kit. Scheduled for periodic sensor cleaning and lens calibration.',
    status: 'Under Maintenance'
  },
  {
    id: 8,
    name: 'Rigol DS1054Z Digital Oscilloscope',
    category: 'Laboratory & Electronics',
    code: 'EQ-LAB-001',
    description: '50 MHz bandwidth, 4 analog channels, 1 GSa/s real-time sample rate for circuit debugging and waveform analysis.',
    status: 'Available'
  },
  {
    id: 9,
    name: 'Hakko FX-888D Digital Soldering Station',
    category: 'Laboratory & Electronics',
    code: 'EQ-LAB-002',
    description: 'Adjustable temperature control (120°F to 899°F) with ceramic heating element and brass cleaning sponge.',
    status: 'Reserved'
  },
  {
    id: 10,
    name: 'Arduino Mega 2560 Ultimate Sensor Kit',
    category: 'Laboratory & Electronics',
    code: 'EQ-LAB-003',
    description: 'ATmega2560 microcontroller bundle containing 37 sensor modules, jumper cables, LCD display, and breadboard.',
    status: 'Borrowed'
  },
  {
    id: 11,
    name: 'Cisco Catalyst 2960-X 24-Port Switch',
    category: 'Networking & Cables',
    code: 'EQ-NET-001',
    description: 'Enterprise-grade 24-port Gigabit Ethernet managed switch for networking lab configurations and packet routing.',
    status: 'Available'
  },
  {
    id: 12,
    name: 'Anker USB-C 8-in-1 Dual 4K HDMI Hub',
    category: 'Networking & Cables',
    code: 'EQ-NET-002',
    description: 'Dual HDMI (4K@60Hz), 100W Power Delivery, Gigabit Ethernet, SD card slot, and 2x USB-A 3.0 ports.',
    status: 'Available'
  },
  {
    id: 13,
    name: 'ViewSonic PA503W WXGA Projector',
    category: 'Audio & Visual',
    code: 'EQ-PRJ-002',
    description: '3,800 lumens WXGA projector. Lamp replacement in progress in department technical workshop.',
    status: 'Under Maintenance'
  }
];

let equipment = [...initialEquipment];

// Equipment catalog endpoint
app.get('/api/equipment', (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    let filtered = equipment;

    if (category && category !== 'All' && category !== 'All Categories') {
      filtered = filtered.filter(
        item => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (status && status !== 'All' && status !== 'All Statuses') {
      filtered = filtered.filter(
        item => item.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    res.json({
      status: 'success',
      data: filtered,
      count: filtered.length,
      total: equipment.length
    });
  } catch (err) {
    next(err);
  }
});

// In-memory borrow requests dataset
let requests = [];
let nextRequestId = 1;

// Get all borrow requests endpoint
app.get('/api/requests', (req, res, next) => {
  try {
    res.json({
      status: 'success',
      data: requests,
      count: requests.length
    });
  } catch (err) {
    next(err);
  }
});

// Submit borrow request endpoint (Phase 03)
app.post('/api/requests', (req, res, next) => {
  try {
    const { equipmentId, borrowerName, borrowerRole, startDate, dueDate, purpose } = req.body;

    // Validate required fields exist
    if (
      equipmentId === undefined ||
      equipmentId === null ||
      !borrowerName ||
      !borrowerRole ||
      !startDate ||
      !dueDate ||
      !purpose
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required: equipmentId, borrowerName, borrowerRole, startDate, dueDate, and purpose.'
      });
    }

    const trimmedBorrowerName = String(borrowerName).trim();
    const trimmedBorrowerRole = String(borrowerRole).trim();
    const trimmedPurpose = String(purpose).trim();

    if (!trimmedBorrowerName || !trimmedBorrowerRole || !trimmedPurpose) {
      return res.status(400).json({
        status: 'error',
        message: 'Borrower name, role, and purpose cannot be empty.'
      });
    }

    // Verify equipment exists
    const item = equipment.find(eq => eq.id === Number(equipmentId));
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: `Equipment with ID ${equipmentId} was not found.`
      });
    }

    // Verify equipment is Available
    if (item.status !== 'Available') {
      return res.status(400).json({
        status: 'error',
        message: `Equipment "${item.name}" is currently ${item.status} and cannot be requested for borrowing.`
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const due = new Date(dueDate);

    if (isNaN(start.getTime()) || isNaN(due.getTime())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid startDate or dueDate format. Please provide valid date strings.'
      });
    }

    if (due < start) {
      return res.status(400).json({
        status: 'error',
        message: 'The expected return date (dueDate) cannot be earlier than the start date.'
      });
    }

    const newRequest = {
      id: nextRequestId++,
      equipmentId: item.id,
      equipmentName: item.name,
      borrowerName: trimmedBorrowerName,
      borrowerRole: trimmedBorrowerRole,
      startDate: String(startDate),
      dueDate: String(dueDate),
      purpose: trimmedPurpose,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    requests.push(newRequest);

    return res.status(201).json({
      status: 'success',
      message: 'Borrow request submitted successfully.',
      data: newRequest
    });
  } catch (err) {
    next(err);
  }
});

// Catch-all 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
});
