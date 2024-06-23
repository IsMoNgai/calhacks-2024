import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="container">
        <h1>project name</h1>
        <Link href='/quiz'>
          <button>Get Started</button>
        </Link>
      </div>
    </main>
  )
}