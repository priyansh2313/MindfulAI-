export const fetchChatResponse = async (userMessage: string): Promise<string> => {
	try {
		const res = await fetch("https://mindfulai-wv9z.onrender.com/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_input: userMessage }),
		});

		// Check if response is ok
		if (!res.ok) {
			console.error(`API Error: ${res.status} ${res.statusText}`);
			return "⚠️ I'm having trouble connecting right now. Please try again later.";
		}

		// Check if response is JSON
		const contentType = res.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			console.error("API returned non-JSON response:", contentType);
			return "⚠️ Service temporarily unavailable. Please try again later.";
		}

		const data = await res.json();
		return data.response || "⚠️ Unable to respond.";
	} catch (error) {
		console.error("Chat API Error:", error);
		return "⚠️ I'm having trouble connecting right now. Please try again later.";
	}
};
  


  