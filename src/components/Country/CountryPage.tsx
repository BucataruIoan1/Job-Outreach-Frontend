import { Globe, Plus, Search, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useCountry } from '../../hooks/useCountry';
import './CountryPage.css';

export const CountryPage = () => {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    formData,
    setFormData,
    editingId,
    notification,
    handleSubmit,
    handleEdit,
    handleDelete,
    cancelEdit,
    filteredCountries
  } = useCountry();

  return (
    <div className="country-page">
      <div className="country-header">
        <h1><Globe className="text-primary" /> Gestionare Țări</h1>
        <p>Adaugă și gestionează țările pentru template-urile de email.</p>
      </div>

      <div className="country-layout">
        <div className="country-card">
          <div className="card-header">
            <Plus className="text-primary" size={24} />
            <div>
              <div className="card-title">{editingId ? 'Editează țara' : 'Adaugă țară nouă'}</div>
              <div className="card-subtitle">Completează datele pentru {editingId ? 'țara selectată' : 'noua țară'}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-section">
            <div className="form-field">
              <label>Nume țară</label>
              <input 
                type="text" 
                placeholder="ex: România"
                value={formData.countryName}
                onChange={(e) => setFormData({...formData, countryName: e.target.value})}
              />
            </div>

            <div className="form-field">
              <label>Cod țară (ISO)</label>
              <input 
                type="text" 
                placeholder="EX: RO"
                value={formData.countryCode}
                onChange={(e) => setFormData({...formData, countryCode: e.target.value.toUpperCase()})}
                maxLength={2}
              />
            </div>

            <button type="submit" className="submit-btn">
              {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
              {editingId ? 'Actualizează țara' : 'Adaugă țară'}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                className="btn btn-outline w-full"
                onClick={cancelEdit}
                style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem', justifyContent: 'center' }}
              >
                Anulează editarea
              </button>
            )}
          </form>
        </div>

        <div className="country-card">
          <div className="list-header">
            <div>
              <div className="card-title">
                <Globe size={20} className="inline-block mr-2 text-primary" />
                Lista țărilor
              </div>
              <div className="card-subtitle">{filteredCountries.length} țări înregistrate</div>
            </div>
            <div className="search-input">
              <Search className="search-icon" size={16} />
              <input 
                type="text" 
                placeholder="Caută..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Se încarcă...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="countries-table">
                <thead>
                  <tr>
                    <th>Nume țară</th>
                    <th>Cod</th>
                    <th style={{ textAlign: 'right' }}>Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <tr key={country.id}>
                        <td style={{ fontWeight: 500 }}>{country.countryName}</td>
                        <td>
                          <span className="country-code-badge">{country.countryCode}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="action-btn" 
                              onClick={() => handleEdit(country)}
                              title="Editează"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              className="action-btn delete" 
                              onClick={() => handleDelete(country.id)}
                              title="Șterge"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-muted-foreground">
                        Nu au fost găsite țări.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          <div className="notification-icon">
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          </div>
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
};
