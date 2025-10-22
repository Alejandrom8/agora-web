import * as React from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Divider, Toolbar } from '@mui/material';
import LandingLayout from '@/components/Landing/LandingLayout';

export default function LegalPage() {
  return (
    <>
      <Head>
        <title>Agora | Política de Privacidad y Términos</title>
        <meta
          name="description"
          content="Lee la política de privacidad y los términos y condiciones de Agora."
        />
      </Head>

      <LandingLayout>
        <Container maxWidth="md" sx={{ py: 6, pt: 10 }}>
          <Toolbar />
          <Typography variant="h3" fontWeight={800} gutterBottom textAlign="center">
            Política de Privacidad
          </Typography>
          <Typography variant="body1" paragraph>
            En Agora valoramos tu privacidad. Recopilamos y procesamos datos personales únicamente
            para ofrecer y mejorar nuestros servicios, gestionar eventos y facilitar la conexión
            entre usuarios. Nunca compartimos tu información con terceros sin tu consentimiento,
            salvo requerimiento legal. Puedes solicitar la eliminación de tus datos en cualquier
            momento.
          </Typography>
          <Typography variant="body1" paragraph>
            Los datos que recopilamos incluyen nombre, correo electrónico, información de eventos y
            preferencias. Utilizamos medidas de seguridad para proteger tu información y solo el
            personal autorizado puede acceder a ella.
          </Typography>
          <Typography variant="body1" paragraph>
            Si tienes dudas sobre nuestra política de privacidad, contáctanos en soporte@agora.com.
          </Typography>
          <Divider sx={{ my: 5 }} />
          <Typography variant="h3" fontWeight={800} gutterBottom textAlign="center">
            Términos y Condiciones
          </Typography>
          <Typography variant="body1" paragraph>
            Al usar Agora, aceptas los siguientes términos:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>Debes proporcionar información veraz y actualizada.</li>
            <li>No está permitido el uso de Agora para actividades ilícitas o fraudulentas.</li>
            <li>
              Agora puede modificar estos términos en cualquier momento. Te notificaremos sobre
              cambios importantes.
            </li>
            <li>El uso de Agora implica la aceptación de nuestra política de privacidad.</li>
            <li>
              Agora no se responsabiliza por el contenido generado por los usuarios ni por la
              interacción entre ellos.
            </li>
          </Box>
          <Typography variant="body1" paragraph>
            Si tienes preguntas sobre los términos y condiciones, escríbenos a soporte@agora.com.
          </Typography>
        </Container>
      </LandingLayout>
    </>
  );
}
