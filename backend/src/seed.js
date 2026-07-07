import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";
import Lead from "./models/lead.js";
import Contact from "./models/contact.js";
import Note from "./models/note.js";
import Task from "./models/task.js";

dotenv.config();

async function seedDatabase() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB");

		// Clear existing data
		await User.deleteMany({});
		await Lead.deleteMany({});
		await Contact.deleteMany({});
		await Note.deleteMany({});
		await Task.deleteMany({});
		console.log("Cleared existing data");

		// Create users
		const users = await User.create([
			{
				name: "John Doe",
				email: "john@example.com",
				password: "password123",
				role: "owner",
				company: "Relio Inc",
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
			},
			{
				name: "Jane Smith",
				email: "jane@example.com",
				password: "password123",
				role: "member",
				company: "Relio Inc",
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
			},
		]);
		console.log("✓ Created 2 users");

		const ownerId = users[0]._id;

		// Create leads
		const leads = await Lead.create([
			{
				owner: ownerId,
				name: "Acme Corporation",
				email: "contact@acme.com",
				phone: "+1-555-0101",
				company: "Acme Corp",
				status: "Qualified",
				prority: "High",
				source: "Website",
				value: 50000,
				tags: ["enterprise", "b2b"],
				notes: "Large potential deal, interested in our premium package",
				order: 0,
			},
			{
				owner: ownerId,
				name: "TechStart Inc",
				email: "sales@techstart.io",
				phone: "+1-555-0102",
				company: "TechStart",
				status: "New",
				prority: "Medium",
				source: "Cold Outereach",
				value: 25000,
				tags: ["startup"],
				notes: "Cold outreach response, early stage interest",
				order: 1,
			},
			{
				owner: ownerId,
				name: "Global Solutions Ltd",
				email: "info@globalsolutions.com",
				phone: "+1-555-0103",
				company: "Global Solutions",
				status: "Proposal",
				prority: "High",
				source: "Referral",
				value: 75000,
				tags: ["enterprise", "high-value"],
				notes: "Referred by existing customer, sent proposal last week",
				order: 2,
			},
			{
				owner: ownerId,
				name: "Innovation Labs",
				email: "contact@innovlabs.com",
				phone: "+1-555-0104",
				company: "Innovation Labs",
				status: "Won",
				prority: "Medium",
				source: "Event",
				value: 40000,
				tags: ["completed"],
				notes: "Closed deal - contract signed",
				order: 3,
			},
			{
				owner: ownerId,
				name: "DataFlow Systems",
				email: "info@dataflow.io",
				phone: "+1-555-0105",
				company: "DataFlow",
				status: "Lost",
				prority: "Low",
				source: "Social",
				value: 15000,
				tags: ["lost"],
				notes: "Customer chose competitor",
				order: 4,
			},
			{
				owner: ownerId,
				name: "NextGen Marketing",
				email: "hello@nextgenmarketing.com",
				phone: "+1-555-0106",
				company: "NextGen Marketing",
				status: "Qualified",
				prority: "Medium",
				source: "Website",
				value: 35000,
				tags: ["marketing", "sme"],
				notes: "Mid-sized marketing agency, good fit for our services",
				order: 5,
			},
		]);
		console.log("✓ Created 6 leads");

		// Create contacts
		const contacts = await Contact.create([
			{
				owner: ownerId,
				name: "Sarah Johnson",
				email: "sarah.johnson@acme.com",
				phone: "+1-555-1001",
				company: "Acme Corporation",
				title: "VP of Sales",
				tags: ["decision-maker"],
				notes: "Key contact, handles purchasing decisions",
			},
			{
				owner: ownerId,
				name: "Michael Chen",
				email: "m.chen@techstart.io",
				phone: "+1-555-1002",
				company: "TechStart Inc",
				title: "CTO",
				tags: ["technical", "key-contact"],
				notes: "Technical lead, very responsive",
			},
			{
				owner: ownerId,
				name: "Emily Rodriguez",
				email: "emily@globalsolutions.com",
				phone: "+1-555-1003",
				company: "Global Solutions Ltd",
				title: "Operations Director",
				tags: ["operations"],
				notes: "Handles vendor relationships",
			},
			{
				owner: ownerId,
				name: "David Park",
				email: "david.park@innovlabs.com",
				phone: "+1-555-1004",
				company: "Innovation Labs",
				title: "Founder & CEO",
				tags: ["founder", "decision-maker"],
				notes: "Primary contact, very engaged",
				favorites: true,
			},
			{
				owner: ownerId,
				name: "Lisa Anderson",
				email: "l.anderson@dataflow.io",
				phone: "+1-555-1005",
				company: "DataFlow Systems",
				title: "Manager",
				tags: ["manager"],
				notes: "Initial contact person",
			},
			{
				owner: ownerId,
				name: "James Wilson",
				email: "james@nextgenmarketing.com",
				phone: "+1-555-1006",
				company: "NextGen Marketing",
				title: "Business Development",
				tags: ["business-dev"],
				notes: "Responsible for vendor evaluation",
			},
		]);
		console.log("✓ Created 6 contacts");

		// Create notes
		await Note.create([
			{
				owner: ownerId,
				content:
					"Follow up on pricing discussion from yesterday. They need enterprise features.",
				lead: leads[0]._id,
				pinned: true,
			},
			{
				owner: ownerId,
				content: "Send technical documentation and case studies to Michael",
				lead: leads[1]._id,
				pinned: false,
			},
			{
				owner: ownerId,
				content:
					"Schedule demo for next Tuesday at 2 PM. Emily requested case studies first.",
				lead: leads[2]._id,
				pinned: true,
			},
			{
				owner: ownerId,
				content:
					"Excellent collaboration throughout the process. Onboarding starts next month.",
				lead: leads[3]._id,
				pinned: false,
			},
			{
				owner: ownerId,
				content:
					"Remember to send thank you note after loss. Keep door open for future.",
				lead: leads[4]._id,
				pinned: false,
			},
			{
				owner: ownerId,
				content:
					"Connected with James at marketing conference. Very interested in platform.",
				contact: contacts[5]._id,
				pinned: false,
			},
		]);
		console.log("✓ Created 6 notes");

		// Create tasks
		const now = new Date();
		const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
		const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
		const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

		await Task.create([
			{
				owner: ownerId,
				title: "Follow up with Acme Corporation",
				description:
					"Send pricing proposal and answer their questions about enterprise tier",
				dueDate: tomorrow,
				status: "Pending",
				priority: "High",
				relatedLead: leads[0]._id,
			},
			{
				owner: ownerId,
				title: "Prepare technical demo for TechStart",
				description:
					"Create customized demo showing key features they requested",
				dueDate: nextWeek,
				status: "In Progress",
				priority: "High",
				relatedLead: leads[1]._id,
			},
			{
				owner: ownerId,
				title: "Send Global Solutions contract",
				description:
					"Finalize and send contract for proposal accepted last week",
				dueDate: tomorrow,
				status: "Pending",
				priority: "High",
				relatedLead: leads[2]._id,
			},
			{
				owner: ownerId,
				title: "Schedule onboarding call with Innovation Labs",
				description:
					"Coordinate with success team to schedule initial onboarding",
				dueDate: nextWeek,
				status: "Pending",
				priority: "Medium",
				relatedLead: leads[3]._id,
				completedAt: null,
			},
			{
				owner: ownerId,
				title: "Research NextGen Marketing industry trends",
				description: "Understand their market and identify potential use cases",
				dueDate: twoWeeks,
				status: "Pending",
				priority: "Medium",
				relatedLead: leads[5]._id,
			},
			{
				owner: ownerId,
				title: "Update CRM with contact information",
				description: "Add newly discovered contact from Acme to system",
				dueDate: tomorrow,
				status: "Completed",
				priority: "Low",
				relatedContact: contacts[0]._id,
				completedAt: new Date(),
			},
		]);
		console.log("✓ Created 6 tasks");

		console.log("\n✅ Database seeded successfully!");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	}
}

seedDatabase();
