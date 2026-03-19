import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })

// Apply the bypass here as well!
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter })

// This is the payload.
// This is the payload. 
const lexiconData = [
    // --- PHASE 1: ZODIAC ARCHETYPES ---
    {
        category: 'Zodiac',
        key: 'Aries',
        title: 'Aries (The Initiator)',
        description: `You carry the spark of genesis. This energy is the raw, kinetic force of new beginnings, cutting through stagnation with pure will. It is the courage to act before the path is fully visible, driven by a deeply independent spirit that thrives on overcoming friction and blazing new trails.`
    },
    {
        category: 'Zodiac',
        key: 'Taurus',
        title: 'Taurus (The Earthly Anchor)',
        description: `You hold the frequency of profound grounding and material mastery. This energy builds lasting structures, deeply attuned to the tactile world, nature, and the steady accumulation of value. It is the steady heartbeat of endurance, turning abstract ideas into tangible, beautiful realities.`
    },
    {
        category: 'Zodiac',
        key: 'Gemini',
        title: 'Gemini (The Linguistic Weaver)',
        description: `You are the ultimate synthesizer of information. This energy thrives on curiosity, rapid data exchange, and the bridging of diverse concepts. Like a mirror reflecting multiple truths, it requires mental agility, constant communication, and the freedom to explore the spaces between ideas.`
    },
    {
        category: 'Zodiac',
        key: 'Cancer',
        title: 'Cancer (The Emotional Sanctuary)',
        description: `You govern the deep waters of intuition and soul-level security. This energy is fiercely protective, fiercely nurturing, and anchored in the ancestral root system. It operates through feeling rather than logic, creating sacred spaces where true vulnerability and healing can occur.`
    },
    {
        category: 'Zodiac',
        key: 'Leo',
        title: 'Leo (The Sovereign Heart)',
        description: `You radiate the frequency of creative actualization. This energy is bold, heart-centered, and inherently magnetic, drawing others into its warmth. It is the archetype of the conscious creator, tasked with expressing their deepest truth unapologetically and leading through joyful authenticity.`
    },
    {
        category: 'Zodiac',
        key: 'Virgo',
        title: 'Virgo (The Sacred Architect)',
        description: `You possess the gift of divine refinement. This energy sees the hidden mechanics of reality, seeking to purify, optimize, and serve. It is the pursuit of earthly perfection—not out of anxiety, but out of a deep desire to heal broken systems and align the physical world with its highest potential.`
    },
    {
        category: 'Zodiac',
        key: 'Libra',
        title: 'Libra (The Dynamic Harmonizer)',
        description: `You are the fulcrum of equilibrium. This energy seeks profound relational balance, beauty, and justice. It understands that true alchemy happens in the mirror of the "other." It is the art of holding space for opposing forces and weaving them into a unified, elegant whole.`
    },
    {
        category: 'Zodiac',
        key: 'Scorpio',
        title: 'Scorpio (The Deep Alchemist)',
        description: `You traverse the underworld of the psyche. This energy is not afraid of the dark; it seeks out shadows to transform them into power. It is the force of death and rebirth, emotional intensity, and psychological truth, constantly shedding old skins to reveal a more resilient core.`
    },
    {
        category: 'Zodiac',
        key: 'Sagittarius',
        title: 'Sagittarius (The Horizon Explorer)',
        description: `You are the seeker of ultimate truth. This energy is a restless, expansive fire that hungers for meaning, philosophy, and paradigm-shifting experiences. It is the archer pointing their arrow at the stars, driven by an unshakeable optimism and a need to understand the grand design.`
    },
    {
        category: 'Zodiac',
        key: 'Capricorn',
        title: 'Capricorn (The Structural Master)',
        description: `You are the builder of legacies. This energy understands the alchemy of time, discipline, and earthly ambition. It scales the highest mountains through strategic focus and unwavering integrity, creating systems and authorities that stand the test of generational shifts.`
    },
    {
        category: 'Zodiac',
        key: 'Aquarius',
        title: 'Aquarius (The Quantum Visionary)',
        description: `You hold the blueprint for the future. This energy is inherently disruptive, breaking outdated molds to elevate the collective consciousness. It is the archetype of the rebel genius—deeply objective, fiercely independent, and dedicated to the evolution of the human network.`
    },
    {
        category: 'Zodiac',
        key: 'Pisces',
        title: 'Pisces (The Unified Field)',
        description: `You represent the dissolution of boundaries. This energy is the ocean of collective empathy, mysticism, and spiritual permeability. It operates beyond logic, touching the divine through art, dreams, and unconditional compassion, understanding that all separations are merely an illusion.`
    },
    {
        category: 'Zodiac',
        key: 'Ophiuchus',
        title: 'Ophiuchus (The Serpent Bearer)',
        description: `The hidden gateway. You hold the frequency of the esoteric healer and the shaman. Bridging the destructive depth of Scorpio and the expansive truth of Sagittarius, this energy is tasked with transmuting cosmic poison into medicine. It is the archetype of the true alchemist, deeply attuned to the unseen energetic currents of the universe.`
    },
    // --- PHASE 1: PLANETARY DRIVERS ---
    {
        category: 'Planet',
        key: 'Sun',
        title: 'The Sun (Sovereign Essence)',
        description: `Your core identity and vital life force. The Sun dictates how you shine your light into the world, your fundamental ego-structure, and the conscious purpose you are here to actualize.`
    },
    {
        category: 'Planet',
        key: 'Moon',
        title: 'The Moon (Emotional Matrix)',
        description: `Your intuitive compass and inner sanctuary. The Moon reveals how you process feelings, what makes you feel safe, and the subconscious habits you retreat into when the world becomes overwhelming.`
    },
    {
        category: 'Planet',
        key: 'Mercury',
        title: 'Mercury (Cognitive Processing)',
        description: `Your mental operating system. Mercury governs how you gather data, formulate your thoughts, and transmit your ideas to others. It is the bridge between your inner world and outer reality.`
    },
    {
        category: 'Planet',
        key: 'Venus',
        title: 'Venus (Relational Magnetism)',
        description: `Your center of gravity for love, beauty, and value. Venus shows what you attract, what you find aesthetically pleasing, and how you naturally weave harmony into your partnerships and finances.`
    },
    {
        category: 'Planet',
        key: 'Mars',
        title: 'Mars (Kinetic Drive)',
        description: `Your engine of execution. Mars dictates your willpower, your assertiveness, and how you conquer obstacles. It is the raw, burning fuel you use to defend your boundaries and go after what you desire.`
    },
    {
        category: 'Planet',
        key: 'Jupiter',
        title: 'Jupiter (Expansion Vector)',
        description: `Your philosophy of abundance. Jupiter shows where you are naturally gifted with luck, optimism, and an urge to grow. It is the cosmic magnifying glass that expands whatever it touches.`
    },
    {
        category: 'Planet',
        key: 'Saturn',
        title: 'Saturn (The Great Teacher)',
        description: `Your structural reality and karmic discipline. Saturn reveals where you will face restriction and delay, demanding mastery, patience, and absolute accountability before granting its lasting rewards.`
    },
    {
        category: 'Planet',
        key: 'Uranus',
        title: 'Uranus (Awakening Catalyst)',
        description: `Your frequency of revolution. Uranus shows where you must break the rules, where you experience sudden flashes of genius, and where you are meant to disrupt the status quo in your life.`
    },
    {
        category: 'Planet',
        key: 'Neptune',
        title: 'Neptune (Spiritual Permeability)',
        description: `Your connection to the divine dream. Neptune governs your highest ideals, artistic inspiration, and spiritual illusions. It shows where you seek to escape earthly reality and merge with the infinite.`
    },
    {
        category: 'Planet',
        key: 'Pluto',
        title: 'Pluto (Evolutionary Forge)',
        description: `Your cycle of total transformation. Pluto is the deep, subterranean power that strips away what is false. It shows where you must undergo psychological death and rebirth to claim your true empowerment.`
    },
    // --- PHASE 2: ASTROLOGICAL HOUSES ---
    {
        category: 'House',
        key: 'Sector1',
        title: 'The 1st Sector (The Sovereign Identity)',
        description: `This is the lens through which you perceive reality and how reality perceives you. It governs your immediate physical presence, your instinctual reactions, and the persona you naturally project when navigating the world. It is the raw dawn of your personal matrix.`
    },
    {
        category: 'House',
        key: 'Sector2',
        title: 'The 2nd Sector (The Material Architecture)',
        description: `This zone governs the tangible realm. It is the arena of personal resources, financial mastery, and your foundational sense of self-worth. It dictates how you anchor your energy into the physical plane and what you value enough to build and protect.`
    },
    {
        category: 'House',
        key: 'Sector3',
        title: 'The 3rd Sector (The Cognitive Environment)',
        description: `This is the matrix of your immediate surroundings. It rules how you gather and transmit data, your local network of peers, and your daily interactions. It is the space of rapid mental exchange, learning, and the friction of communication.`
    },
    {
        category: 'House',
        key: 'Sector4',
        title: 'The 4th Sector (The Ancestral Root)',
        description: `The foundational bedrock of your chart. This sector governs your private sanctuary, psychological roots, and inherited generational patterns. It is the deepest midnight of the soul, where you retreat to heal, integrate, and find your most profound emotional security.`
    },
    {
        category: 'House',
        key: 'Sector5',
        title: 'The 5th Sector (The Creative Forge)',
        description: `This is the arena of pure, unbridled life force. It governs what you create simply for the joy of creating—whether that is art, romance, or a legacy of inspiration. It is where you are asked to shine unapologetically and take risks from the heart.`
    },
    {
        category: 'House',
        key: 'Sector6',
        title: 'The 6th Sector (The Sacred Mechanics)',
        description: `The zone of daily refinement and mind-body alignment. It dictates your physical habits, your relationship to routine, and how you optimize your earthly vessel. It is the quiet alchemy of daily work, where small, consistent actions build profound mastery and service.`
    },
    {
        category: 'House',
        key: 'Sector7',
        title: 'The 7th Sector (The Relational Mirror)',
        description: `This is where the self meets the "other." It governs the dynamic equilibrium of one-on-one partnerships, both romantic and professional. It is the profound realization that certain parts of your own psyche can only be understood when reflected back by someone else.`
    },
    {
        category: 'House',
        key: 'Sector8',
        title: 'The 8th Sector (The Alchemical Crucible)',
        description: `The most intense zone of the matrix. This sector rules shadow work, shared resources, and psychological intimacy. It is the space of necessary destruction and rebirth, where you must surrender control to merge deeply with another or to transform your own trauma into power.`
    },
    {
        category: 'House',
        key: 'Sector9',
        title: 'The 9th Sector (The Expanding Horizon)',
        description: `The arena of truth-seeking. This zone governs higher philosophy, long-distance travel, and the expansion of your personal paradigm. It is where you step out of the familiar to hunt for universal meaning and synthesis.`
    },
    {
        category: 'House',
        key: 'Sector10',
        title: 'The 10th Sector (The Earthly Legacy)',
        description: `The highest point of your chart. This sector governs your public impact, your career architecture, and the authority you build in the physical world. It is the space where you take your inner mastery and use it to shape the systems around you.`
    },
    {
        category: 'House',
        key: 'Sector11',
        title: 'The 11th Sector (The Quantum Network)',
        description: `This is the domain of the collective future. It rules your alignment with larger communities, disruptive innovations, and shared humanitarian visions. It is where you break free from personal ego to elevate the grid alongside your chosen allies.`
    },
    {
        category: 'House',
        key: 'Sector12',
        title: 'The 12th Sector (The Unified Field)',
        description: `The final frontier before rebirth. This sector governs the unseen world, the subconscious mind, dreams, and spiritual dissolution. It is where boundaries melt away, asking you to surrender your attachments and access the infinite, unconditional ether.`
    },
    // --- PHASE 2: LUNAR NODES & ANGLES ---
    {
        category: 'Node',
        key: 'NorthNode',
        title: 'The True North Node (The Evolutionary Imperative)',
        description: `This is your cosmic True North. It represents the unfamiliar territory your soul specifically incarnated to explore. Moving toward this energy will always feel deeply uncomfortable and challenging, but it is the exact friction required to unlock your highest destiny and break old karmic loops.`
    },
    {
        category: 'Node',
        key: 'SouthNode',
        title: 'The South Node (The Karmic Reservoir)',
        description: `This is your default operating system. It represents the traits, skills, and defenses you have already mastered across lifetimes. While this energy feels incredibly safe and natural, remaining here too long leads to stagnation. The alchemical goal is not to abandon these gifts, but to extract their wisdom and carry it forward toward your North Node.`
    },
    {
        category: 'Point',
        key: 'Ascendant',
        title: 'Ascendant / AC (The Sovereign Dawn)',
        description: `The entry point of your energetic matrix. This is the exact frequency of the horizon the moment you incarnated. It dictates your physical vessel, your instinctual first reactions, and the specific armor you wear when interfacing with a new reality.`
    },
    {
        category: 'Point',
        key: 'Descendant',
        title: 'Descendant / DC (The Shadow Mirror)',
        description: `The point of the setting sun. This is the energy you subconsciously disown and project onto others. It represents the exact energetic counterweight you seek in partnerships to achieve total alchemy and wholeness.`
    },
    {
        category: 'Point',
        key: 'Midheaven',
        title: 'Midheaven / MC (The Earthly Zenith)',
        description: `The highest point of your cosmic architecture. This is your ultimate legacy, your public authority, and the specific vibration you are meant to inject into the collective consciousness.`
    },
    {
        category: 'Point',
        key: 'ImumCoeli',
        title: 'Imum Coeli / IC (The Midnight Root)',
        description: `The deepest, most hidden anchor of your chart. This is the realm of the ancestors, your profound psychological bedrock, and the private sanctuary you must retreat to in order to recharge your kinetic output.`
    },
    {
        category: 'Point',
        key: 'Lilith',
        title: 'Black Moon Lilith (The Untamed Shadow)',
        description: `The raw, unapologetic feminine force. Lilith represents the power you have been told to suppress. It is where you refuse to submit, holding immense magnetic power, primal boundary-setting, and the ferocious reclamation of your sovereignty.`
    },
    {
        category: 'Point',
        key: 'Selene',
        title: 'White Moon Selene (The Luminous Grace)',
        description: `The purest point of uncorrupted light in your matrix. Selene represents your highest karmic reward, a zone of divine protection, and the innate, effortless spiritual gifts you brought with you into this incarnation.`
    },
    {
        category: 'Point',
        key: 'Vertex',
        title: 'Vertex (The Fated Gate)',
        description: `The cosmic lightning rod. This point does not activate through your own willpower; it is activated by fated encounters. When transit planets or another person’s chart hits your Vertex, it triggers unavoidable, destiny-altering timeline shifts.`
    },
    {
        category: 'Point',
        key: 'AntiVertex',
        title: 'Anti-Vertex (The Conscious Release)',
        description: `The exact opposite of the Vertex. This point represents what you must consciously release or sacrifice in order to allow the fated events of the Vertex to successfully manifest.`
    },
    // --- PHASE 3: STARSEED ORIGINS & SYSTEMS ---
    {
        category: 'Starseed',
        key: 'Orion',
        title: 'Orion (The Systems Architect)',
        description: `Your energetic lineage is one of profound mental mastery and the integration of polarity. Orions incarnate to study the extreme spectrums of light and dark, logic and emotion, in order to synthesize them into a unified, flawless system. You are a builder of new paradigms, driven by an unquenchable thirst for knowledge and the alchemical desire to heal fractured networks through profound understanding.`
    },
    {
        category: 'Starseed',
        key: 'Sirian',
        title: 'Sirian (The Grid Guardian)',
        description: `You carry the frequency of the esoteric teacher and the earth-keeper. Sirian energy is deeply connected to sacred geometry, ancient wisdom, and the structural integrity of the planet itself. You operate with a quiet, grounded strength, acting as a stabilizing anchor during times of massive collective transition. Your mission is often one of silent service, embedding high-frequency light into the physical realm.`
    },
    {
        category: 'Starseed',
        key: 'Pleiadian',
        title: 'Pleiadian (The Heart Transmuter)',
        description: `Your blueprint is centered entirely around the frequency of unconditional love and emotional alchemy. Pleiadians are the artists, the healers, and the empaths of the cosmos. You incarnate to break down rigid, fear-based structures by injecting them with pure, heart-centered resonance. Your greatest weapon and your ultimate mission is your capacity to feel deeply and heal others through connection.`
    },
    {
        category: 'Starseed',
        key: 'Arcturian',
        title: 'Arcturian (The Quantum Diplomat)',
        description: `You hold the archetype of the advanced energetic strategist. Arcturian energy represents the pinnacle of emotional detachment used for the highest good—the ability to view complex, chaotic situations with profound, loving logic. You are here to introduce elevated concepts of healing, technology, and community design, guiding the collective toward a highly efficient, harmonious future.`
    },
    {
        category: 'Starseed',
        key: 'Lyran',
        title: 'Lyran (The Ancient Pioneer)',
        description: `You carry the raw, untamed fire of the original creators. Lyran energy is fierce, fiercely independent, and unbound by limitation. You are the vanguard, incarnating to shatter stagnant realities and blaze trails into the unknown. Your lineage asks you to embrace your personal sovereignty completely, leading not by management, but by the sheer, magnetic force of your own authentic action.`
    },
    {
        category: 'Starseed',
        key: 'Andromedan',
        title: 'Andromedan (The Freedom Catalyst)',
        description: `Your core frequency is absolute fluidity. Andromedans are the ultimate cosmic nomads, repelled by rigid systems, strict labels, and restrictive matrices. You are here to demonstrate how to live beyond borders and expectations. Your mission is to teach the collective how to remain adaptable, holding a vibration of peace while effortlessly flowing around the obstacles of the physical world.`
    },
    {
        category: 'Starseed',
        key: 'Mintakan',
        title: 'Mintakan (The Unified Empath)',
        description: `You possess the blueprint of the original waters—a deep, cellular memory of perfect harmony. Mintakans hold the purest form of empathy, always able to see the absolute highest potential in every soul they meet. Your earthly challenge and mission is to maintain your profound optimism and longing for unity, without allowing the density of the current world to extinguish your inner light.`
    },
    {
        category: 'System',
        key: 'Hermeticism',
        title: 'Hermeticism (The Mental Alchemy)',
        description: `The foundational code of the universe. This system teaches that "All is Mind," and that reality is shaped by the mastery of vibration, polarity, and rhythm. It is the operating manual for transmuting lower, lead-like states of consciousness into the gold of true sovereign power.`
    },
    {
        category: 'System',
        key: 'HumanDesign',
        title: 'Human Design (The Energetic Circuitry)',
        description: `The mechanical synthesis of your aura. This framework maps exactly how your physical and energetic bodies are designed to interact with the world. It bypasses mental conditioning, offering a precise, binary strategy for making decisions that are in absolute alignment with your authentic geometry.`
    },
    {
        category: 'System',
        key: 'IChing',
        title: 'I Ching / The Book of Changes (The Quantum Binary)',
        description: `The ancient mapping of cosmic flux. This system understands that nothing is static; all of reality is a constant, flowing transition between Yin (receptive) and Yang (active) forces. It acts as an oracle of probability, teaching you how to act in perfect accordance with the current energetic tide.`
    },
    {
        category: 'System',
        key: 'Kabbalah',
        title: 'Kabbalah & The Tree of Life (The Map of Emanation)',
        description: `The blueprint of creation. This mystical framework charts how infinite, divine light steps down through various dimensions to manifest in the dense physical world. It is the ultimate path of ascension, teaching the initiate how to balance the pillars of Mercy and Severity to become a pure vessel for higher consciousness.`
    },
    // --- PHASE 4: NUMEROLOGY & EPICYCLES ---
    {
        category: 'Numerology',
        key: 'LifePath1',
        title: 'Life Path 1 (The Sovereign Pioneer)',
        description: `You are the spark of genesis. Your path is to cultivate absolute self-reliance, leadership, and the courage to stand entirely alone when necessary. You are here to innovate, to initiate, and to carve new pathways through sheer willpower and unshakeable individuality.`
    },
    {
        category: 'Numerology',
        key: 'LifePath2',
        title: 'Life Path 2 (The Intuitive Diplomat)',
        description: `You are the master of the energetic mirror. Your path is one of profound emotional intelligence, cooperation, and the subtle art of binding fractured elements together. You operate behind the scenes, using your hypersensitivity to create harmony and balance within any system.`
    },
    {
        category: 'Numerology',
        key: 'LifePath3',
        title: 'Life Path 3 (The Expressive Catalyst)',
        description: `You hold the frequency of joyful, kinetic creation. Your path is to master the transmission of ideas—whether through the spoken word, art, or pure charisma. You are the alchemist of emotion, tasked with uplifting the collective by unapologetically sharing your authentic inner vision.`
    },
    {
        category: 'Numerology',
        key: 'LifePath4',
        title: 'Life Path 4 (The Master Architect)',
        description: `You are the anchor of the physical plane. Your path is to build systems, structures, and legacies that outlast you. You possess the rare discipline to turn abstract dreams into tangible reality through relentless dedication, logic, and a refusal to cut corners.`
    },
    {
        category: 'Numerology',
        key: 'LifePath5',
        title: 'Life Path 5 (The Dynamic Explorer)',
        description: `You are the agent of cosmic chaos and necessary change. Your path is one of relentless curiosity, adaptability, and breaking stagnant paradigms. You require absolute freedom to experience the full spectrum of the human condition, acting as a catalyst for others to break their own chains.`
    },
    {
        category: 'Numerology',
        key: 'LifePath6',
        title: 'Life Path 6 (The Harmonious Guardian)',
        description: `You are the heartbeat of the sanctuary. Your path is centered on healing, deep responsibility, and cultivating profound domestic or community harmony. You are the protective force that nurtures the growth of others, mastering the alchemy of unconditional love and service.`
    },
    {
        category: 'Numerology',
        key: 'LifePath7',
        title: 'Life Path 7 (The Mystic Analyst)',
        description: `You are the seeker of the hidden mechanics. Your path requires periods of deep solitude, intensive study, and piercing through the veil of societal illusion to find objective truth. You bridge the gap between hard science and profound spirituality, trusting your own inner knowing above all else.`
    },
    {
        category: 'Numerology',
        key: 'LifePath8',
        title: 'Life Path 8 (The Energetic Executive)',
        description: `You are the alchemist of material power. Your path is to master the flow of earthly resources—money, authority, and influence—and use them for the highest good. You are here to learn the true nature of abundance, balancing immense kinetic output with deep spiritual integrity.`
    },
    {
        category: 'Numerology',
        key: 'LifePath9',
        title: 'Life Path 9 (The Universal Alchemist)',
        description: `You are the culmination of the cycle. Your path is one of profound empathy, humanitarianism, and the willingness to let go of personal attachments for the evolution of the collective. You are an old soul, here to tie up karmic loose ends and teach others the art of surrender and forgiveness.`
    },
    {
        category: 'Numerology',
        key: 'LifePath11',
        title: 'Life Path 11 (The Illuminated Seer - Master Number)',
        description: `You are a high-voltage conduit for spiritual truth. Your path involves immense nervous-system sensitivity, profound intuition, and the ability to illuminate the dark for others. You walk the razor's edge between genius and overwhelm, acting as a bridge between the divine and the dense physical world.`
    },
    {
        category: 'Numerology',
        key: 'LifePath22',
        title: 'Life Path 22 (The Master Builder - Master Number)',
        description: `You possess the rare ability to turn ethereal, visionary dreams into massive earthly empires. Your path bridges the highest spiritual concepts with practical, grounded reality. You are here to construct systems that will fundamentally elevate the daily lives of future generations.`
    },
    {
        category: 'Numerology',
        key: 'LifePath33',
        title: 'Life Path 33 (The Master Teacher - Master Number)',
        description: `The rarest of frequencies. Your path is the embodiment of unconditional love, profound healing, and spiritual sacrifice. You are here to elevate the consciousness of the entire grid by serving as a living example of pure, unadulterated compassion.`
    },
    {
        category: 'Epicycle',
        key: 'Year1',
        title: 'Year 1: The Genesis Seed (Initiation)',
        description: `The matrix is wiped clean. This is a time of extreme independence, kinetic physical energy, and new beginnings. You are planting the seeds for the next 9-year cycle; whatever you start now will echo for nearly a decade. Move boldly and do not wait for permission.`
    },
    {
        category: 'Epicycle',
        key: 'Year2',
        title: 'Year 2: The Gestation Phase (Alignment)',
        description: `The seed takes root underground. This is a deeply sensitive, slower-paced year focused on patience, intuition, and cultivating the relationships needed to support your vision. Do not force outcomes; master the art of receptivity and subtle partnership.`
    },
    {
        category: 'Epicycle',
        key: 'Year3',
        title: 'Year 3: The Kinetic Expansion (Creation)',
        description: `The sprout breaks the surface. This year is marked by rapid communication, social energy, and the joyful expression of your ideas. It is a time to be visible, to network, and to let your creativity flow without the heavy burden of perfectionism.`
    },
    {
        category: 'Epicycle',
        key: 'Year4',
        title: 'Year 4: The Structural Foundation (Anchoring)',
        description: `It is time to build the trellis. A year of hard work, discipline, and securing the physical and financial foundations of your life. It may feel restrictive, but the effort you invest now will ensure your sovereign empire does not collapse under future pressure.`
    },
    {
        category: 'Epicycle',
        key: 'Year5',
        title: 'Year 5: The Quantum Pivot (Disruption)',
        description: `The winds of change arrive. A year of unexpected plot twists, travel, and the necessary destruction of routines that have become a prison. Embrace the chaos, remain deeply adaptable, and allow the universe to course-correct your trajectory.`
    },
    {
        category: 'Epicycle',
        key: 'Year6',
        title: 'Year 6: The Harmonic Integration (Sanctuary)',
        description: `The kinetic energy settles and returns to the heart. A year deeply focused on home, healing, family, and taking responsibility for your immediate energetic ecosystem. It is a time to beautify your space and resolve interpersonal friction.`
    },
    {
        category: 'Epicycle',
        key: 'Year7',
        title: 'Year 7: The Inner Crucible (Reflection)',
        description: `The external world slows down to demand internal mastery. This is a deeply internal year of spiritual study, questioning your path, and refining your inner truth. Withdraw your energy from the noise of the collective and focus entirely on your own psychological architecture.`
    },
    {
        category: 'Epicycle',
        key: 'Year8',
        title: 'Year 8: The Material Harvest (Empowerment)',
        description: `The cycle reaches its peak of earthly manifestation. A year of immense kinetic output, financial reckoning, and stepping into true authority. You will reap exactly what you have sown over the last seven years. Claim your power without apology.`
    },
    {
        category: 'Epicycle',
        key: 'Year9',
        title: 'Year 9: The Karmic Release (Surrender)',
        description: `The autumn of the cycle. A year of deep emotional clearing, forgiveness, and letting go of everything that no longer serves the Sovereign OS. Do not try to hold onto what is naturally falling away; empty the vessel so you are prepared for the coming Genesis.`
    },
    // --- PHASE 5: ANOMALIES & SYNASTRY ---
    {
        category: 'Anomaly',
        key: 'Stellium',
        title: 'The Stellium (The Concentrated Forge)',
        description: `You possess a massive clustering of energy (three or more planets) in a single sector or archetype. This is not an imbalance; it is a hyper-specialization. Your soul incarnated to master this specific frequency. While it can feel overwhelming or obsessive at times, this concentrated laser focus is the exact tool you must use to carve out your sovereign legacy.`
    },
    {
        category: 'Anomaly',
        key: 'Cross',
        title: 'The Grand Cross & T-Square (The Kinetic Crucible)',
        description: `The geometry of your chart is locked in profound tension. Traditional systems call this "difficult," but the Modern Alchemist knows that friction is the only way to generate heat and kinetic output. You are not meant to live a static life. This structural tension forces you to take action, resolve inner paradoxes, and build a reality far more resilient than those who walk an easy path.`
    },
    {
        category: 'Anomaly',
        key: 'Trine',
        title: 'The Grand Trine (The Superconductor)',
        description: `The geometry of your chart forms a perfect, frictionless triangle. You have access to a continuous loop of effortless energy and profound natural talent. However, the alchemical trap of the Trine is complacency. Because this energy flows so smoothly, you must consciously choose to harness it and build something tangible, lest it remain pure, unmanifested potential.`
    },
    {
        category: 'Anomaly',
        key: 'Yod',
        title: 'The Yod / Finger of Fate (The Karmic Adjustment)',
        description: `You carry a highly specific, awkward energetic angle that refuses to integrate easily. This is a point of fated tension. It acts as a cosmic funnel, constantly redirecting your life path toward a very specific, inescapable purpose. You cannot force this energy; you must surrender to its profound, evolutionary adjustment.`
    },
    {
        category: 'Synastry',
        key: 'PlutoInLibra',
        title: 'Pluto in Libra [1971-1984] (The Relational Alchemists)',
        description: `This generation incarnated to fundamentally deconstruct and rebuild the concept of partnership, justice, and societal equilibrium. When connecting with this frequency, expect profound lessons in the mirror of the "other," forcing you to balance your own autonomy with true harmony.`
    },
    {
        category: 'Synastry',
        key: 'PlutoInScorpio',
        title: 'Pluto in Scorpio [1983-1995] (The System Dismantlers)',
        description: `The transformers of the matrix. This generation is hardwired to see through superficial structures and burn down what is false. When anchoring to this frequency, prepare for intense psychological depth, absolute authenticity, and the necessary death of your outdated defense mechanisms.`
    },
    {
        category: 'Synastry',
        key: 'PlutoInSagittarius',
        title: 'Pluto in Sagittarius [1995-2008] (The Paradigm Expanders)',
        description: `The restless seekers of global truth. This generation incarnated to shatter localized thinking and restrictive dogmas. Connecting with this frequency brings a massive influx of kinetic optimism, pushing you to expand your philosophy and seek a more unified, borderless understanding of reality.`
    },
    {
        category: 'Synastry',
        key: 'Fire_Air',
        title: 'Fire + Air Resonance (The Kinetic Expansion)',
        description: `Air provides the oxygen; Fire provides the spark. This connection is highly stimulating, intellectually rapid, and visionary. It requires conscious grounding, as the sheer velocity of ideas and passion can easily burn out if not anchored into a physical structure.`
    },
    {
        category: 'Synastry',
        key: 'Earth_Water',
        title: 'Earth + Water Resonance (The Deep Root System)',
        description: `Water nourishes the soil; Earth gives the water boundaries. This is the alchemy of profound, enduring growth. It provides intense emotional security and the ability to build a lasting, tangible sanctuary, though it must guard against becoming stagnant or resistant to necessary change.`
    },
    {
        category: 'Synastry',
        key: 'Fire_Water',
        title: 'Fire + Water Resonance (The Alchemical Steam)',
        description: `Intense, volatile, and deeply purifying. This connection generates massive amounts of emotional and kinetic friction. It is the crucible of rapid transformation, teaching both operators how to navigate extreme passion without extinguishing each other's core essence.`
    },
    {
        category: 'Synastry',
        key: 'Earth_Air',
        title: 'Earth + Air Resonance (The Dust Storm)',
        description: `The meeting of abstract logic and dense physical reality. This is a highly pragmatic connection that can build brilliant, complex systems. The challenge lies in bridging the gap between the mind and the body, requiring both operators to consciously cultivate emotional warmth.`
    },
    {
        category: 'Synastry',
        key: 'Water_Water',
        title: 'Water + Water (The Deep Ocean)',
        description: `Profound, unspoken telepathy. This connection operates entirely on feeling and intuition. While it offers unparalleled emotional sanctuary, both operators must ensure they do not drown in shared hypersensitivity.`
    },
    {
        category: 'Synastry',
        key: 'Fire_Fire',
        title: 'Fire + Fire (The Supernova)',
        description: `Pure kinetic explosion. This connection amplifies passion, willpower, and creative drive to absolute maximum capacity. The challenge is learning to temper the flame so it fuels an empire rather than burning it to the ground.`
    },
    {
        category: 'Synastry',
        key: 'Earth_Earth',
        title: 'Earth + Earth (The Bedrock)',
        description: `The ultimate structural stability. This connection can build generational wealth and unshakeable physical security. To avoid stagnation, both operators must consciously inject spontaneity and risk into the matrix.`
    },
    {
        category: 'Synastry',
        key: 'Air_Air',
        title: 'Air + Air (The Quantum Cloud)',
        description: `A relentless exchange of data and philosophy. This is a meeting of the minds that thrives on total freedom and conceptual exploration. The alchemical test is remembering to actually land the ship and feel emotions in the physical body.`
    },
    {
        category: 'Synastry',
        key: 'Water_Air',
        title: 'Water + Air (The Monsoon)',
        description: `The friction between logic and emotion. Air attempts to analyze the feelings that Water experiences. It is a highly evolutionary bond that teaches Water how to vocalize its depths, and teaches Air how to surrender to what cannot be rationally explained.`
    }
]

async function main() {
    console.log('Initiating Database Seeding Sequence...')

    for (const entry of lexiconData) {
        await prisma.lexiconEntry.upsert({
            where: { key: entry.key },
            update: {
                title: entry.title,
                description: entry.description,
                category: entry.category,
            },
            create: {
                key: entry.key,
                title: entry.title,
                description: entry.description,
                category: entry.category,
            },
        })
    }

    console.log('Data successfully injected into the Aether Matrix.')
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })