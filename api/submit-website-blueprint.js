import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL, ssl: { rejectUnauthorized: false } });

const STRUCTURES = {
  restaurant: {
    label: "Restaurant / Cafe / Bar",
    sections: [
      { order: 1, name: "Hero Section", priority: "Critical", desc: "Full-width stunning food or atmosphere photo. Headline that captures your vibe (e.g. 'Fresh. Local. Unforgettable.'). Two prominent CTA buttons: View Menu and Reserve a Table (or Order Online). Hours visible.", tips: ["Use a professional food photo or ambiance shot — not stock", "Make the CTA buttons large and impossible to miss", "Show your hours right here — people check immediately"] },
      { order: 2, name: "Menu", priority: "Critical", desc: "Your full menu as actual text — not a PDF. Google indexes text menus and can show your specific dishes in search results. Organize by category. Include photos of key dishes if possible.", tips: ["Never use a PDF menu — Google can't read it", "Include prices — hiding them loses trust", "Add a 'Featured Dishes' callout for your best items"] },
      { order: 3, name: "Online Ordering / Reservations", priority: "High", desc: "Prominent section with your ordering platform (if applicable) and reservation system. Make it one tap. If using OpenTable, Resy, or Toast — embed it directly on the page.", tips: ["Connect your reservation system directly to Google Business Profile", "If you don't take reservations, say so clearly with your walk-in policy", "Online ordering should be just as visible as the menu"] },
      { order: 4, name: "Location, Hours & Directions", priority: "Critical", desc: "Embedded Google Map with a 'Get Directions' button. Full address, phone number, and hours — including holiday hours. This is one of the most-visited sections for restaurants.", tips: ["Embed a live Google Map — not just an address", "List hours for every day of the week", "Add parking info if relevant"] },
      { order: 5, name: "About / Story", priority: "Medium", desc: "A short, genuine story about your restaurant. Who started it, why, what makes it special. People connect with people — show the face behind the food.", tips: ["Keep it to 3-4 sentences — don't write an essay", "Include a photo of the owner or team", "Mention your neighborhood or city — good for local SEO"] },
      { order: 6, name: "Events & Specials", priority: "Medium", desc: "Weekly specials, live music, trivia nights, happy hour — whatever brings people in. Keep this section updated. Link to your Facebook Events page.", tips: ["Update this section regularly — stale content hurts credibility", "Add an email signup for event notifications", "Highlight recurring weekly events so people plan ahead"] },
      { order: 7, name: "Reviews / Social Proof", priority: "High", desc: "Pull in your best Google or Yelp reviews. Show star rating. Include a direct link to leave a review.", tips: ["Display your overall star rating prominently", "Include 3-5 specific quotes from real reviews", "Add a 'Leave us a review' button"] },
      { order: 8, name: "Contact / Footer", priority: "High", desc: "Phone number (tap-to-call on mobile), email, address, social media links. Repeat your hours. Link to your Google Business Profile.", tips: ["Make phone number a clickable link on mobile", "Include all social media links", "Repeat your address and hours here for easy access"] },
    ]
  },
  local_service: {
    label: "Local Service Business",
    sections: [
      { order: 1, name: "Hero Section", priority: "Critical", desc: "Bold headline stating exactly what you do and where (e.g. 'Pittsburgh's Most Trusted Plumber'). Your phone number in large text at the top — tap-to-call on mobile. Primary CTA button: Get a Free Quote / Call Now / Book Service. If you offer 24/7 or emergency service, show a prominent emergency button here.", tips: ["Your phone number should be the biggest element on the page", "If 24/7 — add a red 'Emergency Service Available' badge at the very top", "Use a photo of your team or truck — not stock photos"] },
      { order: 2, name: "Services Section", priority: "Critical", desc: "List every service you offer with a short description. Each service should have its own card or section. Link each service to a dedicated service page for SEO.", tips: ["Create a separate page for each major service — huge for local SEO", "Include your most common emergency or high-ticket services first", "Add pricing ranges if you're comfortable — it filters leads"] },
      { order: 3, name: "Get a Quote / Contact Form", priority: "Critical", desc: "A simple form: name, phone, email, service needed, message. This should appear high on the page — don't make people scroll to find it. Consider a two-step form (just name + phone first, then details).", tips: ["Fewer fields = more submissions. Name + phone is often enough", "Add 'We respond within 2 hours' to set expectations", "Consider a chat widget if you respond quickly"] },
      { order: 4, name: "Why Choose Us / Trust Signals", priority: "High", desc: "Years in business, licenses and certifications, insurance badges, awards. This is what converts skeptical visitors. Show your credentials prominently.", tips: ["Include your license number if applicable — builds massive trust", "Add your BBB rating, Google rating, or any awards", "Show before/after photos of your work"] },
      { order: 5, name: "Service Area", priority: "High", desc: "List every city, neighborhood, or ZIP code you serve. This is critical for local SEO. Consider an embedded map showing your service radius.", tips: ["List every city you serve — even if it feels repetitive", "Each city you serve is a potential SEO keyword", "Consider a service area map graphic"] },
      { order: 6, name: "Reviews / Testimonials", priority: "High", desc: "Show your Google review rating and 3-5 specific quotes. Link directly to your Google review page. Include a 'Leave a Review' button.", tips: ["Real reviews with customer names perform better than anonymous ones", "Include the service they used in the review context", "Respond to your reviews — it shows you care"] },
      { order: 7, name: "FAQ", priority: "Medium", desc: "Answer the top 5-8 questions customers ask before hiring you. Pricing questions, process questions, what to expect. This reduces pre-sales calls and improves SEO.", tips: ["Use actual questions you get asked — not generic ones", "FAQ content is great for Google's 'People Also Ask' results", "Keep answers concise — 2-4 sentences max"] },
      { order: 8, name: "Contact / Footer", priority: "High", desc: "Phone (tap-to-call), email, address, service area, hours of operation, social media, license number.", tips: ["Repeat your phone number in the footer", "Include your license and insurance info here too", "Add a map if you have a physical office"] },
    ]
  },
  gym_fitness: {
    label: "Gym / Fitness Studio",
    sections: [
      { order: 1, name: "Hero Section", priority: "Critical", desc: "High-energy photo or video of your classes or members in action. Bold headline about transformation or community (e.g. 'Pittsburgh's Best Boxing Gym'). CTA: Start Your Free Trial / View Class Schedule / Join Now.", tips: ["Video backgrounds perform extremely well for gyms", "Show real members — not stock fitness photos", "Free trial CTA converts better than 'Join Now' for first-time visitors"] },
      { order: 2, name: "Class Types / What We Offer", priority: "Critical", desc: "Cards for each class type or training format. Name, brief description, who it's for, difficulty level. Link each to a dedicated page.", tips: ["Show 3-4 class types prominently — don't overwhelm", "Include 'For beginners welcome' messaging if applicable", "Add class duration and what to bring"] },
      { order: 3, name: "Class Schedule", priority: "Critical", desc: "Embedded scheduling software (Mindbody, PushPress, Acuity, etc.) or a visual class schedule grid. This is one of the most-visited pages for any gym.", tips: ["Embed your scheduling software directly — don't link away", "Show today's classes prominently", "Make it easy to book from the schedule"] },
      { order: 4, name: "Free Trial / Lead Capture", priority: "Critical", desc: "Dedicated section promoting your free trial or intro offer. Simple form: name, email, phone, maybe class preference. This is your primary lead capture.", tips: ["Free trial offer should appear within the first two scrolls", "Add social proof: 'Join 200+ members'", "Follow up immediately after form submission"] },
      { order: 5, name: "Coaches / Instructors", priority: "High", desc: "Profile cards for each coach — photo, name, certifications, specialty, short bio. People join gyms because of coaches as much as equipment.", tips: ["Real photos of your coaches — not professional headshots only", "Include certifications and years of experience", "Add a personal quote or training philosophy"] },
      { order: 6, name: "Pricing / Memberships", priority: "High", desc: "Clear membership options with pricing. 3 tiers works well: Drop-in, Monthly, Annual. Include what's included in each.", tips: ["Don't hide pricing — it builds trust and filters leads", "Highlight your most popular plan", "Add a 'First class free' or trial option"] },
      { order: 7, name: "Testimonials / Transformations", priority: "High", desc: "Member success stories with photos. Before/after if applicable. Video testimonials perform best.", tips: ["Ask members for testimonials after their first month", "Include their name, how long they've been a member, what they've achieved", "Video testimonials are gold — even phone-recorded ones"] },
      { order: 8, name: "Location & Contact", priority: "High", desc: "Address with embedded Google Map, parking info, hours, phone, email. For gyms, parking availability is often a deciding factor.", tips: ["Show parking options prominently", "Include public transit info if relevant", "Add photos of the facility exterior and interior"] },
    ]
  },
  consultant_coach: {
    label: "Consultant / Coach",
    sections: [
      { order: 1, name: "Hero Section", priority: "Critical", desc: "Clear, specific headline about what you do and who you help (e.g. 'I help small business owners 2x their revenue without working more hours'). Professional photo of you. Primary CTA: Book a Free Discovery Call — linked directly to your booking calendar.", tips: ["Be specific — 'I help X do Y' outperforms 'I help businesses grow'", "Your photo builds trust immediately — use a professional one", "The booking CTA should be above the fold on every device"] },
      { order: 2, name: "Booking Calendar", priority: "Critical", desc: "Embed your calendar (Calendly, Acuity, Cal.com) directly on the page — ideally visible without scrolling. This is the #1 goal of your site.", tips: ["Embed the calendar on the homepage — not just on a Contact page", "Set clear availability — don't show too many open slots", "Send an automatic confirmation email after booking"] },
      { order: 3, name: "What I Do / Services", priority: "Critical", desc: "Clear descriptions of each service or program you offer. Who it's for, what's included, the transformation/outcome. Price if you're comfortable showing it.", tips: ["Lead with outcomes, not features ('You'll get 3 more leads per week' not '6 strategy sessions')", "Each service should have its own dedicated page", "Include a 'Not sure which is right for you? Book a call' CTA"] },
      { order: 4, name: "Who It's For", priority: "High", desc: "Describe your ideal client in detail. People should read this and think 'that's me.' Include who it's NOT for — this filters leads and builds credibility.", tips: ["Get specific: 'This is for service business owners doing $10k-$50k/month who...'", "Include 3-5 bullet points of your ideal client profile", "Add 'This is NOT for you if...' to pre-qualify leads"] },
      { order: 5, name: "Results / Case Studies", priority: "Critical", desc: "Specific client results with numbers where possible. Before/after scenarios. Video testimonials. This is what converts skeptics.", tips: ["Specific numbers perform far better than vague praise ('increased revenue by $40k' vs 'helped me a lot')", "Include the client's name, business, and industry if they allow it", "Video testimonials from real clients are worth 10x written ones"] },
      { order: 6, name: "About / My Story", priority: "High", desc: "Your background, credentials, and why you do this work. Personal story of transformation or expertise. Keep it focused on how your background benefits your clients.", tips: ["Connect your experience directly to client outcomes", "Include any credentials, certifications, or notable clients", "Show personality — people hire people they like and trust"] },
      { order: 7, name: "FAQ", priority: "Medium", desc: "Answer objections before they're raised: pricing, process, timeline, what makes you different, who it's for. This reduces pre-sales calls.", tips: ["Answer 'How much does it cost?' even if just a range", "Include 'What happens after I book a call?'", "Add 'Is this right for me?' as a question"] },
      { order: 8, name: "Contact / Footer", priority: "High", desc: "Email, a secondary booking CTA, social media links (especially LinkedIn). Keep it clean.", tips: ["Add a secondary 'Book a call' button in the footer", "Include your LinkedIn profile prominently", "Add a simple contact form for people who aren't ready to book"] },
    ]
  },
  photographer: {
    label: "Photographer / Creative",
    sections: [
      { order: 1, name: "Hero / Portfolio Gallery", priority: "Critical", desc: "Your absolute best work — full-width, stunning images. No text-heavy hero needed. Let your work speak. Show what you're known for first (weddings, portraits, commercial, etc.).", tips: ["Use your top 5-10 images — not your entire portfolio", "Full-width slideshow or masonry grid both work well", "Load speed matters — compress images without losing quality"] },
      { order: 2, name: "Specialties / What You Shoot", priority: "Critical", desc: "Cards or sections for each type of photography you offer: weddings, portraits, events, commercial, etc. Each should link to a dedicated gallery and inquiry form.", tips: ["Create a separate page for each specialty — critical for SEO", "Include starting prices if possible — it filters tire-kickers", "Add 'Now booking 2025/2026' with available dates"] },
      { order: 3, name: "Portfolio by Category", priority: "Critical", desc: "Separate gallery pages for each specialty. Curate ruthlessly — 20 amazing images beats 100 average ones.", tips: ["Only show your best 15-25 images per category", "Name your gallery files with relevant keywords (wedding-photographer-pittsburgh.jpg)", "Add client names/locations as captions where permission is given"] },
      { order: 4, name: "Inquiry / Contact Form", priority: "Critical", desc: "A specific inquiry form for each type of shoot — wedding inquiry includes: date, venue, guest count, style. Portrait inquiry includes: type of session, preferred date, location. Make it easy to say yes.", tips: ["Separate forms for different shoot types get more completions", "Ask for their date and location upfront — saves back-and-forth", "Add a 'Tell me about your vision' open field"] },
      { order: 5, name: "Pricing", priority: "High", desc: "At minimum, show starting prices or packages. Full pricing with what's included builds trust and filters leads who can't afford you.", tips: ["'Starting at $X' is better than no price at all", "Bundle packages with clear inclusions (hours, images, prints)", "Add a FAQ answering 'Do you offer payment plans?'"] },
      { order: 6, name: "About / Your Story", priority: "High", desc: "Who you are, your style, your approach to shoots. Include a natural photo of you — clients want to know the person who will be with them on their wedding day.", tips: ["Be personal and warm — clients choose photographers they feel comfortable with", "Mention your shooting style (documentary, editorial, candid, etc.)", "Include how long you've been shooting and notable work"] },
      { order: 7, name: "Reviews / Testimonials", priority: "High", desc: "Client quotes specifically about the experience and results. Video testimonials from wedding clients are especially powerful.", tips: ["Include the client's name and type of shoot", "Pull from Google reviews with a direct link to leave more", "Video testimonials of couples talking about their experience convert extremely well"] },
      { order: 8, name: "Contact / Footer", priority: "High", desc: "Email, phone (optional), Instagram link, location (city/region you serve), inquiry form CTA.", tips: ["Instagram is often your most important portfolio platform — link prominently", "List all the cities/regions you serve — good for local SEO", "Add 'Destination photographer available worldwide' if relevant"] },
    ]
  },
  online_store: {
    label: "Online Store / E-commerce",
    sections: [
      { order: 1, name: "Hero Section", priority: "Critical", desc: "Lifestyle photo of your best product or newest collection. Compelling headline about your brand or current offer. Primary CTA: Shop Now / Shop the Collection / View New Arrivals. Secondary CTA: Best Sellers.", tips: ["Show products on people or in use — not just product shots on white", "If you have a sale or promotion, announce it prominently here", "Consider a countdown timer for limited-time offers"] },
      { order: 2, name: "Announcement Bar / Promotions", priority: "High", desc: "A thin bar at the very top of the page for: free shipping thresholds, current sales, new arrivals, discount codes. This is your highest-visibility real estate.", tips: ["'Free shipping on orders over $X' consistently increases average order value", "Rotate 2-3 messages if you have a platform that supports it", "Keep it concise — one key message at a time"] },
      { order: 3, name: "Featured / New Arrivals", priority: "Critical", desc: "Your newest products or bestsellers displayed prominently below the hero. 4-8 products in a clean grid. Each with: product photo, name, price, quick-add to cart.", tips: ["Show 'New Arrival' or 'Best Seller' badges on products", "Include a quick-add to cart button on hover", "Update this section regularly — returning visitors need to see newness"] },
      { order: 4, name: "Collections / Categories", priority: "Critical", desc: "Visual collection grid — each major product category gets a card with a lifestyle photo. e.g. 'Dresses', 'Tops', 'Sale'. Makes browsing intuitive.", tips: ["Use lifestyle images for collection thumbnails — not flat lays", "Keep collection names simple and obvious", "Feature a 'Sale' or 'Under $X' collection prominently"] },
      { order: 5, name: "Brand Story / About", priority: "Medium", desc: "A short section on what makes your brand different. Your values, sourcing, why you started it. Especially important for independent brands competing with big retailers.", tips: ["'Woman-owned small business' or 'Sustainable materials' builds connection", "Keep it to 3-4 sentences with a lifestyle image", "Link to a full About page"] },
      { order: 6, name: "Social Proof / Reviews", priority: "High", desc: "Overall star rating, number of reviews, and 3-4 specific quotes. Pull from your Shopify reviews, Judge.me, or Google.", tips: ["Show review count prominently: '2,400+ 5-star reviews'", "Include photos from customer reviews if available", "Add a link to see all reviews"] },
      { order: 7, name: "Instagram / UGC Feed", priority: "Medium", desc: "A shoppable Instagram feed or grid of customer photos. Shows real people using your products — the most trusted form of social proof.", tips: ["Tag products in your Instagram posts for shop functionality", "Ask customers to tag you for a chance to be featured", "UGC (user-generated content) converts better than branded photography"] },
      { order: 8, name: "Email Signup / Newsletter", priority: "High", desc: "Offer a discount (10-15% off first order) in exchange for email signup. This is how you build your most valuable marketing asset.", tips: ["'Get 15% off your first order' outperforms 'Sign up for our newsletter'", "Place this mid-page AND in the footer", "Connect to Klaviyo or Mailchimp for automated welcome series"] },
    ]
  },
  contractor: {
    label: "Contractor / Trades",
    sections: [
      { order: 1, name: "Hero Section", priority: "Critical", desc: "Photo of your best completed project or your team at work. Clear headline: what you do + where (e.g. 'Pittsburgh's Premier Kitchen Remodeler'). Phone number large and visible. CTA: Get a Free Quote. If emergency service: red emergency button.", tips: ["Show your actual work — not stock photos", "Phone number should be clickable on mobile", "Add license and insurance badges near the hero"] },
      { order: 2, name: "Services", priority: "Critical", desc: "List every service you offer with a photo, description, and 'Get a Quote' CTA for each. Create dedicated pages for each major service.", tips: ["Each service page should target '[service] + [city]' as a keyword", "Include project examples for each service type", "Add rough pricing ranges or 'starting at' if comfortable"] },
      { order: 3, name: "Get a Quote Form", priority: "Critical", desc: "Simple form: name, phone, email, type of project, approximate budget, timeline. Should appear within the first two scrolls of the page.", tips: ["Phone number is more important than email — most contractors prefer to call", "Add 'We respond within 24 hours' to set expectations", "Consider a two-step form: just contact info first, then project details"] },
      { order: 4, name: "Project Portfolio / Past Work", priority: "Critical", desc: "Photo gallery of completed projects organized by type. Before/after photos are extremely powerful for contractors.", tips: ["Before/after sliders convert better than standard galleries", "Label each project: what was done, materials used, approximate timeline", "Ask clients for permission to photograph their finished space"] },
      { order: 5, name: "Trust & Credentials", priority: "High", desc: "License number, insurance info, years in business, awards, manufacturer certifications, BBB rating. This section converts hesitant prospects.", tips: ["Display your contractor license number prominently", "Show 'Fully insured' and what that means for the homeowner", "Include any manufacturer or product certifications"] },
      { order: 6, name: "Service Area", priority: "High", desc: "Every city, town, and neighborhood you serve listed explicitly. This is critical for local SEO. Include a service area map.", tips: ["List 20-30 specific cities/areas you serve", "Create individual landing pages for your top service areas", "Add 'Serving [city] for X years' to each area page"] },
      { order: 7, name: "Reviews / Testimonials", priority: "High", desc: "Google review rating, specific client quotes with their name and project type. Link to Google for more reviews.", tips: ["Include the project type in each testimonial context", "Video testimonials from homeowners showing their finished project are incredibly powerful", "Ask for reviews immediately after project completion"] },
      { order: 8, name: "Contact / Footer", priority: "High", desc: "Phone (tap-to-call), email, address (if you have a showroom), service area, hours, social media, license number.", tips: ["Repeat your phone number in the footer", "Include your license and insurance badges", "Add a link to your Google Business Profile"] },
    ]
  },
  retail: {
    label: "Retail / Boutique",
    sections: [
      { order: 1, name: "Hero Section", priority: "Critical", desc: "Beautiful lifestyle image of your store or products. Headline capturing your brand personality. CTA: Shop Online / Visit Us / View New Arrivals. Hours and address visible immediately.", tips: ["Show the in-store experience if you have a beautiful space", "Include your location prominently for foot traffic", "Add 'Now open' or your hours directly in the hero"] },
      { order: 2, name: "Featured Products / New Arrivals", priority: "Critical", desc: "Your newest or most popular items in a product grid. Direct link to purchase or 'add to cart' if you have online shopping.", tips: ["Update this section weekly to give regulars a reason to revisit", "Add 'Just In' badges to new inventory", "Show real people using or wearing the products"] },
      { order: 3, name: "Location & Hours", priority: "Critical", desc: "Embedded Google Map, full address, all hours (including weekends and holidays), parking info, phone number.", tips: ["Make the Google Map embed interactive so people can get directions in one tap", "List holiday hours as soon as you know them", "Add 'Free parking available' if relevant"] },
      { order: 4, name: "Collections / Shop by Category", priority: "High", desc: "Organized product categories with lifestyle imagery. Makes online browsing intuitive.", tips: ["Create a 'Sale' or 'Under $50' category — always popular", "Use lifestyle images for category thumbnails", "Feature seasonal collections prominently"] },
      { order: 5, name: "About / Our Story", priority: "Medium", desc: "Who you are, why you started this store, what makes it special. Local retail competes on personality and community — show yours.", tips: ["Mention your neighborhood or local connection", "Include photos of the owner and staff", "Talk about your curation philosophy — why you choose what you carry"] },
      { order: 6, name: "Events / In-Store Happenings", priority: "Medium", desc: "Trunk shows, sales events, local partnerships, workshops. Give people a reason to visit beyond shopping.", tips: ["Link to your Facebook Events page for upcoming events", "Add a signup for event notifications", "Feature photos from past events to show the experience"] },
      { order: 7, name: "Reviews / Social Proof", priority: "High", desc: "Google reviews, Yelp rating, specific customer quotes.", tips: ["Local retail customers care a lot about reviews — display them prominently", "Include a direct link to leave a Google review", "Respond to every review publicly"] },
      { order: 8, name: "Email Signup / Newsletter", priority: "High", desc: "Offer an incentive for email signup: first purchase discount, early access to sales, exclusive content.", tips: ["'Get 10% off your first purchase' is a proven converter", "Promote in-store events and new arrivals via email", "Connect to Klaviyo or Mailchimp"] },
    ]
  },
  medical: {
    label: "Medical / Health / Wellness",
    sections: [
      { order: 1, name: "Hero Section", priority: "Critical", desc: "Professional, warm photo of your practice, team, or a patient interaction. Clear headline about what you treat and who you serve. Primary CTA: Book an Appointment / Request a Consultation. Phone number prominently visible.", tips: ["Use photos of your actual team and practice — not stock medical photos", "Make the booking CTA the most prominent element", "Add 'Accepting new patients' if applicable"] },
      { order: 2, name: "Services / Treatments", priority: "Critical", desc: "Every service or treatment you offer with a description. Who it's for, what to expect, how long it takes. Each should have its own dedicated page.", tips: ["Create individual pages for each major service — critical for medical SEO", "Include what conditions each treatment addresses", "Add 'Does insurance cover this?' information where relevant"] },
      { order: 3, name: "Book an Appointment", priority: "Critical", desc: "Embedded booking system (Zocdoc, Jane App, Mindbody, Calendly, or your EHR's patient portal). This should be easy to find from every page.", tips: ["Embed booking directly — don't just link to an external site", "Show your availability prominently", "Add telehealth option if you offer it"] },
      { order: 4, name: "Meet the Team", priority: "High", desc: "Provider profiles: photo, name, credentials, specialties, education, personal statement. Patients choose providers they feel connected to.", tips: ["Include every credential and certification — they matter in healthcare", "Add a personal element: why they went into this field", "Show photos that look approachable, not clinical"] },
      { order: 5, name: "Insurance & Payment", priority: "High", desc: "List every insurance you accept. Payment options. This is one of the most-searched things on medical websites.", tips: ["List all accepted insurances explicitly — a searchable list if there are many", "Add 'Don't see your insurance? Call us.' with phone number", "Include payment plan options if you offer them"] },
      { order: 6, name: "Patient Reviews / Testimonials", priority: "High", desc: "Verified patient reviews (Google, Healthgrades, Zocdoc). Star rating. Specific quotes about the experience.", tips: ["Healthgrades and Google reviews are most trusted for medical providers", "Include a link to leave a review on Google", "Respond to every review — especially negative ones"] },
      { order: 7, name: "Location & Hours", priority: "Critical", desc: "Embedded Google Map, full address, parking info, public transit, hours, after-hours contact info.", tips: ["Include parking and accessibility information — matters for patients with mobility issues", "Add after-hours emergency contact information clearly", "Show wait time or 'same-day appointments available' if applicable"] },
      { order: 8, name: "FAQ", priority: "Medium", desc: "What to bring to a first appointment, what to expect, cancellation policy, insurance questions, how long appointments are.", tips: ["Answer insurance questions specifically — they're the most common concern", "Add a 'What to bring' checklist for new patients", "Include your cancellation and no-show policy clearly"] },
    ]
  },
  real_estate: {
    label: "Real Estate",
    sections: [
      { order: 1, name: "Hero Section", priority: "Critical", desc: "Professional headshot or lifestyle photo. Headline positioning: your market, your specialty, your value. CTA: Search Homes / Get a Free Home Valuation / Contact Me. Your phone number prominently visible.", tips: ["'Selling homes in [neighborhood] for X years' is more compelling than just your name", "Include your brokerage if it adds credibility", "Free home valuation CTA gets a lot of clicks from homeowners"] },
      { order: 2, name: "Property Search / Listings", priority: "Critical", desc: "IDX integration for live MLS listings, or your current featured listings. Buyers expect to search on your site.", tips: ["IDX integration is essential — contact your broker for the preferred tool", "Feature your current listings prominently", "Add neighborhood-specific search filters"] },
      { order: 3, name: "Home Valuation Tool", priority: "High", desc: "A lead capture tool where homeowners can get an estimate of their home's value. This is your best seller lead magnet.", tips: ["Connect to a tool like HomeBot, Cloud CMA, or a simple form", "Follow up within the hour — these leads are very warm", "Add 'Get your free home value report in 24 hours'"] },
      { order: 4, name: "Buyer / Seller Resources", priority: "High", desc: "Separate sections for buyers and sellers. Guides, checklists, what to expect from the process.", tips: ["Create a First-Time Buyer Guide as a downloadable lead magnet", "Include a step-by-step home selling process guide", "Video walkthroughs of the buying/selling process perform well"] },
      { order: 5, name: "Neighborhoods / Market Areas", priority: "High", desc: "Pages dedicated to each neighborhood or area you specialize in. Market stats, lifestyle info, available homes.", tips: ["Neighborhood pages are gold for local real estate SEO", "Include school ratings, average home prices, and neighborhood character", "Create a 'Living in [Neighborhood]' blog post series"] },
      { order: 6, name: "About / Why Work With Me", priority: "High", desc: "Your experience, sales volume, average days on market, list-to-sale ratio. Specific results, not vague claims.", tips: ["Include specific stats: 'Sold 47 homes in 2024, average 98% of list price'", "Add video introduction — it builds trust faster than photos", "Include your brokerage and any awards or designations"] },
      { order: 7, name: "Client Reviews / Testimonials", priority: "Critical", desc: "Google reviews, Zillow reviews, Realtor.com reviews. Specific quotes about the experience and results.", tips: ["Pull from multiple review platforms — shows consistency", "Include the client's situation: 'First-time buyer in a competitive market'", "Video testimonials from recent clients are extremely persuasive"] },
      { order: 8, name: "Contact", priority: "Critical", desc: "Phone, email, contact form, your brokerage address. Connect to your calendar for consultations.", tips: ["Add a 'Schedule a consultation' calendar embed", "Include your cell number — clients want to reach you directly", "Add your social media profiles, especially Instagram and Facebook"] },
    ]
  },
  salon_beauty: {
    label: "Salon / Beauty",
    sections: [
      { order: 1, name: "Hero Section", priority: "Critical", desc: "Beautiful photo of your salon or your best work. Brand vibe immediately visible. Primary CTA: Book an Appointment — linked directly to your booking system. Phone number visible.", tips: ["Show your actual salon and work — atmosphere sells beauty services", "Your booking CTA should be one tap from the hero", "Include a tagline that captures your vibe: 'Pittsburgh's Premier Color Studio'"] },
      { order: 2, name: "Book an Appointment", priority: "Critical", desc: "Embed your booking system (Vagaro, StyleSeat, Square Appointments, Fresha) directly on the page. Show available times. Make it instant.", tips: ["Embed booking directly — don't just link to an external site", "Show real-time availability", "Allow clients to choose their specific stylist"] },
      { order: 3, name: "Services / Menu", priority: "Critical", desc: "Every service with a description, starting price, and approximate time. Organized by category: Hair, Color, Extensions, Nails, etc.", tips: ["Include prices — clients expect to see them for beauty services", "List appointment duration so clients can plan their day", "Add 'New Client Special' prominently"] },
      { order: 4, name: "Gallery / Portfolio", priority: "Critical", desc: "Photos of your actual work — hair, nails, makeup. Organized by service type. Updated regularly.", tips: ["Post new work weekly — Google loves fresh content", "Tag the stylist who did each look", "Instagram integration works well for automatic gallery updates"] },
      { order: 5, name: "Meet the Team", priority: "High", desc: "Each stylist or technician with their photo, specialties, years of experience, and a booking link directly to them.", tips: ["Include each stylist's Instagram handle for potential clients to preview their work", "List their certifications and specialties", "Link each stylist's profile to their online booking"] },
      { order: 6, name: "Products / Retail", priority: "Medium", desc: "Products you use and sell in the salon. Links to purchase if you sell online.", tips: ["Mention the professional brands you use — it builds credibility", "If you have an online shop, link directly to purchase", "Include 'Ask about our product recommendations at your appointment'"] },
      { order: 7, name: "Reviews / Testimonials", priority: "High", desc: "Google and Yelp reviews. Star rating. Specific quotes about stylists and results.", tips: ["Beauty clients rely heavily on reviews — display them prominently", "Include before/after photos alongside reviews when possible", "Make it easy to leave a review after each appointment"] },
      { order: 8, name: "Location & Contact", priority: "High", desc: "Address with Google Map, parking, hours for each day, phone, email, Instagram link.", tips: ["Parking availability significantly affects booking decisions", "List hours for each day clearly — they vary for salons", "Link to Instagram prominently — it's often the #1 discovery channel for salons"] },
    ]
  },
  other: {
    label: "Custom Business",
    sections: [
      { order: 1, name: "Hero Section", priority: "Critical", desc: "Your best photo or image representing your business. Clear headline: what you do and who you serve. Primary CTA tied to your #1 business goal. Contact info visible.", tips: ["Be specific in your headline — vague headlines lose visitors in 3 seconds", "Your CTA should match the stage your visitors are at", "Use a real photo of your business, product, or team"] },
      { order: 2, name: "What You Offer", priority: "Critical", desc: "Your products, services, or programs clearly laid out. Each with a description, price if applicable, and a CTA.", tips: ["Lead with your most popular or highest-margin offering", "Create a dedicated page for each major service or product", "Include the outcome or benefit, not just the feature"] },
      { order: 3, name: "Primary Conversion Point", priority: "Critical", desc: "Whatever action you most want visitors to take — a form, a booking calendar, an add-to-cart, a phone number. This should appear multiple times on the page.", tips: ["Your primary CTA should appear at least 3 times on the homepage", "Make it easy — fewer clicks to conversion = higher conversion rate", "Test different CTAs to see which performs best"] },
      { order: 4, name: "Trust Signals", priority: "High", desc: "Reviews, credentials, years in business, logos of clients or media mentions, certifications. Whatever makes someone feel safe choosing you.", tips: ["Social proof is the #1 factor in online conversion decisions", "Specific numbers are more credible than vague claims", "Include a direct link to leave a Google review"] },
      { order: 5, name: "About / Your Story", priority: "Medium", desc: "Who you are, why you do this, what makes you different. People buy from people — show the human behind the business.", tips: ["Keep it customer-focused — how does your story benefit them?", "Include a real photo of you or your team", "Mention your location if you serve a local market"] },
      { order: 6, name: "Results / Portfolio / Work", priority: "High", desc: "Evidence that you deliver. Case studies, portfolio pieces, before/after, or project examples.", tips: ["Specific results always outperform general claims", "Photos of completed work build confidence faster than descriptions", "Video walkthroughs of your work or process perform extremely well"] },
      { order: 7, name: "FAQ", priority: "Medium", desc: "Answer the top 5-8 questions your customers ask. Address objections before they're raised.", tips: ["Answer 'How much does it cost?' even if just a range", "Include process questions — 'What happens after I contact you?'", "FAQ content often ranks in Google's 'People Also Ask' section"] },
      { order: 8, name: "Contact / Footer", priority: "High", desc: "All contact methods, hours, location if applicable, social media. Repeat your primary CTA.", tips: ["Make every contact method a clickable link on mobile", "Repeat your main CTA one more time in the footer", "Include your social media profiles"] },
    ]
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const {
      business_name, email, business_type, industry_note,
      website_status, builder, primary_goal, primary_cta,
      takes_reservations, sells_online, has_portfolio,
      emergency_service, specific_notes
    } = req.body;

    const structure = STRUCTURES[business_type] || STRUCTURES.other;

    // Customize sections based on answers
    let sections = [...structure.sections];

    // Inject emergency CTA note if applicable
    if (emergency_service === 'yes') {
      sections[0] = {
        ...sections[0],
        desc: sections[0].desc + ' IMPORTANT: Add a prominent red "24/7 Emergency Service" button at the very top of your page — above the navigation if possible. Include your emergency phone number separately from your regular contact.',
        tips: [...sections[0].tips, 'Emergency CTA should be the FIRST thing visible — before the main hero', 'Use red or orange color to signal urgency']
      };
    }

    // Add reservations note
    if (takes_reservations === 'yes_third_party') {
      const resSection = sections.find(s => s.name.includes('Reservation') || s.name.includes('Booking') || s.name.includes('Appointment'));
      if (resSection) {
        resSection.tips = [...resSection.tips, 'Embed your third-party reservation system (OpenTable, Calendly, etc.) directly on the page — never just link to it'];
      }
    }

    // Add specific notes if provided
    const additionalNotes = specific_notes ? `\n\nClient-specific request: ${specific_notes}` : '';

    const prompt = `You are an expert web designer and UX strategist. Enhance and personalize the following website blueprint for this specific business.

Business Name: ${business_name}
Business Type: ${business_type} (${structure.label})
Website Status: ${website_status}
Builder: ${builder}
Primary Goal: ${primary_goal}
Primary CTA: ${primary_cta}
Takes Reservations/Appointments: ${takes_reservations || 'N/A'}
Sells Online: ${sells_online || 'N/A'}
Has Portfolio Need: ${has_portfolio || 'N/A'}
Emergency Service: ${emergency_service || 'N/A'}
Additional Notes: ${specific_notes || 'None'}${additionalNotes}

Based on these answers, provide a personalized insight for each section — a 1-2 sentence specific recommendation tailored to THIS business. Be specific to their industry and situation. Also provide an overall website headline recommendation and a meta description suggestion.

Return ONLY valid JSON:
{
  "headline_recommendation": "suggested homepage headline for this specific business",
  "meta_description": "suggested meta description 150-160 chars for this business",
  "builder_tip": "one specific tip for their chosen website builder/situation",
  "section_insights": {
    "1": "personalized insight for section 1 based on their specific business",
    "2": "personalized insight for section 2",
    "3": "personalized insight for section 3",
    "4": "personalized insight for section 4",
    "5": "personalized insight for section 5",
    "6": "personalized insight for section 6",
    "7": "personalized insight for section 7",
    "8": "personalized insight for section 8"
  },
  "top_3_priorities": [
    "most critical thing to get right for this specific business",
    "second most critical",
    "third most critical"
  ],
  "common_mistake": "the most common website mistake businesses like this make"
}`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const groqData = await groqRes.json();
    const rawText = groqData.choices[0].message.content;
    let aiInsights;
    try {
      aiInsights = JSON.parse(rawText.replace(/```json|```/g, '').trim());
    } catch {
      aiInsights = { headline_recommendation: null, section_insights: {}, top_3_priorities: [], common_mistake: null };
    }

    const blueprint = { structure, aiInsights, business_type, sections };

    await pool.query(`
      CREATE TABLE IF NOT EXISTS website_blueprints (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT, business_name TEXT, business_type TEXT,
        website_status TEXT, builder TEXT, primary_goal TEXT, primary_cta TEXT,
        takes_reservations TEXT, sells_online TEXT, has_portfolio TEXT,
        emergency_service TEXT, specific_notes TEXT,
        blueprint JSONB, payment_status TEXT DEFAULT 'unpaid',
        email_sent BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const result = await pool.query(
      `INSERT INTO website_blueprints (
        email, business_name, business_type, website_status, builder,
        primary_goal, primary_cta, takes_reservations, sells_online,
        has_portfolio, emergency_service, specific_notes, blueprint
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
      [email, business_name, business_type, website_status, builder,
       primary_goal, primary_cta, takes_reservations, sells_online,
       has_portfolio, emergency_service, specific_notes, JSON.stringify(blueprint)]
    );

    return res.status(200).json({ id: result.rows[0].id, blueprint });

  } catch (err) {
    console.error('submit-website-blueprint error:', err);
    return res.status(500).json({ error: err.message });
  }
}
