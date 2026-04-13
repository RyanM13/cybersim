import { Blog7 } from "../components/blog7";

export default function Wiki() {
  return (
    <div className="w-full">
      <Blog7
        heading="Wiki"
        tagline="Commands/Best Practices"
        description="Discover a list of useful commands and best practices to stay up to date."
        posts={[
          {
            id: "post-1",
            title: "Uncomplicated Firewall (ufw)",
            label: "Linux Commands",
            author: "Wiki Ubuntu",
            published: " ",
            url: "https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://wiki.ubuntu.com/UncomplicatedFirewall&ved=2ahUKEwino-jCnuuTAxU-nSYFHS0gKEcQFnoECB8QAQ&usg=AOvVaw3kn2XkBpiIhAhYy1dzfZuA",

            image:
              "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-2.svg",
          },
          {
            id: "post-2",
            title: "netstat Command (Linux Manual)",
            label: "Linux Commands",
            author: "Linux Man Pages",
            published: " ",
            url: "https://man7.org/linux/man-pages/man8/netstat.8.html",
            image:
              "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-3.svg",
          },
          {
            id: "post-3",
            title: "OpenSSH Server Documentation",
            label: "Linux Security",
            author: "OpenBSD Project",
            published: " ",
            url: "https://man.openbsd.org/sshd",
            image:
              "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
          },
        ]}
      />
    </div>
  );
}
