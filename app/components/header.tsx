import Image from "next/image"
import MainNav from "./MainNav"
import MobileNav from "./MobileNav"
import Link from "next/link"

const Header = () => {
  return (
    <header className=" w-full flex items-center justify-between px-4 text-white font-roboto">
      <section className="flex gap-2 items-center p-4">
        <Link href="/">
          <Image src="/logo.png" alt="Logo Imep" className="w-12 h-12" width={64} height={64} />
        </Link>
      </section>
      {/* Nav Bar para Desktop */}
      <MainNav />

      {/* Nav Bar para mobile */}
      <MobileNav />

    </header>
  )
}

export default Header