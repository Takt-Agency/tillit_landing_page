import styles from './Logo.module.css';
import logoUrl from '../../logo.png';

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <img
      src={logoUrl}
      alt="tillit — Simple entre nous"
      className={`${styles.logo} ${className ?? ''}`}
    />
  );
}
