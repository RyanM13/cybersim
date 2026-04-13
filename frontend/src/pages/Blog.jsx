// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getPosts, createPost } from "@/services/blogService";
// import { PenSquare } from "lucide-react";
//
// export default function Blog() {
//   const [posts, setPosts] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     getPosts().then((res) => setPosts(res.data));
//   }, []);
//
//   return (
//     <div className="max-w-3xl mx-auto py-10 px-4">
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-3xl font-bold">Blog</h1>
//         <button
//           onClick={() => setShowModal(true)}
//           className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
//         >
//           <PenSquare size={16} /> New Post
//         </button>
//       </div>
//
//       <div className="flex flex-col gap-4">
//         {posts.map((post) => (
//           <div
//             key={post.id}
//             onClick={() => navigate(`/blog/${post.id}`)}
//             className="cursor-pointer border rounded-xl p-5 hover:shadow-md transition"
//           >
//             <h2 className="text-xl font-semibold">{post.title}</h2>
//             <p className="text-sm text-muted-foreground mt-1">
//               By {post.author} · {new Date(post.created_at).toLocaleDateString()}
//             </p>
//             <p className="mt-3 text-muted-foreground line-clamp-2">{post.body}</p>
//           </div>
//         ))}
//         {posts.length === 0 && (
//           <p className="text-muted-foreground text-center mt-20">
//             No posts yet. Be the first to write one!
//           </p>
//         )}
//       </div>
//
//       {showModal && (
//         <CreatePostModal
//           onClose={() => setShowModal(false)}
//           onSubmit={async (data) => {
//             await createPost(data);
//             const res = await getPosts();
//             setPosts(res.data);
//             setShowModal(false);
//           }}
//         />
//       )}
//     </div>
//   );
// }
//

import { Blog7 } from "../components/blog7";

export default function Blog() {
  return (
    <div className="w-full">
      <Blog7></Blog7>
    </div>
  );
}

