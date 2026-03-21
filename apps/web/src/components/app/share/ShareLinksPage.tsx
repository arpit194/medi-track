import { useMemo } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import { CopyIcon, LinkIcon, PlusIcon, ClockIcon } from 'lucide-react'
import { format, isPast } from 'date-fns'
import { buttonVariants } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Skeleton } from '#/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '#/components/ui/tabs'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '#/components/ui/empty'
import { getErrorMessage } from '#/api/client'
import { useShareLinks, useRevokeShareLinkMutation, useReactivateShareLinkMutation } from '#/hooks/share'
import { cn } from '#/lib/utils'
import { RevokeShareLinkButton } from './RevokeShareLinkButton'
import { ReactivateShareLinkButton } from './ReactivateShareLinkButton'
import type { ShareLink } from '@medi-track/types'

const EXPIRY_LABELS: Record<string, string> = {
  '24h': '24 hours',
  '7d': '7 days',
  '30d': '30 days',
  one_time: 'One-time view',
}

function ShareLinkCard({ link }: { link: ShareLink }) {
  const revokeMutation = useRevokeShareLinkMutation()
  const reactivateMutation = useReactivateShareLinkMutation()
  const shareUrl = `${window.location.origin}/s/${link.token}`
  const expired = isPast(new Date(link.expiresAt))
  const inactive = link.isRevoked || expired

  function copyLink() {
    void navigator.clipboard.writeText(shareUrl)
    toast.success('Link copied to clipboard')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(inactive && 'text-muted-foreground')}>{link.label}</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <ClockIcon className="size-3.5" />
          {link.isRevoked
            ? 'Revoked'
            : expired
              ? `Expired ${format(new Date(link.expiresAt), 'd MMM yyyy')}`
              : `Expires ${format(new Date(link.expiresAt), 'd MMM yyyy')}`}
        </CardDescription>
        <CardAction>
          {inactive ? (
            <Badge variant="outline" className="text-muted-foreground">
              {link.isRevoked ? 'Revoked' : 'Expired'}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Active</Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm overflow-hidden">
          <span className="w-0 grow truncate text-muted-foreground font-mono">{shareUrl}</span>
          {!inactive && (
            <button
              onClick={copyLink}
              aria-label="Copy link"
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors min-h-11 min-w-11 flex items-center justify-center"
            >
              <CopyIcon className="size-4" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {link.reportIds.length} {link.reportIds.length === 1 ? 'report' : 'reports'} · {EXPIRY_LABELS[link.expiresIn] ?? link.expiresIn}
          </span>
          <div className="flex items-center gap-2">
            {inactive && (
              <ReactivateShareLinkButton
                onConfirm={(expiresIn) => reactivateMutation.mutate({ id: link.id, expiresIn })}
                isLoading={reactivateMutation.isPending}
              />
            )}
            {!link.isRevoked && !expired && (
              <RevokeShareLinkButton
                onConfirm={() => revokeMutation.mutate(link.id)}
                isLoading={revokeMutation.isPending}
              />
            )}
          </div>
        </div>
        {(revokeMutation.isError || reactivateMutation.isError) && (
          <p className="text-sm text-destructive">
            {getErrorMessage(revokeMutation.error ?? reactivateMutation.error)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function ShareLinksPageSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function LinksList({ links, emptyTitle, emptyDescription }: {
  links: ShareLink[]
  emptyTitle: string
  emptyDescription: string
}) {
  if (links.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"><LinkIcon /></EmptyMedia>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }
  return (
    <div className="flex flex-col gap-4">
      {links.map((link) => <ShareLinkCard key={link.id} link={link} />)}
    </div>
  )
}

export function ShareLinksPage() {
  const navigate = useNavigate()
  const { tab } = useSearch({ from: '/_app/share/' })
  const { data: links, isLoading, isError, error } = useShareLinks()

  const { active, inactive } = useMemo(() => {
    const all = links ?? []
    return {
      active: all.filter((l) => !l.isRevoked && !isPast(new Date(l.expiresAt))),
      inactive: all.filter((l) => l.isRevoked || isPast(new Date(l.expiresAt))),
    }
  }, [links])

  function setTab(value: string) {
    void navigate({ to: '/share', search: { tab: value as 'active' | 'inactive' }, replace: true })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-medium">Share links</h1>
        <Link to="/share/new" className={buttonVariants()}>
          <PlusIcon className="size-4" />
          New link
        </Link>
      </div>

      {isLoading && <ShareLinksPageSkeleton />}

      {isError && (
        <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
      )}

      {!isLoading && !isError && links?.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><LinkIcon /></EmptyMedia>
            <EmptyTitle>No share links yet</EmptyTitle>
            <EmptyDescription>
              Create a link to share your reports with a doctor or specialist — no account needed on their end.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link to="/share/new" className={buttonVariants()}>Create your first link</Link>
          </EmptyContent>
        </Empty>
      )}

      {!isLoading && !isError && links && links.length > 0 && (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="active">
              Active
              {active.length > 0 && (
                <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-xs font-medium text-primary leading-none">
                  {active.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Expired & revoked
              {inactive.length > 0 && (
                <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground leading-none">
                  {inactive.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            <LinksList
              links={active}
              emptyTitle="No active links"
              emptyDescription="All your links have expired or been revoked. Create a new one to share reports again."
            />
          </TabsContent>
          <TabsContent value="inactive" className="mt-4">
            <LinksList
              links={inactive}
              emptyTitle="No expired or revoked links"
              emptyDescription="Links that have expired or been revoked will appear here."
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
