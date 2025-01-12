import { NotifikationSkeletons } from "@/app/notifications/loading"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading(){
    return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
          <div className="w-full max-w-lg mx-auto">
      <Card className="bg-card">
      <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
              <Skeleton className="w-24 h-24 rounded-full relative z-[0] mb-4"/>
              <Skeleton className="h-4 w-full"/>
              <Skeleton className="h-4 w-full"/>
              <Skeleton className="h-4 w-full"/>
               
              <div className="w-full mt-6">
                  <div className="flex justify-between mb-4">
                      <div>
                      <Skeleton className="h-4 w-full"/>
                          <div className="text-sm text-muted-foreground">
                          <Skeleton className="h-4 w-full"/>
                          </div>
                      </div>
                      <Separator orientation="vertical"/>
                      <Skeleton className="h-4 w-full"/>
                      <div>
                          <div className="font-semibold">
                          <Skeleton className="h-4 w-full"/>
                          </div>
                          <div className="text-sm text-muted-foreground">
                          <Skeleton className="h-4 w-full"/>
                          </div>
                      </div>
                      <Separator orientation="vertical"/>
                      <div>
                          <div className="font-semibold">           <Skeleton className="h-4 w-full"/></div>
                          <div className="text-sm text-muted-foreground">           <Skeleton className="h-4 w-full"/>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="w-full mt-6 space-y-2 text-sm">
              <Skeleton className="h-4 w-full"/>
                  <div className="flex items-center text-muted-foreground">
                  </div>
              </div>
          </div>
      </CardContent>
  </Card>
  </div>
  </div>
  </div>
    )
  }
  