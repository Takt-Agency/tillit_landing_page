import styles from './Logo.module.css';
import logoViolet from '../../assets/logo-tillit-violet.webp';
import logoWhite from '../../assets/logo-tillit-blanc.webp';

type LogoProps = {
  className?: string;
  /** 'white' on dark backgrounds (footer), violet everywhere else. */
  variant?: 'violet' | 'white';
};

export default function Logo({ className, variant = 'violet' }: LogoProps) {
  return (
    <img
      src={variant === 'white' ? logoWhite : logoViolet}
      alt="TilliT"
      className={`${styles.logo} ${className ?? ''}`}
      decoding="async"
      width={600}
      height={212}
    />
  );
}
