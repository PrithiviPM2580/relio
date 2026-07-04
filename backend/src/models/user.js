import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minLength: [6, "Password must be at least 6 characterstics"],
			select: false,
		},
		role: {
			type: String,
			enum: ["owner", "member"],
			default: "member",
		},
		company: {
			type: String,
			trim: true,
			default: "",
		},
		avatar: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	},
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
	return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
