import Search from '@features/Search';
import { auth } from '@lib/actions';

const Home = async () => {
  const session = await auth();
  return (
    <div className="w-full">
      <div className="flex flex-col my-20">
        <span className="mb-12 mx-auto text-lg text-darkest tracking-wide">
          {!session ? 'Welcome' : `Welcome ${session.user?.email}`}
        </span>
        <Search />
      </div>
    </div>
  );
};
export default Home;
