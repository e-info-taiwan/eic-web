import type { GetServerSideProps } from 'next'

// This page redirects to homepage with newsletter modal open
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/?subscribe=newsletter',
      permanent: false,
    },
  }
}

// This component will never render due to redirect
export default function NewsletterSubscribe() {
  return null
}
