// controllers/chatController.js
const Order    = require('../models/Order');
const Cart     = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const User     = require('../models/User');
const jwt      = require('jsonwebtoken');

// ── Helper: extract user from token if present ─────────────────────
const getUserFromToken = async (req) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer')) return null;
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    return await User.findById(decoded.id).select('-password');
  } catch {
    return null;
  }
};

// ── Helper: build context string about the user ────────────────────
const buildUserContext = async (user) => {
  if (!user) return 'The user is not logged in (guest).';

  let context = `User name: ${user.name}. Email: ${user.email}.`;
  if (user.phone)         context += ` Phone: ${user.phone}.`;
  if (user.address?.city) context += ` Address: ${[user.address.line1, user.address.city, user.address.state, user.address.postalCode, user.address.country].filter(Boolean).join(', ')}.`;

  // Orders
  const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(5);
  if (orders.length) {
    context += ` Recent orders (${orders.length}): `;
    context += orders.map(o =>
      `Order #${o._id.toString().slice(-6).toUpperCase()} — Status: ${o.status} — Total: ₹${o.totalPrice} — Items: ${o.orderItems.map(i => i.name).join(', ')}`
    ).join(' | ');
  } else {
    context += ' No orders placed yet.';
  }

  // Cart
  const cart = await Cart.findOne({ user: user._id });
  if (cart && cart.items.length) {
    context += ` Cart has ${cart.items.length} item(s): `;
    context += cart.items.map(i => `${i.name} x${i.qty} (₹${i.price})`).join(', ');
    const total = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
    context += `. Cart total: ₹${total}.`;
  } else {
    context += ' Cart is empty.';
  }

  // Wishlist
  const wishlist = await Wishlist.findOne({ user: user._id }).populate('items', 'name price');
  if (wishlist && wishlist.items.length) {
    context += ` Wishlist has ${wishlist.items.length} item(s): ${wishlist.items.map(i => i.name).join(', ')}.`;
  } else {
    context += ' Wishlist is empty.';
  }

  return context;
};

// ── POST /api/chat ──────────────────────────────────────────────────
exports.getChatResponse = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ reply: 'No message provided.' });

    const user        = await getUserFromToken(req);
    const userContext = await buildUserContext(user);

    const systemPrompt = `You are "The Archivist", the intelligent shopping assistant for MINIKART — a premium minimalist e-commerce platform selling electronics, home needs, sanitary products, laptops, and festival offers.

Your personality: sophisticated, helpful, concise, slightly formal but warm. You speak like a knowledgeable curator, not a generic chatbot.

Store information:
- Free shipping on orders above ₹999
- 30-day hassle-free returns
- Payment methods: Stripe (online) and Cash on Delivery (COD)
- Categories: Home Needs, Sanitary, Laptops, Electronics, Stores, Festival Offers
- Contact: hello@minikart.studio

Current user context:
${userContext}

Rules:
- Use the user context to give personalised answers (e.g. tell them their order status, cart total, wishlist items)
- If the user asks about their orders, cart, or wishlist — answer from the context above
- Keep replies concise (2-4 sentences max) unless they ask for detail
- Never make up order IDs or product details not in the context
- If user is a guest, encourage them to sign in for personalised help
- Always stay on topic (MINIKART store related queries)
- Format currency as ₹`;

    // Build messages array for Groq
    const messages = [
      ...history.slice(-10).map(m => ({
        role:    m.role === 'bot' ? 'assistant' : 'user',
        content: m.text,
      })),
      { role: 'user', content: message },
    ];

    // Call Groq API (free, no credit card needed)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model:       'llama-3.1-8b-instant', // free model on Groq
        max_tokens:  400,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq API error:', err);
      return res.status(500).json({ reply: 'The archive is temporarily unavailable. Please try again.' });
    }

    const data  = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'I could not process that. Please try again.';

    res.status(200).json({ reply });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ reply: 'The connection to the archive is currently undergoing maintenance.' });
  }
};