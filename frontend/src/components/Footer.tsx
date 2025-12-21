import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t pt-14 pb-10 text-gray-600">
      <div className="max-w-screen-2xl mx-auto px-8">

        {/* TOP SECTION: 4 COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Resources */}
          <div>
            <h3 className="text-black font-semibold mb-5">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><a className="hover:text-black" href="#">Find A Store</a></li>
              <li><a className="hover:text-black" href="#">Become A Member</a></li>
              <li><a className="hover:text-black" href="#">Running Shoe Finder</a></li>
              <li><a className="hover:text-black" href="#">Nike Coaching</a></li>
              <li><a className="hover:text-black" href="#">Send Us Feedback</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-black font-semibold mb-5">Help</h3>
            <ul className="space-y-3 text-sm">
              <li><a className="hover:text-black" href="#">Get Help</a></li>
              <li><a className="hover:text-black" href="#">Order Status</a></li>
              <li><a className="hover:text-black" href="#">Delivery</a></li>
              <li><a className="hover:text-black" href="#">Returns</a></li>
              <li><a className="hover:text-black" href="#">Payment Options</a></li>
              <li><a className="hover:text-black" href="#">Contact Us</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-black font-semibold mb-5">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><a className="hover:text-black" href="#">About Us</a></li>
              <li><a className="hover:text-black" href="#">News</a></li>
              <li><a className="hover:text-black" href="#">Careers</a></li>
              <li><a className="hover:text-black" href="#">Investors</a></li>
              <li><a className="hover:text-black" href="#">Sustainability</a></li>
              <li><a className="hover:text-black" href="#">Impact</a></li>
              <li><a className="hover:text-black" href="#">Report a Concern</a></li>
            </ul>
          </div>

          {/* Google Map - Đại Học Công Nghệ Sài Gòn (STU) */}
          <div>
            <h3 className="text-black font-semibold mb-5">
              My Address
            </h3>

            <div className="rounded-lg overflow-hidden shadow-md h-48">
              <iframe
                title="STU Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.1392518693655!2d106.67916037586903!3d10.800925889339878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f226b4da889%3A0xf6b769b0818c7990!2zVHLhuqduZyBDw7RuZyBuZ2hp4buHcCBUaMO0bmcgVGluIGPGsOG7nW5nIEtpbmggxJDhu5lpIChTVFUp!5e0!3m2!1svi!2s!4v1732618739123"
              ></iframe>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t pt-8 text-sm text-gray-500">

          {/* Copyright */}
          <div className="mb-4 md:mb-0 text-center md:text-left">
            © {new Date().getFullYear()} Nguyễn Trung Phong. All rights reserved.
          </div>

          {/* Bottom Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/terms-of-sale" className="hover:text-black">Terms of Sale</Link>
            <Link to="/terms-of-use" className="hover:text-black">Terms of Use</Link>
            <Link to="/privacy-policy" className="hover:text-black">Privacy Policy</Link>
            <Link to="/privacy-settings" className="hover:text-black">Privacy Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
