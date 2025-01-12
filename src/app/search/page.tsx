import { getTokenId } from "@/actions/auth.action"
import SuggestedUsers from "@/components/suggestedUsers"
import SearchPageClient from "./searchpage"


 async function SearchPage() {  
  const authUser = await getTokenId()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
           <SearchPageClient/>
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
            <SuggestedUsers  userId={authUser.id}/>
      </div>
    </div>
  )
}

export default SearchPage