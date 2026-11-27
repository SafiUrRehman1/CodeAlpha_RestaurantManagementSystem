
import { Link } from "react-router-dom";
import {
  Utensils,
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";

export default function CustomerFooter() {
  return (
    <footer className="bg-[#25221F] text-[#F5F0E7] mt-16">

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-14 pb-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* BRAND */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#B95F3B] flex items-center justify-center">
                <Utensils size={25} className="text-white" />
              </div>

              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Restaurant
                </h2>
                <p className="text-[10px] tracking-[3px] uppercase text-[#D58A6D] font-semibold">
                  Management System
                </p>
              </div>
            </div>

            <p className="text-[#C4B9AC] text-sm leading-7 max-w-md">
              Enjoy delicious food, convenient online ordering, and easy table
              reservations. Your dining experience matters to us.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[2px] mb-6 text-white">
              Quick Links
            </h3>

            <div className="flex flex-col gap-4">
              {[
                { name: "Home", path: "/customer/home" },
                { name: "Our Menu", path: "/customer/menu" },
                { name: "My Orders", path: "/customer/my-orders" },
                { name: "Reservations", path: "/customer/my-reservations" },
                { name: "My Profile", path: "/customer/profile" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group flex items-center gap-2 text-sm text-[#C4B9AC] hover:text-[#D58A6D] transition-colors duration-300"
                >
                  {item.name}
                  <ArrowUpRight
                    size={14}
                    className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[2px] mb-6 text-white">
              Contact
            </h3>

            <div className="flex flex-col gap-5">

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#D58A6D] mt-1 shrink-0" />
                <p className="text-sm text-[#C4B9AC] leading-6">
                  Visit us for a memorable dining experience.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#D58A6D] shrink-0" />
                <p className="text-sm text-[#C4B9AC]">
                  Contact us for assistance.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#D58A6D] shrink-0" />
                <p className="text-sm text-[#C4B9AC]">
                  We're here to help.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">

          <p className="text-xs text-[#A99D91] text-center">
            © {new Date().getFullYear()} Restaurant Management System. All rights reserved.
          </p>

          <p className="text-xs text-[#A99D91]">
            Made with care for a better dining experience.
          </p>

        </div>
      </div>
    </footer>
  );
}
