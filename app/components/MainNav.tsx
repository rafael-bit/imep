import Link from "next/link"
import { navLinks } from "../constants/header"

const MainNav = () => {
  return (
    <>
      <nav>
        <ul className="space-x-3 hidden md:flex">
          {navLinks.map((link, index) => (
            <Link key={index} href={link.href} className="text-white font-semibold px-3 rounded-full transition duration-300 cursor-pointer hover:scale-110 flex items-center gap-3 p-1">
              {link.label}
            </Link>
          ))}
        </ul>
      </nav>
      <Link href="https://www.youtube.com/@imeptv" target="_blank" className="text-white font-semibold bg-red-500 px-6 rounded-full transition duration-300 cursor-pointer hover:scale-110 hidden md:flex p-1">Ao vivo</Link>
    </>
  )
}


export default MainNav