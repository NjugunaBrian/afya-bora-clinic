/**
 * demo-data.ts — the whole Afya Bora world, in one relational module.
 * Pages read it through the store (lib/store.tsx), never directly.
 * Ids recur everywhere: service ids, doctor ids, booking refs (AB-xxxxx), receipts (INV-xxxxx).
 */
import { addDays } from 'date-fns';
import { atTime, zoned } from '@shared/time';

export type BranchId = 'nairobi' | 'nyeri';
export type ServiceCategory =
    | 'General Care'
    | 'Mother & Child'
    | 'Dental'
    | 'Diagnostics'
    | 'Chronic Care'
    | 'Specialised';
export const SERVICE_CATEGORIES: ServiceCategory[] = [
    'General Care',
    'Mother & Child',
    'Dental',
    'Diagnostics',
    'Chronic Care',
    'Specialised',
];

export type BookingStatus =
    | 'Requested'
    | 'Confirmed'
    | 'Checked in'
    | 'Seen'
    | 'Follow-up due'
    | 'Cancelled';

export type Branch = {
    id: BranchId;
    name: string;
    area: string;
    address: string;
    phone: string;
    /** days: 0 = Sunday … 6 = Saturday, on the clinic's clock */
    hours: { label: string; days: number[]; open: string; close: string }[];
    mapQuery: string;
};

export const BRANCHES: Branch[] = [
    {
        id: 'nairobi',
        name: 'Nairobi (Kasarani)',
        area: 'Kasarani',
        address: 'Thika Road, next to Kasarani Sports View, Nairobi',
        phone: '+254 710 268 389',
        hours: [
            { label: 'Mon – Fri', days: [1, 2, 3, 4, 5], open: '07:30', close: '19:00' },
            { label: 'Saturday', days: [6], open: '08:00', close: '16:00' },
            { label: 'Sunday', days: [0], open: '09:00', close: '13:00' },
        ],
        mapQuery: 'Kasarani, Nairobi',
    },
    {
        id: 'nyeri',
        name: 'Nyeri',
        area: 'Nyeri Town',
        address: 'Kimathi Way, opposite the Nyeri Stadium, Nyeri',
        phone: '+254 710 268 390',
        hours: [
            { label: 'Mon – Fri', days: [1, 2, 3, 4, 5], open: '08:00', close: '18:00' },
            { label: 'Saturday', days: [6], open: '08:00', close: '14:00' },
            { label: 'Sunday', days: [], open: '00:00', close: '00:00' },
        ],
        mapQuery: 'Nyeri Town, Kenya',
    },
];

export type Service = {
    id: string;
    name: string;
    category: ServiceCategory;
    icon: string;
    summary: string;
    forWho: string;
    bullets: string[];
    durationMin: number;
    priceFrom: number | null;
    bring: string;
    specialised?: boolean;
    expect?: string;
};

