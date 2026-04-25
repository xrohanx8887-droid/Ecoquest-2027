import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  Star,
  Target,
  Zap,
  Droplets,
  Recycle,
  TreePine,
  Leaf,
  Lightbulb,
  Clock,
} from "lucide-react";

interface LessonContent {
  id: string;
  title: string;
  type: "text" | "video" | "interactive" | "quiz";
  content: string;
  duration?: string;
  points: number;
}

interface LearningLessonProps {
  moduleId: string;
  moduleTitle: string;
  onBack: () => void;
  onComplete: (points: number) => void;
}

const LearningLesson = ({
  moduleId,
  moduleTitle,
  onBack,
  onComplete,
}: LearningLessonProps) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const getLessonContent = (moduleId: string): LessonContent[] => {
    const lessonMap: Record<string, LessonContent[]> = {
      "climate-basics": [
        {
          id: "intro",
          title: "What is Climate Change?",
          type: "text",
          content: `Climate change refers to long-term shifts in global weather patterns and average temperatures. The Earth's climate has always changed naturally, but human activities are now causing it to change much faster than ever before.

**Key Points:**
• Global temperatures are rising due to greenhouse gas emissions
• Human activities like burning fossil fuels are the main cause
• Climate change affects weather patterns, sea levels, and ecosystems
• We can take action to reduce our impact

**Greenhouse Effect:**
The greenhouse effect is a natural process where certain gases in Earth's atmosphere trap heat from the sun, keeping our planet warm enough to support life. However, human activities are increasing the concentration of these gases, causing the planet to warm too much.`,
          points: 25,
        },
        {
          id: "causes",
          title: "Causes of Climate Change",
          type: "interactive",
          content: `**Main Causes of Climate Change:**

1. **Burning Fossil Fuels** (65%)
   - Coal, oil, and natural gas for electricity and transportation
   - Releases carbon dioxide (CO2) into the atmosphere

2. **Deforestation** (15%)
   - Cutting down forests reduces Earth's ability to absorb CO2
   - Trees are natural carbon sinks

3. **Industrial Processes** (10%)
   - Manufacturing, cement production, and chemical reactions
   - Releases various greenhouse gases

4. **Agriculture** (10%)
   - Livestock farming produces methane
   - Fertilizer use releases nitrous oxide

**Interactive Activity:**
Calculate your carbon footprint by considering your daily activities!`,
          points: 30,
        },
        {
          id: "effects",
          title: "Effects on Our Planet",
          type: "video",
          content:
            "Watch this video to understand how climate change affects different parts of our world.",
          duration: "3:45",
          points: 35,
        },
        {
          id: "solutions",
          title: "Solutions and Actions",
          type: "text",
          content: `**Individual Actions You Can Take:**

🌱 **Reduce Energy Use**
• Turn off lights when not in use
• Use energy-efficient appliances
• Unplug electronics when not charging

🚗 **Transportation**
• Walk, bike, or use public transport
• Carpool with friends
• Consider electric vehicles

♻️ **Waste Reduction**
• Reduce, reuse, recycle
• Compost organic waste
• Choose products with less packaging

💧 **Water Conservation**
• Take shorter showers
• Fix leaky taps
• Use water-efficient fixtures

**Community Actions:**
• Support renewable energy projects
• Participate in tree planting events
• Educate others about climate change
• Advocate for environmental policies`,
          points: 40,
        },
      ],
      "water-conservation": [
        {
          id: "water-cycle",
          title: "The Water Cycle",
          type: "text",
          content: `**Understanding the Water Cycle**

The water cycle is the continuous movement of water on, above, and below the surface of the Earth. This natural process is essential for life on our planet.

**Stages of the Water Cycle:**

1. **Evaporation** - Water from oceans, lakes, and rivers turns into water vapor
2. **Condensation** - Water vapor cools and forms clouds
3. **Precipitation** - Water falls as rain, snow, or hail
4. **Collection** - Water collects in oceans, lakes, and rivers

**Why Water Conservation Matters:**
• Only 3% of Earth's water is freshwater
• Less than 1% is easily accessible for human use
• Population growth increases water demand
• Climate change affects water availability`,
          points: 20,
        },
        {
          id: "conservation-tips",
          title: "Water Conservation Tips",
          type: "interactive",
          content: `**Practical Water Saving Tips:**

🏠 **At Home:**
• Fix leaky faucets and pipes
• Install water-efficient showerheads
• Use a broom instead of a hose to clean driveways
• Water plants in the morning or evening

🚿 **In the Bathroom:**
• Take shorter showers (aim for 5 minutes)
• Turn off the tap while brushing teeth
• Use a bucket instead of a shower for bathing
• Install dual-flush toilets

🍽️ **In the Kitchen:**
• Wash dishes in a basin, not under running water
• Use a dishwasher only when full
• Defrost food in the refrigerator, not under running water
• Collect water used for rinsing fruits and vegetables

🌱 **In the Garden:**
• Use drought-resistant plants
• Water plants at the root, not the leaves
• Use mulch to retain soil moisture
• Collect rainwater for gardening`,
          points: 30,
        },
        {
          id: "global-issues",
          title: "Global Water Issues",
          type: "video",
          content:
            "Learn about water scarcity and how it affects communities worldwide.",
          duration: "4:20",
          points: 35,
        },
      ],
      "waste-management": [
        {
          id: "three-rs",
          title: "The Three Rs: Reduce, Reuse, Recycle",
          type: "text",
          content: `**The Three Rs of Waste Management**

The three Rs are the foundation of sustainable waste management. They help us minimize our environmental impact and conserve resources.

**1. REDUCE - Use Less**
• Buy products with minimal packaging
• Choose reusable items over disposable ones
• Buy in bulk to reduce packaging
• Use digital documents instead of printing
• Bring your own shopping bags

**2. REUSE - Use Again**
• Use containers for storage
• Donate clothes and items you no longer need
• Repair items instead of replacing them
• Use both sides of paper
• Repurpose old items creatively

**3. RECYCLE - Process Again**
• Separate recyclable materials
• Learn what can be recycled in your area
• Buy products made from recycled materials
• Compost organic waste
• Support recycling programs

**Waste Hierarchy:**
1. Prevention (best)
2. Reuse
3. Recycle
4. Energy Recovery
5. Disposal (worst)`,
          points: 30,
        },
        {
          id: "recycling-guide",
          title: "Recycling Guide",
          type: "interactive",
          content: `**What Can Be Recycled?**

♻️ **Paper & Cardboard**
• Newspapers and magazines
• Cardboard boxes
• Office paper
• Paper bags
• Cereal boxes

🥤 **Plastics**
• Water bottles
• Milk jugs
• Food containers
• Shampoo bottles
• Look for recycling symbols (1-7)

🥫 **Metals**
• Aluminum cans
• Steel cans
• Aluminum foil
• Metal lids

🍷 **Glass**
• Bottles and jars
• Clear, green, and brown glass
• Remove lids and caps

**What NOT to Recycle:**
• Plastic bags
• Food waste
• Broken glass
• Styrofoam
• Greasy pizza boxes`,
          points: 25,
        },
        {
          id: "composting",
          title: "Composting Basics",
          type: "text",
          content: `**Composting: Nature's Recycling**

Composting is the natural process of breaking down organic materials into nutrient-rich soil. It's a great way to reduce waste and create fertilizer for plants.

**What to Compost:**
• Fruit and vegetable scraps
• Coffee grounds and tea bags
• Eggshells
• Grass clippings
• Leaves
• Paper towels and napkins

**What NOT to Compost:**
• Meat and dairy products
• Oily foods
• Pet waste
• Diseased plants
• Weeds with seeds

**Benefits of Composting:**
• Reduces landfill waste
• Creates nutrient-rich soil
• Reduces the need for chemical fertilizers
• Helps retain soil moisture
• Reduces greenhouse gas emissions`,
          points: 35,
        },
      ],
      "renewable-energy": [
        {
          id: "energy-types",
          title: "Types of Renewable Energy",
          type: "text",
          content: `**Renewable Energy Sources**

Renewable energy comes from natural sources that are constantly replenished. Unlike fossil fuels, these energy sources won't run out.

**🌞 Solar Energy**
• Uses sunlight to generate electricity
• Solar panels convert sunlight to energy
• Can be used for homes, businesses, and utilities
• Most abundant energy source on Earth

**💨 Wind Energy**
• Uses wind to turn turbines
• Wind farms can generate large amounts of electricity
• Offshore wind farms are becoming popular
• Clean and cost-effective

**💧 Hydropower**
• Uses flowing water to generate electricity
• Dams and water turbines create power
• Most common renewable energy source
• Can be used for large-scale power generation

**🌱 Biomass**
• Uses organic materials like wood, crops, and waste
• Can be burned or converted to biofuels
• Carbon neutral when sustainably managed
• Provides heat, electricity, and transportation fuel

**🌊 Geothermal**
• Uses heat from Earth's interior
• Geothermal power plants generate electricity
• Geothermal heat pumps heat and cool buildings
• Available 24/7, unlike solar and wind`,
          points: 40,
        },
        {
          id: "solar-power",
          title: "Solar Power Deep Dive",
          type: "video",
          content:
            "Explore how solar panels work and their benefits for homes and communities.",
          duration: "5:15",
          points: 45,
        },
        {
          id: "energy-efficiency",
          title: "Energy Efficiency Tips",
          type: "interactive",
          content: `**Making Your Home Energy Efficient**

💡 **Lighting**
• Replace incandescent bulbs with LEDs
• Use natural light when possible
• Turn off lights when leaving a room
• Install motion sensors for outdoor lighting

🏠 **Heating & Cooling**
• Seal air leaks around windows and doors
• Use programmable thermostats
• Insulate your home properly
• Use ceiling fans to circulate air

🔌 **Appliances**
• Choose Energy Star certified appliances
• Unplug electronics when not in use
• Use power strips to easily turn off multiple devices
• Wash clothes in cold water

🌡️ **Smart Habits**
• Adjust thermostat settings seasonally
• Use appliances during off-peak hours
• Regular maintenance of HVAC systems
• Consider renewable energy options`,
          points: 35,
        },
      ],
      "un-sdgs": [
        {
          id: "intro",
          title: "Introduction to UN SDGs",
          type: "text",
          content: `The United Nations Sustainable Development Goals (SDGs) are a collection of 17 global goals designed to be a "blueprint to achieve a better and more sustainable future for all." They were adopted by all UN member states in 2015 as part of the 2030 Agenda for Sustainable Development.

**What are the SDGs?**
The SDGs address global challenges including poverty, inequality, climate change, environmental degradation, peace, and justice. They are interconnected and balance the three dimensions of sustainable development: economic, social, and environmental.

**The 17 Goals:**
1. No Poverty
2. Zero Hunger
3. Good Health and Well-being
4. Quality Education
5. Gender Equality
6. Clean Water and Sanitation
7. Affordable and Clean Energy
8. Decent Work and Economic Growth
9. Industry, Innovation, and Infrastructure
10. Reduced Inequalities
11. Sustainable Cities and Communities
12. Responsible Consumption and Production
13. Climate Action
14. Life Below Water
15. Life on Land
16. Peace, Justice, and Strong Institutions
17. Partnerships for the Goals

**Why They Matter:**
The SDGs provide a shared blueprint for peace and prosperity for people and the planet, now and into the future. They recognize that ending poverty and other deprivations must go hand-in-hand with strategies that improve health and education, reduce inequality, and spur economic growth – all while tackling climate change and working to preserve our oceans and forests.`,
          points: 30,
        },
        {
          id: "environmental-goals",
          title: "Environmental SDGs Deep Dive",
          type: "interactive",
          content: `**Key Environmental SDGs:**

🌊 **SDG 6: Clean Water and Sanitation**
- Ensure availability and sustainable management of water
- Achieve universal access to safe drinking water
- Improve water quality and reduce pollution
- Increase water-use efficiency

⚡ **SDG 7: Affordable and Clean Energy**
- Ensure access to affordable, reliable, sustainable energy
- Increase share of renewable energy in global energy mix
- Double global rate of improvement in energy efficiency

🏭 **SDG 12: Responsible Consumption and Production**
- Achieve sustainable management and efficient use of natural resources
- Reduce waste generation through prevention, reduction, recycling
- Encourage companies to adopt sustainable practices

🌡️ **SDG 13: Climate Action**
- Strengthen resilience and adaptive capacity to climate-related hazards
- Integrate climate change measures into policies and planning
- Improve education and awareness on climate change

🐠 **SDG 14: Life Below Water**
- Conserve and sustainably use oceans, seas, and marine resources
- Prevent and significantly reduce marine pollution
- Minimize ocean acidification

🌳 **SDG 15: Life on Land**
- Protect, restore, and promote sustainable use of terrestrial ecosystems
- Halt biodiversity loss
- Combat desertification and land degradation

**Interactive Challenge:**
Identify which SDGs your daily activities support or hinder!`,
          points: 35,
        },
        {
          id: "taking-action",
          title: "How to Contribute to SDGs",
          type: "text",
          content: `**Individual Actions for SDGs:**

🎯 **SDG 6 - Water Conservation**
• Fix leaks and use water-efficient appliances
• Collect rainwater for gardening
• Reduce water waste in daily activities
• Support clean water initiatives

⚡ **SDG 7 - Clean Energy**
• Use renewable energy sources
• Improve home energy efficiency
• Support clean energy policies
• Reduce energy consumption

🛒 **SDG 12 - Responsible Consumption**
• Buy only what you need
• Choose sustainable products
• Reduce, reuse, recycle
• Support ethical companies

🌡️ **SDG 13 - Climate Action**
• Reduce carbon footprint
• Use public transport or bike
• Plant trees
• Educate others about climate change

🐠 **SDG 14 - Ocean Conservation**
• Reduce plastic use
• Participate in beach cleanups
• Support marine conservation
• Choose sustainable seafood

🌳 **SDG 15 - Land Protection**
• Support reforestation projects
• Protect local wildlife
• Use sustainable gardening practices
• Advocate for nature conservation

**Community Engagement:**
• Join local environmental groups
• Participate in community cleanups
• Advocate for sustainable policies
• Educate others about SDGs
• Support organizations working on SDGs`,
          points: 40,
        },
      ],
      "community-drives": [
        {
          id: "planning",
          title: "Planning Your Community Drive",
          type: "text",
          content: `**Step-by-Step Planning Guide:**

📋 **1. Choose Your Drive Type**
• **Plantation Drive**: Tree planting for environmental restoration
• **River Cleaning**: Water body cleanup and restoration
• **Cleanup Drive**: General area cleaning and waste management
• **Awareness Campaign**: Educational and awareness activities

🎯 **2. Define Objectives**
• Clear, measurable goals
• Target area and scope
• Expected outcomes
• Success metrics

👥 **3. Build Your Team**
• Recruit volunteers (aim for 10-50 people)
• Assign roles and responsibilities
• Team leader and coordinators
• Safety officer
• Communication coordinator

📅 **4. Timeline Planning**
• 2-4 weeks advance planning
• Set event date and time
• Create detailed schedule
• Plan for weather contingencies

📍 **5. Location Selection**
• Identify suitable sites
• Get necessary permissions
• Assess safety and accessibility
• Plan logistics and parking

**Essential Permissions:**
• Municipal corporation approval
• Forest department (for plantation)
• Local police station
• Property owner consent
• Environmental clearance (if needed)`,
          points: 35,
        },
        {
          id: "safety-preparation",
          title: "Safety and Preparation",
          type: "interactive",
          content: `**Safety First - Essential Guidelines:**

🛡️ **Safety Equipment Checklist**
• Heavy-duty gloves for all participants
• Safety masks (N95 or better)
• First aid kit with trained personnel
• Safety vests for visibility
• Proper footwear (closed-toe shoes)
• Sun protection (hats, sunscreen)
• Emergency contact list

⚠️ **Safety Protocols**
• Brief all participants on safety rules
• Identify potential hazards
• Have emergency evacuation plan
• Keep emergency numbers handy
• Assign safety officers
• Regular safety check-ins

🧰 **Essential Tools and Supplies**
• Shovels and spades (for plantation)
• Rakes and brooms
• Trash bags and containers
• Water for drinking and cleaning
• Sanitizer and hand wash
• Measuring tools
• Plant saplings (for plantation drives)

📱 **Communication Setup**
• WhatsApp group for coordination
• Emergency contact system
• Regular updates and reminders
• Photo documentation plan
• Social media strategy

**Do's and Don'ts:**

✅ **DO's:**
• Always wear safety equipment
• Work in pairs or groups
• Stay hydrated and take breaks
• Follow local regulations
• Respect the environment
• Document your work
• Celebrate achievements

❌ **DON'Ts:**
• Never work alone
• Don't ignore safety warnings
• Avoid working in bad weather
• Don't leave waste behind
• Never harm local wildlife
• Don't work without permissions
• Avoid overexertion`,
          points: 40,
        },
        {
          id: "execution",
          title: "Drive Execution and Follow-up",
          type: "video",
          content: `**Day of the Drive - Execution Plan:**

🌅 **Morning Setup (1-2 hours before)**
• Arrive early to set up
• Mark work areas clearly
• Distribute equipment and supplies
• Brief volunteers on tasks
• Take before photos

⏰ **Event Timeline**
• **9:00 AM**: Registration and briefing
• **9:30 AM**: Safety orientation
• **10:00 AM**: Start work activities
• **12:00 PM**: Break and refreshments
• **12:30 PM**: Resume work
• **2:00 PM**: Cleanup and wrap-up
• **2:30 PM**: Group photo and celebration

📊 **Activities by Drive Type:**

🌱 **Plantation Drive:**
• Dig holes (2x2x2 feet)
• Plant saplings properly
• Water immediately after planting
• Add mulch around base
• Install support stakes if needed
• Create maintenance schedule

🌊 **River Cleaning:**
• Remove visible waste and debris
• Clean riverbanks
• Separate recyclable materials
• Proper waste disposal
• Water quality testing (if possible)
• Install awareness signs

🧹 **Cleanup Drive:**
• Systematic area coverage
• Waste segregation
• Collection and disposal
• Area beautification
• Community education
• Follow-up maintenance plan

📈 **Post-Drive Follow-up:**
• Thank all participants
• Share photos and results
• Document impact and metrics
• Plan maintenance activities
• Schedule follow-up events
• Report to local authorities
• Celebrate achievements

**Success Metrics:**
• Number of participants
• Area covered/cleaned
• Trees planted/waste collected
• Community engagement level
• Media coverage received
• Long-term impact assessment`,
          points: 45,
        },
      ],
    };

    return lessonMap[moduleId] || [];
  };

  const lessons = getLessonContent(moduleId);
  const currentLesson = lessons[currentLessonIndex];

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setLessonProgress(((currentLessonIndex + 2) / lessons.length) * 100);
    } else {
      // Complete the module
      const totalPoints = lessons.reduce(
        (sum, lesson) => sum + lesson.points,
        0
      );
      onComplete(totalPoints);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setLessonProgress((currentLessonIndex / lessons.length) * 100);
    }
  };

  const renderLessonContent = () => {
    switch (currentLesson.type) {
      case "text":
        return (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {currentLesson.content}
            </div>
          </div>
        );

      case "video":
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl mb-4">🎥</div>
                <div className="text-lg font-semibold mb-2">
                  {currentLesson.title}
                </div>
                <div className="text-sm text-gray-300 mb-4">
                  Duration: {currentLesson.duration}
                </div>
                <Button
                  className="btn-eco"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isPlaying ? "Pause" : "Play"} Video
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentLesson.content}
            </p>
          </div>
        );

      case "interactive":
        return (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                {currentLesson.content}
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Interactive Activity
              </h4>
              <p className="text-sm text-muted-foreground">
                Complete the activity above and reflect on how you can apply
                these concepts in your daily life.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {currentLesson.content}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Modules
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gradient-eco">
            {moduleTitle}
          </h2>
          <p className="text-sm text-muted-foreground">
            Lesson {currentLessonIndex + 1} of {lessons.length}
          </p>
        </div>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Progress Bar */}
      <Card className="card-eco">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            {Math.round(lessonProgress)}%
          </span>
        </div>
        <Progress value={lessonProgress} className="h-2" />
      </Card>

      {/* Lesson Content */}
      <Card className="card-eco">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary/20 to-primary-glow/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{currentLesson.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="bg-warning/10 text-warning"
                >
                  <Star className="h-3 w-3 mr-1" />
                  {currentLesson.points} points
                </Badge>
                {currentLesson.duration && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {currentLesson.duration}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="min-h-[400px]">{renderLessonContent()}</div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentLessonIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button className="btn-eco" onClick={handleNext}>
          {currentLessonIndex === lessons.length - 1 ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Module
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LearningLesson;
