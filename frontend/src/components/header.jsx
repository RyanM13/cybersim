import Logo from "../assets/Logo.jpg";

export default function Header({ minimal }) {
  return (
    <header className="h-17 bg-background flex items-center px-6">
      <div className="mt-1.5 mr-3.5">
        <img className="size-16 rounded-full " src={Logo} alt="Logo" />
      </div>

      {/* Chatgpt: How to make this apply to my layout to only show on dashboard */}
      {!minimal && (
        <div className="absolute left-1/2 -translate-x-1/2">
          <nav>
            <ul className="flex flex-row gap-3 text-2xl">
              <li>
                <a href="/dashboard">Home</a>
              </li>
              <li>
                <a href="Logs">Logs</a>
              </li>
              <li>
                <a href="Wiki">Wiki</a>
              </li>
              <li>
                <a href="Blog">Blog</a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
