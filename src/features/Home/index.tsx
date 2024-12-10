import { userSignOut } from '@lib/actions';
import { auth } from 'auth.config';

const Home = async () => {
  const session = await auth();
  // if (!session) {
  //   redirect('/signin');
  // }
  return (
    <div className="text-black">
      {`Welcome: ${session?.user?.email}`}
      <form action={userSignOut}>
        <button type="submit">sign out</button>
      </form>
    </div>
  );
};
export default Home;
