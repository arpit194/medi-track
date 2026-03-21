import { Link } from '@tanstack/react-router'
import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '#/components/ui/dropdown-menu'
import { useSignoutMutation } from '#/hooks/auth'

export function UserMenuContent({
  align = 'end',
}: {
  align?: 'start' | 'end' | 'center'
}) {
  const { t } = useTranslation()
  const signoutMutation = useSignoutMutation()

  return (
    <DropdownMenuContent align={align} className="w-52">
      <DropdownMenuGroup>
        <DropdownMenuLabel>{t('nav.myAccount')}</DropdownMenuLabel>
        <DropdownMenuItem render={<Link to="/profile" />}>
          <UserIcon />
          {t('nav.profile')}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link to="/settings" />}>
          <SettingsIcon />
          {t('nav.settings')}
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
          {t('nav.signOut')}
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}
