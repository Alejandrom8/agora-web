import * as React from 'react';
import Head from 'next/head';
import HorizontalNavbar from '@/components/App/HorizontalNavbar';
import LandingHero from '@/components/Landing/LandingHero';
import LandingFeatures from '@/components/Landing/LandingFeatures';
import LandingForAdminsSection from '@/components/Landing/LandingForAdminsSection';
import LandingHowItWorks from '@/components/Landing/LandingHowItWorks';
import LandingEvents from '@/components/Landing/LandingEvents';
import LandingPricing from '@/components/Landing/LandingPricing';
import LandingFooter from '@/components/Landing/LandingFooter';

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

        {/* Open Graph básico */}
        <meta property="og:title" content="Agora" />
        <meta property="og:description" content="Agora - conecta founders con inversionistas" />
        <meta property="og:image" content="https://agora-web-three.vercel.app/favicon.ico" />
        <meta property="og:url" content="https://agora-web-three.vercel.app/" />
        <meta property="og:type" content="website" />
      </Head>

      {/* NAVBAR */}
      <HorizontalNavbar />
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
      {/* FOOTER */}
      <LandingFooter />
    </>
  );
};

export default AgoraLanding;
