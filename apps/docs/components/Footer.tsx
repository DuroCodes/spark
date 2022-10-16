import SparkLogo from './logos/SparkLogo';

export function Footer() {
  return (
    <footer className="" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="md:flex md:items-center md:justify-between">
        <p className="text-xs text-gray-500 ">
          <SparkLogo height={48} />
          &copy; {new Date().getFullYear()} Spark. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
