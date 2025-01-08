'use client';
import type { ResponseInternal } from '@auth/core/types';
import Button from '@components/Button';
import Link from '@components/Link';
import config from '@configs/app.json';
import type { NavItemsProps } from '@features/Navbar/@types';
import { userSignOut } from '@lib/actions';
import classNames from 'classnames';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { redirect as nextRedirect } from 'next/navigation';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';

const { NavbarItems } = config;
const NavItems: FC<NavItemsProps> = ({ horizontal = true }) => {
  // States
  const [session, setSession] = useState<Session | null>(null);

  // Callbacks
  const userSignoutAction = useCallback(async () => {
    const { redirect } = (await userSignOut()) as ResponseInternal;
    if (redirect) nextRedirect(redirect);
  }, []);
  const checkSession = useCallback(async () => {
    const session = await getSession();
    if (session) {
      setSession(session);
    }
  }, []);
  const onClickLogin = useCallback(() => {
    nextRedirect('/signin');
  }, []);

  // Effects
  useEffect(() => {
    if (!session) {
      checkSession().catch((reason) => {
        console.error(reason);
      });
    }
  }, [checkSession, session]);

  return (
    <div
      className={classNames(
        !horizontal && 'mt-16 flex flex-col gap-y-2',
        horizontal && 'hidden md:flex gap-6 leading-relaxed font-medium'
      )}
    >
      {NavbarItems.map(({ href, title }, index) => (
        <Link color="primary" variant="text" href={href} key={index}>
          {title}
        </Link>
      ))}

      {session && (
        <form action={userSignoutAction}>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            type="submit"
          >
            Logout
          </Button>
        </form>
      )}
      {!session && (
        <Button
          variant="contained"
          size="medium"
          color="primary"
          onClick={onClickLogin}
        >
          Login
        </Button>
      )}
    </div>
  );
};
export default NavItems;
