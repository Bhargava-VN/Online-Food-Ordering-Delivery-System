import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-orange-500">Crave</span>Dash
                        </h2>
                        <p className="mb-4 text-slate-400 max-w-sm">
                            Delivering happiness to your door. The fastest, freshest food from your favorite local restaurants.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-orange-500 hover:text-white transition-colors"><FaFacebook /></a>
                            <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-orange-500 hover:text-white transition-colors"><FaTwitter /></a>
                            <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-orange-500 hover:text-white transition-colors"><FaInstagram /></a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="hover:text-orange-400 transition-colors">Home</a></li>
                            <li><a href="/restaurants" className="hover:text-orange-400 transition-colors">Restaurants</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Refund Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} CraveDash. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
