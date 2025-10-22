import * as React from 'react';
import Head from 'next/head';
import LandingHero from '@/components/Landing/LandingHero';
import LandingFeatures from '@/components/Landing/LandingFeatures';
import LandingForAdminsSection from '@/components/Landing/LandingForAdminsSection';
import LandingHowItWorks from '@/components/Landing/LandingHowItWorks';
import LandingEvents from '@/components/Landing/LandingEvents';
import LandingPricing from '@/components/Landing/LandingPricing';
import LandingLayout from '@/components/Landing/LandingLayout';

const AgoraLanding: React.FC = () => {
  return (
    <>
      <Head>
        <title>Agora | Conecta Founders e Inversionistas</title>
        <meta
          name="description"
          content="Agora conecta founders e inversionistas por medio de eventos tecnológicos: crea eventos, define agendas y roles, gestiona asistentes e invita a participar."
        />
        <link rel="canonical" href="https://agora-web-three.vercel.app/" />
        <meta
          name="keywords"
          content="Agora, eventos, tecnología, founders, inversionistas, networking, startups, agenda, asistentes, gestión"
        />
        <meta name="author" content="Agora Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        {/* Open Graph mejorado */}
        <meta property="og:title" content="Agora | Conecta Founders e Inversionistas" />
        <meta
          property="og:description"
          content="Agora conecta founders e inversionistas por medio de eventos tecnológicos: crea eventos, define agendas y roles, gestiona asistentes e invita a participar."
        />
        <meta property="og:image" content="https://agora-web-three.vercel.app/og-image.png" />
        <meta property="og:url" content="https://agora-web-three.vercel.app/" />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Agora | Conecta Founders e Inversionistas" />
        <meta
          name="twitter:description"
          content="Agora conecta founders e inversionistas por medio de eventos tecnológicos."
        />
        <meta name="twitter:image" content="https://agora-web-three.vercel.app/og-image.png" />
        <meta name="twitter:site" content="@agora" />
        {/* Favicon y manifest */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <LandingLayout>
        {/* HERO */}
        <LandingHero />
        {/* FUNCIONALIDADES (Usuarios + Admins) */}
        <LandingFeatures />
        {/* PARA ADMINS (Highlights) */}
        <LandingForAdminsSection />
        {/* CÓMO FUNCIONA */}
        <LandingHowItWorks />
        {/* CTA: Ver eventos */}
        <LandingEvents />
        {/* PRECIOS (placeholder simple) */}
        <LandingPricing />
      </LandingLayout>
    </>
  );
};

export default AgoraLanding;
