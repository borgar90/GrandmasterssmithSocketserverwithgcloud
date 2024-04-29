/**
 * @description Cors options for serveren
 * @author Borgar Flaen Stensrud
 */
const corsOptions = {
  origin: ["https://app-2000-gruppe04.vercel.app/"],
  methods: ["GET", "POST"],
};

exports.corsOptions = corsOptions;
