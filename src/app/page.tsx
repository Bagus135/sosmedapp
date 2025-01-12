import { getTokenId } from "@/actions/auth.action";
import { getPosts } from "@/actions/post.action";
import { getProfile } from "@/actions/user.action";
import CreatePost from "@/components/createPost";
import PostCard from "@/components/postCard";
import SuggestedUsers from "@/components/suggestedUsers";

export default async function Home() {
  const user= await getProfile();
  
  const posts = await getPosts()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        {!!user? <CreatePost user={user!}/> : null}
        <div className="space-y-6">
            {posts.map((post)=>(
              <PostCard key={post.id} post={post} user={user!}/>
            ))}
        </div>
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <SuggestedUsers userId={user?.id}/>
      </div>
    </div>
  );
}
