import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex flex-wrap">
        {/* Contact Us */}
        <div className="w-full lg:w-1/3 md:w-1/2 px-4">
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <ul className="list-none">
            <li className="mb-1">Address: 123 Main Street, City, Country</li>
            <li className="mb-1">Phone: +1234567890</li>
            <li>Email: info@example.com</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="w-full lg:w-1/3 md:w-1/2 px-4">
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="list-none">
            <li className="mb-1"><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
            <li className="mb-1"><a href="/services" className="text-gray-300 hover:text-white">Services</a></li>
            <li className="mb-1"><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
            <li><a href="/contact" className="text-gray-300 hover:text-white">Contact Us</a></li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div className="w-full lg:w-1/3 md:w-full px-4">
          <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
          <ul className="list-none">
            <li className="mb-1"><a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-facebook-f"></i> Facebook</a></li>
            <li className="mb-1"><a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-twitter"></i> Twitter</a></li>
            <li className="mb-1"><a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-instagram"></i> Instagram</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-linkedin"></i> LinkedIn</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-4">
        <p className="text-center text-gray-400">© {new Date().getFullYear()} Handyman Services. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
