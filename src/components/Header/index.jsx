import useUserStore from "../store/userData";

function Header() {
  const userData = useUserStore();
  const iconURI = userData.userData.iconpath;

  return (
    <div className="flex justify-between">
      <div className="text-5xl mt- ml-2">FILER :</div>
      <img
        src={iconURI}
        alt="userIcon"
        className="flex mt-2 mr-2 rounded-full h-10 w-10 "
      />
    </div>
  );
}

export default Header;