export const SERVICES: Service[] = [
    {
        id: 's-general',
        name: 'General Consultation',
        category: 'General Care',
        icon: 'stethoscope',
        summary: 'See a doctor about anything that is worrying you, from a cough to ongoing tiredness.',
        forWho: 'Adults and older children with a new or ongoing health concern.',
        bullets: [
            'Time to talk through your symptoms',
            'A full check-up, including blood pressure and temperature',
            'Clear advice and a written plan',
            'Prescriptions filled at our pharmacy',
        ],
        durationMin: 30,
        priceFrom: 1500,
        bring: 'SHA card and last prescription',
    },
    {
        id: 's-wellness',
        name: 'Family Wellness Check-up',
        category: 'General Care',
        icon: 'heart-pulse',
        summary: 'A yearly look at how the whole family is doing, before small things become big ones.',
        forWho: 'Parents and children who want a routine health review.',
        bullets: [
            'Height, weight and blood pressure',
            'Basic blood sugar and haemoglobin checks',
            'Doctor review for each family member',
            'Vaccination record check',
            'A simple health summary to take home',
        ],
        durationMin: 60,
        priceFrom: 4500,
        bring: 'SHA card, clinic cards for the children',
    },
    {
        id: 's-family-planning',
        name: 'Family Planning',
        category: 'General Care',
        icon: 'users',
        summary: 'Private, judgement-free advice on the family planning method that suits you.',
        forWho: 'Women and couples planning the size and spacing of their family.',
        bullets: [
            'A private talk with a trained nurse or doctor',
            'All methods explained in plain words',
            'Method provided or booked the same visit',
            'Follow-up reminders',
        ],
        durationMin: 30,
        priceFrom: 800,
        bring: 'Any previous family planning card',
    },
    {
        id: 's-antenatal',
        name: 'Antenatal Care',
        category: 'Mother & Child',
        icon: 'baby',
        summary: 'Regular check-ups through your pregnancy so you and your baby stay well.',
        forWho: 'Expectant mothers, from the first visit to delivery planning.',
        bullets: [
            'Blood pressure, weight and baby growth checks',
            'Routine blood and urine tests',
            'Iron and folic acid supplements',
            'Advice on food, rest and warning signs',
            'Help planning where to deliver',
        ],
        durationMin: 45,
        priceFrom: 2500,
        bring: 'Mother and Child Health booklet',
    },
    {
        id: 's-vaccination',
        name: 'Child Vaccinations',
        category: 'Mother & Child',
        icon: 'syringe',
        summary: "Routine childhood vaccines given gently, on schedule, and recorded in your child's booklet.",
        forWho: 'Babies and children from birth to 12 years.',
        bullets: [
            'Vaccines following the Kenya immunisation schedule',
            'Nurse checks your child is well enough that day',
            'Booklet stamped and updated',
            'Reminder for the next dose',
        ],
        durationMin: 20,
        priceFrom: 800,
        bring: "Your child's immunisation booklet",
    },
    {
        id: 's-paediatric',
        name: 'Paediatric Consultation',
        category: 'Mother & Child',
        icon: 'smile',
        summary: "A children's doctor who takes time with little patients and their worried parents.",
        forWho: 'Children from newborn to 14 years.',
        bullets: [
            'Growth and development check',
            'Care for fevers, coughs, tummy troubles and rashes',
            'Feeding and nutrition advice',
            'Child-friendly consultation room',
        ],
        durationMin: 30,
        priceFrom: 1800,
        bring: "Your child's clinic booklet and weight record",
    },
    {
        id: 's-dental-check',
        name: 'Dental Check-up & Cleaning',
        category: 'Dental',
        icon: 'sparkles',
        summary: 'A gentle check of teeth and gums, plus a professional clean.',
        forWho: 'Anyone from age 3. We recommend a check every six months.',
        bullets: [
            'Full mouth examination',
            'Scale and polish',
            'Advice on brushing for you or your child',
            'A clear plan if treatment is needed',
        ],
        durationMin: 45,
        priceFrom: 2000,
        bring: 'SHA or dental insurance card',
    },
    {
        id: 's-dental-fix',
        name: 'Fillings & Extractions',
        category: 'Dental',
        icon: 'tooth',
        summary: 'Treatment for painful or damaged teeth, with pain relief so you stay comfortable.',
        forWho: 'Adults and children with tooth pain or decay.',
        bullets: [
            'Local anaesthetic so you feel no pain',
            'Fillings in tooth-coloured material',
            'Safe, careful tooth removal when needed',
            'Aftercare instructions in writing',
        ],
        durationMin: 60,
        priceFrom: 3000,
        bring: 'Any dental X-rays you already have',
    },
    {
        id: 's-lab',
        name: 'Lab Packages',
        category: 'Diagnostics',
        icon: 'flask-conical',
        summary: 'Blood and other tests with results explained by a doctor, not just handed over.',
        forWho: "Anyone with a doctor's request or wanting a routine screen.",
        bullets: [
            "Packages for general health, diabetes, and women's and men's health",
            'Most results the same day',
            'Results explained by a doctor',
            'Tests can be requested by your own doctor too',
        ],
        durationMin: 20,
        priceFrom: 2800,
        bring: "Doctor's request form, if you have one",
        expect: 'Some tests need you to skip food for 8 to 10 hours first. We tell you when you book.',
    },
    {
        id: 's-ultrasound',
        name: 'Ultrasound Scan',
        category: 'Diagnostics',
        icon: 'scan-line',
        summary: 'A safe, painless scan to look at your baby, tummy or other areas.',
        forWho: 'Pregnant mothers and adults with a scan request.',
        bullets: [
            'Pregnancy and abdominal scans',
            'Done by a trained sonographer',
            'Pictures and written report',
            'Doctor explains what we see',
        ],
        durationMin: 30,
        priceFrom: 3000,
        bring: 'Scan request, and a full bladder if advised',
    },
    {
        id: 's-diabetes',
        name: 'Diabetes & Hypertension Care',
        category: 'Chronic Care',
        icon: 'activity',
        summary: 'Steady, regular care for long-term conditions, so you feel in control.',
        forWho: 'Adults living with diabetes or high blood pressure.',
        bullets: [
            'Blood sugar and blood pressure checks',
            'Medicine review and refills',
            'Food and exercise advice for your life',
            'A simple tracking card to keep',
        ],
        durationMin: 30,
        priceFrom: 2000,
        bring: 'All your medicines and last test results',
    },
    {
        id: 's-asthma',
        name: 'Asthma & Allergy Review',
        category: 'Chronic Care',
        icon: 'wind',
        summary: 'Help breathing easier, with an action plan for you or your child.',
        forWho: 'Children and adults with wheeze, cough or allergies.',
        bullets: [
            'Breathing test',
            'Inhaler technique check',
            'Triggers explained simply',
            'A written action plan',
        ],
        durationMin: 30,
        priceFrom: 2200,
        bring: 'Your inhalers and any past prescriptions',
    },
    {
        id: 's-specialist',
        name: 'Specialist Consultation',
        category: 'Specialised',
        icon: 'user-round-search',
        summary: 'Longer time with a senior doctor for a complex or ongoing problem.',
        forWho: 'Patients who need a deeper look or a second opinion.',
        bullets: [
            'Extended appointment',
            'Review of your past records and tests',
            'Clear plan, with referral if needed',
            'Written summary for your own files',
        ],
        durationMin: 45,
        priceFrom: 3500,
        bring: 'Past reports, scans and medicines list',
        specialised: true,
        expect: 'You will talk through your history, then the doctor examines you and explains the next steps.',
    },
    {
        id: 's-physio',
        name: 'Physiotherapy',
        category: 'Specialised',
        icon: 'dumbbell',
        summary: 'Guided exercises and treatment for pain, injury and recovery.',
        forWho: 'Adults with back, neck or joint pain, or recovering from injury.',
        bullets: [
            'Assessment of how you move',
            'Hands-on treatment where it helps',
            'Exercises to do at home',
            'A plan for the next few sessions',
        ],
        durationMin: 45,
        priceFrom: 2500,
        bring: 'Comfortable clothes and any scans',
        specialised: true,
        expect: 'Your therapist asks about your pain, checks your movement and agrees a simple plan with you.',
    },
];

