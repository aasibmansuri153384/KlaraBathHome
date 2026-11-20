import { useEffect, useState } from 'react';
import { Check, Copy, Download, FileCode2, FolderTree } from 'lucide-react';
import { JavaProjectFile } from '../types';

export function JavaSourceView() {
  const [files, setFiles] = useState<JavaProjectFile[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/java-project/files')
      .then((res) => res.json())
      .then((data: JavaProjectFile[]) => {
        setFiles(data);
        const guide = data.find((f) => f.path.endsWith('ECLIPSE_SETUP_GUIDE.md'));
        setSelectedPath(guide ? guide.path : data[0]?.path || '');
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Guide', 'SQL', 'Java Model', 'Java Servlet', 'JSP View', 'Config & CSS'];
  const visibleFiles = files.filter(
    (f) => categoryFilter === 'All' || f.category === categoryFilter
  );
  const activeFile = files.find((f) => f.path === selectedPath) || visibleFiles[0] || null;

  const handleCopy = async () => {
    if (!activeFile) return;
    await navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="pb-6 border-b border-[#E5E2DC] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-[#1F1E1C]">
              Java Servlet, JSP &amp; MySQL Source Code
            </h1>
            <p className="text-sm text-[#66635E] mt-1">
              Complete Eclipse Dynamic Web Project source files ({files.length} code files + product images) ready for Apache Tomcat and MySQL.
            </p>
          </div>

          <a
            href="/api/java-project/download"
            download="KlaraBathHome-Java-Servlet-JSP.zip"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#1F1E1C] rounded-md hover:bg-[#353330] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <Download className="w-4 h-4" />
            <span>Download Project (.zip)</span>
          </a>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                categoryFilter === cat
                  ? 'bg-[#1F1E1C] text-white border-[#1F1E1C]'
                  : 'bg-white text-[#66635E] border-[#E5E2DC] hover:text-[#1F1E1C]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-[#E5E2DC] rounded-lg p-10 text-center text-sm text-[#66635E]">
          Loading Java Servlet &amp; JSP source tree...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* File Explorer Sidebar */}
          <aside className="lg:col-span-4 bg-white border border-[#E5E2DC] rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-[#FAF9F6] border-b border-[#E5E2DC] flex items-center gap-2 text-xs font-semibold text-[#1F1E1C]">
              <FolderTree className="w-4 h-4 text-[#66635E]" />
              <span>java-project/</span>
            </div>

            <div className="max-h-[540px] overflow-y-auto divide-y divide-[#F3F2EF]">
              {visibleFiles.map((file) => {
                const isSelected = activeFile?.path === file.path;
                return (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => setSelectedPath(file.path)}
                    className={`w-full text-left px-4 py-2.5 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#F5F1EB]' : 'hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#1F1E1C] truncate">
                        {file.name}
                      </span>
                      <span className="text-[11px] text-[#66635E] shrink-0">{file.category}</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#66635E] truncate mt-0.5">
                      {file.path}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Code Viewer */}
          <div className="lg:col-span-8 bg-white border border-[#E5E2DC] rounded-lg overflow-hidden">
            {activeFile ? (
              <>
                <div className="px-5 py-3 bg-[#FAF9F6] border-b border-[#E5E2DC] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCode2 className="w-4 h-4 text-[#66635E] shrink-0" />
                    <span className="text-xs font-mono text-[#1F1E1C] truncate">
                      java-project/{activeFile.path}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1F1E1C] bg-white border border-[#DDD2C1] rounded hover:bg-[#F5F1EB] cursor-pointer shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-5 overflow-x-auto text-xs font-mono leading-relaxed text-[#1F1E1C] bg-[#FAF9F6] max-h-[540px]">
                  <code>{activeFile.content}</code>
                </pre>
              </>
            ) : (
              <div className="p-10 text-center text-sm text-[#66635E]">
                Select a file to inspect its source code.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
