from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List

router = APIRouter(prefix="/blog", tags=["blog"])

# Temporary in-memory store (replace with a database later)
posts = []
next_id = 1

class PostCreate(BaseModel):
    title: str
    body: str
    author: str

class Post(BaseModel):
    id: int
    title: str
    body: str
    author: str
    created_at: datetime

@router.get("/", response_model=List[Post])
def get_posts():
    return posts

@router.get("/{post_id}", response_model=Post)
def get_post(post_id: int):
    post = next((p for p in posts if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/", response_model=Post)
def create_post(post: PostCreate):
    global next_id
    new_post = {
        "id": next_id,
        "title": post.title,
        "body": post.body,
        "author": post.author,
        "created_at": datetime.now()
    }
    posts.append(new_post)
    next_id += 1
    return new_post

@router.delete("/{post_id}")
def delete_post(post_id: int):
    global posts
    posts = [p for p in posts if p["id"] != post_id]
    return {"message": "Post deleted"}