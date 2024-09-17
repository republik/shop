import { redirect } from 'next/navigation'

export default async function Home() {
  redirect(`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/angebote`)
}
