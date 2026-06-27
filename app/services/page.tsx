import type { Metadata } from 'next'
import Link from 'next/link'
import SiteChrome from '@/components/SiteChrome'
import ServiceIcon from '@/components/ServiceIcon'
import { getServices } from '@/lib/services'
import styles from '@/components/subpages.module.css'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Software engineering services by Gouder Haithem — websites and web apps, CRM and ERP platforms, APIs and integrations, performance and SEO audits, and ongoing support.',
  alternates: { canonical: 'https://gouderhaithem.com/services' },
}

const PROCESS = [
  {
    title: 'Scope',
    body: 'A short discovery call, then a fixed scope with clear deliverables and a timeline — no open-ended surprises.',
  },
  {
    title: 'Build',
    body: 'Weekly demos and source on day one. You see progress every week and own the code from the start.',
  },
  {
    title: 'Ship',
    body: 'Deployment, monitoring, and handover docs. The work goes live on infrastructure you control.',
  },
  {
    title: 'Support',
    body: 'Optional ongoing care — updates, fixes, and new features with defined response times.',
  },
]

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <SiteChrome>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className="eyebrow">Services</span>
          <h1 className={`display ${styles.title}`}>
            What I <span className="italic">build</span>.
          </h1>
          <p className={styles.intro}>
            From a single marketing site to a full ERP rollout. Engagements run 4&ndash;12 weeks
            with fixed scope, weekly demos, and source on day one.
          </p>
        </header>

        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <div className="service" key={service.slug}>
              <div className="top">
                <span className="num">{service.num}</span>
                <div className="icon" aria-hidden="true">
                  <ServiceIcon name={service.icon} />
                </div>
              </div>
              <h3>
                {service.title} <span className="it">{service.titleAccent}</span>
              </h3>
              <p>{service.summary}</p>
              <ul>
                {service.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <span className="eyebrow">How it works</span>
        <div className={styles.process}>
          {PROCESS.map((step, i) => (
            <div className={styles.processStep} key={step.title}>
              <span className={styles.processNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.processTitle}>{step.title}</span>
              <span className={styles.processBody}>{step.body}</span>
            </div>
          ))}
        </div>

        <div className="hero-ctas" style={{ display: 'flex', gap: 14, paddingBottom: 90 }}>
          <Link href="/#contact" className="btn-pill primary">
            <span>Start a project</span>
            <span className="arr">&rarr;</span>
          </Link>
          <Link href="/projects" className="btn-pill ghost">
            <span>See recent work</span>
          </Link>
        </div>
      </div>
    </SiteChrome>
  )
}
