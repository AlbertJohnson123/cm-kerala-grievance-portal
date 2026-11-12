// Fallback in-memory store for serverless environments (Vercel)
// Guarantees all dashboards, grievance tracking, and status updates work seamlessly

export interface FallbackGrievance {
  id: string;
  referenceNumber: string;
  citizenId: string;
  citizen: {
    id: string;
    name: string;
    email: string;
    mobile?: string | null;
  };
  district: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  departmentId?: string | null;
  department?: {
    id: string;
    name: string;
    code: string;
  } | null;
  aiSuggestedDept?: string | null;
  aiSuggestedCategory?: string | null;
  aiSuggestedPriority?: string | null;
  aiSummary?: string | null;
  adminRemarks?: string | null;
  actionTakenReport?: string | null;
  isDuplicate: boolean;
  createdAt: string;
  updatedAt: string;
  history: Array<{
    id: string;
    status: string;
    remarks?: string | null;
    createdAt: string;
    changedBy?: {
      id: string;
      name: string;
      role: string;
    } | null;
  }>;
  assignments: Array<{
    id: string;
    departmentId: string;
    department: {
      name: string;
      code: string;
    };
    remarks?: string | null;
    createdAt: string;
  }>;
  feedback?: Array<{
    id: string;
    rating: number;
    comments?: string | null;
    citizen?: { name: string };
  }>;
  attachments: Array<{
    id: string;
    filename: string;
    url: string;
    fileType: string;
  }>;
}

const globalForGrievances = globalThis as unknown as {
  storedGrievances: FallbackGrievance[];
};

