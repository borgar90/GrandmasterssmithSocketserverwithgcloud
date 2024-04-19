const corsOptions = {
  origin: ["http://localhost:3000", "https://grandmasterssmith.ngrok.app"], // Match the frontend's domain
  methods: ["GET", "POST"], // Only allow GET and POST requests
  WebTransport: ["*"],
};

exports.corsOptions = corsOptions;
