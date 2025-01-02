import TrackExplorer from '@features/TrackExplorer';
import { auth } from '@lib/actions';

const Home = async () => {
  const session = await auth();
  return (
    <div className="w-full">
      <div className="flex flex-col mt-20">
        <span className="mb-12 mx-auto text-lg text-darkest tracking-wide">
          {!session ? 'Welcome' : `Welcome ${session.user?.email}`}
        </span>
        <TrackExplorer />
      </div>
    </div>
  );
};
export default Home;
