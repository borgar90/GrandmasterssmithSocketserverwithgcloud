const corsOptions = {
  origin: "http://localhost:3000", // Match the frontend's domain
  methods: ["GET", "POST", "create", "connection"],
  credentials: false, // Allow cookies and other credentials
};

exports.corsOptions = corsOptions;
