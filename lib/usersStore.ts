// In-memory persistent user fallback for serverless environments (Vercel)
// Ensures that demo users and newly registered users can ALWAYS log in without DB issues

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  mobile?: string | null;
  passwordHash?: string;
  plainPassword?: string;
  role: string;
  departmentId?: string | null;
  departmentName?: string | null;
  departmentCode?: string | null;
}

// Global registry so it persists across hot-reloads within a serverless container
const globalForUsers = globalThis as unknown as {
  demoUsers: Map<string, StoredUser>;
};

if (!globalForUsers.demoUsers) {
  globalForUsers.demoUsers = new Map<string, StoredUser>();

  const seedUsers: StoredUser[] = [
    {
      id: "user_cmo_admin",
      name: "CMO Principal Secretary (Grievance Cell)",
      email: "admin@cmkerala.gov.in",
      plainPassword: "Admin@123",
      role: "CMO_ADMIN",
    },
    {
      id: "user_officer_kwa",
      name: "Er. K. Radhakrishnan (Executive Engineer, KWA)",
      email: "officer.water@kerala.gov.in",
      plainPassword: "Officer@123",
      role: "DEPT_OFFICER",
      departmentId: "dept_kwa",
      departmentName: "Water Resources Department (KWA)",
      departmentCode: "WRD",
    },
    {
      id: "user_officer_pwd",
      name: "Er. Suresh Kumar (Executive Engineer, PWD)",
      email: "officer.roads@kerala.gov.in",
      plainPassword: "Officer@123",
      role: "DEPT_OFFICER",
      departmentId: "dept_pwd",
      departmentName: "Public Works Department (PWD)",
      departmentCode: "PWD",
    },
    {
      id: "user_officer_health",
      name: "Dr. Thomas Mathew (District Medical Officer)",
      email: "officer.health@kerala.gov.in",
      plainPassword: "Officer@123",
      role: "DEPT_OFFICER",
      departmentId: "dept_health",
      departmentName: "Health and Family Welfare",
      departmentCode: "HFW",
    },
    {
      id: "user_arun",
      name: "Arun Kumar",
      email: "arun@test.com",
      mobile: "+91 9847012345",
      plainPassword: "Citizen@123",
      role: "CITIZEN",
    },
    {
      id: "user_priya",
      name: "Priya Nair",
      email: "priya@test.com",
      mobile: "+91 9447123456",
      plainPassword: "Citizen@123",
      role: "CITIZEN",
    },
  ];

  for (const u of seedUsers) {
    globalForUsers.demoUsers.set(u.email.toLowerCase().trim(), u);
  }
}

export const usersStore = globalForUsers.demoUsers;

export function findUserByEmail(email: string): StoredUser | undefined {
  return usersStore.get(email.toLowerCase().trim());
}

export function saveUser(user: StoredUser): void {
  usersStore.set(user.email.toLowerCase().trim(), user);
}
