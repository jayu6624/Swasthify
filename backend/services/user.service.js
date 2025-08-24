const userModel = require("../models/user.model");
const Profile = require("../models/profile.model"); // dd this import

module.exports.createUser = async ({ name, age, gender, email, number, password }) => {
  if (!name || !age || !gender || !email || !number || !password) {
    throw new Error("All fields are required");
  }

  // Hash the password before saving
  const hashedPassword = await userModel.hashPassword(password);

  // Create the user
  const user = await userModel.create({
    name,
    age,
    gender,
    email,
    number,
    password: hashedPassword,
  });

  // Create profile for the user
  try {
    // Create a new profile document
    const newProfile = new Profile({
      user: user._id,
      height: 0, // Default value
      weight: 0, // Default value
      age,
      gender
    });
    
    // Save the profile
    await newProfile.save();
    console.log(`Profile created for user: ${user._id}`);
  } catch (profileError) {
    // Log the error but don't throw - we don't want to fail user creation if profile creation fails
    console.error(`Failed to create profile for user ${user._id}:`, profileError.message);
  }

  return user;
};

module.exports.getUserByEmail = async (email) => {
  return await userModel.findOne({ email }).select("+password");
};

module.exports.getUserById = async (id) => {
  return await userModel.findById(id);
};

module.exports.updateUser = async (id, updateData) => {
  return await userModel.findByIdAndUpdate(id, updateData, { new: true });
};

module.exports.deleteUser = async (id) => {
  return await userModel.findByIdAndDelete(id);
};
