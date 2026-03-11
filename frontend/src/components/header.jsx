import Logo from "../assets/Logo.jpg";

export default function Header({ minimal }) {
  return (
    <header className="h-17 bg-background flex items-center px-6">
      <div className="mt-1.5 mr-3.5">
        <img className="size-16 rounded-full " src={Logo} alt="Logo" />
      </div>

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
