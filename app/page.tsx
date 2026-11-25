import { auth } from "@/auth";
import { HomePage } from "./component/home";

// page.tsx เป็น server component → อ่าน session (คุกกี้) ได้ตรง ๆ แล้วส่งต่อให้ HomePage (client)
export default async function Home() {
  const mockMode = process.env.USE_MOCK === "1";
  const session = mockMode ? null : await auth();
  const user = session?.user ? { name: session.user.name ?? session.user.email ?? "ผู้ใช้" } : null;

  return <HomePage user={user} mockMode={mockMode} />;
}
