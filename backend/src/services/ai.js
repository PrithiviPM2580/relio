import { GoogleGenAI } from "@google/genai";
import { APIError } from "../utils/api-error.js";

let client = null;

const getClient = () => {
	const apiKey = process.env.GEMINI_API_KEY;

	if (!apiKey) {
		throw new APIError(503, "Gemini API key is not configured add gemini key.");
	}

	if (!client) client = new GoogleGenAI({ apiKey });
	return client;
};

const MODEL = () => process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const isAiConfigured = () => Boolean(process.env.GEMINI_API_KEY);

const generateJson = async (prompt, schema) => {
	const ai = getClient();

	try {
		const response = await ai.models.generateContent({
			model: MODEL(),
			contents: prompt,
			config: {
				responseMimeType: "application/json",
				responseSchema: schema,
				temperature: 0.6,
			},
		});

		return JSON.parse(response.text);
	} catch (error) {
		console.error("Gemini Json error: ", error?.message || error);
		throw new APIError(502, "Ai request failed. Please try again in a moment");
	}
};

export const generateText = async (prompt, temperature = 0.7) => {
	const ai = getClient();

	try {
		const response = await ai.models.generateContent({
			model: MODEL(),
			contents: prompt,
			config: { temperature },
		});

		return response.text.trim();
	} catch (error) {
		console.error("Gemini text error: ", error?.message || error);
		throw new APIError(502, "AI request failed. Please try again later");
	}
};

export const generateLeadSummary = async (lead) => {
	const prompt = `You are an expert B2B sales analyst for a CRM calles TTP CRM.
     Analyze the following sales lead and produce a concise assessment.

     Lead details:
     - Name: ${lead.name || "N/A"},
     - Company: ${lead.company || "N/A"},
     - Email: ${lead.email || "N/A"},
     - Current pipline stage: ${lead.status || "New"},
     - Potential deal value: ${lead.value || 0},
     - Source: ${lead.source || "Unknown"},
     - Notes: ${lead.notes || "None"}

     Return JSON only.
     `;

	const schema = {
		type: "object",
		properties: {
			summary: {
				type: "string",
				description: "2-3 sentence executive summary of the lead",
			},
			riskScore: {
				type: "integer",
				description: "Risk of losing this deal, 0 (safe) to 100 (high risk)",
			},
			suggestedPriority: {
				type: "string",
				enum: ["Low", "Medium", "High"],
			},
			nextBestAction: {
				type: "string",
				description: "One concrete recommended next step",
			},
		},
		required: ["summary", "riskScore", "suggestedpriority", "nextBestAction"],
	};

	return generateJson(prompt, schema);
};

export const generateEmail = async ({ lead, purpose, tone, sender }) => {
	const prompt = `You are a senior sales rep writing on behalf of 
    ${sender?.name || "Our team"}, ${sender?.company ? `at ${sender?.company}` : ""}

    Write a professional sales email.
    Purpose: ${purpose || "follow-up"}
    Desired tone: ${tone || "friendly and professional"}

    Recipient (lead) details:
    - Name: ${lead?.name || "there"}
    - Company: ${lead?.company || "N/A"}
    - Pipeline stage: ${lead?.status || "New"},
    - Context / notes: ${lead?.notes || "None"}
    
    Return JSON only with a compelling subject line and a complete email body.
    Use line breaks (\\n) in the body, keep it under 100 words. Sign off as
    ${sender?.name || "the TTP CRM team"}
    `;

	const schema = {
		type: "object",
		properties: {
			subject: { type: "string" },
			body: { type: "string" },
		},
		required: ["subject", "body"],
	};

	return generateJson(prompt, schema);
};

export const generateSlaesInsight = async (pipelineStats) => {
	const prompt = `You are a revenue-operations advisor. Given the snapshot of a 
    slae pipeline, identify what is working, what is at risk, and concrete actions
    to improve conversion.

    Pipeline snapshot (JSON);
    ${JSON.stringify(pipelineStats, null, 2)}

    return JSON only
    `;

	const schema = {
		type: "object",
		properties: {
			headline: {
				type: "string",
				description: "One-sentence summary of pipeline health",
			},
			insights: {
				type: "array",
				description: "3-5 specific, data-drive observations",
				items: { type: "string" },
			},
			recommendations: {
				type: "string",
				description: "3-5 priotrized, actionable recommendations",
				items: { type: "string" },
			},
			healthScore: {
				type: "integer",
				description: "Overall pipeline health, 0-100",
			},
		},
		required: ["headline", "insights", "recommendations", "healthScore"],
	};

	return generateJson(prompt, schema);
};
