import { Link } from '@tanstack/react-router'
import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '#/components/ui/dropdown-menu'
import { useSignoutMutation } from '#/hooks/auth'

export function UserMenuContent({ align = 'end' }: { align?: 'start' | 'end' | 'center' }) {
  const signoutMutation = useSignoutMutation()

  return (
    <DropdownMenuContent align={align} className="w-52">
      <DropdownMenuGroup>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem render={<Link to="/profile" />}>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link to="/settings" />}>
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          variant="destructive"
          disabled={signoutMutation.isPending}
          onClick={() => signoutMutation.mutate()}
        >
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}