if (!globalForGrievances.storedGrievances) {
  globalForGrievances.storedGrievances = [
    {
      id: "grv_1",
      referenceNumber: "KL-CMO-2026-881021",
      citizenId: "user_arun",
      citizen: {
        id: "user_arun",
        name: "Arun Kumar",
        email: "arun@test.com",
        mobile: "+91 9847012345",
      },
      district: "Thiruvananthapuram",
      category: "Water Supply & Sanitation",
      subject: "Severe drinking water disruption for 10 days in Ward 14, Kazhakkoottam",
      description: "The main water pipeline burst near Kazhakkoottam junction 10 days ago. Over 300 households have had no drinking water supply. Water tankers are charging exorbitant rates. Immediate repair and tanker deployment requested.",
      priority: "HIGH",
      status: "IN_PROGRESS",
      departmentId: "dept_kwa",
      department: {
        id: "dept_kwa",
        name: "Water Resources Department",
        code: "WRD",
      },
      aiSuggestedDept: "Water Resources Department",
      aiSuggestedCategory: "Water Supply & Sanitation",
      aiSuggestedPriority: "HIGH",
      aiSummary: "Pipeline burst affecting 300+ households with 10 days of zero drinking water in Kazhakkoottam. Urgent repair and emergency supply required.",
      adminRemarks: "Forwarded with high priority to KWA Executive Engineer. Ensure emergency water tankers today.",
      actionTakenReport: "Excavation completed. Replacement pipe parts delivered on site. Welding in progress. Expected completion within 24 hours.",
      isDuplicate: false,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      history: [
        {
          id: "hist_1_1",
          status: "SUBMITTED",
          remarks: "Grievance registered through citizen web portal.",
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          changedBy: { id: "user_arun", name: "Arun Kumar", role: "CITIZEN" },
        },
        {
          id: "hist_1_2",
          status: "UNDER_REVIEW",
          remarks: "CMO Desk reviewed AI summary and marked as high priority.",
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          changedBy: { id: "user_cmo_admin", name: "CMO Admin", role: "CMO_ADMIN" },
        },
        {
          id: "hist_1_3",
          status: "IN_PROGRESS",
          remarks: "Assigned to Water Resources Dept. Field team dispatched for pipe replacement.",
          createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
          changedBy: { id: "user_officer_kwa", name: "Er. K. Radhakrishnan (KWA)", role: "DEPT_OFFICER" },
        },
      ],
      assignments: [
        {
          id: "asgn_1",
          departmentId: "dept_kwa",
          department: { name: "Water Resources Department", code: "WRD" },
          remarks: "Urgent pipeline rectification.",
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
      ],
      attachments: [],
      feedback: [],
    },
    {
      id: "grv_2",
      referenceNumber: "KL-CMO-2026-541982",
      citizenId: "user_priya",
      citizen: {
        id: "user_priya",
        name: "Priya Nair",
        email: "priya@test.com",
        mobile: "+91 9447123456",
      },
      district: "Ernakulam",
      category: "Roads, Bridges & Infrastructure",
      subject: "Life-threatening crater-sized potholes on Aluva-Perumbavoor Road",
      description: "Monsoon rains created deep craters near Marampally on the Aluva-Perumbavoor stretch. Multiple two-wheeler riders have sustained fractures this week. Buses are avoiding the route causing commuter chaos.",
      priority: "HIGH",
      status: "UNDER_REVIEW",
      departmentId: "dept_pwd",
      department: {
        id: "dept_pwd",
        name: "Public Works Department (PWD)",
        code: "PWD",
      },
      aiSuggestedDept: "Public Works Department (PWD)",
      aiSuggestedCategory: "Roads, Bridges & Infrastructure",
      aiSuggestedPriority: "HIGH",
      aiSummary: "Severe road damage causing accidents and injuries on Aluva-Perumbavoor route. Urgent road resurfacing required.",
      adminRemarks: "Reviewing with PWD Central Circle. Escalated for emergency tarring.",
      actionTakenReport: null,
      isDuplicate: false,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      history: [
        {
          id: "hist_2_1",
          status: "SUBMITTED",
          remarks: "Grievance submitted by citizen with road hazard report.",
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          changedBy: { id: "user_priya", name: "Priya Nair", role: "CITIZEN" },
        },
        {
          id: "hist_2_2",
          status: "UNDER_REVIEW",
          remarks: "CMO forwarded to PWD Superintending Engineer.",
          createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
          changedBy: { id: "user_cmo_admin", name: "CMO Admin", role: "CMO_ADMIN" },
        },
      ],
      assignments: [
        {
          id: "asgn_2",
          departmentId: "dept_pwd",
          department: { name: "Public Works Department (PWD)", code: "PWD" },
          remarks: "Emergency patch work needed.",
          createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        },
      ],
      attachments: [],
      feedback: [],
    },
    {
      id: "grv_3",
      referenceNumber: "KL-CMO-2026-319084",
      citizenId: "user_arun",
      citizen: {
        id: "user_arun",
        name: "Arun Kumar",
        email: "arun@test.com",
        mobile: "+91 9847012345",
      },
      district: "Kozhikode",
      category: "Public Healthcare & Hospitals",
      subject: "Non-functioning ultrasound scanner at Taluk Headquarters Hospital, Koyilandy",
      description: "The ultrasound and sonography equipment at Koyilandy Taluk Hospital has been non-operational for 3 months. Expectant mothers are forced to spend thousands at private diagnostic centres.",
      priority: "HIGH",
      status: "RESOLVED",
      departmentId: "dept_health",
      department: {
        id: "dept_health",
        name: "Health and Family Welfare",
        code: "HFW",
      },
      aiSuggestedDept: "Health and Family Welfare",
      aiSuggestedCategory: "Public Healthcare & Hospitals",
      aiSuggestedPriority: "HIGH",
      aiSummary: "Hospital ultrasound scanner out of order for 3 months in Koyilandy Taluk Hospital forcing pregnant women to costly private clinics.",
      adminRemarks: "DMO instructed to expedite biomedical engineer visit.",
      actionTakenReport: "Kerala Medical Services Corporation Ltd (KMSCL) service engineers replaced faulty transducer probe. Machine calibrated and made operational.",
      isDuplicate: false,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      history: [
        {
          id: "hist_3_1",
          status: "SUBMITTED",
          remarks: "Grievance submitted by citizen.",
          createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        },
        {
          id: "hist_3_2",
          status: "IN_PROGRESS",
          remarks: "DMO assigned biomedical team.",
          createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        },
        {
          id: "hist_3_3",
          status: "RESOLVED",
          remarks: "Diagnostic equipment restored. Patient testing resumed.",
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          changedBy: { id: "user_officer_health", name: "Dr. Thomas Mathew (DMO)", role: "DEPT_OFFICER" },
        },
      ],
      assignments: [],
      attachments: [],
      feedback: [
        {
          id: "fb_1",
          rating: 5,
          comments: "Prompt action by the Health department. Much appreciated!",
          citizen: { name: "Arun Kumar" },
        },
      ],
    },
    {
      id: "grv_4",
      referenceNumber: "KL-CMO-2026-119283",
      citizenId: "user_priya",
      citizen: {
        id: "user_priya",
        name: "Priya Nair",
        email: "priya@test.com",
        mobile: "+91 9447123456",
      },
      district: "Palakkad",
      category: "Electricity & Energy",
      subject: "Frequent voltage fluctuation damaging household appliances in Chittur",
      description: "Severe voltage drops below 160V observed continuously between 6 PM to 10 PM in Chittur North. Multiple refrigerators and motor pumps damaged.",
      priority: "MEDIUM",
      status: "SUBMITTED",
      departmentId: null,
      department: null,
      aiSuggestedDept: "Kerala State Electricity Board (KSEB)",
      aiSuggestedCategory: "Electricity & Energy",
      aiSuggestedPriority: "MEDIUM",
      aiSummary: "Severe evening low voltage (<160V) in Chittur North damaging domestic appliances. Transformer upgrade needed.",
      adminRemarks: null,
      actionTakenReport: null,
      isDuplicate: false,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      history: [
        {
          id: "hist_4_1",
          status: "SUBMITTED",
          remarks: "Grievance registered on portal.",
          createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        },
      ],
      assignments: [],
      attachments: [],
      feedback: [],
    },
  ];
}

export const fallbackGrievances = globalForGrievances.storedGrievances;

export function addFallbackGrievance(g: FallbackGrievance) {
  fallbackGrievances.unshift(g);
}

export function findFallbackGrievanceByRef(ref: string) {
  return fallbackGrievances.find(
    (g) => g.referenceNumber.toUpperCase() === ref.trim().toUpperCase()
  );
}

export function findFallbackGrievanceById(id: string) {
  return fallbackGrievances.find((g) => g.id === id);
}

export function updateFallbackGrievance(id: string, updates: Partial<FallbackGrievance>) {
  const index = fallbackGrievances.findIndex((g) => g.id === id);
  if (index !== -1) {
    fallbackGrievances[index] = {
      ...fallbackGrievances[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return fallbackGrievances[index];
  }
  return null;
}
