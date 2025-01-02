import LogoIcon from '@assets/images/logo.svg';
import LinkIcon from '@components/LinkIcon';
import classNames from 'classnames';
import NavItems from './components/NavItems';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center h-full">
      <div>
        <LinkIcon href="/" className="h-full flex items-center gap-x-2">
          <LogoIcon
            width={40}
            height={40}
            className={classNames(
              'hover:scale-125 hover:transition hover:duration-300 hover:delay-200'
            )}
          />
          <label className="cursor-pointer">Phonograph</label>
        </LinkIcon>
      </div>
      <div className="flex items-center gap-16">
        <NavItems horizontal={true} />
        <div className="block md:hidden">{/* <Drawer /> */}</div>
      </div>
    </nav>
  );
};
export default Navbar;
