/**
 * Resume Controller — Returns a structured resume JSON
 */
const Experience = require("../models/Experience");
const Skill = require("../models/Skill");
const Project = require("../models/Project");
const { successResponse } = require("../utils/helpers");

// ─── GET /api/resume ─────────────────────────────────────────────────────────
const getResume = async (req, res) => {
  const [experiences, skills, featuredProjects] = await Promise.all([
    Experience.find({ isPublished: true }).sort({ startDate: -1 }).lean(),
    Skill.find({ isPublished: true }).sort({ category: 1, proficiency: -1 }).lean(),
    Project.find({ status: "published", featured: true }).limit(6).lean(),
  ]);

  const resume = {
    meta: {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      format: "JSON Resume (extended)",
    },
    basics: {
      name: "Your Name",
      label: "Full Stack Engineer",
      email: "you@example.com",
      phone: "+1 (555) 000-0000",
      url: process.env.FRONTEND_URL,
      summary:
        "Passionate full-stack engineer with expertise in building scalable web applications.",
      location: { city: "San Francisco", region: "CA", countryCode: "US" },
      profiles: [
        { network: "GitHub", username: "yourhandle", url: "https://github.com/yourhandle" },
        { network: "LinkedIn", username: "yourhandle", url: "https://linkedin.com/in/yourhandle" },
      ],
    },
    work: experiences.map((exp) => ({
      name: exp.company,
      position: exp.title,
      url: exp.companyUrl,
      startDate: exp.startDate,
      endDate: exp.endDate || "Present",
      summary: exp.description,
      highlights: exp.highlights,
    })),
    skills: Object.entries(
      skills.reduce((acc, s) => {
        if (!acc[s.category]) acc[s.category] = [];
        acc[s.category].push(s.name);
        return acc;
      }, {})
    ).map(([name, keywords]) => ({ name, keywords })),
    projects: featuredProjects.map((p) => ({
      name: p.title,
      description: p.shortDescription,
      url: p.liveUrl || p.githubUrl,
      keywords: p.technologies,
    })),
  };

  return successResponse(res, 200, "Resume fetched", resume);
};

module.exports = { getResume };
