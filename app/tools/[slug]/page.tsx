import Link from "next/link"
import { Bookmark, Share2, ExternalLink, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

// This would normally come from a database or API
const toolsData = {
  "ai-image-creator": {
    id: "ai-image-creator",
    name: "AI Image Creator",
    category: "Image Generation",
    isPremium: true,
    description:
      "Generate stunning images from text descriptions using advanced AI models. AI Image Creator transforms your text prompts into high-quality, creative visuals in seconds. Perfect for designers, marketers, and content creators who need professional-looking images without professional design skills. Choose from multiple styles, resolutions, and customization options to create exactly the visuals you need for your projects.",
    website: "https://example.com/ai-image-creator",
    lastUpdated: "April 2, 2023",
    useCases: ["Marketing", "Social Media", "Web Design", "Content Creation", "E-commerce"],
    keyFeatures: [
      {
        title: "Text-to-Image Generation",
        description: "Convert your text descriptions into beautiful, realistic images with just a few clicks.",
      },
      {
        title: "Multiple Styles",
        description: "Choose from dozens of artistic styles including photorealistic, cartoon, watercolor, and more.",
      },
      {
        title: "High Resolution Output",
        description: "Generate images up to 4K resolution, perfect for professional use and printing.",
      },
      {
        title: "Batch Processing",
        description: "Create multiple variations of an image or process several prompts at once.",
      },
      {
        title: "Custom Training",
        description: "Train the AI on your brand's visual identity to generate on-brand images consistently.",
      },
      {
        title: "Commercial License",
        description: "All generated images come with a commercial license for use in your projects.",
      },
    ],
    pricing: [
      {
        name: "Free",
        price: "Free",
        description: "Perfect for occasional use and testing",
        features: [
          "20 image generations per month",
          "Basic styles only",
          "720p resolution",
          "Community support",
          "Non-commercial license",
        ],
        popular: false,
        cta: "Choose Free",
      },
      {
        name: "Pro",
        price: "$29",
        period: "/mo",
        description: "Ideal for professionals and small businesses",
        features: [
          "500 image generations per month",
          "All premium styles",
          "Up to 2K resolution",
          "Priority email support",
          "Commercial license",
          "Batch processing",
        ],
        popular: true,
        cta: "Choose Pro",
      },
      {
        name: "Enterprise",
        price: "$99",
        period: "/mo",
        description: "For agencies and large organizations",
        features: [
          "Unlimited image generations",
          "All premium styles",
          "Up to 4K resolution",
          "Dedicated support",
          "Commercial license",
          "Custom style training",
          "API access",
        ],
        popular: false,
        cta: "Choose Enterprise",
      },
    ],
    reviews: [
      {
        name: "Sarah Johnson",
        avatar: "SJ",
        rating: 5,
        date: "March 18, 2023",
        comment:
          "This tool has completely transformed how I create visual content for my marketing campaigns. The image quality is outstanding and the interface is incredibly intuitive.",
      },
      {
        name: "Michael Chen",
        avatar: "MC",
        rating: 4,
        date: "March 10, 2023",
        comment:
          "Great tool for quick image generation. The variety of styles is impressive, though I wish there were more customization options for the generated images.",
      },
      {
        name: "Jessica Williams",
        avatar: "JW",
        rating: 5,
        date: "March 2, 2023",
        comment:
          "As a new designer, this tool has been a game-changer for my small business. I can create professional-looking images in minutes without any design skills.",
      },
    ],
    similarTools: [
      {
        id: "dreamscape-ai",
        name: "AI Image Creator",
        category: "Image Generation",
        isPremium: true,
        description: "Generate stunning images from text descriptions using advanced AI models.",
      },
      {
        id: "pixelcraft-ai",
        name: "AI Image Creator",
        category: "Image Generation",
        isPremium: true,
        description: "Generate stunning images from text descriptions using advanced AI models.",
      },
      {
        id: "artify-ai",
        name: "AI Image Creator",
        category: "Image Generation",
        isPremium: true,
        description: "Generate stunning images from text descriptions using advanced AI models.",
      },
    ],
  },
  "codeassist-ai": {
    id: "codeassist-ai",
    name: "CodeAssist AI",
    category: "Development",
    isPremium: false,
    description:
      "AI-powered code completion and generator tool that helps developers write better code faster. CodeAssist AI understands context, suggests improvements, and can generate entire functions based on natural language descriptions.",
    website: "https://example.com/codeassist-ai",
    lastUpdated: "May 15, 2023",
    useCases: ["Coding", "Web Dev", "Debugging", "Software Development", "Learning"],
    keyFeatures: [
      {
        title: "Intelligent Code Completion",
        description: "Get context-aware code suggestions as you type, saving time and reducing errors.",
      },
      {
        title: "Natural Language to Code",
        description: "Describe what you want to build in plain English and get working code in return.",
      },
      {
        title: "Multi-language Support",
        description: "Works with JavaScript, Python, Java, C++, TypeScript, PHP, and many more languages.",
      },
      {
        title: "Code Explanation",
        description: "Get plain English explanations of complex code to understand how it works.",
      },
      {
        title: "Bug Detection",
        description: "Automatically identifies potential bugs and security issues in your code.",
      },
      {
        title: "IDE Integration",
        description: "Seamlessly integrates with popular IDEs like VS Code, IntelliJ, and more.",
      },
    ],
    pricing: [
      {
        name: "Free",
        price: "Free",
        description: "Perfect for students and hobbyists",
        features: [
          "100 completions per day",
          "Basic code generation",
          "Standard response time",
          "Community support",
          "Single language support",
        ],
        popular: false,
        cta: "Choose Free",
      },
      {
        name: "Pro",
        price: "$19",
        period: "/mo",
        description: "Ideal for professional developers",
        features: [
          "Unlimited completions",
          "Advanced code generation",
          "Faster response time",
          "Email support",
          "All languages support",
          "IDE integrations",
        ],
        popular: true,
        cta: "Choose Pro",
      },
      {
        name: "Team",
        price: "$49",
        period: "/mo",
        description: "For development teams",
        features: [
          "Everything in Pro",
          "Team collaboration features",
          "Custom code templates",
          "Priority support",
          "Admin dashboard",
          "API access",
        ],
        popular: false,
        cta: "Choose Team",
      },
    ],
    reviews: [
      {
        name: "David Miller",
        avatar: "DM",
        rating: 5,
        date: "May 10, 2023",
        comment:
          "This tool has cut my coding time in half. The suggestions are incredibly accurate and it's like having a senior developer looking over my shoulder.",
      },
      {
        name: "Lisa Zhang",
        avatar: "LZ",
        rating: 4,
        date: "April 28, 2023",
        comment:
          "Great for learning new languages. I've been using it to learn TypeScript and it's been incredibly helpful for understanding best practices.",
      },
      {
        name: "Robert Jones",
        avatar: "RJ",
        rating: 5,
        date: "April 15, 2023",
        comment:
          "The natural language to code feature is a game-changer. I can describe complex functions and get working implementations instantly.",
      },
    ],
    similarTools: [
      {
        id: "codepilot-ai",
        name: "CodePilot AI",
        category: "Development",
        isPremium: true,
        description: "AI-powered coding assistant that helps developers write better code faster.",
      },
      {
        id: "devgenius",
        name: "DevGenius",
        category: "Development",
        isPremium: false,
        description: "Smart code completion and generation tool for multiple programming languages.",
      },
      {
        id: "syntaxsage",
        name: "SyntaxSage",
        category: "Development",
        isPremium: true,
        description: "AI coding assistant that provides intelligent suggestions and automates repetitive tasks.",
      },
    ],
  },
  "ai-writing-assistant": {
    id: "ai-writing-assistant",
    name: "AI Writing Assistant",
    category: "Text Generation",
    isPremium: true,
    description:
      "Create high-quality content with AI that understands context and delivers human-like writing. This powerful tool helps bloggers, marketers, and content creators produce engaging articles, social media posts, and marketing copy in minutes instead of hours.",
    website: "https://example.com/ai-writing-assistant",
    lastUpdated: "June 10, 2023",
    useCases: ["Blogging", "Marketing", "SEO", "Social Media", "Email Campaigns"],
    keyFeatures: [
      {
        title: "Content Generation",
        description: "Create blog posts, articles, and marketing copy with just a few prompts.",
      },
      {
        title: "Style Customization",
        description: "Adjust tone, style, and voice to match your brand's personality.",
      },
      {
        title: "SEO Optimization",
        description: "Get content that's already optimized for search engines with targeted keywords.",
      },
      {
        title: "Multilingual Support",
        description: "Generate content in over 25 languages to reach global audiences.",
      },
      {
        title: "Content Repurposing",
        description: "Transform existing content into different formats for multiple platforms.",
      },
      {
        title: "Plagiarism-Free",
        description: "All generated content is original and passes plagiarism checks.",
      },
    ],
    pricing: [
      {
        name: "Basic",
        price: "Free",
        description: "Perfect for occasional use",
        features: [
          "5,000 words per month",
          "Basic templates",
          "Standard output quality",
          "Community support",
          "Limited language options",
        ],
        popular: false,
        cta: "Choose Basic",
      },
      {
        name: "Pro",
        price: "$29",
        period: "/mo",
        description: "Ideal for content creators and marketers",
        features: [
          "50,000 words per month",
          "All templates",
          "Premium output quality",
          "Priority support",
          "All languages",
          "SEO optimization",
        ],
        popular: true,
        cta: "Choose Pro",
      },
      {
        name: "Business",
        price: "$79",
        period: "/mo",
        description: "For teams and agencies",
        features: [
          "Unlimited words",
          "Custom templates",
          "Highest quality output",
          "Dedicated support",
          "Brand voice training",
          "API access",
          "Team collaboration",
        ],
        popular: false,
        cta: "Choose Business",
      },
    ],
    reviews: [
      {
        name: "Emily Rodriguez",
        avatar: "ER",
        rating: 5,
        date: "June 5, 2023",
        comment:
          "This tool has revolutionized my content creation process. I can now produce a week's worth of blog content in just a few hours with minimal editing needed.",
      },
      {
        name: "Thomas Wright",
        avatar: "TW",
        rating: 4,
        date: "May 22, 2023",
        comment:
          "Great for overcoming writer's block. The quality is impressive, though I still need to add my personal touch to make it truly shine.",
      },
      {
        name: "Sophia Kim",
        avatar: "SK",
        rating: 5,
        date: "May 15, 2023",
        comment:
          "As a non-native English speaker, this tool helps me create professional content that sounds natural and engaging. Worth every penny!",
      },
    ],
    similarTools: [
      {
        id: "contentcraft",
        name: "ContentCraft",
        category: "Text Generation",
        isPremium: true,
        description: "AI-powered content creation platform for bloggers and marketers.",
      },
      {
        id: "writerbot-pro",
        name: "WriterBot Pro",
        category: "Writing",
        isPremium: true,
        description: "Advanced AI writing assistant for high-quality content creation.",
      },
      {
        id: "copygenius",
        name: "CopyGenius",
        category: "Text Generation",
        isPremium: false,
        description: "Free AI copywriting tool for marketing and social media content.",
      },
    ],
  },
  voicegenius: {
    id: "voicegenius",
    name: "VoiceGenius",
    category: "Voice Synthesis",
    isPremium: false,
    description:
      "Turn text into natural-sounding voice with multiple accents, tones, and emotions. VoiceGenius uses advanced neural networks to create human-like speech that's perfect for videos, podcasts, e-learning, and accessibility applications.",
    website: "https://example.com/voicegenius",
    lastUpdated: "May 28, 2023",
    useCases: ["Video", "Podcast", "Accessibility", "E-Learning", "IVR Systems"],
    keyFeatures: [
      {
        title: "Natural Voice Synthesis",
        description: "Generate human-like speech that's virtually indistinguishable from real voices.",
      },
      {
        title: "Multiple Voices",
        description: "Choose from over 100 voices across different ages, genders, and accents.",
      },
      {
        title: "Emotional Control",
        description: "Adjust tone, pitch, and emotion to create the perfect voice for your content.",
      },
      {
        title: "Real-time Generation",
        description: "Convert text to speech instantly for live applications and streaming.",
      },
      {
        title: "Audio Formatting",
        description: "Export in multiple formats including MP3, WAV, and OGG for any platform.",
      },
      {
        title: "SSML Support",
        description: "Fine-tune pronunciation and delivery with Speech Synthesis Markup Language.",
      },
    ],
    pricing: [
      {
        name: "Free",
        price: "Free",
        description: "Perfect for personal projects",
        features: [
          "10,000 characters per month",
          "10 voice options",
          "Standard quality audio",
          "MP3 export only",
          "Community support",
        ],
        popular: false,
        cta: "Choose Free",
      },
      {
        name: "Creator",
        price: "$19",
        period: "/mo",
        description: "Ideal for content creators",
        features: [
          "100,000 characters per month",
          "50 voice options",
          "High quality audio",
          "All export formats",
          "Email support",
          "Commercial usage",
        ],
        popular: true,
        cta: "Choose Creator",
      },
      {
        name: "Professional",
        price: "$49",
        period: "/mo",
        description: "For businesses and agencies",
        features: [
          "Unlimited characters",
          "All voices",
          "Ultra-high quality audio",
          "Priority rendering",
          "Priority support",
          "API access",
          "Custom voice training",
        ],
        popular: false,
        cta: "Choose Professional",
      },
    ],
    reviews: [
      {
        name: "Alex Morgan",
        avatar: "AM",
        rating: 5,
        date: "May 20, 2023",
        comment:
          "The quality of these AI voices is incredible. I use them for all my YouTube videos now, and viewers can't tell they're synthetic.",
      },
      {
        name: "Priya Patel",
        avatar: "PP",
        rating: 4,
        date: "May 12, 2023",
        comment:
          "Great tool for creating accessible content. The natural-sounding voices make my e-learning materials much more engaging.",
      },
      {
        name: "Marcus Johnson",
        avatar: "MJ",
        rating: 5,
        date: "April 30, 2023",
        comment:
          "As a podcast producer, this tool has been a game-changer for creating intros, ads, and narration without hiring voice actors.",
      },
    ],
    similarTools: [
      {
        id: "speechify-ai",
        name: "Speechify AI",
        category: "Voice Synthesis",
        isPremium: true,
        description: "Premium text-to-speech platform with ultra-realistic voices.",
      },
      {
        id: "voiceover-pro",
        name: "Voiceover Pro",
        category: "Audio",
        isPremium: true,
        description: "Professional AI voiceover generation for videos and presentations.",
      },
      {
        id: "narrato",
        name: "Narrato",
        category: "Audio",
        isPremium: false,
        description: "Simple text-to-speech tool with natural-sounding voices.",
      },
    ],
  },
  "videogen-ai": {
    id: "videogen-ai",
    name: "VideoGen AI",
    category: "Video Creator",
    isPremium: true,
    description:
      "Create professional videos from text in minutes with AI-powered editing, animations, and voiceover. VideoGen AI streamlines the entire video creation process, making it accessible to marketers, educators, and content creators without video editing skills.",
    website: "https://example.com/videogen-ai",
    lastUpdated: "June 15, 2023",
    useCases: ["Marketing", "Social Media", "Education", "Product Demos", "Explainer Videos"],
    keyFeatures: [
      {
        title: "Text-to-Video Generation",
        description: "Turn written scripts into complete videos with just a few clicks.",
      },
      {
        title: "AI Scene Creation",
        description: "Automatically generate appropriate visuals based on your script content.",
      },
      {
        title: "Built-in Animation",
        description: "Add professional animations and transitions without manual editing.",
      },
      {
        title: "Integrated Voice Narration",
        description: "Choose from dozens of AI voices to narrate your video content.",
      },
      {
        title: "Template Library",
        description: "Access hundreds of pre-designed templates for various video types and industries.",
      },
      {
        title: "Brand Customization",
        description: "Add your logo, colors, and fonts to maintain consistent branding.",
      },
    ],
    pricing: [
      {
        name: "Starter",
        price: "$29",
        period: "/mo",
        description: "Perfect for individuals and small businesses",
        features: [
          "5 videos per month",
          "Up to 5 minutes per video",
          "720p resolution",
          "Basic templates",
          "Standard support",
          "Commercial usage",
        ],
        popular: false,
        cta: "Choose Starter",
      },
      {
        name: "Professional",
        price: "$79",
        period: "/mo",
        description: "Ideal for content creators and marketers",
        features: [
          "20 videos per month",
          "Up to 15 minutes per video",
          "1080p resolution",
          "All templates",
          "Priority support",
          "Advanced customization",
          "Remove watermark",
        ],
        popular: true,
        cta: "Choose Professional",
      },
      {
        name: "Business",
        price: "$199",
        period: "/mo",
        description: "For agencies and large organizations",
        features: [
          "Unlimited videos",
          "Unlimited video length",
          "4K resolution",
          "Custom templates",
          "Dedicated support",
          "API access",
          "Team collaboration",
        ],
        popular: false,
        cta: "Choose Business",
      },
    ],
    reviews: [
      {
        name: "Jennifer Lopez",
        avatar: "JL",
        rating: 5,
        date: "June 10, 2023",
        comment:
          "This tool has transformed our marketing strategy. We can now produce high-quality product videos in minutes instead of days.",
      },
      {
        name: "Ryan Thompson",
        avatar: "RT",
        rating: 4,
        date: "June 2, 2023",
        comment:
          "Great for creating social media content quickly. The templates are professional and the AI does a good job interpreting scripts.",
      },
      {
        name: "Aisha Patel",
        avatar: "AP",
        rating: 5,
        date: "May 25, 2023",
        comment:
          "As an online educator, this tool has been invaluable. I can create engaging lesson videos without any video editing skills.",
      },
    ],
    similarTools: [
      {
        id: "vidcraft",
        name: "VidCraft",
        category: "Video Creation",
        isPremium: true,
        description: "AI-powered video creation platform for marketing and social media.",
      },
      {
        id: "motionai",
        name: "MotionAI",
        category: "Video",
        isPremium: true,
        description: "Automated video generation from text scripts and storyboards.",
      },
      {
        id: "clipgenius",
        name: "ClipGenius",
        category: "Video Creation",
        isPremium: true,
        description: "AI video editor that automates editing and enhances production quality.",
      },
    ],
  },
  "dataviz-ai": {
    id: "dataviz-ai",
    name: "DataViz AI",
    category: "Data Visualization",
    isPremium: true,
    description:
      "Transform complex data into beautiful, interactive visualizations with natural language commands. DataViz AI makes data analysis accessible to everyone by allowing you to create charts, graphs, and dashboards without coding or design skills.",
    website: "https://example.com/dataviz-ai",
    lastUpdated: "June 5, 2023",
    useCases: ["Business", "Research", "Reporting", "Presentations", "Data Analysis"],
    keyFeatures: [
      {
        title: "Natural Language Interface",
        description: "Create visualizations by describing what you want in plain English.",
      },
      {
        title: "Automatic Chart Selection",
        description: "AI suggests the best visualization type based on your data structure.",
      },
      {
        title: "Interactive Dashboards",
        description: "Build dynamic dashboards with filters and drill-down capabilities.",
      },
      {
        title: "Multiple Data Sources",
        description: "Connect to spreadsheets, databases, APIs, and business intelligence tools.",
      },
      {
        title: "Customizable Design",
        description: "Adjust colors, fonts, and layouts to match your brand guidelines.",
      },
      {
        title: "Collaboration Tools",
        description: "Share visualizations with team members and collect feedback.",
      },
    ],
    pricing: [
      {
        name: "Basic",
        price: "$19",
        period: "/mo",
        description: "Perfect for individuals and small teams",
        features: [
          "10 visualizations",
          "5 data sources",
          "Basic chart types",
          "Export as images",
          "Standard support",
          "1 user",
        ],
        popular: false,
        cta: "Choose Basic",
      },
      {
        name: "Pro",
        price: "$49",
        period: "/mo",
        description: "Ideal for businesses and analysts",
        features: [
          "Unlimited visualizations",
          "20 data sources",
          "All chart types",
          "Interactive exports",
          "Priority support",
          "5 users",
          "Dashboard creation",
        ],
        popular: true,
        cta: "Choose Pro",
      },
      {
        name: "Enterprise",
        price: "$199",
        period: "/mo",
        description: "For large organizations and data teams",
        features: [
          "Unlimited everything",
          "Custom integrations",
          "Advanced analytics",
          "Dedicated support",
          "Unlimited users",
          "White labeling",
          "API access",
        ],
        popular: false,
        cta: "Choose Enterprise",
      },
    ],
    reviews: [
      {
        name: "Daniel Kim",
        avatar: "DK",
        rating: 5,
        date: "June 1, 2023",
        comment:
          "This tool has revolutionized how we present data to clients. The natural language interface makes it incredibly easy to create professional visualizations.",
      },
      {
        name: "Laura Martinez",
        avatar: "LM",
        rating: 4,
        date: "May 20, 2023",
        comment:
          "Great for quick data analysis and reporting. The AI does an excellent job suggesting appropriate chart types for different data sets.",
      },
      {
        name: "James Wilson",
        avatar: "JW",
        rating: 5,
        date: "May 12, 2023",
        comment:
          "As someone without a data science background, this tool has been a game-changer. I can now create insightful visualizations for my research without coding.",
      },
    ],
    similarTools: [
      {
        id: "chartify",
        name: "Chartify",
        category: "Data Visualization",
        isPremium: true,
        description: "AI-powered chart creation tool for business intelligence.",
      },
      {
        id: "vizgenius",
        name: "VizGenius",
        category: "Data & Analytics",
        isPremium: true,
        description: "Automated data visualization platform with AI-driven insights.",
      },
      {
        id: "datacanvas",
        name: "DataCanvas",
        category: "Data Visualization",
        isPremium: false,
        description: "Free tool for creating simple data visualizations with AI assistance.",
      },
    ],
  },
}

export default function ToolDetail({ params }: { params: { slug: string } }) {
  const { slug } = params
  const tool = toolsData[slug] || toolsData["ai-image-creator"] // Default to AI Image Creator if slug not found

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-6">
          <Link href="/" className="text-[#6b7280]">
            Home
          </Link>
          <span className="mx-2 text-[#6b7280]">{">"}</span>
          <Link href="/browse" className="text-[#6b7280]">
            Tools
          </Link>
          <span className="mx-2 text-[#6b7280]">{">"}</span>
          <span className="text-[#6b7280]">Tool Details</span>
        </div>

        {/* Tool Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] mb-2">{tool.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-[#f5f0ff] text-[#a855f7] px-3 py-1 rounded-full">{tool.category}</span>
              {tool.isPremium && (
                <span className="text-sm bg-[#fff8e6] text-[#f59e0b] px-3 py-1 rounded-full flex items-center">
                  <span className="mr-1">$</span>Premium
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white px-6 py-2 rounded-full flex items-center">
              Try This Tool <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Description and Features */}
          <div className="md:col-span-2">
            <p className="text-[#4b5563] mb-8">{tool.description}</p>

            {/* Key Features */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#111827] mb-6">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tool.keyFeatures.map((feature, index) => (
                  <div key={index} className="border border-[#e5e7eb] rounded-lg p-4">
                    <div className="flex items-start mb-2">
                      <div className="w-5 h-5 rounded-full bg-[#f5f0ff] flex items-center justify-center mr-2 mt-1">
                        <Check className="w-3 h-3 text-[#a855f7]" />
                      </div>
                      <h3 className="font-semibold text-[#111827]">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-[#6b7280] ml-7">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Screenshot */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#111827] mb-6">Screenshot</h2>
              <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
                <div className="bg-[#f9fafb] h-64 flex items-center justify-center">
                  <p className="text-[#9ca3af]">Main Interface Preview</p>
                </div>
                <div className="p-3 border-t border-[#e5e7eb]">
                  <p className="text-sm text-[#6b7280]">
                    The primary interface showing the main functionality of the tool
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#111827] mb-6">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tool.pricing.map((plan, index) => (
                  <div key={index} className="border border-[#e5e7eb] rounded-lg p-6 relative">
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-[#a855f7] text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                        POPULAR
                      </div>
                    )}
                    <div className="mb-4">
                      <h3 className="text-sm text-[#6b7280] mb-1">{plan.name}</h3>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-[#111827]">{plan.price}</span>
                        {plan.period && <span className="text-sm text-[#6b7280]">{plan.period}</span>}
                      </div>
                      <p className="text-xs text-[#6b7280] mt-1">{plan.description}</p>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <div className="w-4 h-4 rounded-full bg-[#f5f0ff] flex items-center justify-center mr-2 mt-0.5">
                            <Check className="w-2 h-2 text-[#a855f7]" />
                          </div>
                          <span className="text-xs text-[#4b5563]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.popular ? "bg-[#a855f7] hover:bg-[#9333ea] text-white" : "bg-white border border-[#e5e7eb] text-[#111827] hover:bg-[#f9fafb]"}`}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* User Reviews */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#111827] mb-6">User Reviews</h2>
              <div className="space-y-6">
                {tool.reviews.map((review, index) => (
                  <div key={index} className="border border-[#e5e7eb] rounded-lg p-6">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#f5f0ff] flex items-center justify-center text-[#a855f7] mr-3">
                          {review.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#111827]">{review.name}</h3>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "text-[#facc15]" : "text-[#e5e7eb]"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-[#6b7280]">{review.date}</span>
                    </div>
                    <p className="text-sm text-[#4b5563]">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Tools */}
            <div>
              <h2 className="text-xl font-bold text-[#111827] mb-6">Similar Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tool.similarTools.map((similarTool, index) => (
                  <div key={index} className="border border-[#e5e7eb] rounded-lg p-4">
                    <h3 className="font-semibold text-[#111827] mb-2">{similarTool.name}</h3>
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 bg-[#f5f0ff] text-[#a855f7] rounded-full">
                        {similarTool.category}
                      </span>
                      {similarTool.isPremium && (
                        <span className="text-xs px-2 py-0.5 bg-[#fff8e6] text-[#f59e0b] rounded-full flex items-center">
                          <span className="mr-0.5">$</span>Premium
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6b7280] mb-4">{similarTool.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button className="p-1 border border-[#e5e7eb] rounded">
                          <Bookmark className="w-3 h-3 text-[#6b7280]" />
                        </button>
                        <button className="p-1 border border-[#e5e7eb] rounded">
                          <Share2 className="w-3 h-3 text-[#6b7280]" />
                        </button>
                      </div>
                      <Link href={`/tools/${similarTool.id}`}>
                        <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-7 rounded-md flex items-center">
                          Try Tool <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="md:col-span-1">
            <div className="border border-[#e5e7eb] rounded-lg p-6 sticky top-8">
              <h3 className="font-semibold text-[#111827] mb-4">Use Cases</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {tool.useCases.map((useCase, index) => (
                  <span key={index} className="text-sm bg-[#f3f4f6] text-[#6b7280] px-3 py-1 rounded-full">
                    {useCase}
                  </span>
                ))}
              </div>

              <div className="border-t border-[#e5e7eb] pt-4 mb-6">
                <h3 className="font-semibold text-[#111827] mb-2">Website</h3>
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#a855f7] hover:underline"
                >
                  {tool.website}
                </a>
              </div>

              <div className="border-t border-[#e5e7eb] pt-4">
                <h3 className="font-semibold text-[#111827] mb-2">Last Updated</h3>
                <p className="text-sm text-[#6b7280]">{tool.lastUpdated}</p>
              </div>

              <div className="flex items-center justify-between mt-8">
                <button className="p-2 border border-[#e5e7eb] rounded-lg">
                  <Bookmark className="w-5 h-5 text-[#6b7280]" />
                </button>
                <button className="p-2 border border-[#e5e7eb] rounded-lg">
                  <Share2 className="w-5 h-5 text-[#6b7280]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
