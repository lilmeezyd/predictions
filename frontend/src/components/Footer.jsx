const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center">
        &copy; {new Date().getFullYear()} Predictions. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
