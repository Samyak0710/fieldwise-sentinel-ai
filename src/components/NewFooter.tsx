
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Youtube } from 'lucide-react';

const NewFooter: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between mb-8 border-b border-gray-800 pb-8">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="text-xl font-bold text-primary mb-4 block">PestVision</Link>
            <p className="text-gray-400 max-w-sm">
              AI-powered pest detection and management solutions for modern agriculture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16">
            <div>
              <h3 className="font-semibold mb-4">Site Links</h3>
              <ul className="space-y-2">
                <li><Link to="/technology" className="text-gray-400 hover:text-white">Technology</Link></li>
                <li><Link to="/benefits" className="text-gray-400 hover:text-white">Benefits for Farmers</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms and Conditions</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Social</h3>
              <div className="flex space-x-4">
                <Link to="#" className="text-gray-400 hover:text-white">
                  <Facebook size={20} />
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white">
                  <Linkedin size={20} />
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white">
                  <Youtube size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm">
          <p>Copyright © {new Date().getFullYear()} PestVision. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