export type Doctor = {
    id: string;
    name: string;
    short: string;
    title: string;
    specialty: string;
    years: number;
    languages: string[];
    bio: string;
    photo: string;
    branchId: BranchId;
    serviceIds: string[];
    /** 0 = Sunday */
    days: number[];
    start: string;
    end: string;
    licence: string;
};

export const DOCTORS: Doctor[] = [
    {
        id: 'd-wanjiku',
        name: 'Dr. Wanjiku Kariuki',
        short: 'Dr. Wanjiku',
        title: 'Lead family doctor',
        specialty: 'Family medicine',
        years: 12,
        languages: ['English', 'Kiswahili', 'Kikuyu'],
        bio: "Dr. Wanjiku looks after whole families, often across three generations. She is known for listening first and explaining everything in simple words.",
        photo: '/assets/dr-wanjiku.png',
        branchId: 'nairobi',
        serviceIds: ['s-general', 's-wellness', 's-family-planning', 's-antenatal', 's-lab', 's-ultrasound', 's-diabetes'],
        days: [1, 2, 3, 4, 5, 6],
        start: '08:00',
        end: '17:00',
        licence: 'KMPDC reg. 11893',
    },
    {
        id: 'd-otieno',
        name: 'Dr. Otieno Odhiambo',
        short: 'Dr. Otieno',
        title: 'Paediatrician',
        specialty: 'Paediatrics',
        years: 9,
        languages: ['English', 'Kiswahili', 'Dholuo'],
        bio: "Dr. Otieno cares for babies and children. He explains each step to the child first, so little ones stay calm and parents feel sure.",
        photo: '/assets/dr-otieno.png',
        branchId: 'nairobi',
        serviceIds: ['s-paediatric', 's-vaccination', 's-asthma', 's-general'],
        days: [1, 2, 3, 4, 5],
        start: '08:30',
        end: '16:30',
        licence: 'KMPDC reg. 13420',
    },
    {
        id: 'd-halima',
        name: 'Dr. Halima Abdi',
        short: 'Dr. Halima',
        title: 'Dental surgeon',
        specialty: 'Dental care',
        years: 7,
        languages: ['English', 'Kiswahili', 'Somali'],
        bio: "Dr. Halima makes dental visits easy for nervous patients and children. She always tells you what she is about to do before she does it.",
        photo: '/assets/dr-halima.png',
        branchId: 'nairobi',
        serviceIds: ['s-dental-check', 's-dental-fix'],
        days: [2, 3, 4, 5, 6],
        start: '09:00',
        end: '17:00',
        licence: 'KDA reg. 4417',
    },
    {
        id: 'd-rotich',
        name: 'Dr. Kipchirchir Rotich',
        short: 'Dr. Kipchirchir',
        title: 'Chronic care physician',
        specialty: 'Chronic care',
        years: 15,
        languages: ['English', 'Kiswahili', 'Kalenjin'],
        bio: "Dr. Kipchirchir has spent 15 years helping people live well with diabetes, high blood pressure and asthma. He sees patients at our Nyeri branch.",
        photo: '/assets/dr-rotich.png',
        branchId: 'nyeri',
        serviceIds: ['s-diabetes', 's-asthma', 's-specialist', 's-general', 's-lab', 's-physio'],
        days: [1, 2, 3, 4, 5, 6],
        start: '08:00',
        end: '16:00',
        licence: 'KMPDC reg. 9206',
    },
];

