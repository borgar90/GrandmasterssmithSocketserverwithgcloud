const mongoose = require("mongoose");
const { NewUserSchema } = require("./User");

const User = mongoose.model("users", NewUserSchema);

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  eloMin: Number,
  eloMax: Number,
  players: [
    {
      socketId: String,
      player: {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        photo: String,
      },
      role: String,
      color: String,
    },
  ],
  spectators: Array,
  bannedSpectators: Array,
  active: {
    type: Boolean,
    default: true,
  },
});

const Room = mongoose.model("Room", roomSchema);

// Save a new room
const saveRoom = async (roomData) => {
  const room = new Room(roomData);
  await room.save();
  return room;
};

const updateRoom = async (roomData) => {
  try {
    const room = await Room.updateOne({ _id: roomData._id }, roomData);
    console.log(room);
  } catch (err) {
    console.error(err);
  }
};

// Retrieve all rooms
async function getAllRooms() {
  try {
    const rooms = await Room.find({ active: true })
      .populate({
        path: "players.player.elo",
        strictPopulate: false,
      })
      .exec();

    if (!rooms) return [];
    return rooms;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getAllRoomsWithUser(id) {
  try {
    // Ensure the user ID is correctly formatted as a MongoDB ObjectId
    const validUserId = new mongoose.Types.ObjectId(id);

    // Query to find rooms where the user is a player and the room is active
    const room = await Room.findOne({
      "players.player._id": validUserId,
      active: true,
    });

    return room;
  } catch (err) {
    console.error("Error fetching rooms with user:", err);
    return null;
  }
}

const getRoom = async (id) => {
  try {
    const rooms = await Room.findOne({ _id: id, active: true }).populate({
      path: "players.player.elo",
      strictPopulate: false,
    });

    if (!rooms) return {};
    return rooms;
  } catch (err) {
    console.error(err);
    return {};
  }
};
const deleteRoom = async (id) => {
  try {
    await Room.deleteOne({ _id: id });
  } catch (err) {
    console.error(err);
    return {};
  }
};
module.exports = {
  Room,
  saveRoom,
  getAllRooms,
  getRoom,
  updateRoom,
  deleteRoom,
  getAllRoomsWithUser,
};
