import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import connectMongo from "./mongo";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(connectMongo),
  providers: [
    // Add your auth providers here
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default authOptions;
