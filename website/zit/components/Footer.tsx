"use client";

import { Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <div className="font-bold text-xl mb-2 text-white">zit</div>
          <p className="text-sm text-gray-500">
            Built with Rust and ❤️ by{" "}
            <a
              href="https://github.com/JUSTMEETPATEL/zit"
              target="_blank"
              className="text-white hover:underline"
            >
              ZenMasters
            </a>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Released under the MIT License.
          </p>
        </div>

        <div className="flex gap-6">
          <Link
            href="https://github.com/JUSTMEETPATEL/zit"
            target="_blank"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github size={24} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
