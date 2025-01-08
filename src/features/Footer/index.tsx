import LogoIcon from '@assets/images/logo.svg';
import LinkIcon from '@components/LinkIcon';
import classNames from 'classnames';
import Menus from './components/Menus';

const Footer = () => {
  return (
    <footer
      className={classNames(
        'w-screen h-[400px] bg-background sticky bottom-0',
        'md:px-20 px-12 pt-20 pb-3',
        'border-t border-t-medium'
      )}
    >
      <div className="flex flex-col gap-y-12">
        <div
          className={classNames(
            'w-full gap-y-8',
            'flex flex-col-reverse md:flex-row-reverse md:justify-between'
          )}
        >
          <Menus />
          <div>
            <LinkIcon href="/">
              <LogoIcon
                width={40}
                height={40}
                className={
                  'hover:scale-125 hover:transition hover:duration-300 hover:delay-200'
                }
              />
            </LinkIcon>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
