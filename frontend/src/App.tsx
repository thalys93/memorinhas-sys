import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from '@/routes/routes';
import { Toaster } from '@/lib/toast';
import { ThemeProvider } from '@/components/theme-provider';
import { StoreThemeProvider } from '@/components/store-theme-provider';
import { usePageMeta } from '@/hooks/use-page-meta';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function PageMeta() {
  usePageMeta();
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreThemeProvider>
        <BrowserRouter>
          <ThemeProvider>
            <PageMeta />
            <AppRoutes />
            <Toaster />
          </ThemeProvider>
        </BrowserRouter>
      </StoreThemeProvider>
    </QueryClientProvider>
  );
}
