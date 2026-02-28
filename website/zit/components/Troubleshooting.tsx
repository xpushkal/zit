"use client";

import { AlertTriangle, AlertCircle } from "lucide-react";

export default function Troubleshooting() {
  const issues = [
    {
      title: "Windows: linker link.exe not found",
      desc: (
        <span>
          Install Visual Studio Build Tools with the{" "}
          <span className="text-white font-medium">
            &quot;Desktop development with C++&quot;
          </span>{" "}
          workload.
        </span>
      ),
      icon: <AlertTriangle className="text-orange-500" />,
    },
    {
      title: "AI not working",
      desc: (
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>
            Check connectivity: use{" "}
            <strong className="text-white">Health Check</strong> in the AI
            Mentor panel{" "}
            <code className="bg-white/10 px-1 py-0.5 rounded text-xs">a</code> →
            select Health Check
          </li>
          <li>
            Verify config:{" "}
            <code className="bg-white/10 px-1 py-0.5 rounded text-xs select-all">
              cat ~/.config/zit/config.toml
            </code>{" "}
            — ensure{" "}
            <code className="bg-white/10 px-1 py-0.5 rounded text-xs text-yellow-500">
              [ai]
            </code>{" "}
            section is present
          </li>
          <li>
            Check env vars:{" "}
            <code className="bg-white/10 px-1 py-0.5 rounded text-xs select-all">
              echo $ZIT_AI_ENDPOINT $ZIT_AI_API_KEY
            </code>
          </li>
          <li>
            Check Lambda logs:{" "}
            <code className="bg-white/10 px-1 py-0.5 rounded text-xs select-all block mt-1 w-fit">
              aws logs tail /aws/lambda/zit-ai-mentor-dev --region ap-south-1
            </code>
          </li>
        </ul>
      ),
      icon: <AlertCircle className="text-red-500" />,
    },
  ];

  return (
    <section id="troubleshooting" className="py-20 bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-200">
          Common Issues & Troubleshooting
        </h2>

        <div className="space-y-4">
          {issues.map((issue, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="mt-1 shrink-0">{issue.icon}</div>
              <div>
                <h4 className="font-semibold text-white mb-1">{issue.title}</h4>
                <div className="text-gray-400 text-sm">{issue.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
