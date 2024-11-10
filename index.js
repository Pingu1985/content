const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/generate', async (req, res) => {
    try {
        const { template, originalPost } = req.body;
        
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const templatePrompts = {
            authority: `Create an AUTHORITY POST using this original post as reference:
                ${originalPost}
                
                Follow this structure:
                1. HOOK: Create a curious/shocking statement about their desire/outcome
                2. List their false beliefs
                3. Describe their motor actions
                4. End with an empowering question/statement`,
            offer: `Create an OFFER POST using this original post as reference:
                ${originalPost}
                
                Follow this structure:
                1. Start with [OFFER]
                2. Speak to their DESIRES and OUTCOMES
                3. List 3-5 bullet points of achievable outcomes
                4. End with a clear CTA`,
            pastor: `Create a PASTOR POST using this original post as reference:
                ${originalPost}`,
            standard: `Create a STANDARD POST using this original post as reference:
                ${originalPost}`,
            story: `Create a STORY POST using this original post as reference:
                ${originalPost}`,
            sundayNight: `Create a SUNDAY NIGHT POST using this original post as reference:
                ${originalPost}`,
            value: `Create a VALUE POST using this original post as reference:
                ${originalPost}`
        };

        const message = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1000,
            temperature: 0.7,
            system: "You are an expert content creator for aspiring entrepreneurs.",
            messages: [{
                role: "user",
                content: templatePrompts[template]
            }]
        });

        res.json({ content: message.content[0].text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
