import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

export const metadata = {
  title: 'Subathon',
  description: '10 dias de aventura na neve.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>❄️</text></svg>',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth">
      <ThemeProvider>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </ThemeProvider>
    </html>
  );
}