import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { findUserByEmail, saveUser } from "@/lib/usersStore";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const cleanEmail = credentials.email.toLowerCase().trim();

        // 1. Check in-memory store (instant & immune to serverless DB issues)
        const stored = findUserByEmail(cleanEmail);
        if (stored) {
          const isMatch =
            (stored.plainPassword && credentials.password === stored.plainPassword) ||
            (stored.passwordHash &&
              (await bcrypt.compare(credentials.password, stored.passwordHash)));

          if (isMatch) {
            return {
              id: stored.id,
              name: stored.name,
              email: stored.email,
              role: stored.role,
              departmentId: stored.departmentId || undefined,
              departmentName: stored.departmentName || undefined,
              departmentCode: stored.departmentCode || undefined,
            };
          }
        }

        // 2. Database lookup (with try/catch fallback)
        try {
          const user = await prisma.user.findUnique({
            where: { email: cleanEmail },
            include: { department: true },
          });

          if (user) {
            const valid = await bcrypt.compare(credentials.password, user.passwordHash);
            if (valid) {
              // Cache into memory store for faster future lookups
              saveUser({
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                departmentId: user.departmentId,
                departmentName: user.department?.name,
                departmentCode: user.department?.code,
                passwordHash: user.passwordHash,
              });

              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                departmentId: user.departmentId || undefined,
                departmentName: user.department?.name,
                departmentCode: user.department?.code,
              };
            }
          }
        } catch (dbError) {
          console.error("Prisma authorize error (fallbacking):", dbError);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.departmentId = (user as any).departmentId;
        token.departmentName = (user as any).departmentName;
        token.departmentCode = (user as any).departmentCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).departmentId = token.departmentId as string | undefined;
        (session.user as any).departmentName = token.departmentName as string | undefined;
        (session.user as any).departmentCode = token.departmentCode as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "cm-kerala-grievance-secret-2026",
};
