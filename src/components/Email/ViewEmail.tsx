import { Eye, Globe, Briefcase } from 'lucide-react';
import { Country } from '../../types/Country';
import { CountrySelect } from './CountrySelect';
import { PositionSelect } from './PositionSelect';
import { useViewEmail } from '../../hooks/useViewEmail';
import { Email } from '../../types/Email';
import './EmailPage.css';

interface ViewEmailProps {
  countries: Country[];
  onNotification: (message: string, type: 'success' | 'error') => void;
  initialCountryId?: number;
  initialPositionId?: number;
  initialEmail?: Email | null;
}

export const ViewEmail = ({ countries, onNotification, initialCountryId, initialPositionId, initialEmail }: ViewEmailProps) => {
  const {
    selectedCountry,
    setSelectedCountry,
    positions,
    selectedPosition,
    setSelectedPosition,
    emailTemplate
  } = useViewEmail(onNotification, initialCountryId, initialPositionId, countries, initialEmail);

  return (
    <div className="email-layout view-mode">
        <div className="sidebar-column">
             <div className="email-card" style={{ height: 'fit-content' }}>
               <div className="card-header">
                <Globe className="text-primary" size={24} />
                <div>
                  <div className="card-title">Selectează template</div>
                  <div className="card-subtitle">Alege țara și poziția pentru a vizualiza template-ul asociat</div>
                </div>
              </div>
               
               <div style={{ marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                       <Globe size={16} /> Țara
                   </div>
                   <CountrySelect 
                    countries={countries}
                    selectedCountry={selectedCountry}
                    onChange={setSelectedCountry}
                  />
               </div>

               <div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                       <Briefcase size={16} /> Tip poziție
                   </div>
                   <PositionSelect 
                    positions={positions}
                    selectedPosition={selectedPosition}
                    onChange={setSelectedPosition}
                    disabled={!selectedCountry}
                  />
               </div>
             </div>
        </div>

        <div className="email-card">
            <div className="card-header">
                <Eye className="text-primary" size={24} />
                <div>
                <div className="card-title">
                    {selectedPosition ? `Template: ${selectedPosition.positionName}` : 'Previzualizare'}
                </div>
                <div className="card-subtitle">
                    {selectedCountry ? `Pentru ${selectedCountry.countryName}` : 'Nicio țară selectată'}
                </div>
                </div>
            </div>

            {selectedCountry && selectedPosition ? (
                <div className="preview-container">
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid hsl(var(--border))' }}>
                    <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}>Subiect:</div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{emailTemplate?.subject || '(Fără subiect)'}</div>
                </div>
                {emailTemplate?.content ? (
                    <div className="preview-content" dangerouslySetInnerHTML={{ __html: emailTemplate.content }} />
                ) : (
                    <div style={{ color: 'hsl(var(--muted-foreground))', fontStyle: 'italic' }}>
                    Nu există conținut pentru această combinație de țară și poziție.
                    </div>
                )}
                </div>
            ) : (
                <div className="preview-placeholder">
                <Briefcase size={48} className="preview-placeholder-icon" style={{ opacity: 0.2 }} />
                <h3>Selectează poziția pentru a vedea template-ul</h3>
                <p>Alege o țară și o poziție din lista din stânga.</p>
                </div>
            )}
        </div>
    </div>
  );
};
