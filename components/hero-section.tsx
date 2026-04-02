import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteContent } from "@/lib/content";

export function HeroSection() {
  const { person, hero } = siteContent;

  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-12 md:py-24">
        <div className="md:col-span-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1">
            <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
            <a href="https://ceat.okstate.edu/iem" target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline">
              PhD Candidate in Industrial Engineering & Management
            </a>
          </div>
          
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            {person.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{person.role}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {hero.specialties.map((specialty) => (
              <Badge key={specialty} variant="outline">{specialty}</Badge>
            ))}
          </div>
          
          <p className="mt-6 max-w-2xl text-pretty text-sm leading-7 text-muted-foreground md:text-base">{hero.proofLine}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects">
              <Button size="lg">
                View Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/cv">
              <Button variant="outline" size="lg">
                Download CV
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:col-span-4">
          <Image
            src={person.image}
            alt={person.imageAlt}
            width={400}
            height={400}
            className="w-full h-auto object-cover rounded-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
}
