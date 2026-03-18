import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from '@tanstack/react-router'
import {
  ActivityIcon,
  ArrowRightIcon,
  FileTextIcon,
  HeartPulseIcon,
  ShareIcon,
  ShieldCheckIcon,
} from 'lucide-react'
import { buttonVariants } from '#/components/ui/button'
import { cn } from '#/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    icon: FileTextIcon,
    title: 'Store any report',
    desc: 'Blood tests, X-rays, prescriptions, scans — upload whatever you have, in any format.',
  },
  {
    icon: ActivityIcon,
    title: 'Timeline view',
    desc: 'See your entire health history at a glance, sorted chronologically.',
  },
  {
    icon: ShareIcon,
    title: 'Share with doctors',
    desc: 'Generate a secure link to share specific reports. Works on any device, no sign-up required.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Private by default',
    desc: 'Your data is yours. Nothing is shared unless you explicitly choose to.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Create your account',
    desc: 'Sign up with your email in seconds. No credit card, no subscriptions.',
  },
  {
    n: '02',
    title: 'Upload your reports',
    desc: 'Photograph or upload PDFs of any medical document — from any visit, any hospital.',
  },
  {
    n: '03',
    title: 'Access anywhere',
    desc: 'View, organise, and share your records from your phone or computer, anytime.',
  },
]

const MOCK_REPORTS = [
  { label: 'Blood Test', date: 'Mar 10, 2026', tag: 'blood_test' },
  { label: 'Chest X-Ray', date: 'Jan 22, 2026', tag: 'xray' },
  { label: 'Prescription', date: 'Dec 5, 2025', tag: 'prescription' },
]

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Hero entrance
      const heroTimeline = gsap.timeline()
      heroTimeline
        .fromTo(
          '.hero-badge',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        )
        .fromTo(
          '.hero-title',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.2',
        )
        .fromTo(
          '.hero-sub',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3',
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          '-=0.2',
        )
        .fromTo(
          '.hero-visual',
          { opacity: 0, y: 32, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.4',
        )

      // Ambient blob float
      gsap.to('.blob-1', {
        y: -24,
        x: 12,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.blob-2', {
        y: 18,
        x: -16,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.2,
      })
      gsap.to('.blob-3', {
        y: -14,
        x: -8,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.6,
      })

      // Feature cards stagger on scroll
      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.features-grid', start: 'top 80%' },
        },
      )

      // Steps slide in
      gsap.fromTo(
        '.step-item',
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.steps-container', start: 'top 80%' },
        },
      )

      // Bottom CTA
      gsap.fromTo(
        '.cta-inner',
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.cta-section', start: 'top 80%' },
        },
      )
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <HeartPulseIcon className="size-5 text-primary" />
            <span className="font-serif text-xl font-medium">MediTrack</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className={buttonVariants({ variant: 'ghost' })}>
              Sign in
            </Link>
            <Link to="/signup" className={buttonVariants()}>
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground pb-28 pt-36 text-background">
        <div className="blob-1 pointer-events-none absolute -right-24 -top-24 size-120 rounded-full bg-primary/25 blur-3xl" />
        <div className="blob-2 pointer-events-none absolute -bottom-16 -left-24 size-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="blob-3 pointer-events-none absolute left-1/2 top-1/3 size-64 -translate-x-1/2 rounded-full bg-chart-2/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            Your health records, finally organised
          </div>

          <h1 className="hero-title font-serif text-5xl font-medium leading-[1.1] tracking-tight md:text-7xl">
            All your medical
            <br />
            records in{' '}
            <span className="relative inline-block text-primary">
              one place
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 9C50 4 100 2 150 3C200 4 250 6 298 9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
            </span>
          </h1>

          <p className="hero-sub mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-background/65 md:text-xl">
            Stop digging through folders and filing cabinets. MediTrack lets you
            store, organise, and share your medical reports digitally — from any
            device, anytime.
          </p>

          <div className="hero-cta mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/signup"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-12 px-8 text-base',
              )}
            >
              Start for free <ArrowRightIcon className="ml-2 size-4" />
            </Link>
            <Link
              to="/login"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'h-12 border-background/20 bg-transparent px-8 text-base text-background hover:bg-background/10 hover:text-background',
              )}
            >
              Sign in to your account
            </Link>
          </div>
        </div>

        {/* Mock UI preview */}
        <div className="hero-visual mx-auto mt-20 max-w-3xl px-6">
          <div className="rounded-2xl border border-background/10 bg-background/5 p-1.5 shadow-2xl backdrop-blur-sm">
            <div className="rounded-xl border border-background/10 bg-background/5 p-5">
              <div className="mb-5 flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-destructive/60" />
                <div className="size-2.5 rounded-full bg-chart-1/60" />
                <div className="size-2.5 rounded-full bg-primary/60" />
                <span className="ml-3 text-xs text-background/30">
                  meditrack.app/reports
                </span>
              </div>
              <div className="mb-3 text-xs font-medium uppercase tracking-widest text-background/30">
                Recent reports
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {MOCK_REPORTS.map((r) => (
                  <div
                    key={r.label}
                    className="rounded-xl border border-background/10 bg-background/5 p-4 transition-colors hover:bg-background/10"
                  >
                    <div className="mb-3 inline-flex rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {r.tag}
                    </div>
                    <p className="font-medium text-background">{r.label}</p>
                    <p className="mt-1 text-xs text-background/40">{r.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl font-medium">
              Everything you need, nothing you don't
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Designed around how patients actually manage their health — not
              how hospitals do.
            </p>
          </div>

          <div className="features-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={cn(
                  'feature-card rounded-2xl border border-border bg-card p-6',
                  'transition-shadow hover:shadow-md',
                )}
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="size-5 text-primary" />
                </div>
                <h3 className="font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/40 py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl font-medium">
              Up and running in minutes
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              No training required. No confusing dashboards.
            </p>
          </div>

          <div className="steps-container grid gap-12 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="step-item flex flex-col gap-3">
                <span className="font-serif text-6xl font-medium text-primary/25">
                  {s.n}
                </span>
                <h3 className="text-lg font-medium">{s.title}</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="cta-section py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="cta-inner overflow-hidden rounded-3xl bg-foreground px-8 py-16 text-center text-background shadow-xl md:px-16">
            <HeartPulseIcon className="mx-auto mb-6 size-8 text-primary" />
            <h2 className="font-serif text-4xl font-medium">
              Take control of your health records today
            </h2>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-background/65">
              Join thousands of patients who've ditched paper folders and moved
              to MediTrack.
            </p>
            <Link
              to="/signup"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'mt-8 h-12 px-10 text-base',
              )}
            >
              Get started for free <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <HeartPulseIcon className="size-4 text-primary" />
            <span className="text-sm font-medium">MediTrack</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 MediTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
