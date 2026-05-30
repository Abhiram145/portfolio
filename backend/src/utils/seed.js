/**
 * Database seeder — creates the initial admin user
 * Run: npm run seed
 */
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");
const Experience = require("../models/Experience");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const Blog = require("../models/Blog");
const logger = require("./logger");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  logger.info("Connected to MongoDB for seeding...");

  // ─── Admin User ───────────────────────────────────────────────────────────
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existing) {
    await User.create({
      name: "Portfolio Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });
    logger.info(`✅ Admin user created: ${process.env.ADMIN_EMAIL}`);
  } else {
    logger.info("ℹ️  Admin user already exists, skipping.");
  }

  // ─── Sample Skills ────────────────────────────────────────────────────────
  const skillCount = await Skill.countDocuments();
  if (skillCount === 0) {
    await Skill.insertMany([
      { name: "JavaScript", category: "Languages", proficiency: 95, icon: "javascript", color: "#F7DF1E", yearsOfExperience: 5, order: 1 },
      { name: "TypeScript", category: "Languages", proficiency: 90, icon: "typescript", color: "#3178C6", yearsOfExperience: 3, order: 2 },
      { name: "Python", category: "Languages", proficiency: 85, icon: "python", color: "#3776AB", yearsOfExperience: 4, order: 3 },
      { name: "React", category: "Frontend", proficiency: 95, icon: "react", color: "#61DAFB", yearsOfExperience: 4, order: 1 },
      { name: "Next.js", category: "Frontend", proficiency: 90, icon: "nextdotjs", color: "#000000", yearsOfExperience: 2, order: 2 },
      { name: "Node.js", category: "Backend", proficiency: 90, icon: "nodedotjs", color: "#339933", yearsOfExperience: 4, order: 1 },
      { name: "Express", category: "Backend", proficiency: 88, icon: "express", color: "#000000", yearsOfExperience: 4, order: 2 },
      { name: "MongoDB", category: "Database", proficiency: 85, icon: "mongodb", color: "#47A248", yearsOfExperience: 3, order: 1 },
      { name: "PostgreSQL", category: "Database", proficiency: 80, icon: "postgresql", color: "#336791", yearsOfExperience: 2, order: 2 },
      { name: "Docker", category: "DevOps", proficiency: 80, icon: "docker", color: "#2496ED", yearsOfExperience: 2, order: 1 },
      { name: "AWS", category: "Cloud", proficiency: 75, icon: "amazonaws", color: "#FF9900", yearsOfExperience: 2, order: 1 },
      { name: "Git", category: "Tools", proficiency: 95, icon: "git", color: "#F05032", yearsOfExperience: 5, order: 1 },
    ]);
    logger.info("✅ Sample skills seeded.");
  }

  // ─── Sample Experience ────────────────────────────────────────────────────
  const expCount = await Experience.countDocuments();
  if (expCount === 0) {
    await Experience.insertMany([
      {
        title: "Senior Full Stack Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA (Remote)",
        employmentType: "Full-time",
        startDate: new Date("2022-01-01"),
        isCurrent: true,
        description: "Led development of microservices architecture serving 1M+ users. Mentored junior engineers and drove adoption of TypeScript across the team.",
        highlights: ["Reduced API response time by 40% via Redis caching", "Architected event-driven system using RabbitMQ", "Led team of 5 engineers"],
        technologies: ["React", "Node.js", "TypeScript", "MongoDB", "Redis", "Docker"],
        order: 1,
      },
      {
        title: "Full Stack Developer",
        company: "StartupXYZ",
        location: "New York, NY",
        employmentType: "Full-time",
        startDate: new Date("2020-03-01"),
        endDate: new Date("2021-12-31"),
        isCurrent: false,
        description: "Built and launched customer-facing SaaS platform from ground up. Implemented CI/CD pipelines and improved deployment frequency from monthly to daily.",
        highlights: ["Launched MVP in 3 months", "Integrated Stripe payments", "Built real-time notifications with WebSockets"],
        technologies: ["Vue.js", "Express", "PostgreSQL", "AWS", "Stripe"],
        order: 2,
      },
    ]);
    logger.info("✅ Sample experience seeded.");
  }

  // ─── Sample Projects ──────────────────────────────────────────────────────
  const projCount = await Project.countDocuments();
  if (projCount === 0) {
    await Project.create([
      {
        title: "DevPortfolio CMS",
        shortDescription: "A full-stack portfolio CMS with admin dashboard and dynamic content management.",
        description: "# DevPortfolio CMS\n\nA production-ready portfolio system built with Next.js, Express, and MongoDB. Features JWT authentication, Redis caching, image uploads via Cloudinary, and a rich admin dashboard.",
        technologies: ["Next.js", "Express", "MongoDB", "Redis", "Cloudinary", "JWT"],
        category: "Web",
        featured: true,
        status: "published",
        order: 1,
      },
      {
        title: "AI Code Reviewer",
        shortDescription: "An AI-powered tool that reviews pull requests and suggests improvements.",
        description: "# AI Code Reviewer\n\nIntegrates with GitHub Actions to automatically review PRs using OpenAI GPT-4. Provides inline comments, security analysis, and performance suggestions.",
        technologies: ["Python", "FastAPI", "OpenAI API", "GitHub Actions", "PostgreSQL"],
        category: "AI/ML",
        featured: true,
        status: "published",
        order: 2,
      },
    ]);
    logger.info("✅ Sample projects seeded.");
  }

  logger.info("🌱 Seeding complete!");
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  logger.error("Seeding failed:", err);
  process.exit(1);
});
