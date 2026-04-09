import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost } from "@/services/blogService";
import { ArrowLeft } from "lucide-react";

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    getPost(id).then((res) => setPost(res.data));
  }, [id]);

  if (!post) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <button
        onClick={() => navigate("/blog")}
        className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground"
      >
        <ArrowLeft size={16} /> Back to Blog
      </button>
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        By {post.author} · {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="prose prose-neutral max-w-none whitespace-pre-wrap">
        {post.body}
      </div>
    </div>
  );
}