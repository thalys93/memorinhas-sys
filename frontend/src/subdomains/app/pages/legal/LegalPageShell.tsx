import type { ReactNode } from 'react';

interface LegalPageShellProps {
  title: string;
  updatedAt: string;
  children: ReactNode;
}

export function LegalPageShell({ title, updatedAt, children }: LegalPageShellProps) {
  return (
    <section className="bg-background pt-28 pb-20 md:pt-36 md:pb-24">
      <div className="viewport-content max-w-3xl">
        <p className="text-label text-primary uppercase tracking-widest mb-3">Informações legais</p>
        <h1 className="text-section-title text-foreground mb-3">{title}</h1>
        <p className="text-label text-muted-foreground mb-12">Última atualização: {updatedAt}</p>
        <div className="space-y-8 text-body text-muted-foreground [&_h2]:text-card-title [&_h2]:text-foreground [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline">
          {children}
        </div>
      </div>
    </section>
  );
}
