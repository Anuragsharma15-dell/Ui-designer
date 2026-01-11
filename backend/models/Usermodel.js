const UserSchema = new mongoose.Schema({
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    email: String,
    role: {
      type: String,
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  export default mongoose.model("User", UserSchema);
  