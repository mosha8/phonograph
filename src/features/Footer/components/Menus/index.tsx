import Link from '@components/Link';
import config from '@configs/app.json';

const { FooterMenu } = config;
const Menus = () => {
  return (
    <div className="flex md:space-x-16 justify-center md:justify-end">
      {FooterMenu.map(({ label, values }) => {
        return (
          <div className="flex flex-col" key={`footer-${label}`}>
            <label className="text-sm text-medium px-4 py-2">{label}</label>
            <ul className="flex flex-col gap-y-2">
              {values.map(({ title, href }) => (
                <li key={`footer-sub-menu-${title}`}>
                  <Link href={href} variant="text">
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
export default Menus;
