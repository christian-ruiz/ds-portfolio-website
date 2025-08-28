import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Github, ExternalLink, FileText, Filter, Moon, Sun, Calendar, Tag, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { ScrollArea } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import { PROFILE } from "./data/profile";
import { PROJECTS } from "./data/projects"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Helpers
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });

function rawMdUrl(repo, path = "paper.md", branch = "main") {
  // repo: "owner/repo", path: "docs/summary.md"
  return `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;
}

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => { const saved = localStorage.getItem("ds-portfolio-dark"); if (saved) setDark(saved === "1"); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); localStorage.setItem("ds-portfolio-dark", dark ? "1" : "0"); }, [dark]);
  return { dark, setDark };
}

export default function Portfolio() {
  const { dark, setDark } = useDarkMode();
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [openProject, setOpenProject] = useState(null);
  const [paperMd, setPaperMd] = useState("");
  const [paperErr, setPaperErr] = useState("");

  const allTags = useMemo(() => {
    const t = new Set();
    PROJECTS.forEach((p) => p.tags.forEach((x) => t.add(x)));
    return Array.from(t).sort((a, b) => a.localeCompare(b));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS
      .filter((p) => {
        const inQuery = !q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
        const inTags = activeTags.length === 0 || activeTags.every((t) => p.tags.includes(t));
        return inQuery && inTags;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [query, activeTags]);
  
  useEffect(() => {
    if (!openProject) {
      // dialog closed → clear content
      setPaperMd("");
      setPaperErr("");
      return;
    }
  
    let cancelled = false;               // guard against stale updates
    const currentId = openProject.id;    // track which project we fetched for
  
    const tryFetch = async () => {
      setPaperErr("");
      setPaperMd("Loading…");
  
      const branches = ["main", "master"];
      for (const br of branches) {
        const url = rawMdUrl(
          openProject.repo,                       // "owner/repo"
          openProject.summaryMd || "README.md",   // path in repo
          br
        );
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (res.ok) {
            const txt = await res.text();
            if (!cancelled && openProject?.id === currentId) {
              setPaperMd(txt);
            }
            return;
          }
        } catch (_) {
          // try next branch
        }
      }
  
      if (!cancelled && openProject?.id === currentId) {
        setPaperMd("");
        setPaperErr("Could not load the project paper from GitHub.");
      }
    };
  
    tryFetch();
  
    return () => { cancelled = true; };  // cleanup if project changes or dialog closes
  }, [openProject]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-slate-900 dark:bg-slate-200 grid place-items-center text-white dark:text-slate-900 font-bold">CR</div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{PROFILE.name}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">{PROFILE.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" aria-label="Toggle theme" onClick={() => setDark(!dark)} className="px-2">
              {dark ? <Sun className="h-5 w-5"/> : <Moon className="h-5 w-5"/>}
            </Button>
            {PROFILE.links.github && (
              <Button asChild variant="outline">
                <a href={PROFILE.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2"><Github className="h-4 w-4"/> GitHub</a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Projects, methods, and write-ups — all in one place.</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl">{PROFILE.blurb}</p>
            <div className="flex gap-2">
              <Badge className="text-xs">Open-source</Badge>
              <Badge className="text-xs">Reproducible</Badge>
              <Badge className="text-xs">Interactive</Badge>
            </div>
          </div>
          <div className="md:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Filter className="h-4 w-4"/> Find a project</CardTitle>
                <CardDescription>Search by keyword or filter by tags.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"/>
                  <Input placeholder="Search title, summary, or tag…" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)}/>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-auto pr-1">
                  {allTags.map((t) => {
                    const active = activeTags.includes(t);
                    return (
                      <button key={t} onClick={() => setActiveTags((prev) => active ? prev.filter((x) => x !== t) : [...prev, t])} className={`text-xs px-2 py-1 rounded-full border ${active ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100" : "border-slate-300 dark:border-slate-700"}`}>
                        #{t}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
        <Tabs defaultValue="grid">
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filtered.map((p) => (
                  <motion.div key={p.id} layout initial={{opacity:0, y: 10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                    <Card className="h-full flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-start justify-between gap-3">
                          <span>{p.title}</span>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2"><Calendar className="h-4 w-4"/>{formatDate(p.date)}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-4">{p.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.tags.map((t) => (
                            <Badge key={t} className="text-xs"><Tag className="h-3 w-3 mr-1"/> {t}</Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center gap-2">
                        <Button onClick={() => setOpenProject(p)} className="gap-2"><FileText className="h-4 w-4"/> View Paper</Button>
                        {p.links?.code && (
                          <Button asChild variant="outline" className="gap-2"><a href={p.links.code} target="_blank" rel="noreferrer"><Github className="h-4 w-4"/> Code</a></Button>
                        )}
                        {p.links?.demo && p.links.demo !== "#" && (
                          <Button asChild variant="ghost" className="gap-2"><a href={p.links.demo} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4"/> Demo</a></Button>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-8">
            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 pl-6">
              {filtered.map((p) => (
                <div key={p.id} className="mb-10">
                  <div className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full bg-slate-900 dark:bg-slate-100"/>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-2"><Calendar className="h-4 w-4"/>{formatDate(p.date)}</p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{p.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-2">{p.tags.map((t) => <Badge key={t} className="text-xs">#{t}</Badge>)}</div>
                  <div className="mt-3 flex gap-2">
                    <Button onClick={() => setOpenProject(p)} className="gap-1"><FileText className="h-4 w-4"/> Paper</Button>
                    {p.links?.code && (
                      <Button asChild variant="outline" className="gap-1"><a href={p.links.code} target="_blank" rel="noreferrer"><Github className="h-4 w-4"/> Code</a></Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Paper dialog */}
      {/* <Dialog open={!!openProject} onOpenChange={(isOpen) => { if (!isOpen) setOpenProject(null); }}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] p-0 overflow-hidden">
          {openProject && (
            <div className="grid md:grid-cols-4 h-full">
              <aside className="hidden md:block border-r border-slate-200 dark:border-slate-800 p-4 bg-slate-50/60 dark:bg-slate-900/40">
                <DialogHeader><DialogTitle className="text-base">{openProject.title}</DialogTitle></DialogHeader>
                <nav className="mt-4 space-y-2 text-sm">
                  {[{id:"abstract",label:"Abstract"},{id:"data",label:"Data"},{id:"methods",label:"Methods"},{id:"approach",label:"Approach"},{id:"findings",label:"Findings"},{id:"conclusions",label:"Conclusions"}]
                    .map(s => <a key={s.id} href={`#${s.id}`} className="block hover:underline">{s.label}</a>)}
                </nav>
                <Separator className="my-4"/>
                <div className="space-y-2">
                  {openProject.links?.code && <Button asChild className="w-full justify-start gap-2"><a href={openProject.links.code} target="_blank" rel="noreferrer"><Github className="h-4 w-4"/> View Code</a></Button>}
                  {openProject.links?.demo && openProject.links.demo !== "#" && <Button asChild variant="outline" className="w-full justify-start gap-2"><a href={openProject.links.demo} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4"/> Live Demo</a></Button>}
                </div>
              </aside>

              <ScrollArea className="md:col-span-3 p-6">
                <article className="prose dark:prose-invert max-w-none">
                  <h1 className="mb-2 text-2xl font-semibold flex items-center gap-2">{openProject.title} <ArrowUpRight className="h-5 w-5"/></h1>
                  <p className="text-sm text-slate-500 flex items-center gap-2"><Calendar className="h-4 w-4"/>{formatDate(openProject.date)}</p>
                  <section id="abstract" className="mt-6"><h2>Abstract</h2><p>{openProject.paper.abstract}</p></section>
                  <section id="data" className="mt-6"><h2>Data</h2><p>{openProject.paper.data}</p></section>
                  <section id="methods" className="mt-6"><h2>Methods</h2><p>{openProject.paper.methods}</p></section>
                  <section id="approach" className="mt-6"><h2>Approach</h2><p>{openProject.paper.approach}</p></section>
                  <section id="findings" className="mt-6"><h2>Findings</h2><p>{openProject.paper.findings}</p></section>
                  <section id="conclusions" className="mt-6"><h2>Conclusions & Next Steps</h2><p>{openProject.paper.conclusions}</p></section>
                  <div className="my-8 flex flex-wrap gap-2">{openProject.tags.map((t) => <Badge key={t}>#{t}</Badge>)}</div>
                </article>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
      {/* Paper dialog */}
      <Dialog open={!!openProject} onOpenChange={(isOpen) => { if (!isOpen) setOpenProject(null); }}>
        <DialogContent className="w-[95vw] max-w-7xl h-[80vh] p-0 overflow-hidden">
          {openProject && (
            <div className="grid md:grid-cols-4 h-full">
              {/* Sidebar */}
              <aside className="hidden md:block border-r border-slate-200 dark:border-slate-800 p-4 bg-slate-50/60 dark:bg-slate-900/40 h-full overflow-auto">
                <DialogHeader>
                  <DialogTitle className="text-base">{openProject.title}</DialogTitle>
                </DialogHeader>
                <nav className="mt-4 space-y-2 text-sm">
                  {[
                    {id:"abstract",label:"Abstract"},
                    {id:"data",label:"Data"},
                    {id:"methods",label:"Methods"},
                    {id:"approach",label:"Approach"},
                    {id:"findings",label:"Findings"},
                    {id:"conclusions",label:"Conclusions"},
                  ].map(s => (
                    <a key={s.id} href={`#${s.id}`} className="block hover:underline">{s.label}</a>
                  ))}
                </nav>
                <Separator className="my-4"/>
                <div className="space-y-2">
                  {openProject.links?.code && (
                    <Button asChild className="w-full justify-start gap-2">
                      <a href={openProject.links.code} target="_blank" rel="noreferrer">
                        <Github className="h-4 w-4"/> View Code
                      </a>
                    </Button>
                  )}
                  {openProject.links?.demo && openProject.links.demo !== "#" && (
                    <Button asChild variant="outline" className="w-full justify-start gap-2">
                      <a href={openProject.links.demo} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4"/> Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </aside>

              {/* Main content */}
              {<ScrollArea className="md:col-span-3 h-full p-6">
                <article className="prose dark:prose-invert max-w-none">
                  <h1 className="mb-2 text-2xl font-semibold flex items-center gap-2">
                    {openProject.title} <ArrowUpRight className="h-5 w-5"/>
                  </h1>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4"/>{formatDate(openProject.date)}
                  </p>

                  {paperErr ? (
                    <p className="mt-6 text-red-600">{paperErr}</p>
                  ) : (
                    <div className="mt-6">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {paperMd}
                      </ReactMarkdown>
                    </div>
                  )}

                  {/* tags */}
                  <div className="my-8 flex flex-wrap gap-2">
                    {openProject.tags.map((t) => <Badge key={t}>#{t}</Badge>)}
                  </div>
                </article>
              </ScrollArea>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">© {new Date().getFullYear()} {PROFILE.name}. Built with React & Tailwind.</p>
          <div className="flex items-center gap-3">
            {PROFILE.links.github && <a className="text-sm inline-flex items-center gap-1 hover:underline" href={PROFILE.links.github} target="_blank" rel="noreferrer"><Github className="h-4 w-4"/> GitHub</a>}
            {PROFILE.links.linkedin && <a className="text-sm inline-flex items-center gap-1 hover:underline" href={PROFILE.links.linkedin} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4"/> LinkedIn</a>}
          </div>
        </div>
      </footer>
    </div>
  );
}