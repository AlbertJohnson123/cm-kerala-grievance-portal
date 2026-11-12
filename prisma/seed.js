const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Departments
  const departmentsData = [
    {
      name: "Water Resources Department",
      code: "WRD",
      description: "Drinking water supply schemes, Kerala Water Authority (KWA), pipeline maintenance, and canal irrigation.",
    },
    {
      name: "Public Works Department (PWD)",
      code: "PWD",
      description: "State highways, district roads, bridges, public buildings, and pothole maintenance.",
    },
    {
      name: "Health and Family Welfare",
      code: "HFW",
      description: "Primary health centres, medical college hospitals, essential medicines, and public health monitoring.",
    },
    {
      name: "General Education Department",
      code: "GED",
      description: "Government and aided schools, infrastructure repairs, teacher allotment, and mid-day meal scheme.",
    },
    {
      name: "Kerala State Electricity Board (KSEB)",
      code: "KSEB",
      description: "Grid electricity, transformer breakdowns, street lighting lines, and billing disputes.",
    },
    {
      name: "Agriculture Development & Farmers' Welfare",
      code: "AGR",
      description: "Crop loss compensation, Krishi Bhavan assistance, fertilizers, and farmer distress relief.",
    },
    {
      name: "Revenue and Disaster Management",
      code: "REV",
      description: "Land records, mutation, village office certificates, disaster relief, and survey disputes.",
    },
    {
      name: "Kerala Police Department",
      code: "POL",
      description: "Public safety, women's cell, traffic regulation, and local law enforcement support.",
    },
    {
      name: "Transport Department (KSRTC)",
      code: "TRN",
      description: "Public bus routes, regional transport offices (RTO), and rural connectivity.",
    },
    {
      name: "Local Self Government (LSGD)",
      code: "LSGD",
      description: "Panchayats and municipalities, waste management, building permits, and local sanitation.",
    },
  ];

  const deptMap = {};
  for (const dept of departmentsData) {
    const record = await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name, description: dept.description },
      create: dept,
    });
    deptMap[dept.code] = record.id;
  }
  console.log("Departments created:", Object.keys(deptMap).length);

  // 2. Users
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const officerPassword = await bcrypt.hash("Officer@123", 10);
  const citizenPassword = await bcrypt.hash("Citizen@123", 10);

  // CMO Admin
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@cmkerala.gov.in" },
    update: { passwordHash: adminPassword },
    create: {
      name: "CMO Principal Secretary (Grievance Cell)",
      email: "admin@cmkerala.gov.in",
      mobile: "+91 9447000001",
      passwordHash: adminPassword,
      role: "CMO_ADMIN",
    },
  });

  // Department Officers
  const waterOfficer = await prisma.user.upsert({
    where: { email: "officer.water@kerala.gov.in" },
    update: { passwordHash: officerPassword, departmentId: deptMap["WRD"] },
    create: {
      name: "Er. K. Radhakrishnan (Executive Engineer, KWA)",
      email: "officer.water@kerala.gov.in",
      mobile: "+91 9447000002",
      passwordHash: officerPassword,
      role: "DEPT_OFFICER",
      departmentId: deptMap["WRD"],
    },
  });

  const pwdOfficer = await prisma.user.upsert({
    where: { email: "officer.roads@kerala.gov.in" },
    update: { passwordHash: officerPassword, departmentId: deptMap["PWD"] },
    create: {
      name: "Er. Anitha Varma (Assistant Executive Engineer, PWD)",
      email: "officer.roads@kerala.gov.in",
      mobile: "+91 9447000003",
      passwordHash: officerPassword,
      role: "DEPT_OFFICER",
      departmentId: deptMap["PWD"],
    },
  });

  const healthOfficer = await prisma.user.upsert({
    where: { email: "officer.health@kerala.gov.in" },
    update: { passwordHash: officerPassword, departmentId: deptMap["HFW"] },
    create: {
      name: "Dr. Mathew Thomas (District Medical Officer)",
      email: "officer.health@kerala.gov.in",
      mobile: "+91 9447000004",
      passwordHash: officerPassword,
      role: "DEPT_OFFICER",
      departmentId: deptMap["HFW"],
    },
  });

  // Citizens
  const citizenUsers = [
    {
      name: "Arun Krishnan",
      email: "arun@test.com",
      mobile: "+91 9847112233",
    },
    {
      name: "Priya Menon",
      email: "priya@test.com",
      mobile: "+91 9847223344",
    },
    {
      name: "Mohammed Ashraf",
      email: "ashraf@test.com",
      mobile: "+91 9847334455",
    },
    {
      name: "Lakshmi Devi",
      email: "lakshmi@test.com",
      mobile: "+91 9847445566",
    },
  ];

  const citizenMap = {};
  for (const c of citizenUsers) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: { passwordHash: citizenPassword },
      create: {
        ...c,
        passwordHash: citizenPassword,
        role: "CITIZEN",
      },
    });
    citizenMap[c.email] = user.id;
  }
  console.log("Users created successfully");

  // 3. Grievances
  const sampleGrievances = [
    {
      ref: "KL-CMO-2026-881021",
      citizenEmail: "arun@test.com",
      district: "Thiruvananthapuram",
      category: "Water Supply & Sanitation",
      subject: "Severe drinking water disruption for 10 days in Ward 14, Kazhakkoottam",
      description: "The main water pipeline burst near Kazhakkoottam junction 10 days ago. Over 300 households have had no drinking water supply. Water tankers are charging exorbitant rates. Immediate repair and tanker deployment requested.",
      priority: "HIGH",
      status: "IN_PROGRESS",
      deptCode: "WRD",
      aiDept: "Water Resources Department",
      aiCat: "Water Supply & Sanitation",
      aiPri: "HIGH",
      aiSum: "Pipeline burst affecting 300+ households with 10 days of zero drinking water in Kazhakkoottam. Urgent repair and emergency supply required.",
      adminRemarks: "Forwarded with high priority to KWA Executive Engineer. Ensure emergency water tankers today.",
      history: [
        { status: "SUBMITTED", remarks: "Grievance registered through citizen web portal.", by: "arun@test.com" },
        { status: "UNDER_REVIEW", remarks: "CMO Desk reviewed AI summary and marked as high priority.", by: "admin@cmkerala.gov.in" },
        { status: "IN_PROGRESS", remarks: "Assigned to Water Resources Dept. Field team dispatched for pipe replacement.", by: "officer.water@kerala.gov.in" },
      ],
      actionReport: "Excavation completed. Replacement pipe parts delivered on site. Welding in progress. Expected completion within 24 hours.",
    },
    {
      ref: "KL-CMO-2026-541982",
      citizenEmail: "priya@test.com",
      district: "Ernakulam",
      category: "Roads, Bridges & Infrastructure",
      subject: "Life-threatening crater-sized potholes on Aluva-Perumbavoor Road",
      description: "Monsoon rains created deep craters near Marampally on the Aluva-Perumbavoor stretch. Multiple two-wheeler riders have sustained fractures this week. Buses are avoiding the route causing commuter chaos.",
      priority: "HIGH",
      status: "UNDER_REVIEW",
      deptCode: "PWD",
      aiDept: "Public Works Department (PWD)",
      aiCat: "Roads, Bridges & Infrastructure",
      aiPri: "HIGH",
      aiSum: "Severe road damage causing accidents and injuries on Aluva-Perumbavoor route. Urgent road resurfacing required.",
      adminRemarks: "Reviewing with PWD Central Circle. Escalated for emergency tarring.",
      history: [
        { status: "SUBMITTED", remarks: "Grievance submitted by citizen with road hazard report.", by: "priya@test.com" },
        { status: "UNDER_REVIEW", remarks: "CMO forwarded to PWD Superintending Engineer.", by: "admin@cmkerala.gov.in" },
      ],
      actionReport: null,
    },
    {
      ref: "KL-CMO-2026-319084",
      citizenEmail: "ashraf@test.com",
      district: "Kozhikode",
      category: "Public Healthcare & Hospitals",
      subject: "Acute shortage of insulin and anti-hypertensives at Kozhikode Taluk Hospital",
      description: "Patients visiting the outpatient pharmacy at the Taluk Hospital are turned away daily due to non-availability of insulin and basic cardiac medications. Poor patients cannot afford open-market pharmacy rates.",
      priority: "HIGH",
      status: "RESOLVED",
      deptCode: "HFW",
      aiDept: "Health and Family Welfare",
      aiCat: "Public Healthcare & Hospitals",
      aiPri: "HIGH",
      aiSum: "Critical shortage of life-saving diabetes and hypertension drugs at Taluk Hospital impacting low-income patients.",
      adminRemarks: "Directly addressed with District Medical Officer. Additional stock requisition approved from KMSCL.",
      history: [
        { status: "SUBMITTED", remarks: "Complaint submitted.", by: "ashraf@test.com" },
        { status: "UNDER_REVIEW", remarks: "CMO alerted DMO office.", by: "admin@cmkerala.gov.in" },
        { status: "IN_PROGRESS", remarks: "Emergency indent sent to KMSCL warehouse.", by: "officer.health@kerala.gov.in" },
        { status: "RESOLVED", remarks: "Emergency shipment of 500 vials of insulin and cardiac drugs delivered. Pharmacy distribution resumed.", by: "officer.health@kerala.gov.in" },
      ],
      actionReport: "Emergency consignment received from KMSCL Kozhikode central depot on Nov 10. Buffer stock maintained for 45 days.",
      feedback: { rating: 5, comment: "Thank you Hon. Chief Minister and Health Dept! Medications were available the very next day." },
    },
    {
      ref: "KL-CMO-2026-102948",
      citizenEmail: "lakshmi@test.com",
      district: "Palakkad",
      category: "Agriculture, Farmers & Irrigation",
      subject: "Delay of 4 months in paddy procurement payment (Supplyco)",
      description: "Paddy harvested and procured in Chittur taluk by Supplyco has not been credited to farmers' accounts for over 4 months. Farmers are facing bank notices and unable to start next season sowing.",
      priority: "MEDIUM",
      status: "SUBMITTED",
      deptCode: null,
      aiDept: "Agriculture Development & Farmers' Welfare",
      aiCat: "Agriculture, Farmers & Irrigation",
      aiPri: "MEDIUM",
      aiSum: "Four-month delay in PRS payment for paddy procurement causing financial hardship to Chittur farmers.",
      adminRemarks: null,
      history: [
        { status: "SUBMITTED", remarks: "Grievance submitted by farmer collective representative.", by: "lakshmi@test.com" },
      ],
      actionReport: null,
    },
    {
      ref: "KL-CMO-2026-772910",
      citizenEmail: "arun@test.com",
      district: "Kottayam",
      category: "Education & Schools",
      subject: "Damaged roof and leaking classroom ceiling at Govt Higher Secondary School, Vaikom",
      description: "The primary section building of GHSS Vaikom has leaking asbestos roofs and peeling plaster during rain. Classes had to be temporarily moved to the dining hall. Requires immediate structural repair funds.",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      deptCode: "PWD",
      aiDept: "General Education Department",
      aiCat: "Education & Schools",
      aiPri: "MEDIUM",
      aiSum: "School building roof leakage at GHSS Vaikom disrupting primary classes. Structural repair required.",
      adminRemarks: "PWD Engineering wing assigned for school building restoration under Plan Fund.",
      history: [
        { status: "SUBMITTED", remarks: "Grievance submitted by PTA executive member.", by: "arun@test.com" },
        { status: "UNDER_REVIEW", remarks: "CMO verified school details with DEO Kottayam.", by: "admin@cmkerala.gov.in" },
        { status: "IN_PROGRESS", remarks: "Joint inspection with PWD Buildings assistant engineer completed.", by: "officer.roads@kerala.gov.in" },
      ],
      actionReport: "Inspection report prepared. ₹4.5 Lakhs estimate sanctioned under school maintenance grant. Tendering initiated.",
    },
  ];

  for (const g of sampleGrievances) {
    const citizenId = citizenMap[g.citizenEmail];
    const deptId = g.deptCode ? deptMap[g.deptCode] : null;

    const grievance = await prisma.grievance.upsert({
      where: { referenceNumber: g.ref },
      update: {
        status: g.status,
        priority: g.priority,
        departmentId: deptId,
        adminRemarks: g.adminRemarks,
      },
      create: {
        referenceNumber: g.ref,
        citizenId,
        district: g.district,
        category: g.category,
        subject: g.subject,
        description: g.description,
        priority: g.priority,
        status: g.status,
        departmentId: deptId,
        aiSuggestedDept: g.aiDept,
        aiSuggestedCategory: g.aiCat,
        aiSuggestedPriority: g.aiPri,
        aiSummary: g.aiSum,
        adminRemarks: g.adminRemarks,
      },
    });

    await prisma.grievanceHistory.deleteMany({ where: { grievanceId: grievance.id } });

    for (const h of g.history) {
      let changedById = adminUser.id;
      if (citizenMap[h.by]) {
        changedById = citizenMap[h.by];
      } else if (h.by === "officer.water@kerala.gov.in") {
        changedById = waterOfficer.id;
      } else if (h.by === "officer.roads@kerala.gov.in") {
        changedById = pwdOfficer.id;
      } else if (h.by === "officer.health@kerala.gov.in") {
        changedById = healthOfficer.id;
      }

      await prisma.grievanceHistory.create({
        data: {
          grievanceId: grievance.id,
          status: h.status,
          remarks: h.remarks,
          changedById,
        },
      });
    }

    if (deptId && g.actionReport) {
      await prisma.grievanceAssignment.deleteMany({ where: { grievanceId: grievance.id } });
      await prisma.grievanceAssignment.create({
        data: {
          grievanceId: grievance.id,
          departmentId: deptId,
          actionReport: g.actionReport,
          resolvedAt: g.status === "RESOLVED" ? new Date() : null,
        },
      });
    }

    if (g.feedback) {
      await prisma.feedback.deleteMany({ where: { grievanceId: grievance.id } });
      await prisma.feedback.create({
        data: {
          grievanceId: grievance.id,
          citizenId,
          rating: g.feedback.rating,
          comment: g.feedback.comment,
        },
      });
    }
  }

  // 4. Contact Enquiry sample
  await prisma.contactEnquiry.create({
    data: {
      name: "Somanathan Nair",
      email: "soman@kerala.org",
      subject: "Inquiry regarding Pravasi grievance assistance",
      message: "Can Non-Resident Keralites (NRKs) submit complaints regarding ancestral property encroachment through this portal?",
    },
  });

  console.log("Database seeded successfully with all roles, depts, grievances, and history!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

