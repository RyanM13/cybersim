import Logo from "../assets/Logo.jpg";

export default function Header({ minimal }) {
  return (
    <>
      <header className="bg-background">
        <img className="size-24 rounded-full" src={Logo} alt="Logo" />

        {!minimal && (
          <nav>
            <button type="Home">Home</button>
            <button type="Logs">Logs</button>
            <button type="Wiki">Wiki</button>
            <button type="Blog"></button>
          </nav>
        )}
      </header>
    </>
  );
}
