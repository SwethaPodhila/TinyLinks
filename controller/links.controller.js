import Link from "../models/Links.js";

// Generate short code (6 chars) — returns alphanumeric
function generateCode() {
    return Math.random().toString(36).replace(/[^a-z0-9]/gi, '').substring(0, 6);
}

// Validate URL
function isValidUrl(url) {
    try {
        const u = new URL(url);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

export const createLink = async (req, res) => {
    try {
        const { longUrl, code } = req.body;

        if (!longUrl || !isValidUrl(longUrl)) {
            return res.status(400).json({ error: "Invalid URL" });
        }

        const codeRegex = /^[A-Za-z0-9]{6,8}$/;
        let finalCode = code;

        if (finalCode) {
            // validate custom code format
            if (!codeRegex.test(finalCode)) {
                return res.status(400).json({ error: "Code must be 6-8 alphanumeric characters" });
            }
            const exists = await Link.findOne({ code: finalCode });
            if (exists) {
                return res.status(409).json({ error: "Code already exists" });
            }
        } else {
            // generate a unique code
            finalCode = generateCode();
            // ensure uniqueness (rare collision)
            while (await Link.findOne({ code: finalCode })) {
                finalCode = generateCode();
            }
        }

        const newLink = await Link.create({
            code: finalCode,
            longUrl,
        });

        // Return the created document (so the client can use it directly)
        res.status(201).json(newLink);
    } catch (err) {
        console.error("createLink error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const getAllLinks = async (req, res) => {
    try {
        const links = await Link.find().sort({ createdAt: -1 });
        res.json(links);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteLink = async (req, res) => {
    const { code } = req.params;

    const link = await Link.findOneAndDelete({ code });

    if (!link) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Link deleted" });
};

// Redirect Handler
export const redirectLink = async (req, res) => {
    try {
        const { code } = req.params;

        const link = await Link.findOne({ code });

        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }

        // UPDATE CLICKS & LAST CLICKED
        link.clicks += 1;
        link.lastClicked = new Date();
        await link.save();

        // REDIRECT TO ORIGINAL LONG URL
        res.redirect(link.longUrl);

    } catch (error) {
        console.error("Redirect error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Health Check
export const healthCheck = (req, res) => {
    res.status(200).json({
        ok: true,
        version: "1.0",
        uptime: process.uptime(),
    });
};

export const getStats = async (req, res) => {
    const { code } = req.params;

    const link = await Link.findOne({ code });

    if (!link) {
        return res.status(404).json({ message: "Not found" });
    }

    res.json(link);
};

