import { useState } from "react";
import { X } from "lucide-react";

export default function CreatePostModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = () => {
    if (!title || !body) return;
    onSubmit({ title, body });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Blog Post</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm h-40 resize-none"
          placeholder="Write your post..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border text-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:opacity-90"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}