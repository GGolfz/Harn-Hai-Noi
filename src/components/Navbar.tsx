import style from "../style/Navbar.module.css";
interface Props {
  isHome: boolean;
  onBack: () => void;
}
const Navbar = ({ isHome = true, onBack }: Props) => {
  return (
    <div className={style.NavbarContainer}>
      {isHome ? (
        <div className={style.Space}></div>
      ) : (
        <div className={style.Space} onClick={onBack}>
          Back
        </div>
      )}
      <div className={style.MainContent}>Harn Hai Noi</div>
      <div className={style.Space}></div>
    </div>
  );
};

export default Navbar;
