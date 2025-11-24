import { PrismaClient, Category } from '@prisma/client'

const prisma = new PrismaClient({})

async function main() {
    const warmthCues = [
        {
            title: 'The Triple Nod',
            description: 'Nodding encourages the speaker to continue.',
            instruction: 'Nod 3 times quickly when someone is making a point.',
            category: Category.WARMTH,
            difficulty: 'Easy',
        },
        {
            title: 'Eyebrow Flash',
            description: 'A quick raise of eyebrows signals recognition.',
            instruction: 'Flash your eyebrows when you first see someone you know.',
            category: Category.WARMTH,
            difficulty: 'Easy',
        },
        {
            title: 'Head Tilt',
            description: 'Exposes the neck, showing trust and interest.',
            instruction: 'Tilt your head slightly to the side while listening.',
            category: Category.WARMTH,
            difficulty: 'Easy',
        },
        {
            title: 'Warm Smile',
            description: 'A genuine smile reaches the eyes.',
            instruction: 'Smile slowly, letting it reach your eyes (Duchenne smile).',
            category: Category.WARMTH,
            difficulty: 'Medium',
        },
        {
            title: 'Open Palms',
            description: 'Showing palms signals you have nothing to hide.',
            instruction: 'Keep your hands visible and palms open during conversation.',
            category: Category.WARMTH,
            difficulty: 'Easy',
        },
    ]

    const competenceCues = [
        {
            title: 'Power Pose',
            description: 'Expansive posture increases confidence.',
            instruction: 'Stand with feet shoulder-width apart and hands on hips for 2 mins.',
            category: Category.COMPETENCE,
            difficulty: 'Easy',
        },
        {
            title: 'Lower Inflection',
            description: 'Ending sentences with a downward pitch sounds authoritative.',
            instruction: 'Practice saying your name with a downward inflection at the end.',
            category: Category.COMPETENCE,
            difficulty: 'Medium',
        },
        {
            title: 'Steeple Hands',
            description: 'Touching fingertips together signals precision.',
            instruction: 'Use the steeple gesture when making a key point.',
            category: Category.COMPETENCE,
            difficulty: 'Medium',
        },
        {
            title: 'Firm Handshake',
            description: 'A solid handshake establishes equality.',
            instruction: 'Offer a vertical, firm handshake (dry hands!).',
            category: Category.COMPETENCE,
            difficulty: 'Easy',
        },
        {
            title: 'Direct Eye Contact',
            description: 'Holding gaze shows confidence.',
            instruction: 'Maintain eye contact for 3-5 seconds before looking away.',
            category: Category.COMPETENCE,
            difficulty: 'Hard',
        },
    ]

    console.log('Seeding Warmth Cues...')
    for (const cue of warmthCues) {
        await prisma.cue.create({ data: cue })
    }

    console.log('Seeding Competence Cues...')
    for (const cue of competenceCues) {
        await prisma.cue.create({ data: cue })
    }

    console.log('Seeding completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