export type StaffMember = { id: string; name: string; role: string; initials: string };
export const STAFF: StaffMember[] = [
    { id: 'st-grace', name: 'Grace Muthoni', role: 'Senior nurse', initials: 'GM' },
    { id: 'st-peter', name: 'Peter Mwenda', role: 'Laboratory technologist', initials: 'PM' },
    { id: 'st-faith', name: 'Faith Achieng', role: 'Front desk', initials: 'FA' },
];

export const PATIENT = {
    id: 'p-karimi',
    name: 'Karimi Njoroge',
    firstName: 'Karimi',
    phone: '0712 483 905',
    email: 'karimi.njoroge@example.com',
    area: 'Kasarani, Nairobi',
    cover: 'SHA',
    dependants: [
        { name: 'Zawadi Njoroge', relation: 'Daughter, 5' },
        { name: 'Tafari Njoroge', relation: 'Son, 9' },
    ],
};

export type JourneyStep = 'Book' | 'Visit' | 'Treatment' | 'Follow-up';
export const JOURNEY: { step: JourneyStep; blurb: string }[] = [
    { step: 'Book', blurb: 'Choose a time. We confirm by phone or WhatsApp.' },
    { step: 'Visit', blurb: 'Arrive 10 minutes early and check in at the front desk.' },
    { step: 'Treatment', blurb: 'Your doctor examines you and explains your plan.' },
    { step: 'Follow-up', blurb: 'We remind you when a check-in is due.' },
];

