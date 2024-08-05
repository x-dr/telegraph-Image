import { auth } from "@/auth";
import { LoginPage } from "@/components/SignIn";
import { redirect } from "next/navigation";
export const runtime = 'edge';
export default async function SignInPage() {
    const session = await auth()
    // console.log({ session });
    if (session?.user) { redirect('/admin') }
    else {
        return <LoginPage />
    }



}

