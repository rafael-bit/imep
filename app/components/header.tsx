import Image from "next/image"
import MainNav from "./MainNav"
import MobileNav from "./MobileNav"

const Header = () => {
  return (
    <header className=" w-full flex items-center justify-between px-4 bg-black text-white font-roboto">
      <section className="flex gap-2 items-center p-4">
        <Image src="/logo.png" alt="Logo Imep" className="w-12 h-12" width={64} height={64}/>
      </section>
      {/* Nav Bar para Desktop */}
      <MainNav />

      {/* Nav Bar para mobile */}
      <MobileNav />

    </header>
  )
}

export default Header