export type Booking = {
    ref: string;
    patientName: string;
    forName: string;
    phone: string;
    serviceId: string;
    doctorId: string;
    branchId: BranchId;
    start: string; // ISO instant
    status: BookingStatus;
    payment: 'SHA' | 'Insurance' | 'M-Pesa' | 'Cash';
    reason: string;
    createdAt: string;
    invoice?: { no: string; total: number; youPaid: number; method: string };
    followUp?: { dueOn: string; note: string };
    history: { at: string; text: string }[];
};

const now = new Date();
const today = zoned(now);
const iso = (d: Date) => d.toISOString();
const at = (offsetDays: number, hhmm: string) => iso(atTime(addDays(today, offsetDays), hhmm));
const hoursAgo = (h: number) => iso(new Date(now.getTime() - h * 3_600_000));

/** Days back to the most recent Tuesday before today (1..7). */
const backToTuesday = ((today.getDay() - 2 + 7) % 7) || 7;

export const SEED_BOOKINGS: Booking[] = [
    {
        ref: 'AB-20417',
        patientName: 'Karimi Njoroge',
        forName: 'Karimi Njoroge',
        phone: PATIENT.phone,
        serviceId: 's-general',
        doctorId: 'd-wanjiku',
        branchId: 'nairobi',
        start: at(0, '16:30'),
        status: 'Confirmed',
        payment: 'SHA',
        reason: 'Headaches and tiredness for two weeks',
        createdAt: hoursAgo(30),
        history: [
            { at: hoursAgo(30), text: 'Request sent on the website' },
            { at: hoursAgo(26), text: 'Confirmed by Faith at the front desk' },
        ],
    },
    {
        ref: 'AB-20421',
        patientName: 'Karimi Njoroge',
        forName: 'Zawadi Njoroge',
        phone: PATIENT.phone,
        serviceId: 's-vaccination',
        doctorId: 'd-otieno',
        branchId: 'nairobi',
        start: at(3, '10:00'),
        status: 'Requested',
        payment: 'SHA',
        reason: "Zawadi's 5-year booster",
        createdAt: hoursAgo(5),
        history: [{ at: hoursAgo(5), text: 'Request sent on the website' }],
    },
    {
        ref: 'AB-20371',
        patientName: 'Karimi Njoroge',
        forName: 'Karimi Njoroge',
        phone: PATIENT.phone,
        serviceId: 's-general',
        doctorId: 'd-wanjiku',
        branchId: 'nairobi',
        start: at(-backToTuesday, '09:30'),
        status: 'Seen',
        payment: 'SHA',
        reason: 'Blood pressure check',
        createdAt: at(-backToTuesday - 3, '14:00'),
        invoice: { no: 'INV-30218', total: 1500, youPaid: 0, method: 'SHA' },
        followUp: {
            dueOn: at(-backToTuesday + 14, '09:30'),
            note: 'Recheck blood pressure in 2 weeks. Bring your readings from home.',
        },
        history: [
            { at: at(-backToTuesday - 3, '14:00'), text: 'Request sent on the website' },
            { at: at(-backToTuesday - 2, '08:10'), text: 'Confirmed by Faith at the front desk' },
            { at: at(-backToTuesday, '09:20'), text: 'Checked in' },
            { at: at(-backToTuesday, '10:05'), text: 'Seen by Dr. Wanjiku. Receipt INV-30218 issued' },
        ],
    },
    {
        ref: 'AB-20288',
        patientName: 'Karimi Njoroge',
        forName: 'Tafari Njoroge',
        phone: PATIENT.phone,
        serviceId: 's-dental-check',
        doctorId: 'd-halima',
        branchId: 'nairobi',
        start: at(-46, '11:00'),
        status: 'Follow-up due',
        payment: 'SHA',
        reason: 'Six-month dental check for Tafari',
        createdAt: at(-52, '16:00'),
        followUp: { dueOn: at(-4, '11:00'), note: 'Six-month dental check is now due.' },
        history: [
            { at: at(-52, '16:00'), text: 'Request sent on the website' },
            { at: at(-46, '10:50'), text: 'Checked in' },
            { at: at(-46, '11:50'), text: 'Seen by Dr. Halima' },
        ],
    },
    {
        ref: 'AB-20190',
        patientName: 'Karimi Njoroge',
        forName: 'Karimi Njoroge',
        phone: PATIENT.phone,
        serviceId: 's-lab',
        doctorId: 'd-wanjiku',
        branchId: 'nairobi',
        start: at(-80, '08:30'),
        status: 'Cancelled',
        payment: 'M-Pesa',
        reason: 'Routine blood tests',
        createdAt: at(-84, '12:00'),
        history: [
            { at: at(-84, '12:00'), text: 'Request sent on the website' },
            { at: at(-81, '09:00'), text: 'Cancelled by Karimi' },
        ],
    },
];

