import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		name: {
			type: String,
			required: [true, "Contact is requird"],
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			lowecase: true,
			default: "",
		},
		phone: {
			type: String,
			trim: true,
			default: "",
		},
		company: {
			type: String,
			trim: true,
			default: "",
		},
		title: {
			type: String,
			trim: true,
			default: "",
		},
		tags: [{ type: String, trim: true }],
		notes: {
			type: String,
			default: "",
		},
		favorites: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

contactSchema.index({ name: "text", email: "text", company: "text" });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
