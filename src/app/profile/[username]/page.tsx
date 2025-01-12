import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from "@/actions/profile.action"
import { notFound } from "next/navigation";
import ProfilePageClient from "./profilePage";
import { getProfile } from "@/actions/user.action";

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({params}: Props){
  const username = (await params).username
  const user = await getProfileByUsername(username)
  if(!user) return;

  return {
    title : `${user.name ?? user.username}`,
    description : user.bio || `Check out ${user.username || 'user'} profile`
  }
}

async function ProfilePage({params}: Props) {
  const username = (await params).username
  
  const [user, currentUser]= await Promise.all([getProfileByUsername(username), getProfile()]);
  if(!user) return notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id)
  ]);



  return (
    <ProfilePageClient
      user = {user}
      posts = {posts}
      likedPosts = {likedPosts}
      isFollowing ={isCurrentUserFollowing}
      currentUser = {currentUser}
      />
  )
}

export default ProfilePage