import { LandingHero } from '@/subdomains/app/pages/landing/components/landing-hero';
import { LandingAbout } from '@/subdomains/app/pages/landing/components/landing-about';
import { LandingProducts } from '@/subdomains/app/pages/landing/components/landing-products';
import { LandingInstagramSection } from '@/subdomains/app/pages/landing/components/landing-instagram-section';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '@/subdomains/app/components/public-layout/PublicLayout';
import LandingFooter from './components/landing-footer';
import { LandingFeatures } from './components/landing-features';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleStartCustomization = (quantity: number) => {
        navigate(`/customizar?kit=${quantity}`);
        window.scrollTo(0, 0);
    };

    return (
        <PublicLayout>
            <LandingHero />
            <LandingAbout />
            <LandingProducts onSelectKit={handleStartCustomization} />
            <LandingFeatures />
            <LandingInstagramSection />
            <LandingFooter />
        </PublicLayout>
    );
}

export default LandingPage;