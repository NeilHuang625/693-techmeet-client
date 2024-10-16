import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { useAuth } from "../Contexts/AuthProvider";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <NavBar />
      <div className="flex-grow mx-auto w-1/2 mt-8">
        <h1>Profile update</h1>
        <p>Hello, {user?.nickname}</p>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
