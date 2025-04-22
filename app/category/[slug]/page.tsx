import Link from "next/link"
import { Search, ExternalLink, ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

// This would normally come from a database or API
const categoryData = {
  code: {
    name: "Code & Development",
    description: "AI tools that help with coding, development, and programming tasks",
    tools: [
      {
        id: "codeassist-ai",
        name: "CodeAssist AI",
        category: "Development",
        isPremium: false,
        description: "AI-powered code completion and generator tool that helps developers write better code.",
        tags: ["Coding", "Web Dev", "Debugging"],
      },
      {
        id: "devgpt",
        name: "DevGPT",
        category: "Development",
        isPremium: true,
        description: "AI coding assistant that generates code snippets, explains code, and helps debug issues.",
        tags: ["Programming", "Debugging", "Learning"],
      },
      {
        id: "codepilot",
        name: "CodePilot",
        category: "Development",
        isPremium: true,
        description: "Intelligent code generation tool that understands context and suggests optimal solutions.",
        tags: ["Productivity", "Code Generation", "AI Assistant"],
      },
      {
        id: "bugfixer-ai",
        name: "BugFixer AI",
        category: "Development",
        isPremium: false,
        description: "Automatically identifies and fixes bugs in your code with detailed explanations.",
        tags: ["Debugging", "Code Quality", "Learning"],
      },
      {
        id: "webflow-ai",
        name: "WebFlow AI",
        category: "Development",
        isPremium: true,
        description: "Generate responsive websites from text descriptions with AI-powered design and code.",
        tags: ["Web Design", "No-Code", "Frontend"],
      },
      {
        id: "docugenius",
        name: "DocuGenius",
        category: "Development",
        isPremium: false,
        description: "AI tool that automatically generates documentation for your code and projects.",
        tags: ["Documentation", "Technical Writing", "Productivity"],
      },
      {
        id: "testcraft-ai",
        name: "TestCraft AI",
        category: "Development",
        isPremium: true,
        description: "Generate comprehensive test suites for your code with AI-powered test case creation.",
        tags: ["Testing", "QA", "Code Quality"],
      },
      {
        id: "apiforge",
        name: "APIForge",
        category: "Development",
        isPremium: true,
        description: "Design, document, and generate API endpoints with natural language descriptions.",
        tags: ["API Development", "Backend", "Documentation"],
      },
    ],
  },
  image: {
    name: "Image Generation",
    description: "AI tools for creating, editing, and enhancing images",
    tools: [
      {
        id: "ai-image-creator",
        name: "AI Image Creator",
        category: "Image Generation",
        isPremium: true,
        description: "Generate stunning images from text descriptions using advanced AI models.",
        tags: ["Marketing", "Design", "Content"],
      },
      {
        id: "dreamscape-ai",
        name: "DreamScape AI",
        category: "Image Generation",
        isPremium: true,
        description: "Create surreal and artistic images with AI that understands complex visual concepts.",
        tags: ["Art", "Creative", "Digital Art"],
      },
      {
        id: "photofixer",
        name: "PhotoFixer",
        category: "Image Generation",
        isPremium: false,
        description: "Enhance and restore old or damaged photos with AI-powered image processing.",
        tags: ["Photo Editing", "Restoration", "Enhancement"],
      },
      {
        id: "brandimage-ai",
        name: "BrandImage AI",
        category: "Image Generation",
        isPremium: true,
        description: "Generate consistent brand imagery and marketing visuals with customized AI models.",
        tags: ["Branding", "Marketing", "Design"],
      },
      {
        id: "iconify",
        name: "Iconify",
        category: "Image Generation",
        isPremium: false,
        description: "Create custom icons and illustrations from text descriptions for your projects.",
        tags: ["Icons", "UI Design", "Illustration"],
      },
      {
        id: "background-remover",
        name: "Background Remover Pro",
        category: "Image Generation",
        isPremium: false,
        description: "Instantly remove backgrounds from images with AI-powered precision.",
        tags: ["Photo Editing", "E-commerce", "Design"],
      },
    ],
  },
  chatbots: {
    name: "Chatbots & Assistants",
    description: "AI-powered conversational agents and virtual assistants",
    tools: [
      {
        id: "chatgenius",
        name: "ChatGenius",
        category: "Chatbots & Assistants",
        isPremium: true,
        description: "Build customized AI chatbots for customer service, lead generation, and support.",
        tags: ["Customer Service", "Support", "Automation"],
      },
      {
        id: "salesbot-ai",
        name: "SalesBot AI",
        category: "Chatbots & Assistants",
        isPremium: true,
        description: "AI sales assistant that qualifies leads, answers questions, and books meetings.",
        tags: ["Sales", "Lead Generation", "Conversion"],
      },
      {
        id: "supportgpt",
        name: "SupportGPT",
        category: "Chatbots & Assistants",
        isPremium: false,
        description: "24/7 AI customer support agent that handles common questions and troubleshooting.",
        tags: ["Customer Support", "Help Desk", "Automation"],
      },
      {
        id: "healthbot",
        name: "HealthBot",
        category: "Chatbots & Assistants",
        isPremium: true,
        description: "AI health assistant that provides medical information and wellness recommendations.",
        tags: ["Healthcare", "Wellness", "Information"],
      },
      {
        id: "studybuddy-ai",
        name: "StudyBuddy AI",
        category: "Chatbots & Assistants",
        isPremium: false,
        description: "AI tutor that helps students learn subjects through conversational explanations.",
        tags: ["Education", "Learning", "Tutoring"],
      },
      {
        id: "travelassist",
        name: "TravelAssist",
        category: "Chatbots & Assistants",
        isPremium: true,
        description: "AI travel assistant that helps plan trips, find deals, and provide recommendations.",
        tags: ["Travel", "Planning", "Recommendations"],
      },
    ],
  },
  text: {
    name: "Text & Writing",
    description: "AI tools for content creation, writing, and text generation",
    tools: [
      {
        id: "ai-writing-assistant",
        name: "AI Writing Assistant",
        category: "Text Generation",
        isPremium: true,
        description: "Create high-quality content with AI that understands context and delivers human-like writing.",
        tags: ["Blogging", "Marketing", "SEO"],
      },
      {
        id: "bloggenius",
        name: "BlogGenius",
        category: "Text & Writing",
        isPremium: true,
        description: "Generate SEO-optimized blog posts and articles with customizable tone and style.",
        tags: ["Blogging", "Content Marketing", "SEO"],
      },
      {
        id: "copywriter-ai",
        name: "Copywriter AI",
        category: "Text & Writing",
        isPremium: true,
        description: "Create compelling marketing copy, headlines, and ad text that converts.",
        tags: ["Copywriting", "Advertising", "Marketing"],
      },
      {
        id: "scriptcraft",
        name: "ScriptCraft",
        category: "Text & Writing",
        isPremium: true,
        description: "Generate video scripts, podcast outlines, and dialogue for creative projects.",
        tags: ["Scripts", "Video", "Creative Writing"],
      },
      {
        id: "emailpro-ai",
        name: "EmailPro AI",
        category: "Text & Writing",
        isPremium: false,
        description: "Write professional emails, follow-ups, and newsletters with the perfect tone.",
        tags: ["Email", "Communication", "Business"],
      },
      {
        id: "resumewriter",
        name: "ResumeWriter",
        category: "Text & Writing",
        isPremium: false,
        description: "Create tailored resumes and cover letters that highlight your skills and experience.",
        tags: ["Career", "Job Search", "Professional"],
      },
      {
        id: "contentplanner",
        name: "ContentPlanner",
        category: "Text & Writing",
        isPremium: true,
        description: "Generate content calendars, outlines, and ideas for your marketing strategy.",
        tags: ["Content Strategy", "Planning", "Marketing"],
      },
    ],
  },
  video: {
    name: "Video Creation",
    description: "AI tools for video generation, editing, and enhancement",
    tools: [
      {
        id: "videogen-ai",
        name: "VideoGen AI",
        category: "Video Creator",
        isPremium: true,
        description:
          "Create professional videos from text in minutes with AI-powered editing, animations, and voiceover.",
        tags: ["Marketing", "Social Media", "Education"],
      },
      {
        id: "motioncraft",
        name: "MotionCraft",
        category: "Video Creation",
        isPremium: true,
        description: "Transform static images and text into dynamic video content with AI animations.",
        tags: ["Animation", "Marketing", "Social Media"],
      },
      {
        id: "videopilot",
        name: "VideoPilot",
        category: "Video Creation",
        isPremium: true,
        description: "Automated video editing that turns raw footage into polished content in minutes.",
        tags: ["Editing", "Post-Production", "Content Creation"],
      },
      {
        id: "scripttoscreen",
        name: "ScriptToScreen",
        category: "Video Creation",
        isPremium: true,
        description: "Convert written scripts directly into animated explainer videos and presentations.",
        tags: ["Explainer Videos", "Education", "Marketing"],
      },
      {
        id: "subtitlegenius",
        name: "SubtitleGenius",
        category: "Video Creation",
        isPremium: false,
        description: "Automatically generate accurate subtitles and captions in multiple languages.",
        tags: ["Accessibility", "Translation", "Content"],
      },
    ],
  },
  audio: {
    name: "Audio & Music",
    description: "AI tools for audio generation, music creation, and voice synthesis",
    tools: [
      {
        id: "voicegenius",
        name: "VoiceGenius",
        category: "Voice Synthesis",
        isPremium: false,
        description: "Turn text into natural-sounding voice with multiple accents, tones, and emotions.",
        tags: ["Video", "Podcast", "Accessibility"],
      },
      {
        id: "musiccomposer-ai",
        name: "MusicComposer AI",
        category: "Audio & Music",
        isPremium: true,
        description: "Generate original music in various genres with customizable mood and tempo.",
        tags: ["Music Production", "Creative", "Entertainment"],
      },
      {
        id: "podcaststudio",
        name: "PodcastStudio",
        category: "Audio & Music",
        isPremium: true,
        description: "All-in-one AI tool for recording, editing, and enhancing podcast audio.",
        tags: ["Podcast", "Audio Editing", "Content Creation"],
      },
      {
        id: "soundenhancer",
        name: "SoundEnhancer",
        category: "Audio & Music",
        isPremium: false,
        description: "Clean up and enhance audio recordings by removing noise and improving clarity.",
        tags: ["Audio Editing", "Production", "Quality"],
      },
      {
        id: "voicecloner",
        name: "VoiceCloner",
        category: "Audio & Music",
        isPremium: true,
        description: "Create a digital copy of your voice for consistent narration and content.",
        tags: ["Voice Acting", "Content Creation", "Branding"],
      },
    ],
  },
  data: {
    name: "Data & Analytics",
    description: "AI tools for data analysis, visualization, and insights",
    tools: [
      {
        id: "dataviz-ai",
        name: "DataViz AI",
        category: "Data Visualization",
        isPremium: true,
        description:
          "Transform complex data into beautiful, interactive visualizations with natural language commands.",
        tags: ["Business", "Research", "Reporting"],
      },
      {
        id: "insightengine",
        name: "InsightEngine",
        category: "Data & Analytics",
        isPremium: true,
        description: "Extract actionable insights from your business data with AI-powered analysis.",
        tags: ["Business Intelligence", "Strategy", "Decision Making"],
      },
      {
        id: "forecastpro",
        name: "ForecastPro",
        category: "Data & Analytics",
        isPremium: true,
        description: "Predict future trends and outcomes with advanced AI forecasting models.",
        tags: ["Forecasting", "Planning", "Business"],
      },
      {
        id: "datacleanser",
        name: "DataCleanser",
        category: "Data & Analytics",
        isPremium: false,
        description: "Automatically clean, normalize, and prepare data for analysis and machine learning.",
        tags: ["Data Preparation", "Data Quality", "Automation"],
      },
      {
        id: "sentimentanalyzer",
        name: "SentimentAnalyzer",
        category: "Data & Analytics",
        isPremium: false,
        description: "Analyze customer feedback, reviews, and social media for sentiment and insights.",
        tags: ["Customer Insights", "Social Listening", "Feedback"],
      },
      {
        id: "anomalydetector",
        name: "AnomalyDetector",
        category: "Data & Analytics",
        isPremium: true,
        description: "Identify unusual patterns and outliers in your data to prevent issues before they occur.",
        tags: ["Security", "Monitoring", "Prevention"],
      },
    ],
  },
  business: {
    name: "Business & Marketing",
    description: "AI tools for business operations, marketing, and strategy",
    tools: [
      {
        id: "marketingstrategy-ai",
        name: "MarketingStrategy AI",
        category: "Business & Marketing",
        isPremium: true,
        description: "Generate comprehensive marketing strategies based on your business goals and target audience.",
        tags: ["Strategy", "Planning", "Marketing"],
      },
      {
        id: "adcreator",
        name: "AdCreator",
        category: "Business & Marketing",
        isPremium: true,
        description: "Create high-converting ad copy and visuals for multiple platforms and formats.",
        tags: ["Advertising", "Creative", "Conversion"],
      },
      {
        id: "socialscheduler",
        name: "SocialScheduler",
        category: "Business & Marketing",
        isPremium: false,
        description: "AI-powered content calendar and scheduling tool for social media management.",
        tags: ["Social Media", "Content", "Planning"],
      },
      {
        id: "competitorinsight",
        name: "CompetitorInsight",
        category: "Business & Marketing",
        isPremium: true,
        description: "Analyze competitor strategies, content, and performance to inform your business decisions.",
        tags: ["Competitive Analysis", "Strategy", "Research"],
      },
      {
        id: "leadqualifier",
        name: "LeadQualifier",
        category: "Business & Marketing",
        isPremium: true,
        description: "Automatically score and qualify leads based on behavior, engagement, and fit.",
        tags: ["Sales", "Lead Generation", "Automation"],
      },
      {
        id: "pricingoptimizer",
        name: "PricingOptimizer",
        category: "Business & Marketing",
        isPremium: true,
        description: "Determine optimal pricing strategies for your products and services using AI analysis.",
        tags: ["Pricing", "Strategy", "Revenue"],
      },
    ],
  },
  research: {
    name: "AI Research",
    description: "Advanced AI tools for research, analysis, and academic work",
    tools: [
      {
        id: "researchassistant",
        name: "ResearchAssistant",
        category: "AI Research",
        isPremium: true,
        description: "AI-powered research assistant that finds, summarizes, and analyzes academic papers.",
        tags: ["Academic", "Literature Review", "Analysis"],
      },
      {
        id: "hypothesistester",
        name: "HypothesisTester",
        category: "AI Research",
        isPremium: true,
        description: "Design and analyze experiments with AI guidance for statistical validity.",
        tags: ["Statistics", "Experiments", "Data Analysis"],
      },
      {
        id: "literaturesummarizer",
        name: "LiteratureSummarizer",
        category: "AI Research",
        isPremium: false,
        description: "Automatically summarize research papers and extract key findings and methodologies.",
        tags: ["Academic", "Summarization", "Research"],
      },
      {
        id: "citationgenius",
        name: "CitationGenius",
        category: "AI Research",
        isPremium: false,
        description: "Generate and format citations in multiple styles with AI accuracy checking.",
        tags: ["Citations", "Academic Writing", "Bibliography"],
      },
    ],
  },
  language: {
    name: "Natural Language",
    description: "AI tools for language processing, translation, and understanding",
    tools: [
      {
        id: "neural-translator",
        name: "Neural Translator",
        category: "Language",
        isPremium: false,
        description: "Advanced AI translation tool that preserves context and nuance across 100+ languages.",
        tags: ["Translation", "Localization", "Communication"],
      },
      {
        id: "sentimentanalyzer-pro",
        name: "SentimentAnalyzer Pro",
        category: "Natural Language",
        isPremium: true,
        description: "Analyze text for emotional tone, sentiment, and intent with advanced NLP.",
        tags: ["Sentiment Analysis", "Customer Feedback", "Social Media"],
      },
      {
        id: "textclassifier",
        name: "TextClassifier",
        category: "Natural Language",
        isPremium: false,
        description: "Automatically categorize and tag text documents using AI classification.",
        tags: ["Document Management", "Organization", "Automation"],
      },
      {
        id: "languagetutor-ai",
        name: "LanguageTutor AI",
        category: "Natural Language",
        isPremium: true,
        description: "Personalized language learning assistant with conversation practice and feedback.",
        tags: ["Education", "Language Learning", "Tutoring"],
      },
    ],
  },
  design: {
    name: "UI/UX Design",
    description: "AI tools for user interface and experience design",
    tools: [
      {
        id: "uigenius",
        name: "UIGenius",
        category: "UI/UX Design",
        isPremium: true,
        description: "Generate complete UI designs from text descriptions with customizable styles.",
        tags: ["UI Design", "Web Design", "Mobile Design"],
      },
      {
        id: "wireframer-ai",
        name: "Wireframer AI",
        category: "UI/UX Design",
        isPremium: false,
        description: "Create wireframes and prototypes from text descriptions or rough sketches.",
        tags: ["Wireframing", "Prototyping", "UX Design"],
      },
      {
        id: "accessibilitychecker",
        name: "AccessibilityChecker",
        category: "UI/UX Design",
        isPremium: false,
        description: "AI-powered tool that checks designs for accessibility issues and suggests improvements.",
        tags: ["Accessibility", "Compliance", "Inclusive Design"],
      },
      {
        id: "designsystem-generator",
        name: "DesignSystem Generator",
        category: "UI/UX Design",
        isPremium: true,
        description: "Generate complete design systems with components, styles, and documentation.",
        tags: ["Design Systems", "Components", "Documentation"],
      },
    ],
  },
  predictive: {
    name: "Predictive Analytics",
    description: "AI tools for forecasting, prediction, and trend analysis",
    tools: [
      {
        id: "predictive-analytics",
        name: "Predictive Analytics",
        category: "Business",
        isPremium: true,
        description: "Enterprise-grade tool that forecasts business trends and customer behavior.",
        tags: ["Forecasting", "Planning", "Strategy"],
      },
      {
        id: "demandforecaster",
        name: "DemandForecaster",
        category: "Predictive Analytics",
        isPremium: true,
        description: "Predict product demand and optimize inventory with AI-powered forecasting.",
        tags: ["Inventory", "Supply Chain", "Retail"],
      },
      {
        id: "marketpredictor",
        name: "MarketPredictor",
        category: "Predictive Analytics",
        isPremium: true,
        description: "Analyze market trends and predict future movements with advanced AI models.",
        tags: ["Finance", "Investment", "Market Analysis"],
      },
      {
        id: "customerchurn-predictor",
        name: "CustomerChurn Predictor",
        category: "Predictive Analytics",
        isPremium: true,
        description: "Identify customers at risk of churning before they leave with predictive analytics.",
        tags: ["Customer Retention", "Churn", "Customer Success"],
      },
    ],
  },
  robotics: {
    name: "Robotics",
    description: "AI tools for robotics programming, simulation, and control",
    tools: [
      {
        id: "robotprogrammer",
        name: "RobotProgrammer",
        category: "Robotics",
        isPremium: true,
        description: "Generate robot control code from natural language instructions and goals.",
        tags: ["Programming", "Automation", "Control Systems"],
      },
      {
        id: "robotsimulator",
        name: "RobotSimulator",
        category: "Robotics",
        isPremium: true,
        description: "Simulate robot behavior and test control algorithms in virtual environments.",
        tags: ["Simulation", "Testing", "Development"],
      },
      {
        id: "motionplanner",
        name: "MotionPlanner",
        category: "Robotics",
        isPremium: true,
        description: "AI-powered motion planning for robots to navigate complex environments efficiently.",
        tags: ["Navigation", "Path Planning", "Optimization"],
      },
    ],
  },
  translation: {
    name: "Translation",
    description: "AI tools for language translation and localization",
    tools: [
      {
        id: "neural-translator",
        name: "Neural Translator",
        category: "Language",
        isPremium: false,
        description: "Advanced AI translation tool that preserves context and nuance across 100+ languages.",
        tags: ["Translation", "Localization", "Communication"],
      },
      {
        id: "documenttranslator",
        name: "DocumentTranslator",
        category: "Translation",
        isPremium: true,
        description: "Translate entire documents while preserving formatting and layout.",
        tags: ["Document Translation", "Business", "International"],
      },
      {
        id: "realtimetranslator",
        name: "RealtimeTranslator",
        category: "Translation",
        isPremium: true,
        description: "Real-time translation for meetings, calls, and live events with minimal delay.",
        tags: ["Real-time", "Meetings", "Events"],
      },
      {
        id: "localizationassistant",
        name: "LocalizationAssistant",
        category: "Translation",
        isPremium: true,
        description: "Complete localization solution for apps, websites, and software with AI assistance.",
        tags: ["Localization", "Software", "International"],
      },
    ],
  },
  "user-research": {
    name: "User Research",
    description: "AI tools for user research, feedback analysis, and insights",
    tools: [
      {
        id: "userinsights",
        name: "UserInsights",
        category: "User Research",
        isPremium: true,
        description: "Analyze user feedback, interviews, and surveys to extract actionable insights.",
        tags: ["Feedback Analysis", "UX Research", "Customer Insights"],
      },
      {
        id: "usabilitytester",
        name: "UsabilityTester",
        category: "User Research",
        isPremium: true,
        description: "AI-powered usability testing that identifies issues and suggests improvements.",
        tags: ["Usability", "Testing", "UX Improvement"],
      },
      {
        id: "personagenerator",
        name: "PersonaGenerator",
        category: "User Research",
        isPremium: false,
        description: "Create data-driven user personas based on research and behavioral patterns.",
        tags: ["Personas", "UX Design", "Marketing"],
      },
      {
        id: "feedbackanalyzer",
        name: "FeedbackAnalyzer",
        category: "User Research",
        isPremium: false,
        description: "Automatically categorize and prioritize user feedback from multiple channels.",
        tags: ["Feedback", "Product Management", "Prioritization"],
      },
    ],
  },
  voice: {
    name: "Voice Tech",
    description: "AI tools for voice recognition, synthesis, and processing",
    tools: [
      {
        id: "voicegenius",
        name: "VoiceGenius",
        category: "Voice Synthesis",
        isPremium: false,
        description: "Turn text into natural-sounding voice with multiple accents, tones, and emotions.",
        tags: ["Video", "Podcast", "Accessibility"],
      },
      {
        id: "voicerecognition-pro",
        name: "VoiceRecognition Pro",
        category: "Voice Tech",
        isPremium: true,
        description: "Advanced speech recognition with high accuracy even in noisy environments.",
        tags: ["Speech Recognition", "Transcription", "Accessibility"],
      },
      {
        id: "voiceanalytics",
        name: "VoiceAnalytics",
        category: "Voice Tech",
        isPremium: true,
        description: "Analyze voice for emotion, sentiment, and engagement in calls and meetings.",
        tags: ["Call Analytics", "Customer Service", "Sales"],
      },
      {
        id: "voiceassistant-builder",
        name: "VoiceAssistant Builder",
        category: "Voice Tech",
        isPremium: true,
        description: "Build custom voice assistants for specific domains and use cases.",
        tags: ["Voice Assistant", "Custom AI", "Automation"],
      },
    ],
  },
}

export default function CategoryDetail({ params }: { params: { slug: string } }) {
  const { slug } = params
  const category = categoryData[slug] || {
    name: "Category Not Found",
    description: "This category does not exist or has no tools yet.",
    tools: [],
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-[#a855f7] mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-[#111827] mb-1">{category.name}</h1>
        <p className="text-[#6b7280] mb-8">{category.description}</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${category.name} tools...`}
              className="pl-10 pr-4 py-2 w-full border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <div className="w-full md:w-48">
              <button className="w-full flex items-center justify-between px-4 py-2 bg-white border border-[#e5e7eb] rounded-md focus:outline-none">
                <span>Sort By: Popular</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <button className="px-4 py-2 bg-white border border-[#e5e7eb] rounded-md flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <p className="text-[#6b7280] mb-6">Showing {category.tools.length} tools</p>

        {category.tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.tools.map((tool) => (
              <div
                key={tool.id}
                className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-[#111827] mb-2">{tool.name}</h3>

                <div className="flex gap-2 mb-2">
                  <span className="text-xs px-3 py-1 bg-[#f5f0ff] text-[#a855f7] rounded-full">{tool.category}</span>
                  {tool.isPremium ? (
                    <span className="text-xs px-3 py-1 bg-[#fff8e6] text-[#f59e0b] rounded-full flex items-center">
                      <span className="mr-0.5">$</span>Premium
                    </span>
                  ) : (
                    <span className="text-xs px-3 py-1 bg-[#f0fdf4] text-[#22c55e] rounded-full flex items-center">
                      <span className="mr-0.5">✓</span>Free
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#4b5563] mb-4">{tool.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {tool.tags.map((tag, index) => (
                    <span key={index} className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#6b7280] rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="p-1.5 border border-[#e5e7eb] rounded">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                          stroke="#6b7280"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button className="p-1.5 border border-[#e5e7eb] rounded">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                          stroke="#6b7280"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <Link href={`/tools/${tool.id}`}>
                    <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-8 rounded-md flex items-center">
                      Try Tool <ExternalLink className="w-3 h-3 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tools found</h3>
            <p className="text-gray-500 mb-6">We couldn't find any tools in this category.</p>
            <Link href="/browse">
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white">Browse All Tools</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