export type FeeCard = {
    id: string;
    serviceId: string;
    name: string;
    price: number;
    fromPrefix?: boolean;
    popular?: boolean;
    includes: string[];
    /** What each payment route covers, in KES, for the "what you pay" filter. */
    youPay: Record<string, number>;
};

export const PAYMENT_ROUTES = ['Cash', 'M-Pesa', 'SHA', 'AAR', 'Jubilee', 'Britam', 'CIC', 'Madison'] as const;
export type PaymentRoute = (typeof PAYMENT_ROUTES)[number];

export const FEES: FeeCard[] = [
    {
        id: 'f-general',
        serviceId: 's-general',
        name: 'General Consultation',
        price: 1500,
        includes: ['30 minutes with a doctor', 'Full check-up', 'Written plan and advice', 'Free repeat review within 7 days'],
        youPay: { Cash: 1500, 'M-Pesa': 1500, SHA: 0, AAR: 150, Jubilee: 150, Britam: 200, CIC: 200, Madison: 250 },
    },
    {
        id: 'f-wellness',
        serviceId: 's-wellness',
        name: 'Family Wellness Check-up',
        price: 4500,
        popular: true,
        includes: ['Up to 4 family members', 'Blood pressure, sugar and haemoglobin', 'Doctor review for each person', 'Vaccination record check', 'Health summary to take home'],
        youPay: { Cash: 4500, 'M-Pesa': 4500, SHA: 1000, AAR: 450, Jubilee: 450, Britam: 700, CIC: 700, Madison: 900 },
    },
    {
        id: 'f-specialist',
        serviceId: 's-specialist',
        name: 'Specialist Consultation',
        price: 3500,
        includes: ['45 minutes with a senior doctor', 'Review of past records', 'Referral letter if needed', 'Written summary'],
        youPay: { Cash: 3500, 'M-Pesa': 3500, SHA: 500, AAR: 350, Jubilee: 350, Britam: 500, CIC: 500, Madison: 600 },
    },
    {
        id: 'f-lab',
        serviceId: 's-lab',
        name: 'Lab Packages',
        price: 2800,
        fromPrefix: true,
        includes: ["Choose a general, diabetes or women's/men's health package", 'Most results same day', 'Doctor explains your results'],
        youPay: { Cash: 2800, 'M-Pesa': 2800, SHA: 300, AAR: 280, Jubilee: 280, Britam: 400, CIC: 400, Madison: 500 },
    },
];

export const ACCEPTED_PAYMENTS = ['SHA', 'AAR', 'Jubilee', 'Britam', 'CIC', 'Madison', 'M-Pesa', 'Card', 'Cash'];

