import { NotifikationSkeletons } from "@/app/notifications/loading"
import SkeletonSearch from "./search/loading"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading(){
    return (
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
      <Card>
          <CardContent>
            <SkeletonSearch/>
          </CardContent>
         </Card>
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
         <Card>
          <CardContent>
            <SkeletonSearch/>
          </CardContent>
         </Card>
      </div>
    </div>
    )
  }
  