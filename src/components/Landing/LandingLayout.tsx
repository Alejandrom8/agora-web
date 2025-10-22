import HorizontalNavbar from '../App/HorizontalNavbar';
import LandingFooter from './LandingFooter';

export default function LandingLayout({ children }) {
  return (
    <>
      {/* NAVBAR */}
      <HorizontalNavbar />
      {children}
      {/* FOOTER */}
      <LandingFooter />
    </>
  );
}
