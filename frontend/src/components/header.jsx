import Logo from "../assets/Logo.jpg";

export default function Header({ minimal }) {
  return (
    <header className="h-16 bg-background flex items-center px-6">
      <img className="size-20 rounded-full " src={Logo} alt="Logo" />

      {/* Chatgpt: How to make this apply to my layout to only show on dashboard */}
      {!minimal && (
        <nav>
          <button>Home</button>
          <button>Logs</button>
          <button>Wiki</button>
          <button>Blog</button>
        </nav>
      )}
    </header>
  );
}
