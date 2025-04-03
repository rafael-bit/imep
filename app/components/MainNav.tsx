import Link from "next/link"
import { navLinks } from "../constants/header"

const MainNav = () => {
  return (
    <>
      <nav>
        <ul className="space-x-3 hidden md:flex">
          {navLinks.map((link, index) => (
            <Link key={index} href={link.href} className="text-white px-3 rounded-full transition duration-300 cursor-pointer hover:scale-110 flex items-center gap-3 p-1">
              {link.label}
            </Link>
          ))}
        </ul>
      </nav>
      <Link href="https://www.youtube.com/@imeptv" target="_blank" className="font-semibold text-black bg-white border hover:bg-transparent hover:text-white px-6 rounded-full transition duration-300 cursor-pointer hover:scale-110 hidden md:flex pb-0.5">Ao vivo</Link>
    </>
  )
}


export default MainNav