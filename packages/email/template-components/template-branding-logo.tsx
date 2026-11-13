import { Img, Link } from '../components';
import { useBranding } from '../providers/branding';
import { getSafeBrandingUrl } from '../utils/branding-url';

export type TemplateBrandingLogoProps = {
  assetBaseUrl: string;
  className?: string;
};

/**
 * Renders the email logo.
 *
 * - When custom branding is enabled with a logo, the branding logo is shown.
 *   If a safe (http/https) Brand Website is configured, the logo links to it.
 * - Otherwise the Documenso logo is shown.
 */
export const TemplateBrandingLogo = ({ assetBaseUrl, className = 'mb-4 h-6' }: TemplateBrandingLogoProps) => {
  const branding = useBranding();

  const hasCustomBrandingLogo = branding.brandingEnabled && Boolean(branding.brandingLogo);

  if (!hasCustomBrandingLogo) {
    const documensoLogoUrl = new URL('/static/logo.png', assetBaseUrl).toString();

    return <Img src={documensoLogoUrl} alt="Documenso Logo" className={className} />;
  }

  // Custom logos share the same sizing across every tenant, so drop any height
  // class from the caller and let `BRANDING_LOGO_STYLE` control the dimensions.
  const brandingLogoClassName = className
    .split(' ')
    .filter((token) => !token.startsWith('h-'))
    .join(' ');

  const brandingLogo = (
    <Img
      src={branding.brandingLogo}
      alt="Branding Logo"
      className={brandingLogoClassName}
      style={BRANDING_LOGO_STYLE}
    />
  );

  const safeBrandingUrl = getSafeBrandingUrl(branding.brandingUrl);

  if (!safeBrandingUrl) {
    return brandingLogo;
  }

  return (
    <Link href={safeBrandingUrl} target="_blank">
      {brandingLogo}
    </Link>
  );
};

export default TemplateBrandingLogo;

const BRANDING_LOGO_STYLE = {
  height: '64px',
  width: 'auto',
  maxWidth: '256px',
  objectFit: 'contain',
  objectPosition: 'left center',
} satisfies React.CSSProperties;