export const FAQS: { q: string; a: string }[] = [
    { q: 'How do I book an appointment?', a: 'Use the Book Appointment page, pick a time that suits you, and send the request. You can also message us on WhatsApp or call. We confirm by phone or WhatsApp within 2 hours during opening times.' },
    { q: 'What should I bring to my first visit?', a: "Bring your national ID or birth certificate for a child, your SHA or insurance card, any medicines you take, and past test results if you have them. For children, bring the clinic booklet." },
    { q: 'Do you accept SHA and private insurance?', a: 'Yes. We work with SHA, AAR, Jubilee, Britam, CIC and Madison. Your cover and its limits decide what you pay, so we check at the front desk before your visit.' },
    { q: 'Can I pay with M-Pesa?', a: 'Yes. You can pay by M-Pesa, card or cash at the front desk. You always get a receipt.' },
    { q: 'How long will I wait to see a doctor?', a: 'If you booked, most patients are seen within 15 minutes of their time. Walk-ins are welcome and are seen as soon as a doctor is free.' },
    { q: 'Can I reschedule or cancel my appointment?', a: 'Yes. Open My Visits, choose the visit and pick a new time or cancel. Please tell us at least 4 hours before so another patient can take the slot.' },
    { q: 'Do you offer home visits or online consultations?', a: 'Not yet. Please message us on WhatsApp if you cannot travel and we will tell you what we can arrange.' },
    { q: 'Are my medical records private and secure?', a: "Yes. We follow Kenya's Data Protection Act, 2019. Only the staff caring for you see your details, and we only ask for what we need to book your visit." },
    { q: 'What are your opening hours and emergency arrangements?', a: 'Nairobi is open Monday to Friday 7:30 am to 7 pm, Saturday 8 am to 4 pm and Sunday 9 am to 1 pm. Nyeri is open Monday to Friday 8 am to 6 pm and Saturday 8 am to 2 pm. For an emergency call 0720 555 014 or go to the nearest hospital.' },
];

export type Testimonial = { id: string; name: string; place: string; rating: number; quote: string };
export const TESTIMONIALS: Testimonial[] = [
    { id: 't1', name: 'Wambui', place: 'Roysambu', rating: 5, quote: "I was nervous about my first antenatal visit. Grace sat with me and explained every step. I left feeling calm." },
    { id: 't2', name: 'Juma', place: 'Kasarani', rating: 5, quote: 'I booked from my phone at lunch and was seen at 4:30 that day. No long queue, no confusion.' },
    { id: 't3', name: 'Njeri', place: 'Nyeri', rating: 5, quote: 'We use SHA for the whole family. The front desk checks everything before we arrive, so there are no surprises.' },
    { id: 't4', name: 'Baraka', place: 'Mwiki', rating: 4, quote: 'Dr. Otieno was gentle with my son and explained his asthma plan in a way I could follow.' },
    { id: 't5', name: 'Chebet', place: 'Ruaraka', rating: 5, quote: 'The dentist let me raise my hand when I needed a break. I was not afraid for the first time.' },
];

export const FACILITIES = [
    { id: 'fa-reception', title: 'Reception', caption: 'A warm welcome and quick check-in', img: '/assets/reception.png' },
    { id: 'fa-room', title: 'Consultation rooms', caption: 'Private, bright and clean', img: '/assets/consult-room.png' },
    { id: 'fa-lab', title: 'Laboratory', caption: 'Same-day results for most tests', img: '/assets/lab.png' },
    { id: 'fa-pharmacy', title: 'Pharmacy', caption: 'Collect your medicine before you leave', img: '/assets/pharmacy.png' },
    { id: 'fa-waiting', title: 'Waiting area', caption: "Calm seating with a children's corner", img: '/assets/waiting-area.png' },
];

export const METRICS = [
    { label: 'Years of service', value: 11, suffix: '+' },
    { label: 'Patients cared for', value: 24000, suffix: '+' },
    { label: 'Qualified staff', value: 38, suffix: '' },
    { label: 'Services offered', value: 14, suffix: '' },
];

export const VALUES = [
    { title: 'Patient first', text: 'You are never rushed. We explain things until they make sense.' },
    { title: 'Honest prices', text: 'You see the cost before the visit, in KES, with no surprises.' },
    { title: 'Family minded', text: 'One clinic for parents, children and grandparents.' },
    { title: 'Safe and clean', text: 'Clean rooms, trained staff, and records kept private.' },
];

export const ACCREDITATIONS = ['KMPDC licensed facility', 'SHA contracted provider', 'Ministry of Health vaccine partner'];
export const LICENCE = 'KMPDC/FAC/04821';
