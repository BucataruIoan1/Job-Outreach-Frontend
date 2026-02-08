import { Building2, Mail, Send } from "lucide-react";
import { CountrySelect } from "../Email/CountrySelect";
import { PositionSelect } from "../Email/PositionSelect";
import { Pagination } from "../Pagination/Pagination";
import "../Email/EmailPage.css";
import "../CompanyGrid/CompanyGrid.css";
import "./SendEmail.css";
import { TableSortHeader } from "../Common/Table/TableSortHeader";
import { TableFilterInput } from "../Common/Table/TableFilterInput";
import { useSendEmailPage } from "../../hooks/useSendEmailPage";

export const SendEmailPage = () => {
  const {
    companies,
    countries,
    selectedCompanyIds,
    selectedCountry,
    setSelectedCountry,
    positions,
    selectedPosition,
    setSelectedPosition,
    selectedTemplate,
    loadingData,
    loadingCompanies,
    loadingTemplate,
    sendingEmails,
    error,
    sortColumn,
    sortOrder,
    filters,
    notification,
    currentPage,
    pageSize,
    totalItems,
    handleSort,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleToggleCompany,
    handleToggleAllCompanies,
    handleSendEmails,
    paginatedCompanies,
    selectedCompaniesCount,
    allCompaniesSelected,
    companyFilterMode,
    setCompanyFilterMode
  } = useSendEmailPage();

  const isSendDisabled =
    sendingEmails || selectedCompaniesCount === 0 || !selectedTemplate;

  if (loadingData) {
    return (
      <div className="send-email-page">
        <div className="send-email-header">
          <h1>Trimitere Email</h1>
          <p>
            Selectează companiile și template-ul pentru a trimite email-uri în
            masă.
          </p>
        </div>
        <div className="empty-state">Se încarcă datele...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="send-email-page">
        <div className="send-email-header">
          <h1>Trimitere Email</h1>
          <p>
            Selectează companiile și template-ul pentru a trimite email-uri în
            masă.
          </p>
        </div>
        <div className="empty-state" style={{ color: "var(--destructive)" }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="send-email-page">
      <div className="send-email-header">
        <h1>Trimitere Email</h1>
        <p>
          Selectează companiile și template-ul pentru a trimite email-uri în
          masă.
        </p>
      </div>

      <div className="send-email-layout">
        <div className="send-email-column">
          <div className="send-email-card send-email-card--companies">
            <div className="card-header">
              <Building2 className="text-primary" size={24} />
              <div>
                <div className="card-title">
                  Selectează companiile
                  {selectedCompaniesCount > 0 && (
                    <span className="send-badge">
                      {selectedCompaniesCount} selectate
                    </span>
                  )}
                </div>
                <div className="card-subtitle">
                  Alege companiile cărora vrei să le trimiți email.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", padding: "0 0.5rem 1rem 0rem" }}>
              <button
                className={`btn ${companyFilterMode === "uncontacted" ? "btn-primary" : ""}`}
                style={companyFilterMode !== "uncontacted" ? { backgroundColor: "white", color: "black", border: "1px solid #e2e8f0" } : {}}
                onClick={() => setCompanyFilterMode("uncontacted")}
              >
                Necontactate {companyFilterMode === "uncontacted" && `(${totalItems})`}
              </button>
              <button
                className={`btn ${companyFilterMode === "all" ? "btn-primary" : ""}`}
                style={companyFilterMode !== "all" ? { backgroundColor: "white", color: "black", border: "1px solid #e2e8f0" } : {}}
                onClick={() => setCompanyFilterMode("all")}
              >
                Contactate {companyFilterMode === "all" && `(${totalItems})`}
              </button>
            </div>

            <div
              className="send-email-table-wrapper"
              style={{ position: "relative" }}
            >
              {loadingCompanies && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(255, 255, 255, 0)",
                    zIndex: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    paddingTop: "50px",
                    pointerEvents: "none",
                  }}
                >
                  {/* <div className="spinner">Se încarcă...</div> */}
                </div>
              )}
              <table className="companies-table">
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>
                      <input
                        type="checkbox"
                        checked={allCompaniesSelected}
                        onChange={handleToggleAllCompanies}
                      />
                    </th>
                    <th>
                      <TableSortHeader
                        label="Companie"
                        column="companyName"
                        currentSortColumn={sortColumn}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </th>
                    <th>
                      <TableSortHeader
                        label="Telefon"
                        column="companyPhone"
                        currentSortColumn={sortColumn}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </th>
                    <th>
                      <TableSortHeader
                        label="Email"
                        column="companyEmail"
                        currentSortColumn={sortColumn}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </th>
                    <th>
                      <TableSortHeader
                        label="Poziții"
                        column="positions"
                        currentSortColumn={sortColumn}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </th>
                  </tr>
                  <tr>
                    <th></th>
                    <th>
                      <TableFilterInput
                        value={filters.companyName}
                        onChange={(val) =>
                          handleFilterChange("companyName", val)
                        }
                      />
                    </th>
                    <th>
                      <TableFilterInput
                        value={filters.companyPhone}
                        filterType={filters.companyPhoneFilterType}
                        onChange={(val) =>
                          handleFilterChange("companyPhone", val)
                        }
                        onFilterTypeChange={(type) =>
                          handleFilterChange("companyPhoneFilterType", type)
                        }
                      />
                    </th>
                    <th>
                      <TableFilterInput
                        value={filters.companyEmail}
                        filterType={filters.companyEmailFilterType}
                        onChange={(val) =>
                          handleFilterChange("companyEmail", val)
                        }
                        onFilterTypeChange={(type) =>
                          handleFilterChange("companyEmailFilterType", type)
                        }
                      />
                    </th>
                    <th>
                      <TableFilterInput
                        value={filters.positions}
                        onChange={(val) => handleFilterChange("positions", val)}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        <div style={{ color: "hsl(var(--muted-foreground))" }}>
                          Nu există companii care să corespundă criteriilor.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    companies.map((company) => {
                      const isSelected = selectedCompanyIds.includes(
                        company.id,
                      );
                      const rowClass = [
                        "transition-colors",
                        isSelected ? "send-email-row-selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ");
                      return (
                        <tr key={company.id} className={rowClass}>
                          <td>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleCompany(company.id)}
                            />
                          </td>
                          <td>
                            <div className="company-name-cell">
                              <div className="company-avatar">
                                {company.companyName.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold">
                                {company.companyName}
                              </span>
                            </div>
                          </td>
                          <td style={{ color: "hsl(var(--muted-foreground))" }}>
                            {company.companyPhone || "-"}
                          </td>
                          <td style={{ color: "hsl(var(--muted-foreground))" }}>
                            {company.companyEmail || "-"}
                          </td>
                          <td
                            style={{
                              color: "hsl(var(--muted-foreground))",
                              maxWidth: "200px",
                            }}
                          >
                            {company.positions && company.positions.length > 0
                              ? company.positions
                                  .map((p) => p.positionName)
                                  .join(", ")
                              : "-"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {paginatedCompanies.length > 0 && (
              <div style={{ padding: "0 1.5rem" }}>
                <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalItems={totalItems}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            )}
          </div>
        </div>

        <div className="send-email-column">
          <div className="send-email-card send-email-card--template">
            <div className="card-header">
              <Mail className="text-primary" size={24} />
              <div>
                <div className="card-title">Template email</div>
                <div className="card-subtitle">
                  Selectează țara și poziția pentru template-ul de email.
                </div>
              </div>
            </div>

            <div className="form-field">
              <label>Țară</label>
              <CountrySelect
                countries={countries}
                selectedCountry={selectedCountry}
                onChange={setSelectedCountry}
                placeholder="Alege țara..."
              />
            </div>

            <div className="form-field" style={{ marginTop: "1rem" }}>
              <label>Tip poziție</label>
              <PositionSelect
                positions={positions}
                selectedPosition={selectedPosition}
                onChange={setSelectedPosition}
                disabled={!selectedCountry}
                placeholder="Selectează poziția..."
              />
            </div>

            {loadingTemplate && (
              <div className="send-helper-text">
                Se încarcă template-ul selectat...
              </div>
            )}
            {selectedTemplate && (
              <div className="send-helper-text">
                Subiect: <strong>{selectedTemplate.subject}</strong>
              </div>
            )}
          </div>

          <div className="send-email-card send-email-summary-card send-summary-card">
            <div className="send-summary-row">
              <span>Companii selectate:</span>
              <span className="send-summary-value">
                {selectedCompaniesCount}
              </span>
            </div>
            <div className="send-summary-row">
              <span>Țară:</span>
              <span className="send-summary-value">
                {selectedCountry ? selectedCountry.countryName : "-"}
              </span>
            </div>
            <div className="send-summary-row">
              <span>Pozitie:</span>
              <span className="send-summary-value">
                {selectedPosition ? selectedPosition.positionName : "-"}
              </span>
            </div>

            <button
              className="btn btn-primary send-action-button"
              onClick={handleSendEmails}
              disabled={isSendDisabled}
            >
              <Send size={18} />
              {sendingEmails
                ? "Se trimit email-urile..."
                : selectedCompaniesCount === 0
                  ? "Selectează companii"
                  : !selectedTemplate
                    ? "Selectează template"
                    : `Trimite ${selectedCompaniesCount} email-uri`}
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};
