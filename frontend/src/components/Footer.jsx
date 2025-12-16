const Footer = () => {
  return (
    <footer className="w-full bg-blue-100 text-muted-foreground text-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center">
        &copy; {new Date().getFullYear()} Predictions. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
