import { format } from 'date-fns'
import { OctagonXIcon } from 'lucide-react'
import type { User } from '@medi-track/types'
import { getErrorMessage } from '#/api/client'
import { useUser } from '#/hooks/user'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { Separator } from '#/components/ui/separator'
import { ProfileForm } from './ProfileForm'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function ProfilePageSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-full shrink-0" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    </div>
  )
}

function ProfilePageContent({ user }: { user: User }) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Avatar className="size-16 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-xl font-medium truncate">{user.name}</p>
          <p className="text-base text-muted-foreground truncate">{user.email}</p>
          <p className="text-sm text-muted-foreground">
            Member since {format(new Date(user.createdAt), 'MMMM yyyy')}
          </p>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Medical information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}

export function ProfilePage() {
  const { data: user, isLoading, isError, error } = useUser()

  if (isLoading) return <ProfilePageSkeleton />

  if (isError || !user) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>Couldn't load your profile</AlertTitle>
          <AlertDescription>{getErrorMessage(error)} Please try again.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return <ProfilePageContent user={user} />
}
